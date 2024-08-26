import ReObject from './reobject';
import { Line, MultitailArrow } from 'domain/entities/multitailArrow';
import { MULTITAIL_ARROW_KEY } from 'domain/constants/multitailArrow';
import { LayerMap, Render, ReStruct } from 'application/render';
import { RenderOptions } from 'application/render/render.types';
import { PathBuilder } from 'application/render/pathBuilder';
import { Scale } from 'domain/helpers';
import { Box2Abs, Pool, Vec2 } from 'domain/entities';
import util from 'application/render/util';
import { RaphaelPaper } from 'raphael';

export enum MultitailArrowRefName {
  HEAD = 'head',
  TAILS = 'tails',
  TOP_TAIL = 'topTail',
  BOTTOM_TAIL = 'bottomTail',
  SPINE = 'spine',
}

export interface MultitailArrowReferencePosition {
  name: MultitailArrowRefName;
  offset: Vec2;
  isLine: boolean;
  tailId: number | null;
}

export interface MultitailArrowClosestReferencePosition {
  distance: number;
  ref: MultitailArrowReferencePosition | null;
}

export class ReMultitailArrow extends ReObject {
  static TAILS_NAME = 'tails';
  static CUBIC_BEZIER_OFFSET = 6;

  static isSelectable(): boolean {
    return true;
  }

  static getTailIdFromRefName(name: string): number | null {
    if (name.startsWith(MultitailArrowRefName.TAILS)) {
      return parseInt(name.replace(`${MultitailArrowRefName.TAILS}-`, ''));
    }
    return null;
  }

  constructor(public multitailArrow: MultitailArrow) {
    super(MULTITAIL_ARROW_KEY);
  }

  getOffset(options: RenderOptions) {
    return 1.4 * (options.microModeScale / 8);
  }

  getReferencePositions(
    renderOptions: RenderOptions,
  ): ReturnType<MultitailArrow['getReferencePositions']> {
    const positions = this.multitailArrow.getReferencePositions();
    const tails = new Pool<Vec2>();
    positions.tails.forEach((item, key) => {
      tails.set(key, Scale.modelToCanvas(item, renderOptions));
    });

    return {
      head: Scale.modelToCanvas(positions.head, renderOptions),
      topTail: Scale.modelToCanvas(positions.topTail, renderOptions),
      bottomTail: Scale.modelToCanvas(positions.bottomTail, renderOptions),
      topSpine: Scale.modelToCanvas(positions.topSpine, renderOptions),
      bottomSpine: Scale.modelToCanvas(positions.bottomSpine, renderOptions),
      tails,
    };
  }

  getReferenceLines(
    renderOptions: RenderOptions,
    referencePositions = this.getReferencePositions(renderOptions),
  ) {
    return this.multitailArrow.getReferenceLines(referencePositions);
  }

  drawSingleLineHover(
    builder: PathBuilder,
    renderOptions: RenderOptions,
    lineStart: Vec2,
    lineEnd: Vec2,
    verticalDirection: -1 | 1,
    horizontalDirection: -1 | 1,
  ): void {
    const offset = this.getOffset(renderOptions);
    const cubicBezierOffset =
      horizontalDirection * ReMultitailArrow.CUBIC_BEZIER_OFFSET;
    const start = lineStart.add(
      new Vec2(offset * horizontalDirection, offset * verticalDirection),
    );
    const end = start.add(new Vec2(0, 2 * offset * -verticalDirection));
    builder
      .addLine(start)
      .addLine(lineEnd.add(new Vec2(0, offset * verticalDirection)))
      .addQuadraticBezierCurve(
        lineEnd.add(new Vec2(cubicBezierOffset, offset * verticalDirection)),
        lineEnd.add(new Vec2(cubicBezierOffset, 0)),
      )
      .addQuadraticBezierCurve(
        lineEnd.add(new Vec2(cubicBezierOffset, offset * -verticalDirection)),
        lineEnd.add(new Vec2(0, offset * -verticalDirection)),
      )
      .addLine(end);
  }

  buildFrame(renderOptions: RenderOptions): string {
    const offset = this.getOffset(renderOptions);
    const { topSpine, bottomSpine, topTail, bottomTail, head, tails } =
      this.getReferencePositions(renderOptions);
    const builder = new PathBuilder();
    const tailsPoints = Array.from(tails.values()).sort((a, b) => a.y - b.y);

    const start = topSpine.add(new Vec2(offset, offset));

    builder
      .addMovement(start)
      .addLine(
        topSpine.add(
          new Vec2(offset, -offset + ReMultitailArrow.CUBIC_BEZIER_OFFSET),
        ),
      )
      .addQuadraticBezierCurve(
        topSpine.add(new Vec2(offset, -offset)),
        topSpine.add(
          new Vec2(offset - ReMultitailArrow.CUBIC_BEZIER_OFFSET, -offset),
        ),
      );
    this.drawSingleLineHover(builder, renderOptions, topSpine, topTail, -1, -1);
    tailsPoints.forEach((tailPoint) => {
      this.drawSingleLineHover(
        builder,
        renderOptions,
        new Vec2(topSpine.x, tailPoint.y),
        tailPoint,
        -1,
        -1,
      );
    });
    this.drawSingleLineHover(
      builder,
      renderOptions,
      bottomSpine,
      bottomTail,
      -1,
      -1,
    );
    builder
      .addLine(
        bottomSpine.add(
          new Vec2(offset - ReMultitailArrow.CUBIC_BEZIER_OFFSET, offset),
        ),
      )
      .addQuadraticBezierCurve(
        bottomSpine.add(new Vec2(offset, offset)),
        bottomSpine.add(
          new Vec2(offset, offset - ReMultitailArrow.CUBIC_BEZIER_OFFSET),
        ),
      );
    this.drawSingleLineHover(
      builder,
      renderOptions,
      new Vec2(topSpine.x, head.y),
      head,
      1,
      1,
    );
    builder.addLine(start);
    return builder.build();
  }

  drawHover(render: Render) {
    const path = this.buildFrame(render.options);
    const paths = render.ctab.render.paper
      .path(path)
      .attr({ ...render.options.hoverStyle });

    render.ctab.addReObjectPath(LayerMap.hovering, this.visel, paths);

    return paths;
  }

  makeSelectionPlate(
    reStruct: ReStruct,
    paper: RaphaelPaper,
    options: RenderOptions,
  ) {
    const path = this.buildFrame(options);
    const selectionSet = paper.set();
    const paths = reStruct.render.paper
      .path(path)
      .attr({ ...options.selectionStyle });

    selectionSet.push(paths);
    return selectionSet;
  }

  show(reStruct: ReStruct, renderOptions: RenderOptions) {
    reStruct.clearVisel(this.visel);
    const pathBuilder = new PathBuilder();
    const headPathBuilder = new PathBuilder();
    const { topTail, topSpine, bottomSpine, head, tails } =
      this.getReferencePositions(renderOptions);
    const topTailOffsetX = topSpine.sub(topTail).x;
    const arrowStart = new Vec2(topSpine.x, head.y);
    const arrowLength = head.x - arrowStart.x;

    pathBuilder.addMultitailArrowBase(
      topSpine.y,
      bottomSpine.y,
      topSpine.x,
      topTailOffsetX,
    );
    headPathBuilder.addFilledTriangleArrowPathParts(arrowStart, arrowLength);
    tails.forEach((tail) => {
      pathBuilder.addLine(tail, { x: topSpine.x, y: tail.y });
    });

    const path = reStruct.render.paper.path(pathBuilder.build());
    const header = reStruct.render.paper.path(headPathBuilder.build());
    path.attr(renderOptions.lineattr);
    header.attr({
      ...renderOptions.lineattr,
      fill: '#000',
    });
    this.visel.add(path, Box2Abs.fromRelBox(util.relBox(path.getBBox())));
    this.visel.add(header, Box2Abs.fromRelBox(util.relBox(header.getBBox())));
  }

  private calculateDistanceToNamedEntity(
    point: Vec2,
    entities: Array<[string, Vec2]>,
    isLine: false,
  ): MultitailArrowClosestReferencePosition;

  private calculateDistanceToNamedEntity(
    point: Vec2,
    entities: Array<[string, Line]>,
    isLine: true,
  ): MultitailArrowClosestReferencePosition;

  private calculateDistanceToNamedEntity(
    point: Vec2,
    entities: Array<[string, Vec2 | Line]>,
    isLine: boolean,
  ): MultitailArrowClosestReferencePosition {
    return entities.reduce(
      (acc, [name, value]) => {
        const distance = isLine
          ? point.calculateDistanceToLine(value as Line)
          : Vec2.dist(point, value as Vec2);
        const tailId = ReMultitailArrow.getTailIdFromRefName(name);
        let refName: MultitailArrowRefName;
        if (typeof tailId === 'number') {
          refName = MultitailArrowRefName.TAILS;
        } else if (
          [
            MultitailArrowRefName.HEAD,
            MultitailArrowRefName.BOTTOM_TAIL,
            MultitailArrowRefName.TOP_TAIL,
          ].includes(name as MultitailArrowRefName)
        ) {
          refName = name as MultitailArrowRefName;
        } else {
          refName = MultitailArrowRefName.SPINE;
        }

        return distance < acc.distance
          ? {
              distance,
              ref: {
                name: refName,
                offset: new Vec2(0, 0),
                isLine,
                tailId,
              },
            }
          : acc;
      },
      {
        distance: Infinity,
        ref: null,
      } as MultitailArrowClosestReferencePosition,
    );
  }

  private tailArrayFromPool<T>(tails: Pool<T>): Array<[string, T]> {
    return Array.from(tails.entries()).map(([key, value]) => [
      `${ReMultitailArrow.TAILS_NAME}-${key}`,
      value,
    ]);
  }

  calculateDistanceToPoint(
    point: Vec2,
    renderOptions: RenderOptions,
    maxDistanceToPoint: number,
  ): MultitailArrowClosestReferencePosition {
    const referencePositions = this.getReferencePositions(renderOptions);
    const referenceLines = this.getReferenceLines(
      renderOptions,
      referencePositions,
    );
    const { tails, ...rest } = referenceLines;
    const lines: Array<[string, Line]> = Object.entries(rest).concat(
      this.tailArrayFromPool(tails),
    );

    const lineRes = this.calculateDistanceToNamedEntity(point, lines, true);

    if (lineRes.distance < maxDistanceToPoint) {
      const {
        topSpine: _t,
        bottomSpine: _b,
        tails: tailsPoints,
        ...validReferencePositions
      } = referencePositions;

      const points: Array<[string, Vec2]> = Object.entries(
        validReferencePositions,
      ).concat(this.tailArrayFromPool(tailsPoints));

      const pointsRes = this.calculateDistanceToNamedEntity(
        point,
        points,
        false,
      );
      if (
        pointsRes.distance < maxDistanceToPoint / 2 ||
        (pointsRes.distance < maxDistanceToPoint &&
          pointsRes.distance <= lineRes.distance)
      ) {
        return pointsRes;
      }
    }

    return lineRes;
  }
}
