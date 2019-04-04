const p5 = require('p5');
require('p5/lib/addons/p5.sound.js');

import { getSequenceFromSequences } from '../../util/SequenceUtil';

class RemoveSequenceHandler {
  execute(context) {
    const {
      emitter,
      listener,
      phrases,
      mainPart
    } = context;

    // remove from phrases
    context.oldSequence = phrases[listener.id][emitter.id];

    delete phrases[listener.id][emitter.id];

    // remove from mainPart
    if (!Object.keys(phrases[listener.id]).length) {
      delete phrases[listener.id];

      context.phraseDeleted = true;

      context.oldPhrase = mainPart.getPhrase(listener.id);

      mainPart.removePhrase(listener.id);
    } else {
      const sequenceFromSequences = getSequenceFromSequences(phrases[listener.id]);

      mainPart.getPhrase(listener.id).sequence = sequenceFromSequences;
    }
  }

  revert({
    emitter,
    listener,
    phrases,
    mainPart,
    oldSequence,
    oldPhrase,
    phraseDeleted
  }) {
    if (phraseDeleted) {
      phrases[listener.id] = {};
    }

    phrases[listener.id][emitter.id] = oldSequence;

    // last remaining sequence was deleted
    if (oldPhrase) {
      mainPart.addPhrase(oldPhrase);
    } else {
      mainPart.getPhrase(listener.id).sequence = oldSequence;
    }
  }
}

export default RemoveSequenceHandler;
