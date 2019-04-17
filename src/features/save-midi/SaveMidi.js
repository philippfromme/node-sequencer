import Midi from 'jsmidgen';
import FileSaver from 'file-saver';

import {
  domify,
  classes as domClasses,
  event as domEvent,
} from 'min-dom';

import { isRoot } from '../../util/NodeSequencerUtil';
import { getSequenceFromSequences } from '../../util/SequenceUtil';

const NOTES = [ 'c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b' ];
const SEMI_TONES = 12;
const MEASURES = 16;

function getNoteFromIndex(index) {
  const noteIndex = index % SEMI_TONES;
  const octaveIndex = Math.floor(index / SEMI_TONES) + 3;

  return NOTES[noteIndex] + octaveIndex;
}

class SaveMidi {
  constructor(eventBus, canvas, audio) {
    this._audio = audio;
  }

  saveMidi() {
    const file = new Midi.File();
    var track = new Midi.Track();
    file.addTrack(track);

    const allPhrases = this._audio.getAllPhrases();

    const sequences = [];

    Object.values(allPhrases).forEach(phrase => {
      const sequence = getSequenceFromSequences(phrase);

      sequences.push(sequence);
    });

    for (let i = 0; i < MEASURES; i++) {
      const chord = [];

      sequences.forEach((sequence, sequenceIndex) => {
        if (sequence[i]) {
          chord.push(getNoteFromIndex(sequenceIndex));
        }
      });

      if (chord.length) {
        track.addChord(0, chord, 32);
      } else {
        track.noteOff(0, '', 32);
      }
    }

    FileSaver.saveAs(new Blob([
      new Uint8Array([].map.call(file.toBytes(), c => {
        return c.charCodeAt(0);
      })).buffer
    ], {
      type: 'application/x-midi'
    }) , 'nodeSequencer.mid' );
  }
}

SaveMidi.$inject = [ 'eventBus', 'canvas', 'audio' ];

export default SaveMidi;