import {
  domify,
  classes as domClasses,
  event as domEvent,
  query as domQuery
} from 'min-dom';

import { isRoot } from '../../util/NodeSequencerUtil';

class KitSelect {
  constructor(canvas, eventBus, nodeSequencerConfig, nodeSequencerModeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._nodeSequencerConfig = nodeSequencerConfig;
    this._nodeSequencerModeling = nodeSequencerModeling;

    this.presets = {};

    this.init();

    eventBus.on([
      'commandStack.nodeSequencer.changeProperties.executed',
      'commandStack.nodeSequencer.changeProperties.reverted'
    ], ({ context }) => {
      const element = context.element;

      if (isRoot(element)) {
        this.update(element.soundKit);
      }
    });

    eventBus.on('sounds.setSoundKit', ({ soundKit }) => {
      this.update(soundKit);
    });
  }

  init() {
    const container = this.container = domify(
      '<div class="kit-select">' +
        '<span>Presets</span>' +
      '</div>'
    );

    this._canvas.getContainer().appendChild(container);

    Object.keys(this._nodeSequencerConfig.soundKits).forEach((key, index) => {
      const label = index + 1;

      const preset = domify(`<div class="preset pill pill-button">${label}</div>`);

      domEvent.bind(preset, 'click', () => {
        const rootElement = this._canvas.getRootElement();

        this._nodeSequencerModeling.changeProperties(rootElement, {
          soundKit: key
        });

        this.update(key);
      });

      this.container.appendChild(preset);

      this.presets[ key ] = preset;
    });

    this.update(this._nodeSequencerConfig.initialSoundKit);
  }

  update(activeSoundKit) {
    Object.entries(this.presets).forEach((entry) => {
      const [ key, preset ] = entry;

      if (key === activeSoundKit) {
        preset.classList.add('active');
      } else {
        preset.classList.remove('active');
      }
    })
  }
}

KitSelect.$inject = [ 'canvas', 'eventBus', 'nodeSequencerConfig', 'nodeSequencerModeling' ];

export default KitSelect;