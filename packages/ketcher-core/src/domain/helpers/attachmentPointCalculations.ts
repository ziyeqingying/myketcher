import CoordinatesTool from 'application/editor/shared/coordinates';
import { Vec2 } from 'domain/entities/vec2';

export type Coordinates = { x: number; y: number };

// eslint-disable-next-line camelcase
export function canvasToMonomerCoordinates(
  coordinatesOnCanvas: Coordinates,
  centerOFMonomer: Coordinates,
  monomerWidth: number,
  monomerHeight: number,
) {
  const zeroPointCoord = {
    x: centerOFMonomer.x - monomerWidth / 2,
    y: centerOFMonomer.y - monomerHeight / 2,
  };

  const monomerCoord = {
    x: coordinatesOnCanvas.x - zeroPointCoord.x,
    y: coordinatesOnCanvas.y - zeroPointCoord.y,
  };

  return monomerCoord;
}

export function findLabelPoint(
  pointOnBorder: Coordinates,
  angle: number,
  lineLength: number,
  lineOffset: number,
) {
  // based on https://ru.stackoverflow.com/a/1442905

  const angleRadians = Vec2.degrees_to_radians(angle);

  const pointOfAttachment = Vec2.findSecondPoint(
    pointOnBorder,
    lineLength,
    angleRadians,
  );

  // find vector between pointOnBorder and pointOfAttachment

  const attachmentVector = {
    x: pointOfAttachment.x - pointOnBorder.x,
    y: pointOfAttachment.y - pointOnBorder.y,
  };

  // rotate this vector at 90 degrees - change x and y, then make one negative
  let rotatedVector;
  if (angle >= -200 && angle < -60) {
    rotatedVector = { x: -attachmentVector.y, y: attachmentVector.x }; // for angle -200 to -60
  } else {
    rotatedVector = { x: attachmentVector.y, y: -attachmentVector.x }; // for angle -0 to -270
  }

  // normalize vector
  const normalizedVector = {
    x: rotatedVector.x / lineLength,
    y: rotatedVector.y / lineLength,
  };

  // find vector for Label, using normalized vector and length

  let addedLabelOffset = 0;
  if (angle >= -225 && angle < -180) {
    addedLabelOffset = 5;
  } else if (angle >= -60 && angle <= 0) {
    addedLabelOffset = 5;
  }

  const labelVector = {
    x: normalizedVector.x * (lineOffset + addedLabelOffset),
    y: normalizedVector.y * (lineOffset + addedLabelOffset),
  };

  // add this vector to point of attachment

  const labelCoordinates = {
    x: pointOfAttachment.x + labelVector.x,
    y: pointOfAttachment.y + labelVector.y,
  };

  return [labelCoordinates, pointOfAttachment];
}

export function getSearchFunction(
  initialAngle: number,
  canvasOffset: Coordinates,
  monomer,
) {
  return function findPointOnMonomerBorder(
    coordStart,
    length,
    angle = initialAngle,
  ) {
    const angleRadians = Vec2.degrees_to_radians(angle);

    const secondPoint = Vec2.findSecondPoint(coordStart, length, angleRadians);

    const diff = Vec2.diff(
      new Vec2(coordStart.x, coordStart.y),
      new Vec2(secondPoint.x, secondPoint.y),
    );

    // exit recursion
    if (diff.length() < 1.2) {
      return secondPoint;
    }

    const newLength = Math.round(diff.length() / 2);
    const newCoordStart = { x: secondPoint.x, y: secondPoint.y };

    const zoomedCoordinateOfSecondPoint = CoordinatesTool.canvasToView(
      new Vec2(secondPoint),
    );

    const newPointCoord = {
      x: Math.round(zoomedCoordinateOfSecondPoint.x) + canvasOffset.x,
      y: Math.round(zoomedCoordinateOfSecondPoint.y) + canvasOffset.y,
    };
    const newPoint = document.elementFromPoint(
      newPointCoord.x,
      newPointCoord.y,
    ) as Element;

    let newAngle;
    if (newPoint === monomer.renderer.bodyElement.node()) {
      newAngle = initialAngle;
    } else {
      newAngle = initialAngle - 180;
    }

    return findPointOnMonomerBorder(newCoordStart, newLength, newAngle);
  };
}

export const anglesToSector = {
  '45': {
    min: 23,
    max: 68,
    center: 45,
  },
  '90': {
    min: 68,
    max: 113,
    center: 90,
  },
  '135': {
    min: 113,
    max: 148,
    center: 135,
  },
  '180': {
    min: 148,
    max: 203,
    center: 180,
  },
  '225': {
    min: 203,
    max: 248,
    center: 225,
  },
  '270': {
    min: 248,
    max: 293,
    center: 270,
  },
  '315': {
    min: 293,
    max: 228,
    center: 315,
  },
  '360': {
    min: 338,
    max: 360,
    center: 360,
  },
  '0': {
    min: 0,
    max: 23,
    center: 0,
  },
};

export enum attachmentPointNumberToAngle {
  'R1' = 0,
  'R2' = 180,
  'R3' = 90,
  'R4' = 270,
  'R5' = 45,
  'R6' = 135,
  'R7' = 315,
  'R8' = 225,
}

export const sectorsList = [45, 90, 135, 180, 225, 270, 315, 0, 360];

export function checkFor0and360(sectorsList: number[]) {
  if (!sectorsList.includes(0) && sectorsList.includes(360)) {
    return sectorsList.filter((item) => item !== 360);
  }
  if (!sectorsList.includes(360) && sectorsList.includes(0)) {
    return sectorsList.filter((item) => item !== 0);
  }
  return sectorsList;
}
