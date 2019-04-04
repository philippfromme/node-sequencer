import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isRoot, isEmitter, isListener } from '../../util/GitterUtil';
import { getSequence } from '../../util/SequenceUtil';
import { getDistance } from '../../util/GeometryUtil';

function connected(source, target) {
  if (!source.outgoing.length || !target.incoming.length) {
    return false;
  }

  let connected = false;

  source.outgoing.forEach(outgoing => {
    target.incoming.forEach(incoming => {
      if (outgoing === incoming) {
        connected = true;
      }
    })
  });

  return connected;
}


/**
 * Update p5.sound properties after properties change.
 *
 * Changes are always applied immediately, i.e. during
 * <executed> and <reverted> phases.
 */
class GitterUpdater extends CommandInterceptor {

  constructor(eventBus, audio, sounds, elementRegistry, gitterConfig) {

    super(eventBus);

    const { maxDistance, offsetDistance } = gitterConfig;

    const mainPart = audio.getMainPart();


    function updateListener(listener, soundId) {

      // if mock sound and no sound assignment => no change needed
      if (!soundId && !listener.sound) {
        return;
      }

      const onPlay = function() {
        eventBus.fire('gitter.audio.playSound', {
          listener
        });
      };

      const { sound } = sounds.getSound(soundId || listener.sound);
      const oldPhrase = mainPart.getPhrase(listener.id);

      const newPhrase = new p5.Phrase(listener.id, (time, playbackRate) => {
        sound.rate(playbackRate);
        sound.play(time);
        onPlay();
      }, oldPhrase.sequence);

      mainPart.removePhrase(listener.id);
      mainPart.addPhrase(newPhrase);
    }


    function updateSounds(element, properties) {

      if (isRoot(element)) {

        const { tempo, soundKit } = properties;

        // updates BPM on p5.sound part after BPM change
        if (tempo) {
          mainPart.setBPM(tempo);
        }

        // update p5.sounds after sound kit change
        if (soundKit) {
          sounds.setSoundKit(soundKit);

          const listeners = elementRegistry.filter(element => isListener(element));

          listeners.forEach(listener => {
            updateListener(listener, listener.sound);
          });
        }
      } else if (isEmitter(element)) {

        // NOOP; we still do this in POST EXECUTE
      } else if (isListener(element)) {
        updateListener(element, properties.sound);
      }
    }

    this.postExecute('gitter.changeProperties', ({ context }) => {

      const { element, properties } = context;

      // update time signature
      if (properties.timeSignature) {
        const listeners = elementRegistry.filter(e => {
          return isListener(e) && connected(element, e);
        });

        listeners.forEach(listener => {
          const distance = getDistance(element, listener);

          const sequence = getSequence(distance, maxDistance, offsetDistance, properties.timeSignature);

          audio.updateSequence(sequence, element, listener);
        });
      }
    });

    this.executed('gitter.changeProperties', ({ context }) => {

      const { element, properties } = context;

      updateSounds(element, properties);
    });

    this.reverted('gitter.changeProperties', ({ context }) => {

      const { element, oldProperties } = context;

      updateSounds(element, oldProperties);
    });

  }
}

GitterUpdater.$inject = [
  'eventBus',
  'audio',
  'sounds',
  'elementRegistry',
  'gitterConfig'
];

export default GitterUpdater;
