import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

class NodeSequencerElementFactory extends BaseElementFactory {
  constructor(nodeSequencerConfig, sounds) {
    super();

    this.baseCreate = BaseElementFactory.prototype.create;

    this.handlers = {

      // root
      root: attrs => {
        return this.baseCreate('root', Object.assign({
          id: 'root',
          tempo: nodeSequencerConfig.initialTempo,
          soundKit: nodeSequencerConfig.initialSoundKit
        }, attrs));
      },

      // emitter
      emitter: attrs => {
        return this.baseCreate('shape', Object.assign({
          type: 'nodeSequencer:Emitter',
          width: nodeSequencerConfig.shapeSize,
          height: nodeSequencerConfig.shapeSize,
          timeSignature: nodeSequencerConfig.initialTimeSignature
        }, attrs));
      },

      // listener
      listener: attrs => {
        return this.baseCreate('shape', Object.assign({
          type: 'nodeSequencer:Listener',
          width: nodeSequencerConfig.shapeSize,
          height: nodeSequencerConfig.shapeSize,
          sound: nodeSequencerConfig.initialSound
        }, attrs));
      }
    }
  }

  create(elementType, attrs) {
    return this.handlers[elementType](attrs);
  }

  createRoot(attrs) {
    return this.create('root', attrs);
  }

  createEmitter(attrs) {
    return this.create('emitter', attrs);
  }

  createListener(attrs) {
    return this.create('listener', attrs);
  }
}

NodeSequencerElementFactory.$inject = [ 'nodeSequencerConfig', 'sounds' ];

export default NodeSequencerElementFactory;
