import p5 from 'p5';

class Sounds {
  constructor(eventBus, nodeSequencerConfig, loadingOverlay) {
    this._eventBus = eventBus;
    this._nodeSequencerConfig = nodeSequencerConfig;
    this._loadingOverlay = loadingOverlay;

    this.soundKit = nodeSequencerConfig.initialSoundKit;

    this.noneSound = {
      sound: {
        rate() {},
        play() {}
      },
      label: 'None'
    };

    this._sounds = {};

    this.loadSounds();
  }

  loadSounds() {
    this._loadingOverlay.addLoadingComponent(this);

    this._eventBus.fire('nodeSequencer.sounds.loading');

    let numberLoading = 0;

    Object.entries(this._nodeSequencerConfig.soundKits).forEach(entry => {
      const soundKit = entry[0],
            sounds = entry[1].sounds;

      this._sounds[soundKit] = {};

      sounds.forEach(s => {
        numberLoading++;

        const sound = p5.prototype.loadSound(s.path, () => {
          numberLoading--;

          if (numberLoading === 0) {
            this._loadingOverlay.removeLoadingComponent(this);

            this._eventBus.fire('nodeSequencer.sounds.loaded');
          }
        });

        this._sounds[soundKit][s.id] = {
          sound,
          label: s.label
        };
      });
    });

    this.soundKit = Object.keys(this._nodeSequencerConfig.soundKits)[0];
  }

  getSound(soundId) {
    if (this._sounds[this.soundKit][soundId]) {
      return this._sounds[this.soundKit][soundId];
    } else {

      // return mock sound
      return this.noneSound;
    }
  }

  setSoundKit(soundKit) {
    this.soundKit = soundKit;

    this._eventBus.fire('sounds.setSoundKit', {
      soundKit
    });
  }

  getSounds() {
    return this._sounds;
  }
}

Sounds.$inject = [ 'eventBus', 'nodeSequencerConfig', 'loadingOverlay' ];

export default Sounds;
