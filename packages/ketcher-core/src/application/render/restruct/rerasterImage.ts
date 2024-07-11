import { ReObject, ReStruct } from 'application/render/restruct';
import { RasterImage } from 'domain/entities/rasterImage';
import { RenderOptions } from 'application/render/render.types';
import { Scale } from 'domain/helpers';
import { RaphaelElement } from 'raphael';
import { Box2Abs, Vec2 } from 'domain/entities';
import draw from 'application/render/draw';
import { RASTER_IMAGE_KEY } from 'domain/constants';

export class ReRasterImage extends ReObject {
  private element?: RaphaelElement;

  static isSelectable(): boolean {
    return true;
  }

  constructor(public rasterImage: RasterImage) {
    super(RASTER_IMAGE_KEY);
  }

  private getScaledPointWithOffset(
    originalPoint: Vec2,
    renderOptions: RenderOptions,
  ): Vec2 {
    const scaledPoint: Vec2 = Scale.modelToCanvas(originalPoint, renderOptions);
    return scaledPoint.add(renderOptions.offset);
  }

  private getDimensions(renderOptions: RenderOptions): Vec2 {
    return Vec2.diff(
      this.getScaledPointWithOffset(
        this.rasterImage.getBottomRightPosition(),
        renderOptions,
      ),
      this.getScaledPointWithOffset(
        this.rasterImage.getTopLeftPosition(),
        renderOptions,
      ),
    );
  }

  show(restruct: ReStruct, renderOptions: RenderOptions) {
    if (this.element) {
      restruct.clearVisel(this.visel);
      this.remove();
    }

    const scaledTopLeftWithOffset = this.getScaledPointWithOffset(
      this.rasterImage.getTopLeftPosition(),
      renderOptions,
    );
    const dimensions = this.getDimensions(renderOptions);

    this.element = restruct.render.paper.image(
      this.rasterImage.bitmap,
      scaledTopLeftWithOffset.x,
      scaledTopLeftWithOffset.y,
      dimensions.x,
      dimensions.y,
    );
  }

  drawHover() {
    // TODO implement in the following task
  }

  makeSelectionPlate(
    _restruct: ReStruct,
    paper: ReStruct['render']['paper'],
    options: RenderOptions,
  ) {
    const selectionSet = paper.set();
    const cornerPositions = this.rasterImage
      .getCornerPositions()
      .map((item) => Scale.modelToCanvas(item, options));
    selectionSet.push(
      draw
        .selectionPolygon(paper, cornerPositions, options)
        .attr(options.selectionStyleSimpleObject),
    );
    return selectionSet;
  }

  getVBoxObj(): Box2Abs | null {
    return new Box2Abs(
      this.rasterImage.getTopLeftPosition(),
      this.rasterImage.getBottomRightPosition(),
    );
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  move(reStruct: ReStruct, diff: Vec2) {
    reStruct.clearVisel(this.visel);
    if (this.element) {
      this.element.translate(diff.x, diff.y);
    }
  }

  // Workaround to always display images on top
  moveToBottomOfParentNode() {
    if (this.element && this.element.node && this.element.node.parentNode) {
      const node = this.element.node;
      const parentNode: HTMLElement = node.parentNode;
      parentNode?.appendChild(node);
    }
  }
}
