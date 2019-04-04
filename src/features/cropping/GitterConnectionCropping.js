import { getMid, getVectorFromPoints, Vector } from '../../util/GeometryUtil';

const { atan2, cos, sin, PI } = Math;

class GitterConnectionCropping {
  constructor(gitterConfig) {
    this.shapeRadius = gitterConfig.shapeSize / 2;
  }

  getCroppedWaypoints(a, b) {
    const vectorA = getVectorFromPoints(a, b).normalize().scale(10);
    const vectorB = getVectorFromPoints(b, a).normalize().scale(10);

    const intersection1 = {
      x: a.x + vectorA.x,
      y: a.y + vectorA.y
    };

    const intersection2 = {
      x: b.x + vectorB.x,
      y: b.y + vectorB.y
    };

    return [
      intersection1,
      intersection2
    ];
  }

  getCroppedWaypointsFromConnection({ source, target }) {
    const sourceMid = getMid(source),
          targetMid = getMid(target);

    return this.getCroppedWaypoints(sourceMid, targetMid);
  }
}

GitterConnectionCropping.$inject = [ 'gitterConfig' ];

export default GitterConnectionCropping;
