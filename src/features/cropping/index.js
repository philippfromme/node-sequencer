import Cropping from './Cropping';
import NodeSequencerConnectionCropping from './NodeSequencerConnectionCropping';

export default {
  __init__: [ 'cropping', 'nodeSequencerConnectionCropping' ],
  cropping: [ 'type', Cropping ],
  nodeSequencerConnectionCropping: [ 'type', NodeSequencerConnectionCropping ]
};
