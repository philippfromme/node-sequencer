import {
  domify,
  classes as domClasses,
  event as domEvent,
  query as domQuery
} from 'min-dom';

import { isRoot } from '../../util/NodeSequencerUtil';

class TempoControl {
  constructor(canvas, eventBus, nodeSequencerConfig, nodeSequencerModeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._nodeSequencerConfig = nodeSequencerConfig;
    this._nodeSequencerModeling = nodeSequencerModeling;

    this.rootElement = undefined;
    this.oldTempo = undefined;

    this.init();

    eventBus.on([ 'nodeSequencer.create.start', 'nodeSequencer.load.start' ], () => {
      this.unbindListeners();
    });

    eventBus.on([ 'nodeSequencer.create.end', 'nodeSequencer.load.end' ], () => {
      this.rangeInput.value = nodeSequencerConfig.initialTempo;
      this.value.textContent = nodeSequencerConfig.initialTempo;

      this.bindListeners();
    });

    eventBus.on([ 'commandStack.nodeSequencer.changeProperties.executed', 'commandStack.nodeSequencer.changeProperties.reverted' ], ({ context }) => {
      const { element } = context;

      if (isRoot(element)) {
        this.rangeInput.value = element.tempo;
        this.value.textContent = element.tempo;
      }
    });
  }

  init() {
    const { minTempo, maxTempo, initialTempo } = this._nodeSequencerConfig;

    const container = domify(`
      <div class="tempo-control">
        <input class="range-input" type="range" min="${minTempo}" max="${maxTempo}" step="1" value="${initialTempo}"/>
        <span class="value">${initialTempo}</span>&nbsp;BPM
      </div>
    `);

    domEvent.bind(container, 'mousedown', e => e.stopPropagation());

    this.rangeInput = domQuery('input', container);
    this.value = domQuery('.value', container);

    this._canvas.getContainer().appendChild(container);
  }

  bindListeners() {
    this.rootElement = this._canvas.getRootElement();

    domEvent.bind(this.rangeInput, 'input', this.handleRangeInput.bind(this));
    domEvent.bind(this.rangeInput, 'change', this.handleRangeChange.bind(this));
  }

  unbindListeners() {
    this.rootElement = undefined;

    domEvent.unbind(this.rangeInput, 'input', this.handleRangeInput.bind(this));
    domEvent.unbind(this.rangeInput, 'change', this.handleRangeChange.bind(this));
  }

  handleRangeInput() {
    if (this.rootElement) {

      // save old tempo for correct command execution
      if (!this.oldTempo) {
        this.oldTempo = this.rootElement.tempo;
      }

      this.rootElement.tempo = this.rangeInput.value;

      this._eventBus.fire('nodeSequencer.tempoControl.input', {
        tempo: this.rangeInput.value
      });

      this.value.textContent = this.rangeInput.value;
    }
  }

  handleRangeChange() {
    if (this.rootElement) {

      // reset to old tempo for correct undo/redo
      this.rootElement.tempo = this.oldTempo;

      this._nodeSequencerModeling.changeProperties(this.rootElement, {
        tempo: this.rangeInput.value
      });

      this.oldTempo = undefined;
    }
  }
}

TempoControl.$inject = [ 'canvas', 'eventBus', 'nodeSequencerConfig', 'nodeSequencerModeling' ];

export default TempoControl;