import GitterUpdater from './GitterUpdater';
import Modeling from './Modeling';

export default {
  __init__: [ 'gitterUpdater', 'gitterModeling' ],
  gitterUpdater: [ 'type', GitterUpdater ],
  gitterModeling: [ 'type', Modeling ]
};
