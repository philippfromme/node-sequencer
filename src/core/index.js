import Audio from './Audio';
import ExportConfig from './ExportConfig';
import GitterElementFactory from './GitterElementFactory';
import GitterRenderer from './GitterRenderer';
import LoadingOverlay from './LoadingOverlay';
import Sounds from './Sounds';

export default {
  __init__: [
    'audio',
    'exportConfig',
    'gitterElementFactory',
    'gitterRenderer',
    'loadingOverlay',
    'sounds'
  ],
  audio: [ 'type', Audio ],
  exportConfig: [ 'type', ExportConfig ],
  gitterElementFactory: [ 'type', GitterElementFactory ],
  gitterRenderer: [ 'type', GitterRenderer ],
  loadingOverlay: [ 'type', LoadingOverlay ],
  sounds: [ 'type', Sounds ]
};
