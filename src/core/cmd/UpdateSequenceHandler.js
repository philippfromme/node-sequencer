import { getSequenceFromSequences } from '../../util/SequenceUtil';

class UpdateSequenceHandler {
  execute(context) {
    const {
      sequence,
      emitter,
      listener,
      phrases,
      mainPart
    } = context;

    context.oldSequence = phrases[listener.id][emitter.id];

    phrases[listener.id][emitter.id] = sequence;

    const sequenceFromSequences = getSequenceFromSequences(phrases[listener.id]);

    context.oldSequenceFromSequences = mainPart.getPhrase(listener.id).sequence;

    mainPart.getPhrase(listener.id).sequence = sequenceFromSequences;
  }

  revert({
    emitter,
    listener,
    phrases,
    mainPart,
    oldSequence,
    oldSequenceFromSequences
  }) {
    phrases[listener.id][emitter.id] = oldSequence;

    mainPart.getPhrase(listener.id).sequence = oldSequenceFromSequences;
  }
}

export default UpdateSequenceHandler;
