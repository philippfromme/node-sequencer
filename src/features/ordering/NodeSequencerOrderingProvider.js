import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';

import { find } from 'lodash-es';
import { findIndex } from 'lodash-es';

import { isConnection } from '../../util/NodeSequencerUtil';

class NodeSequencerOrderingProvider extends OrderingProvider {
  constructor(eventBus) {
    super(eventBus);

    this.getOrdering = (element, newParent) => {
      if (isConnection(element)) {
        return {
          index: 0,
          newParent
        };
      } else {
        const index = newParent.children.length - 1;
        return {
          index,
          newParent
        };
      }
    }
  }
}

NodeSequencerOrderingProvider.$inject = [ 'eventBus' ];

export default NodeSequencerOrderingProvider;
