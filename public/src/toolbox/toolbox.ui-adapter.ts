import { clientConfiguration } from '../config/client.config.js';
import { SemanticEvents, type EventBus, type SemanticEventMap } from '../event-bus/index.js';
import { Tools } from './enums/tools.enum.js';

interface ToolboxElementDOMIds {
  penButton: string;
  lineButton: string;
  eraserButton: string;
  eyeDropperButton: string;
  rectangleButton: string;
  ovalButton: string;

  colorSetting: string;
  strokeSetting: string;
}

export class ToolboxUiAdapter {
  private buttonIdMap: Record<Tools, string>;

  private colorPickerElement: HTMLInputElement;
  private strokeSizeElement: HTMLInputElement;

  constructor(
    private document: Document,
    private semanticEventBus: EventBus<SemanticEventMap>,
    toolboxUiElementIds: ToolboxElementDOMIds = {
      penButton: 'toolbox-button-pen',
      lineButton: 'toolbox-button-line',
      eraserButton: 'toolbox-button-eraser',
      eyeDropperButton: 'toolbox-button-eye-dropper',
      rectangleButton: 'toolbox-button-rectangle',
      ovalButton: 'toolbox-button-oval',

      colorSetting: 'toolbox-setting-color',
      strokeSetting: 'toolbox-setting-stroke',
    },
  ) {
    // Map of tools mapped to corresponding buttons
    this.buttonIdMap = {
      [Tools.Pen]: toolboxUiElementIds.penButton,
      [Tools.Line]: toolboxUiElementIds.lineButton,
      [Tools.Eraser]: toolboxUiElementIds.eraserButton,
      [Tools.Eyedropper]: toolboxUiElementIds.eyeDropperButton,
      [Tools.Rectangle]: toolboxUiElementIds.rectangleButton,
      [Tools.Oval]: toolboxUiElementIds.ovalButton,
    };

    for (const tool of Object.keys(this.buttonIdMap) as Tools[]) {
      const element = this.document.getElementById(this.getDOMElementId(tool));
      if (!element) throw new Error(`Toolbox button component not found: ${tool}`);
      element.addEventListener('click', (_) => {
        this.semanticEventBus.emit(SemanticEvents.ToolboxChangeTool, { tool });
      });
    }

    this.colorPickerElement = this.document.getElementById(
      toolboxUiElementIds.colorSetting,
    ) as HTMLInputElement;
    if (!this.colorPickerElement)
      throw new Error(
        `Color picker component not found. Did you spell id correctly? Id: ${toolboxUiElementIds.colorSetting}`,
      );

    this.strokeSizeElement = this.document.getElementById(
      toolboxUiElementIds.strokeSetting,
    ) as HTMLInputElement;
    if (!this.strokeSizeElement)
      throw new Error(
        `Stroke size picker component not found. Did you spell id correctly? Id: ${toolboxUiElementIds.strokeSetting}`,
      );

    this.colorPickerElement.addEventListener('input', (e) => {
      this.semanticEventBus.emit(SemanticEvents.ToolboxChangeStrokeColor, {
        value: (e.target as HTMLInputElement).value,
      });
    });
    this.strokeSizeElement.addEventListener('input', (e) => {
      this.semanticEventBus.emit(SemanticEvents.ToolboxChangeStrokeSize, {
        value: +(e.target as HTMLInputElement).value,
      });
    });

    // set defaults from client configuration
    this.strokeSizeElement.min = clientConfiguration.strokeMinSize.toString();
    this.strokeSizeElement.max = clientConfiguration.strokeMaxSize.toString();

    this.setStrokeColor(clientConfiguration.defaultStrokeData.color);
    this.setStrokeSize(clientConfiguration.defaultStrokeData.size);
    this.setActive(clientConfiguration.defaultTool);
  }

  private getDOMElementId(button: Tools): string {
    const ret = this.buttonIdMap[button];
    if (!ret) throw Error('Toolbox button id is not defined');
    return ret;
  }

  public setStrokeColor(value: string) {
    this.colorPickerElement.value = value;
  }
  public setStrokeSize(value: number) {
    this.strokeSizeElement.value = value.toString();
  }

  public setActive(button: Tools) {
    const el = this.document.getElementById(this.getDOMElementId(button));
    if (el) el.classList.add('active');
  }
  public setInactive(button: Tools) {
    const el = this.document.getElementById(this.getDOMElementId(button));
    if (el) el.classList.remove('active');
  }
}
