import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { isEmitter, isListener } from '../../util/NodeSequencerUtil';
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

class AutoConnect extends CommandInterceptor {
  constructor(eventBus, elementRegistry, modeling, nodeSequencerRules) {
    super(eventBus);

    this.postExecuted('shape.create', context => {
      const shape = context.context.shape;

      if (isEmitter(shape)) {

        const listeners = elementRegistry.filter(elements => {
          return isListener(elements);
        });

        listeners.forEach(listener => {
          if (nodeSequencerRules.canConnect(shape, listener)) {
            modeling.connect(shape, listener, { type: 'nodeSequencer:Connection' });
          }
        });
      }

      if (isListener(shape)) {
        const emitters = elementRegistry.filter(elements => {
          return isEmitter(elements);
        });

        emitters.forEach(emitter => {
          if (nodeSequencerRules.canConnect(emitter, shape)) {
            modeling.connect(emitter, shape, { type: 'nodeSequencer:Connection' });
          }
        });
      }
    }, this);

    this.postExecuted('elements.move', event => {
      const shapes = event.context.shapes;

      shapes.forEach(shape => {
        if (isEmitter(shape)) {
          var remove = [];

          shape.outgoing.forEach(outgoing => {
            if (!nodeSequencerRules.canConnect(shape, outgoing.target)) {
              remove.push(outgoing);
            }
          });

          remove.forEach(c => modeling.removeConnection(c));

          const listeners = elementRegistry.filter(elements => {
            return isListener(elements);
          });

          listeners.forEach(listener => {

            if (nodeSequencerRules.canConnect(shape, listener) &&
                !connected(shape, listener)) {
              modeling.connect(shape, listener, { type: 'nodeSequencer:Connection' });
            }

          });
        }

        if (isListener(shape)) {
          shape.incoming.forEach(incoming => {
            if (!nodeSequencerRules.canConnect(shape, incoming.source)) {
              console.log('removing connection');
              modeling.removeConnection(incoming);
            }
          });

          const emitters = elementRegistry.filter(elements => {
            return isEmitter(elements);
          });

          emitters.forEach(emitter => {
            if (nodeSequencerRules.canConnect(emitter, shape) &&
                !connected(emitter, shape)) {
              modeling.connect(emitter, shape, { type: 'nodeSequencer:Connection' });
            }
          });
        }
      });
    });
  }
}

AutoConnect.$inject = [ 'eventBus', 'elementRegistry', 'modeling', 'nodeSequencerRules' ];

export default AutoConnect;
