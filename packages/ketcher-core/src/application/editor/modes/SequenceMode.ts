import { CoreEditor, EditorHistory } from 'application/editor/internal';
import { LayoutMode } from 'application/editor/modes';
import { BaseMode } from 'application/editor/modes/BaseMode';
import ZoomTool from 'application/editor/tools/Zoom';
import { BaseSequenceItemRenderer } from 'application/render/renderers/sequence/BaseSequenceItemRenderer';
import { SequenceRenderer } from 'application/render/renderers/sequence/SequenceRenderer';
import { initHotKeys, keyNorm } from 'utilities';
import { AttachmentPointName } from 'domain/types';
import { Command } from 'domain/entities/Command';
import { BaseMonomer, SequenceType, Vec2 } from 'domain/entities';
import { BaseRenderer } from 'application/render/renderers/internal';
import { EmptySequenceNode } from 'domain/entities/EmptySequenceNode';
import { Nucleoside } from 'domain/entities/Nucleoside';
import { Nucleotide } from 'domain/entities/Nucleotide';
import {
  ReinitializeSequenceModeCommand,
  RestoreSequenceCaretPositionCommand,
} from 'application/editor/operations/modes';
import assert from 'assert';
import {
  getPeptideLibraryItem,
  getRnaPartLibraryItem,
} from 'domain/helpers/rna';
import {
  peptideNaturalAnalogues,
  RNA_DNA_NON_MODIFIED_PART,
  rnaDnaNaturalAnalogues,
} from 'domain/constants/monomers';
import { SubChainNode } from 'domain/entities/monomer-chains/types';
import { uniq } from 'lodash';

const naturalAnalogues = uniq([
  ...rnaDnaNaturalAnalogues,
  ...peptideNaturalAnalogues,
]);

export class SequenceMode extends BaseMode {
  private _isEditMode = false;
  private selectionStarted = false;
  private selectionStartCaretPosition = -1;

  constructor(previousMode?: LayoutMode) {
    super('sequence-layout-mode', previousMode);
  }

  public get isEditMode() {
    return this._isEditMode;
  }

  public set isEditMode(isEditMode) {
    this._isEditMode = isEditMode;
  }

  public initialize(needScroll = true) {
    const command = super.initialize();
    const editor = CoreEditor.provideEditorInstance();

    editor.drawingEntitiesManager.clearCanvas();

    const modelChanges = editor.drawingEntitiesManager.reArrangeChains(
      editor.canvas.width.baseVal.value,
      true,
      false,
    );
    const zoom = ZoomTool.instance;

    editor.renderersContainer.update(modelChanges);

    const chainsCollection =
      editor.drawingEntitiesManager.applyMonomersSequenceLayout();
    const firstMonomerPosition =
      chainsCollection.firstNode?.monomer.renderer?.scaledMonomerPosition;

    if (firstMonomerPosition && needScroll) {
      zoom.scrollTo(firstMonomerPosition);
    }

    modelChanges.merge(command);

    return modelChanges;
  }

  public turnOnEditMode(sequenceItemRenderer?: BaseSequenceItemRenderer) {
    const editor = CoreEditor.provideEditorInstance();

    this.isEditMode = true;
    this.initialize(false);
    if (sequenceItemRenderer) {
      SequenceRenderer.setCaretPositionByMonomer(
        sequenceItemRenderer.node.monomer,
      );
      SequenceRenderer.moveCaretForward();
    }
    editor.events.toggleSequenceEditMode.dispatch(true);
  }

  public turnOffEditMode() {
    if (!this.isEditMode) return;
    const editor = CoreEditor.provideEditorInstance();

    this.isEditMode = false;
    this.initialize(false);
    editor.events.toggleSequenceEditMode.dispatch(false);
  }

  public onKeyDown(event: KeyboardEvent) {
    if (!this.isEditMode) {
      return;
    }
    const hotKeys = initHotKeys(this.keyboardEventHandlers);
    const shortcutKey = keyNorm.lookup(hotKeys, event);

    this.keyboardEventHandlers[shortcutKey]?.handler(event);

    return true;
  }

  public startNewSequence() {
    if (!this.isEditMode) {
      this.turnOnEditMode();
    }

    if (!SequenceRenderer.hasNewChain) {
      SequenceRenderer.startNewSequence();
    }

    SequenceRenderer.moveCaretToNewChain();
  }

  public click(event: MouseEvent) {
    const eventData = event.target?.__data__;
    const isClickedOnEmptyPlace = !(eventData instanceof BaseRenderer);
    const isClickedOnSequenceItem =
      eventData instanceof BaseSequenceItemRenderer;

    if (isClickedOnEmptyPlace) {
      this.turnOffEditMode();
    }

    if (this.isEditMode && isClickedOnSequenceItem) {
      SequenceRenderer.setCaretPositionBySequenceItemRenderer(
        eventData as BaseSequenceItemRenderer,
      );
      const editor = CoreEditor.provideEditorInstance();
      const modelChanges =
        editor.drawingEntitiesManager.unselectAllDrawingEntities();
      editor.renderersContainer.update(modelChanges);
    }
    this.selectionStartCaretPosition = -1;
  }

  public mousedown(event: MouseEvent) {
    const eventData = event.target?.__data__;
    const isEventOnSequenceItem = eventData instanceof BaseSequenceItemRenderer;
    if (this.isEditMode && isEventOnSequenceItem && !event.shiftKey) {
      this.selectionStarted = true;
      this.selectionStartCaretPosition = SequenceRenderer.caretPosition;
    }
  }

  public mousemove(event: MouseEvent) {
    const eventData = event.target?.__data__;
    const isEventOnSequenceItem = eventData instanceof BaseSequenceItemRenderer;

    if (this.isEditMode && isEventOnSequenceItem && this.selectionStarted) {
      const modelChanges = new Command();
      const editor = CoreEditor.provideEditorInstance();
      SequenceRenderer.setCaretPositionBySequenceItemRenderer(
        eventData as BaseSequenceItemRenderer,
      );

      let startCaretPosition = this.selectionStartCaretPosition;
      let endCaretPosition = SequenceRenderer.caretPosition;
      if (this.selectionStartCaretPosition > SequenceRenderer.caretPosition) {
        startCaretPosition = SequenceRenderer.caretPosition;
        endCaretPosition = this.selectionStartCaretPosition;
      }
      const monomers = SequenceRenderer.getMonomersByCaretPositionRange(
        startCaretPosition,
        endCaretPosition,
      );
      modelChanges.merge(
        editor.drawingEntitiesManager.selectDrawingEntities(monomers),
      );
      const moveCaretOperation = new RestoreSequenceCaretPositionCommand(
        this.selectionStartCaretPosition,
        SequenceRenderer.caretPosition,
      );
      modelChanges.addOperation(moveCaretOperation);
      editor.renderersContainer.update(modelChanges);
    }
  }

  mouseup() {
    if (this.selectionStarted) {
      this.selectionStarted = false;
    }
  }

  private bondNodesThroughNewPhosphate(
    position: Vec2,
    previousNode: SubChainNode,
    nextNode: SubChainNode,
  ) {
    const editor = CoreEditor.provideEditorInstance();
    const phosphateLibraryItem = getRnaPartLibraryItem(
      editor,
      RNA_DNA_NON_MODIFIED_PART.PHOSPHATE,
    );

    assert(phosphateLibraryItem);

    const modelChanges = editor.drawingEntitiesManager.addMonomer(
      phosphateLibraryItem,
      position,
    );

    const additionalPhosphate = modelChanges.operations[0]
      .monomer as BaseMonomer;

    modelChanges.merge(
      editor.drawingEntitiesManager.createPolymerBond(
        previousNode.lastMonomerInNode,
        additionalPhosphate,
        AttachmentPointName.R2,
        AttachmentPointName.R1,
      ),
    );

    modelChanges.merge(
      editor.drawingEntitiesManager.createPolymerBond(
        additionalPhosphate,
        nextNode.firstMonomerInNode,
        AttachmentPointName.R2,
        AttachmentPointName.R1,
      ),
    );

    return modelChanges;
  }

  private handlePeptideNodeAddition(
    enteredSymbol: string,
    currentNode: SubChainNode,
    previousNodeInSameChain: SubChainNode,
    newNodePosition: Vec2,
  ) {
    if (!peptideNaturalAnalogues.includes(enteredSymbol)) {
      return undefined;
    }

    const modelChanges = new Command();
    const editor = CoreEditor.provideEditorInstance();
    const newPeptideLibraryItem = getPeptideLibraryItem(editor, enteredSymbol);

    assert(newPeptideLibraryItem);

    const peptideAddCommand = editor.drawingEntitiesManager.addMonomer(
      newPeptideLibraryItem,
      newNodePosition,
    );

    const newPeptide = peptideAddCommand.operations[0].monomer as BaseMonomer;

    modelChanges.merge(peptideAddCommand);

    if (!(currentNode instanceof EmptySequenceNode)) {
      if (previousNodeInSameChain) {
        const r2Bond =
          previousNodeInSameChain?.lastMonomerInNode.attachmentPointsToBonds.R2;
        assert(r2Bond);
        modelChanges.merge(
          editor.drawingEntitiesManager.deletePolymerBond(r2Bond),
        );
      }

      modelChanges.merge(
        editor.drawingEntitiesManager.createPolymerBond(
          newPeptide,
          currentNode?.firstMonomerInNode as BaseMonomer,
          AttachmentPointName.R2,
          AttachmentPointName.R1,
        ),
      );
    }

    if (previousNodeInSameChain) {
      modelChanges.merge(
        editor.drawingEntitiesManager.createPolymerBond(
          previousNodeInSameChain.lastMonomerInNode,
          newPeptide,
          AttachmentPointName.R2,
          AttachmentPointName.R1,
        ),
      );
    }

    return modelChanges;
  }

  private handleRnaDnaNodeAddition(
    enteredSymbol: string,
    currentNode: SubChainNode,
    previousNodeInSameChain: SubChainNode,
    newNodePosition: Vec2,
  ) {
    if (!rnaDnaNaturalAnalogues.includes(enteredSymbol)) {
      return undefined;
    }

    const modelChanges = new Command();
    const editor = CoreEditor.provideEditorInstance();
    const { modelChanges: addedNodeModelChanges, node: nodeToAdd } =
      currentNode instanceof Nucleotide || currentNode instanceof Nucleoside
        ? Nucleotide.createOnCanvas(enteredSymbol, newNodePosition)
        : Nucleoside.createOnCanvas(enteredSymbol, newNodePosition);

    modelChanges.merge(addedNodeModelChanges);

    if (!(currentNode instanceof EmptySequenceNode)) {
      if (previousNodeInSameChain) {
        const r2Bond =
          previousNodeInSameChain?.lastMonomerInNode.attachmentPointsToBonds.R2;
        assert(r2Bond);
        modelChanges.merge(
          editor.drawingEntitiesManager.deletePolymerBond(r2Bond),
        );
      }

      modelChanges.merge(
        editor.drawingEntitiesManager.createPolymerBond(
          nodeToAdd.lastMonomerInNode,
          currentNode?.firstMonomerInNode as BaseMonomer,
          AttachmentPointName.R2,
          AttachmentPointName.R1,
        ),
      );
    }

    if (previousNodeInSameChain instanceof Nucleoside) {
      modelChanges.merge(
        this.bondNodesThroughNewPhosphate(
          newNodePosition,
          previousNodeInSameChain,
          nodeToAdd,
        ),
      );
    } else if (previousNodeInSameChain) {
      modelChanges.merge(
        editor.drawingEntitiesManager.createPolymerBond(
          previousNodeInSameChain.lastMonomerInNode,
          nodeToAdd.firstMonomerInNode,
          AttachmentPointName.R2,
          AttachmentPointName.R1,
        ),
      );
    }

    return modelChanges;
  }

  private get keyboardEventHandlers() {
    return {
      delete: {
        shortcut: ['Backspace', 'Delete'],
        handler: () => {
          const editor = CoreEditor.provideEditorInstance();
          const history = new EditorHistory(editor);
          const modelChanges = new Command();
          const previousCaretPosition = SequenceRenderer.caretPosition;
          let currentNode = SequenceRenderer.currentEdittingNode;
          // for drag left and Shift+ArrowLeft
          if (
            editor.drawingEntitiesManager.selectedEntities.length > 0 &&
            SequenceRenderer.caretPosition < this.selectionStartCaretPosition
          ) {
            currentNode = SequenceRenderer.getNodeByPointer(
              this.selectionStartCaretPosition,
            );
            this.selectionStartCaretPosition = SequenceRenderer.caretPosition;
          }
          const firstNodeToBeDeleted = SequenceRenderer.getNodeByPointer(
            this.selectionStartCaretPosition,
          );
          modelChanges.merge(this.deleteDrawingEntities(firstNodeToBeDeleted));

          const nodeBeforeFirstNodeToBeDeletedInSameChain =
            SequenceRenderer.getPreviousNodeInSameChain(firstNodeToBeDeleted);
          if (nodeBeforeFirstNodeToBeDeletedInSameChain) {
            if (!(currentNode instanceof EmptySequenceNode)) {
              modelChanges.merge(
                editor.drawingEntitiesManager.createPolymerBond(
                  nodeBeforeFirstNodeToBeDeletedInSameChain instanceof
                    Nucleotide
                    ? nodeBeforeFirstNodeToBeDeletedInSameChain.firstMonomerInNode
                    : nodeBeforeFirstNodeToBeDeletedInSameChain.lastMonomerInNode,
                  currentNode?.firstMonomerInNode as BaseMonomer,
                  AttachmentPointName.R2,
                  AttachmentPointName.R1,
                ),
              );
            }
            SequenceRenderer.setCaretPositionByMonomer(
              firstNodeToBeDeleted.monomer,
            );
          } else if (
            SequenceRenderer.previousChain &&
            !(currentNode instanceof EmptySequenceNode)
          ) {
            const previousChainLastNonEmptyNode =
              SequenceRenderer.getLastNonEmptyNode(
                SequenceRenderer.previousChain,
              );
            const previousChainLastEmptyNode = SequenceRenderer.getLastNode(
              SequenceRenderer.previousChain,
            );
            if (previousChainLastNonEmptyNode instanceof Nucleoside) {
              const newNodePosition = this.getNewSequenceItemPosition(
                previousChainLastEmptyNode,
                previousChainLastNonEmptyNode,
              );

              // create bond between previous and current chain through new phosphate
              modelChanges.merge(
                this.bondNodesThroughNewPhosphate(
                  newNodePosition,
                  previousChainLastNonEmptyNode,
                  currentNode,
                ),
              );
            } else {
              // create bond between previous and current chain
              modelChanges.merge(
                editor.drawingEntitiesManager.createPolymerBond(
                  previousChainLastNonEmptyNode?.lastMonomerInNode,
                  currentNode?.firstMonomerInNode as BaseMonomer,
                  AttachmentPointName.R2,
                  AttachmentPointName.R1,
                ),
              );
            }
            SequenceRenderer.setCaretPositionByMonomer(
              previousChainLastEmptyNode.monomer,
            );
          }
          const moveCaretOperation = new RestoreSequenceCaretPositionCommand(
            previousCaretPosition,
            SequenceRenderer.caretPosition,
          );
          modelChanges.addOperation(new ReinitializeSequenceModeCommand());
          editor.renderersContainer.update(modelChanges);
          modelChanges.addOperation(moveCaretOperation);
          history.update(modelChanges);
          this.selectionStartCaretPosition = -1;
        },
      },
      'turn-off-edit-mode': {
        shortcut: ['Escape'],
        handler: () => {
          this.turnOffEditMode();
        },
      },
      'start-new-sequence': {
        shortcut: ['Enter'],
        handler: () => {
          this.startNewSequence();
        },
      },
      'move-caret-forward': {
        shortcut: ['ArrowRight'],
        handler: () => {
          SequenceRenderer.moveCaretForward();
        },
      },
      'move-caret-back': {
        shortcut: ['ArrowLeft'],
        handler: () => {
          SequenceRenderer.moveCaretBack();
        },
      },
      'add-sequence-item': {
        shortcut: [
          ...naturalAnalogues,
          ...naturalAnalogues.map((naturalAnalogue) =>
            naturalAnalogue.toLowerCase(),
          ),
        ],
        handler: (event) => {
          const enteredSymbol = event.code.replace('Key', '');
          const editor = CoreEditor.provideEditorInstance();
          const history = new EditorHistory(editor);
          const currentNode = SequenceRenderer.currentEdittingNode;
          const previousNode =
            SequenceRenderer.previousFromCurrentEdittingMonomer;
          const nodeBeforePreviousNode = previousNode
            ? SequenceRenderer.getPreviousNodeInSameChain(previousNode)
            : undefined;
          const previousNodeInSameChain =
            SequenceRenderer.previousNodeInSameChain;

          const newNodePosition = this.getNewSequenceItemPosition(
            previousNode,
            nodeBeforePreviousNode,
          );

          let modelChanges;

          if (editor.sequenceTypeEnterMode === SequenceType.PEPTIDE) {
            modelChanges = this.handlePeptideNodeAddition(
              enteredSymbol,
              currentNode,
              previousNodeInSameChain,
              newNodePosition,
            );
          } else {
            modelChanges = this.handleRnaDnaNodeAddition(
              enteredSymbol,
              currentNode,
              previousNodeInSameChain,
              newNodePosition,
            );
          }

          // Case when user type symbol that does not exist in current sequence type mode
          if (!modelChanges) {
            return;
          }

          modelChanges.addOperation(new ReinitializeSequenceModeCommand());
          editor.renderersContainer.update(modelChanges);
          modelChanges.addOperation(SequenceRenderer.moveCaretForward());
          history.update(modelChanges);
        },
      },
      'sequence-edit-select': {
        shortcut: ['Shift+ArrowLeft', 'Shift+ArrowRight'],
        handler: (event) => {
          this.selectionStartCaretPosition =
            this.selectionStartCaretPosition !== -1
              ? this.selectionStartCaretPosition
              : SequenceRenderer.caretPosition;
          SequenceRenderer.shiftArrowSelectionInEditMode(event);
        },
      },
    };
  }

  private deleteDrawingEntities(firstNodeToBeDeleted: SubChainNode) {
    const editor = CoreEditor.provideEditorInstance();
    const modelChanges = new Command();
    if (editor.drawingEntitiesManager.selectedEntities.length > 0) {
      editor.drawingEntitiesManager.selectedEntities.forEach(([, entity]) => {
        if (entity instanceof BaseMonomer) {
          modelChanges.merge(
            editor.drawingEntitiesManager.deleteMonomer(entity as BaseMonomer),
          );
        }
      });
    } else {
      const drawingEntities = editor.drawingEntitiesManager.getDrawingEntities(
        firstNodeToBeDeleted.monomer,
      );
      drawingEntities.forEach((entity) => {
        modelChanges.merge(
          editor.drawingEntitiesManager.deleteMonomer(entity as BaseMonomer),
        );
      });
    }
    return modelChanges;
  }

  private getNewSequenceItemPosition(
    previousNode?: SubChainNode,
    nodeBeforePreviousNode?: SubChainNode,
  ) {
    if (!previousNode || !nodeBeforePreviousNode) {
      return new Vec2(0, 0);
    }

    const offsetFromPrevious = new Vec2(1, 1);

    const nodeForPositionCalculation =
      previousNode instanceof EmptySequenceNode
        ? nodeBeforePreviousNode
        : previousNode;

    return nodeForPositionCalculation.lastMonomerInNode.position.add(
      offsetFromPrevious,
    );
  }
}
