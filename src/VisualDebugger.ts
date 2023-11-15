import WritingDirection from "./WritingDirection";

// We'll make VisualDebugger no-op for any environments lacking a DOM (e.g. SSR and React Native non-web platforms).
const hasDOM = typeof window !== 'undefined' && window.document;

const WIDTH = hasDOM ? window.innerWidth : 0;
const HEIGHT = hasDOM ? window.innerHeight : 0;

interface NodeLayout {
  left: number;
  top: number;
  readonly right: number;
  readonly bottom: number;
  width: number;
  height: number;
}

class VisualDebugger {
  private debugCtx: CanvasRenderingContext2D;

  private layoutsCtx: CanvasRenderingContext2D;

  private writingDirection: WritingDirection;

  constructor(writingDirection: WritingDirection) {
    if (hasDOM) {
      this.debugCtx = VisualDebugger.createCanvas('sn-debug', '1010', writingDirection);
      this.layoutsCtx = VisualDebugger.createCanvas('sn-layouts', '1000', writingDirection);
      this.writingDirection = writingDirection;
    }
  }

  static createCanvas(id: string, zIndex: string, writingDirection: WritingDirection) {
    const canvas: HTMLCanvasElement =
      document.querySelector(`#${id}`) || document.createElement('canvas');

    canvas.setAttribute('id', id);
    canvas.setAttribute('dir', writingDirection === WritingDirection.LTR ? "ltr" : "rtl");

    const ctx = canvas.getContext('2d');

    canvas.style.zIndex = zIndex;
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';

    document.body.appendChild(canvas);

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    return ctx;
  }

  clear() {
    if (!hasDOM) {
      return;
    }

    this.debugCtx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  clearLayouts() {
    if (!hasDOM) {
      return;
    }

    this.layoutsCtx.clearRect(0, 0, WIDTH, HEIGHT);
  }

  drawLayout(layout: NodeLayout, focusKey: string, parentFocusKey: string) {
    if (!hasDOM) {
      return;
    }
    this.layoutsCtx.strokeStyle = 'green';
    this.layoutsCtx.strokeRect(
      layout.left,
      layout.top,
      layout.width,
      layout.height
    );
    this.layoutsCtx.font = '8px monospace';
    this.layoutsCtx.fillStyle = 'red';

    const horizontalStartDirection = this.writingDirection === WritingDirection.LTR ? "left" : "right";
    const horizontalStartCoordinate = layout[horizontalStartDirection];

    this.layoutsCtx.fillText(focusKey, horizontalStartCoordinate, layout.top + 10);
    this.layoutsCtx.fillText(parentFocusKey, horizontalStartCoordinate, layout.top + 25);
    this.layoutsCtx.fillText(
      `${horizontalStartDirection}: ${horizontalStartCoordinate}`,
      horizontalStartCoordinate,
      layout.top + 40
    );
    this.layoutsCtx.fillText(
      `top: ${layout.top}`,
      horizontalStartCoordinate,
      layout.top + 55
    );
  }

  drawPoint(x: number, y: number, color = 'blue', size = 10) {
    if (!hasDOM) {
      return;
    }
    this.debugCtx.strokeStyle = color;
    this.debugCtx.lineWidth = 3;
    this.debugCtx.strokeRect(x - size / 2, y - size / 2, size, size);
  }
}

export default VisualDebugger;
