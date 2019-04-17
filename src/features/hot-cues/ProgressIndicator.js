import { tweenLinear } from '../../util/TweenUtil';

const MILLIS_PER_MINUTE = 60000;

import {
  domify,
  attr as domAttr,
  classes as domClasses,
  event as domEvent,
  query as domQuery
} from 'min-dom';

class ProgressIndicator {

  constructor(eventBus, canvas) {
    this.timeLastLoopStart = 0;
    this._canvas = canvas;

    eventBus.on('nodeSequencer.audio.loopStart', 4000, context => {
      this.timeLastLoopStart = Date.now();
    });

    eventBus.on('diagram.destroy', () => {
      this._destroyed = true;
    });

    this._init();

    eventBus.on([
      'nodeSequencer.create.end',
      'nodeSequencer.load.end'
    ], () => {
      this.updateAnimation();
    });
  }

  _init() {

    this.$rootEl = domify(`
      <div class="progress-indicator">
        <div class="progress"></div>
      </div>
    `);

    this.$progressEl = domQuery('.progress', this.$rootEl);
  }

  drawOn(parentEl) {

    if (!parentEl) {
      if (this.$rootEl.parentNode) {
        this.$rootEl.parentNode.removeChild(parentEl);
      }
    }

    parentEl.appendChild(this.$rootEl);
  }

  updateAnimation() {

    if (this._destroyed) {
      return;
    }

    const currentTime = Date.now();

    const { tempo } = this._canvas.getRootElement();

    // we are in 4/4, quarter note = beat
    const quarterNoteDuration = MILLIS_PER_MINUTE / tempo,
          sixteenthNoteDuration = quarterNoteDuration / 4;

    const loopDuration = sixteenthNoteDuration * 16;

    const elapsedLoopTime = currentTime - this.timeLastLoopStart;

    // TODO: fix, should be 0 to 100
    const newProgress = tweenLinear(0, 110, elapsedLoopTime, loopDuration);

    // console.log('progress: ' + newProgress);

    this.$progressEl.style.width = newProgress + '%';

    requestAnimationFrame(this.updateAnimation.bind(this));
  }
}

ProgressIndicator.$inject = [ 'eventBus', 'canvas' ];

export default ProgressIndicator;