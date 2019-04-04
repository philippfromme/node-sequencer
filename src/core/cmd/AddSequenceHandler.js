const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

import { getSequenceFromSequences } from '../../util/SequenceUtil';

class AddSequenceHandler {
  execute(context) {
    const {
      sequence,
      emitter,
      listener,
      phrases,
      mainPart,
      sound,
      onPlay
    } = context;

    if (!phrases[listener.id]) {
      context.phraseAdded = true;

      phrases[listener.id] = {};
    }

    phrases[listener.id][emitter.id] = sequence;

    const sequenceFromSequences = getSequenceFromSequences(phrases[listener.id]);

    const phrase = new p5.Phrase(listener.id, (time, playbackRate) => {
      sound.rate(playbackRate);
      sound.play(time);
      onPlay();
    }, sequenceFromSequences);

    if (!mainPart.getPhrase(listener.id)) {
      mainPart.addPhrase(phrase);
    } else {
      context.oldSequence = mainPart.getPhrase(listener.id).sequence;

      mainPart.getPhrase(listener.id).sequence = sequenceFromSequences;
    }
  }

  revert({
    emitter,
    listener,
    phrases,
    mainPart,
    phraseAdded,
    oldSequence
  }) {
    delete phrases[listener.id][emitter.id];

    if (phraseAdded) {
      delete phrases[listener.id]
    }

    if (oldSequence) {
      mainPart.getPhrase(listener.id).sequence = oldSequence;
    } else {
      mainPart.removePhrase(listener.id);
    }
  }
}

// export default doesn't work
export default AddSequenceHandler;
