import {
  append as svgAppend,
  attr as svgAttr,
  clear as svgClear,
  create as svgCreate,
  remove as svgRemove
} from 'tiny-svg';

import { isEmitter } from '../../util/NodeSequencerUtil';

class EmitterAnimation {
  constructor(eventBus, canvas, nodeSequencerConfig, elementRegistry) {
    const emitterAnimationLayer = canvas.getLayer('nodeSequencerEmitterAnimation', -900);

    this.circles = [];

    this.updateAnimation();

    let soundsLoaded = false;

    eventBus.on('nodeSequencer.sounds.loaded', () => {
      soundsLoaded = true;
    });

    eventBus.on('nodeSequencer.audio.loopStart', () => {
      if (!soundsLoaded) {
        return;
      }

      const emitters = elementRegistry.filter(e => isEmitter(e));

      emitters.forEach(emitter => {
        const { x, y, width } = emitter;

        const circle = svgCreate('circle');

        let radius = 20;

        svgAttr(circle, {
          cx: Math.round(x + (width / 2)),
          cy: Math.round(y + (width / 2)),
          r: radius
        });

        svgAttr(circle, {
          stroke: 'none',
          fill: nodeSequencerConfig.emitterColor
        });

        svgAppend(emitterAnimationLayer, circle);

        this.circles.push({
          emitter,
          gfx: circle,
          radius,
          created: Date.now()
        });
      });
    });

    eventBus.on('commandStack.shape.delete.postExecuted', ({ context }) => {
      const { shape } = context;

      this.circles.forEach(circle => {
        if (circle.emitter === shape) {
          svgRemove(circle.gfx);
        }
      });

      this.circles = this.circles.filter(c => c.emitter !== shape);
    });

    // diagram clear
    eventBus.on('diagram.clear', () => {
      svgClear(emitterAnimationLayer);

      this.circles = [];
    });
  }

  updateAnimation() {
    requestAnimationFrame(this.updateAnimation.bind(this));

    this.circles.forEach(circle => {
      circle.radius = Math.max(0, circle.radius - 1);

      svgAttr(circle.gfx, {
        r: circle.radius
      });

      if (Date.now() - circle.created > 500) {
        svgRemove(circle.gfx);

        this.circles = this.circles.filter(c => c !== circle);
      }
    });
  }
}

EmitterAnimation.$inject = [ 'eventBus', 'canvas', 'nodeSequencerConfig', 'elementRegistry' ];

export default EmitterAnimation;
