import { pointDistance } from 'diagram-js/lib/util/Geometry';

const round = Math.round;

export function getMid(element) {
  return {
    x: round(element.x + element.width / 2),
    y: round(element.y + element.height / 2)
  };
}

export function getDistance(a, b) {
  return pointDistance(getMid(a), getMid(b));
}

export function getVectorFromPoints(a, b) {
  return new Vector(b.x - a.x, b.y - a.y);
}

export class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  normalize() {
    const magnitude = this.magnitude();

    this.x = this.x / magnitude;
    this.y = this.y / magnitude;

    return this;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  scale(factor) {
    this.x = this.x * factor;
    this.y = this.y * factor;

    return this;
  }
}
