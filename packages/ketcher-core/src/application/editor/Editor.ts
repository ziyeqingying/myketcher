import { DOMSubscription } from 'subscription';
import { Struct, Vec2 } from 'domain/entities';
import {
  BaseTool,
  IRnaPreset,
  isBaseTool,
  Tool,
  ToolConstructorInterface,
  ToolEventHandlerName,
} from 'application/editor/tools/Tool';
import { toolsMap } from 'application/editor/tools';
import { MonomerItemType } from 'domain/types';
import { RenderersManager } from 'application/render/renderers/RenderersManager';
import { DrawingEntitiesManager } from 'domain/entities/DrawingEntitiesManager';
import {
  editorEvents,
  renderersEvents,
  resetEditorEvents,
} from 'application/editor/editorEvents';
import { PolymerBondRenderer } from 'application/render/renderers';
import { Editor } from 'application/editor/editor.types';
import { MacromoleculesConverter } from 'application/editor/MacromoleculesConverter';

interface ICoreEditorConstructorParams {
  theme;
  canvas: SVGSVGElement;
}

function isMouseMainButtonPressed(event: MouseEvent) {
  return event.button === 0;
}

let editor;
export class CoreEditor {
  public events;

  public renderersContainer: RenderersManager;
  public drawingEntitiesManager: DrawingEntitiesManager;
  public lastCursorPosition: Vec2 = new Vec2(0, 0);
  public canvas: SVGSVGElement;
  public canvasOffset: DOMRect;
  public theme;
  // private lastEvent: Event | undefined;
  private tool?: Tool | BaseTool;
  private micromoleculesEditor: Editor;

  constructor({ theme, canvas }: ICoreEditorConstructorParams) {
    this.theme = theme;
    this.canvas = canvas;
    resetEditorEvents();
    this.events = editorEvents;
    this.subscribeEvents();
    this.renderersContainer = new RenderersManager({ theme });
    this.drawingEntitiesManager = new DrawingEntitiesManager();
    this.domEventSetup();
    this.canvasOffset = this.canvas.getBoundingClientRect();
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    editor = this;
    this.micromoleculesEditor = global.ketcher.editor;
    this.switchToMacromolecules();
  }

  static provideEditorInstance(): CoreEditor {
    return editor;
  }

  private subscribeEvents() {
    this.events.selectMonomer.add((monomer) => this.onSelectMonomer(monomer));
    this.events.selectPreset.add((preset) => this.onSelectRNAPreset(preset));
    this.events.selectTool.add((tool) => this.onSelectTool(tool));
    this.events.selectMode.add((isSnakeMode) => this.onSelectMode(isSnakeMode));

    renderersEvents.forEach((eventName) => {
      this.events[eventName].add((event) =>
        this.useToolIfNeeded(eventName, event),
      );
    });
  }

  private onSelectMonomer(monomer: MonomerItemType) {
    this.selectTool('monomer', monomer);
  }

  private onSelectRNAPreset(preset: IRnaPreset) {
    this.selectTool('preset', preset);
  }

  private onSelectTool(tool: string) {
    this.selectTool(tool);
  }

  // todo we need to create abstraction layer for modes in future similar to the tools layer
  private onSelectMode(isSnakeMode: boolean) {
    PolymerBondRenderer.setSnakeMode(isSnakeMode);
    const modelChanges = this.drawingEntitiesManager.reArrangeChains(
      this.canvas.width.baseVal.value,
      isSnakeMode,
    );
    this.renderersContainer.update(modelChanges);
  }

  public selectTool(name: string, options?) {
    const ToolConstructor: ToolConstructorInterface = toolsMap[name];
    const oldTool = this.tool;

    this.tool = new ToolConstructor(this, options);

    if (isBaseTool(oldTool)) {
      oldTool?.destroy();
    }
  }

  public unsubscribeEvents() {
    for (const eventName in this.events) {
      this.events[eventName].handlers = [];
    }
  }

  get trackedDomEvents() {
    const trackedDomEvents: {
      target: Element | Document;
      eventName: string;
      toolEventHandler: ToolEventHandlerName;
    }[] = [
      {
        target: this.canvas,
        eventName: 'click',
        toolEventHandler: 'click',
      },
      {
        target: this.canvas,
        eventName: 'dblclick',
        toolEventHandler: 'dblclick',
      },
      {
        target: this.canvas,
        eventName: 'mousedown',
        toolEventHandler: 'mousedown',
      },
      {
        target: document,
        eventName: 'mousemove',
        toolEventHandler: 'mousemove',
      },
      {
        target: document,
        eventName: 'mouseup',
        toolEventHandler: 'mouseup',
      },
      {
        target: document,
        eventName: 'mouseleave',
        toolEventHandler: 'mouseleave',
      },
      {
        target: this.canvas,
        eventName: 'mouseleave',
        toolEventHandler: 'mouseLeaveClientArea',
      },
      {
        target: this.canvas,
        eventName: 'mouseover',
        toolEventHandler: 'mouseover',
      },
    ];

    return trackedDomEvents;
  }

  private domEventSetup() {
    this.trackedDomEvents.forEach(({ target, eventName, toolEventHandler }) => {
      this.events[eventName] = new DOMSubscription();
      const subs = this.events[eventName];

      target.addEventListener(eventName, subs.dispatch.bind(subs));

      subs.add((event) => {
        this.updateLastCursorPosition(event);

        if (
          ['mouseup', 'mousedown', 'click', 'dbclick'].includes(event.type) &&
          !isMouseMainButtonPressed(event)
        ) {
          return true;
        }

        // if (eventName !== 'mouseup' && eventName !== 'mouseleave') {
        //   // to complete drag actions
        //   if (!event.target || event.target.nodeName === 'DIV') {
        //     // click on scroll
        //     this.hover(null);
        //     return true;
        //   }
        // }

        const isToolUsed = this.useToolIfNeeded(toolEventHandler, event);
        if (isToolUsed) {
          return true;
        }

        return true;
      }, -1);
    });
  }

  private updateLastCursorPosition(event) {
    const events = ['mousemove', 'click', 'mousedown', 'mouseup', 'mouseover'];
    if (events.includes(event.type)) {
      const clientAreaBoundingBox = this.canvas.getBoundingClientRect();

      this.lastCursorPosition = new Vec2({
        x: event.pageX - clientAreaBoundingBox.x,
        y: event.pageY - clientAreaBoundingBox.y,
      });
    }
  }

  private useToolIfNeeded(eventHandlerName: ToolEventHandlerName, event) {
    const editorTool = this.tool as Tool;
    if (!editorTool) {
      return false;
    }
    // this.lastEvent = event;
    const conditions = [
      eventHandlerName in editorTool,
      this.canvas.contains(event?.target) || editorTool.isSelectionRunning?.(),
      // isContextMenuClosed(editor.contextMenu),
    ];

    if (conditions.every((condition) => condition)) {
      editorTool[eventHandlerName]?.(event);
      return true;
    }

    return false;
  }

  public switchToMicromolecules() {
    this.unsubscribeEvents();
    const struct = this.micromoleculesEditor.struct();
    const reStruct = this.micromoleculesEditor.render.ctab;
    MacromoleculesConverter.convertDrawingEntitiesToStruct(
      this.drawingEntitiesManager,
      struct,
      reStruct,
    );
    reStruct.render.setMolecule(struct);
  }

  private switchToMacromolecules() {
    const struct = this.micromoleculesEditor?.struct() || new Struct();
    const { modelChanges } =
      MacromoleculesConverter.convertStructToDrawingEntities(
        struct,
        this.drawingEntitiesManager,
      );
    this.renderersContainer.update(modelChanges);
    global.ketcher.editor?.clear();
  }
}
