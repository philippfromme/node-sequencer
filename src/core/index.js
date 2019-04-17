import Audio from './Audio';
import ExportConfig from './ExportConfig';
import NodeSequencerElementFactory from './NodeSequencerElementFactory';
import NodeSequencerRenderer from './NodeSequencerRenderer';
import LoadingOverlay from './LoadingOverlay';
import Sounds from './Sounds';

export default {
  __init__: [
    'audio',
    'exportConfig',
    'nodeSequencerElementFactory',
    'nodeSequencerRenderer',
    'loadingOverlay',
    'sounds'
  ],
  audio: [ 'type', Audio ],
  exportConfig: [ 'type', ExportConfig ],
  nodeSequencerElementFactory: [ 'type', NodeSequencerElementFactory ],
  nodeSequencerRenderer: [ 'type', NodeSequencerRenderer ],
  loadingOverlay: [ 'type', LoadingOverlay ],
  sounds: [ 'type', Sounds ]
};
