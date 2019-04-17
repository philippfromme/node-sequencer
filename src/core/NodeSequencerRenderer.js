import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import { componentsToPath, createLine } from 'diagram-js/lib/util/RenderUtil';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate
} from 'tiny-svg';

import { isEmitter, isListener, isConnection } from '../util/NodeSequencerUtil';

function getLabel(soundId) {
  switch (soundId) {
    case 'kick':
      return 'K';
    case 'clap':
      return 'C';
    case 'snare':
      return 'S';
    case 'closedhat':
      return 'CH';
    case 'openhat':
      return 'OH';
    case 'tom':
      return 'T';
  }
}

class CustomRenderer extends BaseRenderer {
  constructor(eventBus, canvas, nodeSequencerConfig) {
    super(eventBus, 2000);

    this._nodeSequencerConfig = nodeSequencerConfig;

    this.drawEmitter = (p, element, color) => {
      const { width, height, timeSignature } = element;

      const cx = width / 2,
            cy = height / 2;

      const attrs = {
        stroke: color,
        strokeWidth: 1,
        fill: 'white'
      };

      const circle = svgCreate('circle');

      svgAttr(circle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4)
      });

      svgAttr(circle, attrs);

      svgAppend(p, circle);

      var text = svgCreate('text');

      text.textContent = '1/' + timeSignature;

      svgAppend(p, text);

      // thanks to monospace font we can do this
      var translateX = (width / 2) - (text.textContent.length * 1.85);

      svgAttr(text, {
        transform: 'translate(' + translateX +  ', 12)',
        fill: color,
        fontSize: '6px'
      });

      return circle;
    };

    this.drawListener = (p, element, outerColor, innerColor) => {
      const { width, height, sound } = element;

      const cx = width / 2,
            cy = height / 2;

      const attrs = {
        strokeWidth: 1,
        fill: 'white'
      };

      const circle = svgCreate('circle');

      svgAttr(circle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4),
        stroke: outerColor
      });

      svgAttr(circle, attrs);

      svgAppend(p, circle);

      const innerCircle = svgCreate('circle');

      svgAttr(innerCircle, {
        cx: cx,
        cy: cy,
        r: Math.round((width + height) / 4) - 3,
        stroke: innerColor
      });

      svgAttr(innerCircle, attrs);

      svgAppend(p, innerCircle);

      var text = svgCreate('text');

      text.textContent = getLabel(sound) || '';

      svgAppend(p, text);

      // thanks to monospace font we can do this
      var translateX = (width / 2) - (text.textContent.length * 1.85);

      svgAttr(text, {
        transform: 'translate(' + translateX +  ', 12)',
        fill: innerColor,
        fontSize: '6'
      });

      return circle;
    };

    this.getCirclePath = shape => {
      const cx = shape.x + shape.width / 2,
            cy = shape.y + shape.height / 2,
            radius = shape.width / 2;

      const circlePath = [
        ['M', cx, cy],
        ['m', 0, -radius],
        ['a', radius, radius, 0, 1, 1, 0, 2 * radius],
        ['a', radius, radius, 0, 1, 1, 0, -2 * radius],
        ['z']
      ];

      return componentsToPath(circlePath);
    };

    this.drawConnection = (p, element) => {
      const attrs = {
        strokeWidth: 1,
        stroke: nodeSequencerConfig.emitterColor
      };

      return svgAppend(p, createLine(element.waypoints, attrs));
    };

    this.getCustomConnectionPath = connection => {
      const waypoints = connection.waypoints.map(function(p) {
        return p.original || p;
      });

      const connectionPath = [
        ['M', waypoints[0].x, waypoints[0].y]
      ];

      waypoints.forEach(function(waypoint, index) {
        if (index !== 0) {
          connectionPath.push(['L', waypoint.x, waypoint.y]);
        }
      });

      return componentsToPath(connectionPath);
    };
  }

  canRender(element) {
    return /^nodeSequencer\:/.test(element.type);
  }

  drawShape(parent, element) {
    if (isEmitter(element)) {
      return this.drawEmitter(parent, element, this._nodeSequencerConfig.emitterColor);
    } else if (isListener(element)) {
      return this.drawListener(parent, element, this._nodeSequencerConfig.emitterColor, this._nodeSequencerConfig.listenerColor);
    }
  }

  getShapePath(shape) {
    if (isEmitter(shape) || isListener(shape)) {
      return this.getCirclePath(shape);
    }
  }

  drawConnection(p, element) {
    if (isConnection(element)) {
      return this.drawConnection(p, element);
    }
  }
}

CustomRenderer.$inject = [ 'eventBus', 'canvas', 'nodeSequencerConfig' ];

export default CustomRenderer;
