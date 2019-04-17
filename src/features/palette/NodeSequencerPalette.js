class NodeSequencerPalette {
  constructor(palette, create, nodeSequencerElementFactory, lassoTool) {
    this._create = create;
    this._nodeSequencerElementFactory = nodeSequencerElementFactory;
    this._lassoTool = lassoTool;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {

    const actions  = {},
          create = this._create,
          nodeSequencerElementFactory = this._nodeSequencerElementFactory,
          lassoTool = this._lassoTool;

    const createAction = (type, group, className, title, options) => {

      const createShape = event => {
        const shape = nodeSequencerElementFactory.create(type);

        create.start(event, shape);
      }

      const shortType = type.replace(/^nodeSequencer\:/, '');

      return {
        group: group,
        className: className,
        title: title || 'Create ' + shortType,
        action: {
          dragstart: createShape,
          click: createShape
        }
      };
    }

    Object.assign(actions, {
      'nodeSequencer-emitter': createAction(
        'emitter', 'nodeSequencer', 'icon-node-sequencer-emitter'
      ),
      'nodeSequencer-listener': createAction(
        'listener', 'nodeSequencer', 'icon-node-sequencer-listener'
      )
    });

    return actions;
  }
}

NodeSequencerPalette.$inject = [ 'palette', 'create', 'nodeSequencerElementFactory', 'lassoTool' ];

export default NodeSequencerPalette;
