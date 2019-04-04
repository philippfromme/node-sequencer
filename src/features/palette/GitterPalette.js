class GitterPalette {
  constructor(palette, create, gitterElementFactory, lassoTool) {
    this._create = create;
    this._gitterElementFactory = gitterElementFactory;
    this._lassoTool = lassoTool;

    palette.registerProvider(this);
  }

  getPaletteEntries(element) {

    const actions  = {},
          create = this._create,
          gitterElementFactory = this._gitterElementFactory,
          lassoTool = this._lassoTool;

    const createAction = (type, group, className, title, options) => {

      const createShape = event => {
        const shape = gitterElementFactory.create(type);

        create.start(event, shape);
      }

      const shortType = type.replace(/^gitter\:/, '');

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
      'gitter-emitter': createAction(
        'emitter', 'gitter', 'icon-gitter-emitter'
      ),
      'gitter-listener': createAction(
        'listener', 'gitter', 'icon-gitter-listener'
      ),
      // 'gitter-separator': {
      //   group: 'gitter',
      //   separator: true
      // },
      // 'lasso-tool': {
      //   group: 'tools',
      //   className: 'bpmn-icon-lasso-tool',
      //   title: 'Activate the lasso tool',
      //   action: {
      //     click: function(event) {
      //       lassoTool.activateSelection(event);
      //     }
      //   }
      // }
    });

    return actions;
  }
}

GitterPalette.$inject = [ 'palette', 'create', 'gitterElementFactory', 'lassoTool' ];

export default GitterPalette;
