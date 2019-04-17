import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import { isEmitter, isListener, isConnection } from '../../util/NodeSequencerUtil';
import { getDistance } from '../../util/GeometryUtil';

const HIGH_PRIORITY = 1500;

class NodeSequencerRules extends RuleProvider {
  constructor(eventBus, nodeSequencerConfig) {
    super(eventBus);

    this._nodeSequencerConfig = nodeSequencerConfig;

    const canCreate = target => {
      if (!target) {
        return true;
      }

      return !isEmitter(target) &&
             !isListener(target) &&
             !isConnection(target);
    }

    this.addRule('elements.move', HIGH_PRIORITY, context => {
      const target = context.target,
            shapes = context.shapes;

      let canMove = true;

      shapes.forEach(shape => {
        if (!canCreate(target)) {
          canMove = false;
        }
      });

      return canMove;
    });

    this.addRule('shape.create', HIGH_PRIORITY, context => {
      const target = context.target,
            shape = context.shape;

      return canCreate(target);
    });

    this.addRule('connection.create', HIGH_PRIORITY, context => {
      const source = context.source,
            target = context.target;

      return this.canConnect(source, target);
    });
  }

  canConnect(source, target) {
    return source.type !== target.type &&
      getDistance(source, target) < this._nodeSequencerConfig.maxDistance;
  }
}

NodeSequencerRules.$inject = [ 'eventBus', 'nodeSequencerConfig' ];

export default NodeSequencerRules;
