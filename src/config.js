import removeSvg from '../assets/icons/remove.svg';

export default {
  maxDistance: 400, // px
  offsetDistance: 20, // px
  emitterColor: 'blue',
  listenerColor: 'blue',
  shapeSize: 20, // px
  minTempo: 70, // bpm
  maxTempo: 140, // bpm
  initialTempo: 120, // bpm
  initialTimeSignature: '8',
  timeSignatures: [
    { id: '2', label: '1/2' },
    { id: '4', label: '1/4' },
    { id: '8', label: '1/8' },
    { id: '16', label: '1/16' },
  ],
  initialSound: undefined,
  initialSoundKit: 'alphabetical',
  soundKits: {
    'alphabetical': {
      label: 'Alphabetical',
      sounds: [
        { id: 'kick', label: 'Kick', path: 'public/audio/alphabetical/kick.wav' },
        { id: 'clap', label: 'Clap', path: 'public/audio/alphabetical/clap.wav' },
        { id: 'snare', label: 'Snare', path: 'public/audio/alphabetical/snare.wav' },
        { id: 'closedhat', label: 'Closed Hihat', path: 'public/audio/alphabetical/closedhat.wav' },
        { id: 'openhat', label: 'Open Hihat', path: 'public/audio/alphabetical/openhat.wav' },
        { id: 'tom', label: 'Tom', path: 'public/audio/alphabetical/tom.wav' }
      ]
    },
    'glitch-baby': {
      label: 'Glitch Baby',
      sounds: [
        { id: 'kick', label: 'Kick', path: 'public/audio/glitch-baby/kick.wav' },
        { id: 'clap', label: 'Clap', path: 'public/audio/glitch-baby/clap.wav' },
        { id: 'snare', label: 'Snare', path: 'public/audio/glitch-baby/snare.wav' },
        { id: 'closedhat', label: 'Closed Hihat', path: 'public/audio/glitch-baby/closedhat.wav' },
        { id: 'openhat', label: 'Open Hihat', path: 'public/audio/glitch-baby/openhat.wav' },
        { id: 'tom', label: 'Tom', path: 'public/audio/glitch-baby/tom.wav' }
      ]
    },
    'alkaloid': {
      label: 'Alkaloid',
      sounds: [
        { id: 'kick', label: 'Kick', path: 'public/audio/alkaloid/kick.wav' },
        { id: 'clap', label: 'Clap', path: 'public/audio/alkaloid/clap.wav' },
        { id: 'snare', label: 'Snare', path: 'public/audio/alkaloid/snare.wav' },
        { id: 'closedhat', label: 'Closed Hihat', path: 'public/audio/alkaloid/closedhat.wav' },
        { id: 'openhat', label: 'Open Hihat', path: 'public/audio/alkaloid/openhat.wav' },
        { id: 'tom', label: 'Tom', path: 'public/audio/alkaloid/tom.wav' }
      ]
    }
  },
  icons: {
    remove: removeSvg
  }
};
