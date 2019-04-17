import NodeSequencerUpdater from './NodeSequencerUpdater';
import Modeling from './Modeling';

export default {
  __init__: [ 'nodeSequencerUpdater', 'nodeSequencerModeling' ],
  nodeSequencerUpdater: [ 'type', NodeSequencerUpdater ],
  nodeSequencerModeling: [ 'type', Modeling ]
};
