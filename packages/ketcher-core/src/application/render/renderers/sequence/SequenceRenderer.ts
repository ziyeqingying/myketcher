import { ChainsCollection } from 'domain/entities/monomer-chains/ChainsCollection';
import { SequenceNodeRendererFactory } from 'application/render/renderers/sequence/SequenceNodeRendererFactory';
import { BaseMonomer, RNABase, Sugar, Vec2 } from 'domain/entities';
import { AttachmentPointName } from 'domain/types';
import { PolymerBondSequenceRenderer } from 'application/render/renderers/sequence/PolymerBondSequenceRenderer';
import {
  getRnaBaseFromSugar,
  getSugarFromRnaBase,
} from 'domain/helpers/monomers';
import { BackBoneBondSequenceRenderer } from 'application/render/renderers/sequence/BackBoneBondSequenceRenderer';
import { PolymerBond } from 'domain/entities/PolymerBond';
import { BaseSequenceItemRenderer } from 'application/render/renderers/sequence/BaseSequenceItemRenderer';
import { EmptySequenceItemRenderer } from 'application/render/renderers/sequence/EmptySequenceItemRenderer';
import { EmptySequenceNode } from 'domain/entities/EmptySequenceNode';
import { Chain } from 'domain/entities/monomer-chains/Chain';
import { EmptySubChain } from 'domain/entities/monomer-chains/EmptySubChain';
import { RenderersManager } from 'application/render/renderers/RenderersManager';
import { SubChainNode } from 'domain/entities/monomer-chains/types';
import { CoreEditor } from 'application/editor';

export type SequencePointer = [number, number, number];

export class SequenceRenderer {
  public static caretPosition: SequencePointer = [-1, -1, -1];
  public static chainsCollection: ChainsCollection;
  private static emptySequenceItemRenderers: EmptySequenceItemRenderer[] = [];
  private static lastChainStartPosition: Vec2;
  public static show(chainsCollection: ChainsCollection) {
    SequenceRenderer.chainsCollection = chainsCollection;
    this.removeEmptyNodes();
    this.showNodes(SequenceRenderer.chainsCollection);
    this.showBonds(SequenceRenderer.chainsCollection);
  }

  public static removeEmptyNodes() {
    SequenceRenderer.emptySequenceItemRenderers.forEach(
      (emptySequenceItemRenderer) => {
        emptySequenceItemRenderer.remove();
        SequenceRenderer.emptySequenceItemRenderers = [];
      },
    );
  }

  private static showNodes(chainsCollection: ChainsCollection) {
    const firstNode = chainsCollection.firstNode;

    let currentChainStartPosition = firstNode
      ? new Vec2(
          firstNode.monomer.renderer?.scaledMonomerPosition.x,
          firstNode.monomer.renderer?.scaledMonomerPosition.y,
        )
      : new Vec2(41.5, 41.5);

    let currentMonomerIndexInChain = 0;
    const editor = CoreEditor.provideEditorInstance();
    const isEditMode = editor.mode.isEditMode;

    if (isEditMode) {
      chainsCollection.chains.forEach((chain) => {
        const emptySequenceNode = new EmptySequenceNode();
        const emptySubChain = new EmptySubChain();
        emptySubChain.add(emptySequenceNode);
        chain.subChains.push(emptySubChain);
      });
    }

    chainsCollection.chains.forEach((chain, chainIndex) => {
      currentMonomerIndexInChain = 0;
      chain.subChains.forEach((subChain, subChainIndex) => {
        subChain.nodes.forEach((node, nodeIndex) => {
          const renderer = SequenceNodeRendererFactory.fromNode(
            node,
            currentChainStartPosition,
            currentMonomerIndexInChain,
            currentMonomerIndexInChain + 1 + (isEditMode ? 1 : 0) ===
              chain.subChains.reduce(
                (prev, curr) => prev + curr.nodes.length,
                0,
              ),
            chainIndex === SequenceRenderer.caretPosition[0] &&
              subChainIndex === SequenceRenderer.caretPosition[1] &&
              nodeIndex === SequenceRenderer.caretPosition[2],
          );
          renderer.show();
          node.monomer?.setRenderer(renderer);
          currentMonomerIndexInChain++;

          if (node instanceof EmptySequenceNode) {
            SequenceRenderer.emptySequenceItemRenderers.push(renderer);
            node.setRenderer(renderer);
          }
        });
      });

      currentChainStartPosition = SequenceRenderer.getNextChainPosition(
        currentChainStartPosition,
        chain,
      );
    });

    this.lastChainStartPosition = currentChainStartPosition;
  }

  private static getNextChainPosition(
    currentChainStartPosition: Vec2,
    lastChain: Chain,
  ) {
    return new Vec2(
      currentChainStartPosition.x,
      currentChainStartPosition.y + 75 + 47 * Math.floor(lastChain.length / 30),
    );
  }

  private static showBonds(chainsCollection: ChainsCollection) {
    const handledMonomersToAttachmentPoints: Map<
      BaseMonomer,
      Set<AttachmentPointName>
    > = new Map();

    chainsCollection.chains.forEach((chain) => {
      chain.subChains.forEach((subChain) => {
        subChain.nodes.forEach((node) => {
          if (node instanceof EmptySequenceNode) {
            return;
          }

          if (!handledMonomersToAttachmentPoints.has(node.monomer)) {
            handledMonomersToAttachmentPoints.set(node.monomer, new Set());
          }
          node.monomer.forEachBond((polymerBond, attachmentPointName) => {
            if (!polymerBond.isSideChainConnection) {
              polymerBond.setRenderer(
                new BackBoneBondSequenceRenderer(polymerBond),
              );
              return;
            }

            const handledAttachmentPoints =
              handledMonomersToAttachmentPoints.get(
                node.monomer,
              ) as Set<AttachmentPointName>;

            if (handledAttachmentPoints.has(attachmentPointName)) {
              return;
            }

            const anotherMonomer = polymerBond.getAnotherMonomer(
              node.monomer,
            ) as BaseMonomer;

            // Skip handling side chains for sugar(R3) + base(R1) connections.
            if (
              (node.monomer instanceof Sugar &&
                getRnaBaseFromSugar(node.monomer) === anotherMonomer) ||
              (anotherMonomer instanceof Sugar &&
                getRnaBaseFromSugar(anotherMonomer) === node.monomer)
            ) {
              return;
            }

            let bondRenderer;

            // If side connection comes from rna base then take connected sugar and draw side connection from it
            // because for rna we display only one letter instead of three
            if (anotherMonomer instanceof RNABase) {
              const connectedSugar = getSugarFromRnaBase(anotherMonomer);
              bondRenderer = new PolymerBondSequenceRenderer(
                new PolymerBond(node.monomer, connectedSugar),
              );
            } else {
              bondRenderer = new PolymerBondSequenceRenderer(polymerBond);
            }
            bondRenderer.show();
            polymerBond.setRenderer(bondRenderer);
            handledAttachmentPoints.add(attachmentPointName);

            if (!handledMonomersToAttachmentPoints.get(anotherMonomer)) {
              handledMonomersToAttachmentPoints.set(anotherMonomer, new Set());
            }
            const anotherMonomerHandledAttachmentPoints =
              handledMonomersToAttachmentPoints.get(
                anotherMonomer,
              ) as Set<AttachmentPointName>;

            anotherMonomerHandledAttachmentPoints.add(
              anotherMonomer?.getAttachmentPointByBond(
                polymerBond,
              ) as AttachmentPointName,
            );
          });
        });
      });
    });
  }

  public static setCaretPosition(caretPosition: SequencePointer) {
    const oldSubChainNode = SequenceRenderer.getNodeByPointer(
      this.caretPosition,
    );

    if (oldSubChainNode) {
      oldSubChainNode.monomer.renderer.isEditingSymbol = false;
      oldSubChainNode.monomer.renderer?.remove();
      oldSubChainNode.monomer.renderer?.show();
    }
    SequenceRenderer.caretPosition = caretPosition;
    const subChainNode = SequenceRenderer.getNodeByPointer(caretPosition);

    if (!subChainNode) {
      return;
    }

    subChainNode.monomer.renderer.isEditingSymbol = true;
    subChainNode.monomer.renderer?.remove();
    subChainNode.monomer.renderer?.show();
  }

  public static setCaretPositionBySequenceItemRenderer(
    sequenceItemRenderer: BaseSequenceItemRenderer,
  ) {
    let chainIndex = -1;
    let subChainIndex = -1;
    let subChainNodeIndex = -1;

    this.chainsCollection.chains.forEach((chain, _chainIndex) => {
      chain.subChains.forEach((subChain, _subChainIndex) => {
        subChain.nodes.forEach((node, _nodeIndex) => {
          if (node.monomer.renderer === sequenceItemRenderer) {
            chainIndex = _chainIndex;
            subChainIndex = _subChainIndex;
            subChainNodeIndex = _nodeIndex;
          }
        });
      });
    });

    this.setCaretPosition([chainIndex, subChainIndex, subChainNodeIndex]);
  }

  public static moveCaretForward() {
    this.setCaretPosition(this.nextCaretPosition || this.caretPosition);
  }

  public static moveCaretBack() {
    this.setCaretPosition(this.previousCaretPosition || this.caretPosition);
  }

  public static get hasNewChain() {
    return Boolean(SequenceRenderer.newChainCaretPosition);
  }

  public static moveCaretToNewChain() {
    this.setCaretPosition(
      SequenceRenderer.newChainCaretPosition || [-1, -1, -1],
    );
  }

  public static get newChainCaretPosition(): SequencePointer | undefined {
    const lastNodeCaretPosition = SequenceRenderer.lastNodeCaretPosition;
    if (!lastNodeCaretPosition) {
      return undefined;
    }
    const lastChain =
      SequenceRenderer.chainsCollection.chains[lastNodeCaretPosition[0]];
    return lastChain.isEmpty
      ? [
          lastNodeCaretPosition[0],
          lastNodeCaretPosition[1],
          lastNodeCaretPosition[2],
        ]
      : undefined;
  }

  public static get lastNodeCaretPosition(): SequencePointer | undefined {
    if (SequenceRenderer.chainsCollection.chains.length === 0) {
      return undefined;
    }

    const lastChainCaretPosition =
      SequenceRenderer.chainsCollection.chains.length - 1;
    const lastSubChainCaretPosition =
      SequenceRenderer.chainsCollection.chains[lastChainCaretPosition].subChains
        .length - 1;
    const lastNodeCaretPosition =
      SequenceRenderer.chainsCollection.chains[lastChainCaretPosition]
        .subChains[lastSubChainCaretPosition].nodes.length - 1;

    return [
      lastChainCaretPosition,
      lastSubChainCaretPosition,
      lastNodeCaretPosition,
    ];
  }

  public static get currentEdittingNode() {
    return SequenceRenderer.getNodeByPointer(this.caretPosition);
  }

  public static get previousFromCurrentEdittingMonomer() {
    return SequenceRenderer.getNodeByPointer(
      SequenceRenderer.previousCaretPosition,
    );
  }

  public static get previousChain() {
    return SequenceRenderer.chainsCollection.chains[this.caretPosition[0] - 1];
  }

  public static getLastNonEmptyNode(chain: Chain) {
    const subChainBeforeLast = chain.subChains[chain.subChains.length - 2];

    return subChainBeforeLast.nodes[subChainBeforeLast.nodes.length - 1];
  }

  public static get nextFromCurrentEdittingMonomer() {
    return SequenceRenderer.getNodeByPointer(
      SequenceRenderer.nextCaretPosition,
    );
  }

  public static get nextNodeInSameChain() {
    if (
      SequenceRenderer.nextCaretPosition?.[0] !==
      SequenceRenderer.caretPosition[0]
    ) {
      return;
    }

    return SequenceRenderer.getNodeByPointer(
      SequenceRenderer.nextCaretPosition,
    );
  }

  public static get previousNodeInSameChain() {
    if (
      SequenceRenderer.previousCaretPosition?.[0] !==
      SequenceRenderer.caretPosition[0]
    ) {
      return;
    }

    return SequenceRenderer.getNodeByPointer(
      SequenceRenderer.previousCaretPosition,
    );
  }

  private static getNodeByPointer(sequencePointer?: SequencePointer) {
    if (!sequencePointer) return;

    return SequenceRenderer.chainsCollection.chains[sequencePointer[0]]
      ?.subChains[sequencePointer[1]]?.nodes[sequencePointer[2]];
  }

  private static getSubChainByPointer(sequencePointer: SequencePointer) {
    return SequenceRenderer.chainsCollection.chains[sequencePointer[0]]
      ?.subChains[sequencePointer[1]];
  }

  private static getChainByPointer(sequencePointer: SequencePointer) {
    return SequenceRenderer.chainsCollection.chains[sequencePointer[0]];
  }

  private static get nextCaretPosition(): SequencePointer | undefined {
    const currentChainIndex = SequenceRenderer.caretPosition[0];
    const currentSubChainIndex = SequenceRenderer.caretPosition[1];
    const currentNodeIndex = SequenceRenderer.caretPosition[2];
    const nextNodePointer: SequencePointer = [
      currentChainIndex,
      currentSubChainIndex,
      currentNodeIndex + 1,
    ];
    const nextSubChainPointer: SequencePointer = [
      currentChainIndex,
      currentSubChainIndex + 1,
      0,
    ];
    const nextChainPointer: SequencePointer = [currentChainIndex + 1, 0, 0];

    return (
      (this.getNodeByPointer(nextNodePointer) && nextNodePointer) ||
      (this.getNodeByPointer(nextSubChainPointer) && nextSubChainPointer) ||
      (this.getNodeByPointer(nextChainPointer) && nextChainPointer) ||
      undefined
    );
  }

  private static get previousCaretPosition() {
    const currentChainIndex = SequenceRenderer.caretPosition[0];
    const currentSubChainIndex = SequenceRenderer.caretPosition[1];
    const currentNodeIndex = SequenceRenderer.caretPosition[2];
    const previousNodePointer: SequencePointer = [
      currentChainIndex,
      currentSubChainIndex,
      currentNodeIndex - 1,
    ];
    const previousSubChainPointer: SequencePointer = [
      currentChainIndex,
      currentSubChainIndex - 1,
      this.getSubChainByPointer([
        currentChainIndex,
        currentSubChainIndex - 1,
        -1,
      ])?.nodes.length - 1,
    ];
    const previousChainPointer: SequencePointer = [
      currentChainIndex - 1,
      this.getChainByPointer([currentChainIndex - 1, -1, -1])?.subChains
        .length - 1,
      this.getSubChainByPointer([
        currentChainIndex - 1,
        this.getChainByPointer([currentChainIndex - 1, -1, -1])?.subChains
          .length - 1,
        -1,
      ])?.nodes.length - 1,
    ];

    return (
      (this.getNodeByPointer(previousNodePointer) && previousNodePointer) ||
      (this.getNodeByPointer(previousSubChainPointer) &&
        previousSubChainPointer) ||
      (this.getNodeByPointer(previousChainPointer) && previousChainPointer) ||
      undefined
    );
  }

  public static get isCarretBeforeChain() {
    return this.caretPosition[2] === -1;
  }

  public static get lastChain() {
    return SequenceRenderer.chainsCollection.chains[
      SequenceRenderer.chainsCollection.chains.length - 1
    ];
  }

  public static startNewSequence() {
    const chain = new Chain();
    const emptySequenceNode = new EmptySequenceNode();
    const emptySubChain = new EmptySubChain();
    emptySubChain.add(emptySequenceNode);
    chain.subChains.push(emptySubChain);

    const renderer = SequenceNodeRendererFactory.fromNode(
      emptySequenceNode,
      this.lastChainStartPosition,
      0,
      false,
      true,
    );
    renderer.show();
    emptySequenceNode.setRenderer(renderer);
    SequenceRenderer.emptySequenceItemRenderers.push(renderer);
    SequenceRenderer.chainsCollection.chains.push(chain);
  }

  public static getPreviousNodeInSameChain(nodeToCompare: SubChainNode) {
    let chainIndex = -1;
    let subChainIndex = -1;
    let subChainNodeIndex = -1;

    this.chainsCollection.chains.forEach((chain, _chainIndex) => {
      chain.subChains.forEach((subChain, _subChainIndex) => {
        subChain.nodes.forEach((node, _nodeIndex) => {
          if (node === nodeToCompare) {
            chainIndex = _chainIndex;
            subChainIndex = _subChainIndex;
            subChainNodeIndex = _nodeIndex;
          }
        });
      });
    });

    return subChainNodeIndex - 1 >= 0
      ? SequenceRenderer.getNodeByPointer([
          chainIndex,
          subChainIndex,
          subChainNodeIndex - 1,
        ])
      : undefined;
  }
}
