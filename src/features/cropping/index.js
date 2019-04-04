import Cropping from './Cropping';
import GitterConnectionCropping from './GitterConnectionCropping';

export default {
  __init__: [ 'cropping', 'gitterConnectionCropping' ],
  cropping: [ 'type', Cropping ],
  gitterConnectionCropping: [ 'type', GitterConnectionCropping ]
};
