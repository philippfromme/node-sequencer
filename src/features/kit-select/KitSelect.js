import {
  domify,
  classes as domClasses,
  event as domEvent,
  query as domQuery
} from 'min-dom';

import { isRoot } from '../../util/GitterUtil';

class KitSelect {
  constructor(canvas, eventBus, gitterConfig, gitterModeling) {
    this._canvas = canvas;
    this._eventBus = eventBus;
    this._gitterConfig = gitterConfig;
    this._gitterModeling = gitterModeling;

    this.presets = {};

    this.init();

    eventBus.on([
      'commandStack.gitter.changeProperties.executed',
      'commandStack.gitter.changeProperties.reverted'
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

    Object.keys(this._gitterConfig.soundKits).forEach((key, index) => {
      const label = index + 1;

      const preset = domify(`<div class="preset pill pill-button">${label}</div>`);

      domEvent.bind(preset, 'click', () => {
        const rootElement = this._canvas.getRootElement();

        this._gitterModeling.changeProperties(rootElement, {
          soundKit: key
        });

        this.update(key);
      });

      this.container.appendChild(preset);

      this.presets[ key ] = preset;
    });

    this.update(this._gitterConfig.initialSoundKit);
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

KitSelect.$inject = [ 'canvas', 'eventBus', 'gitterConfig', 'gitterModeling' ];

export default KitSelect;