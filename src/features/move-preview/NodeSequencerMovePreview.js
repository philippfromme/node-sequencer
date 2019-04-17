import {
  append as svgAppend,
  clear as svgClear,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg';

import {
  classes as domClasses
} from 'min-dom';

import { translate } from 'diagram-js/lib/util/SvgTransformUtil';

import { createLine, updateLine } from 'diagram-js/lib/util/RenderUtil';

import { isConnection, isRoot } from '../../util/NodeSequencerUtil';

import { getMid } from '../../util/GeometryUtil';

const LOW_PRIORITY = 500;

// TODO: fix buggy implementation
class NodeSequencerMovePreview {
  constructor(
    eventBus,
    canvas,
    previewSupport,
    elementRegistry,
    nodeSequencerRules,
    nodeSequencerConnectionCropping
  ) {
    this._nodeSequencerConnectionCropping = nodeSequencerConnectionCropping;

    this.connectionPreviews = [];

    const movePreviewLayer = this.movePreviewLayer = canvas.getLayer('move-preview', -100);

    eventBus.on('shape.move.start', LOW_PRIORITY, ({ context }) => {
      if (!context.dragGroup) {
        const dragGroup = svgCreate('g');

        domClasses(dragGroup).add('nodeSequencer-move-group');

        svgAppend(movePreviewLayer, dragGroup);

        context.dragGroup = dragGroup;
      }

      const { shapes } = context;

      shapes.forEach(shape => {
        previewSupport.addDragger(shape, context.dragGroup);
      });

      context.nonMovingShapes = context.nonMovingShapes = elementRegistry.filter(s => {
        return !shapes.includes(s) &&
               !isRoot(s) &&
               !isConnection(s);
      });
    });

    eventBus.on('shape.move.move', LOW_PRIORITY, event => {
      const { context, dx, dy } = event;

      const { shapes, nonMovingShapes, dragGroup } = context;

      translate(dragGroup, dx, dy);

      // shapes.forEach(shape => {
      //   nonMovingShapes.forEach(nonMovingShape => {

      //     const movedShape = {
      //       id: shape.id,
      //       type: shape.type,
      //       x: shape.x + dx,
      //       y: shape.y + dy,
      //       width: shape.width,
      //       height: shape.height
      //     };

      //     // check for possible connections
      //     if (nodeSequencerRules.canConnect(movedShape, nonMovingShape)
      //         && !this.hasPreview(movedShape, nonMovingShape)) {
      //       this.addConnectionPreview(movedShape, nonMovingShape);
      //     }
      //   });
      // });

      // this.connectionPreviews.forEach(connectionPreview => {
      //   const { gfx, movingShape, nonMovingShape } = connectionPreview;

      //   const movingShapeWithDelta = {
      //     id: movingShape.id,
      //     type: movingShape.type,
      //     x: movingShape.x + dx,
      //     y: movingShape.y + dy,
      //     width: movingShape.width,
      //     height: movingShape.height
      //   };

      //   if (!nodeSequencerRules.canConnect(movingShapeWithDelta, nonMovingShape)) {

      //     // remove
      //     this.removeConnectionPreview(connectionPreview);
      //   } else {

      //     // update
      //     this.updateConnectionPreview(connectionPreview, dx, dy);
      //   }
      // });
    });

    eventBus.on([ 'shape.move.cleanup' ], LOW_PRIORITY, ({ context }) => {
      svgClear(movePreviewLayer);

      this.connectionPreviews = [];
    });
  }

  addConnectionPreview(movingShape, nonMovingShape) {
    const movingShapeMid = getMid(movingShape),
          nonMovingShapeMid = getMid(nonMovingShape);

    const croppedWaypoints =
      this._nodeSequencerConnectionCropping.getCroppedWaypoints(movingShapeMid, nonMovingShapeMid);

    const attrs = {
      stroke: 'red'
    };

    const connectionPreview = createLine(croppedWaypoints, attrs);

    svgAppend(this.movePreviewLayer, connectionPreview);

    this.connectionPreviews.push({
      gfx: connectionPreview,
      movingShape,
      nonMovingShape
    });
  }

  updateConnectionPreview(connectionPreview, dx, dy) {
    const { gfx, movingShape, nonMovingShape } = connectionPreview;

    const movingShapeMid = getMid(movingShape),
          nonMovingShapeMid = getMid(nonMovingShape);

    movingShapeMid.x += dx;
    movingShapeMid.y += dy;

    const croppedWaypoints =
      this._nodeSequencerConnectionCropping.getCroppedWaypoints(movingShapeMid, nonMovingShapeMid);

    updateLine(gfx, croppedWaypoints);
  }

  removeConnectionPreview(connectionPreview) {
    const { gfx } = connectionPreview;

    svgRemove(gfx);

    this.connectionPreviews =
      this.connectionPreviews.filter(p => p !== connectionPreview);
  }

  // TODO: fix, why does object to object comparism not work?
  hasPreview(a, b) {
    let hasPreview = false;

    this.connectionPreviews.forEach(({ movingShape, nonMovingShape }) => {
      if ((movingShape.id === a.id && nonMovingShape.id === b.id) ||
          (movingShape.id === b.id && nonMovingShape.id === a.id)) {
            hasPreview = true;
          }
    });

    return hasPreview;
  }
}

NodeSequencerMovePreview.$inject = [
  'eventBus',
  'canvas',
  'previewSupport',
  'elementRegistry',
  'nodeSequencerRules',
  'nodeSequencerConnectionCropping'
];

export default NodeSequencerMovePreview;
