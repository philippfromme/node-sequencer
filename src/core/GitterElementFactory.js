import BaseElementFactory from 'diagram-js/lib/core/ElementFactory';

class GitterElementFactory extends BaseElementFactory {
  constructor(gitterConfig, sounds) {
    super();

    this.baseCreate = BaseElementFactory.prototype.create;

    this.handlers = {

      // root
      root: attrs => {
        return this.baseCreate('root', Object.assign({
          id: 'root',
          tempo: gitterConfig.initialTempo,
          soundKit: gitterConfig.initialSoundKit
        }, attrs));
      },

      // emitter
      emitter: attrs => {
        return this.baseCreate('shape', Object.assign({
          type: 'gitter:Emitter',
          width: gitterConfig.shapeSize,
          height: gitterConfig.shapeSize,
          timeSignature: gitterConfig.initialTimeSignature
        }, attrs));
      },

      // listener
      listener: attrs => {
        return this.baseCreate('shape', Object.assign({
          type: 'gitter:Listener',
          width: gitterConfig.shapeSize,
          height: gitterConfig.shapeSize,
          sound: gitterConfig.initialSound
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

GitterElementFactory.$inject = [ 'gitterConfig', 'sounds' ];

export default GitterElementFactory;
