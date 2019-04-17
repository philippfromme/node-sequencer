import Diagram from 'diagram-js';

// nodeSequencer modules
import autoConnect from './features/auto-connect';
import nodeSequencerConfig from './config';
import coreModule from './core';
import cropping from './features/cropping';
import emissionAnimation from './features/emission-animation';
import emitterAnimation from './features/emitter-animation';
import nodeSequencerEmitterPreview from './features/emitter-preview';
import nodeSequencerMovePreview from './features/move-preview';
import nodeSequencerPalette from './features/palette';
import nodeSequencerRules from './features/rules';
import keyboardBindings from './features/keyboard-bindings';
import kitSelect from './features/kit-select';
import listenerAnimation from './features/listener-animation';
import nodeSequencerModeling from './features/modeling';
import ordering from './features/ordering';
import overridden from './features/overridden'; // overridden diagram-js features
import radialMenu from './features/radial-menu';
import saveMidi from './features/save-midi';
import sequences from './features/sequences';
import tempoControl from './features/tempo-control';
import hotCues from './features/hot-cues';

import autoScroll from 'diagram-js/lib/features/auto-scroll';
import connect from 'diagram-js/lib/features/connect';
import contextPad from 'diagram-js/lib/features/context-pad';
import create from 'diagram-js/lib/features/create';
import editorActions from 'diagram-js/lib/features/editor-actions';
import handTool from 'diagram-js/lib/features/hand-tool';
import kayboard from 'diagram-js/lib/features/keyboard';
import lassoTool from 'diagram-js/lib/features/lasso-tool';
import modeling from 'diagram-js/lib/features/modeling';
import move from 'diagram-js/lib/features/move';
import outline from 'diagram-js/lib/features/outline';
import overlays from 'diagram-js/lib/features/overlays';
import palette from 'diagram-js/lib/features/palette';
import popupMenu from 'diagram-js/lib/features/popup-menu';
import rules from 'diagram-js/lib/features/rules';
import selection from 'diagram-js/lib/features/selection';
import toolManager from 'diagram-js/lib/features/tool-manager';
import moveCanvas from 'diagram-js/lib/navigation/movecanvas';
import zoomScroll from 'diagram-js/lib/navigation/zoomscroll';

import ConnectionDocking from 'diagram-js/lib/layout/CroppingConnectionDocking';

import { isRoot, isEmitter, isListener } from './util/NodeSequencerUtil';
import keyboard from 'diagram-js/lib/features/keyboard';

function NodeSequencer(options) {

  const diagramModules = [
    {
      nodeSequencer: [ 'value', this ],
      nodeSequencerConfig: [ 'value', nodeSequencerConfig ],
      connectionDocking: [ 'type', ConnectionDocking ]
    },
    autoScroll,
    connect,
    contextPad,
    create,
    editorActions,
    handTool,
    keyboard,
    lassoTool,
    modeling,
    move,
    outline,
    overlays,
    palette,
    popupMenu,
    rules,
    selection,
    toolManager,
    moveCanvas,
    zoomScroll,
    {
      movePreview: [ 'value', {} ]
    }
  ];

  const nodeSequencerModules = [
    autoConnect,
    coreModule,
    cropping,
    emissionAnimation,
    emitterAnimation,
    nodeSequencerEmitterPreview,
    nodeSequencerMovePreview,
    nodeSequencerPalette,
    nodeSequencerRules,
    hotCues,
    keyboardBindings,
    kitSelect,
    listenerAnimation,
    nodeSequencerModeling,
    ordering,
    overridden,
    radialMenu,
    saveMidi,
    sequences,
    tempoControl
  ];

  const additionalModules = options.additionalModules || [];

  Diagram.call(this, {
    ...options,
    ...{
      modules: [
        ...diagramModules,
        ...nodeSequencerModules,
        ...additionalModules
      ]
    }
  });
};

NodeSequencer.prototype = Object.create(Diagram.prototype, {
  constructor: {
    value: NodeSequencer,
    enumerable: false,
    writable: true,
    configurable: true
  }
});

NodeSequencer.prototype.create = function() {
  const canvas = this.get('canvas');
  const eventBus = this.get('eventBus');
  const nodeSequencerConfig = this.get('nodeSequencerConfig');
  const nodeSequencerElementFactory = this.get('nodeSequencerElementFactory');

  eventBus.fire('nodeSequencer.create.start');

  const rootShape = nodeSequencerElementFactory.createRoot();

  canvas.setRootElement(rootShape);

  const x = Math.floor(canvas.getContainer().clientWidth / 3) - 15;
  const y = Math.floor(canvas.getContainer().clientHeight / 2) - 15;

  const emitter = nodeSequencerElementFactory.createEmitter({
    id: 'Emitter_1',
    type: 'nodeSequencer:Emitter',
    x,
    y,
    width: nodeSequencerConfig.shapeSize,
    height: nodeSequencerConfig.shapeSize
  });

  canvas.addShape(emitter, rootShape);

  eventBus.fire('nodeSequencer.create.end');
};

/**
 * Internal load. Loads all elements.
 */
NodeSequencer.prototype._load = function(elements) {
  const nodeSequencerConfig = this.get('nodeSequencerConfig'),
        canvas = this.get('canvas'),
        modeling = this.get('modeling'),
        nodeSequencerElementFactory = this.get('nodeSequencerElementFactory'),
        sounds = this.get('sounds');

  const { shapeSize } = nodeSequencerConfig;

  this.clear();

  // add root first
  const rootElement = elements.filter(({ isRoot }) => isRoot)[0];

  if (!rootElement) {
    throw new Error('root not found');
  }

  const { tempo, soundKit } = rootElement;

  const rootShape = nodeSequencerElementFactory.createRoot({
    tempo,
    soundKit
  });

  canvas.setRootElement(rootShape);

  sounds.setSoundKit(soundKit);

  elements.forEach(element => {

    if (element.isRoot) {
      return;
    } else if (isEmitter(element)) {
      const { type, x, y, timeSignature } = element;

      const emitterShape = nodeSequencerElementFactory.createEmitter({
        type,
        timeSignature,
        width: shapeSize,
        height: shapeSize
      });

      modeling.createShape(emitterShape, { x, y }, rootShape);
    } else if (isListener(element)) {
      const { type, x, y, sound } = element;

      const listenerShape = nodeSequencerElementFactory.createEmitter({
        type,
        sound,
        width: shapeSize,
        height: shapeSize
      });

      modeling.createShape(listenerShape, { x, y }, rootShape);
    }

  });
};

/**
 * Loads all elements and configurations.
 */
NodeSequencer.prototype.load = function(descriptors) {
  const eventBus = this.get('eventBus'),
        exportConfig = this.get('exportConfig');

  eventBus.fire('nodeSequencer.load.start');

  try {
    const { elements, exportedConfigs } = JSON.parse(descriptors);

    this._load(elements);

    exportConfig.import(exportedConfigs);

    eventBus.fire('nodeSequencer.load.end');
  } catch(e) {
    throw new Error('could not load', e);
  }
};

/**
 * Internal save. Saves all elements.
 */
NodeSequencer.prototype._save = function() {
  const elementRegistry = this.get('elementRegistry');

  let elements = [];

  Object.values(elementRegistry._elements).forEach(({ element }) => {

    let descriptor;

    if (isRoot(element)) {
      descriptor = {
        isRoot: true,
        tempo: element.tempo,
        soundKit: element.soundKit
      };
    } else if (isEmitter(element)) {
      descriptor = {
        type: element.type,
        timeSignature: element.timeSignature,
        x: element.x,
        y: element.y
      };
    } else if (isListener(element)) {
      descriptor = {
        type: element.type,
        sound: element.sound,
        x: element.x,
        y: element.y
      };
    }

    if (descriptor) {
      elements = [
        ...elements,
        descriptor
      ];
    }
  });

  return elements;
};

/**
 * Saves all elements and additional configurations.
 */
NodeSequencer.prototype.save = function() {
  const exportConfig = this.get('exportConfig');

  const exportedConfigs = exportConfig.export();

  return JSON.stringify({
    elements: this._save(),
    exportedConfigs: exportedConfigs
  });
};

NodeSequencer.prototype.saveMidi = function() {
  const saveMidi = this.get('saveMidi');

  if (!saveMidi) {
    throw new Error('feature not found');
  }

  saveMidi.saveMidi();
};

export default NodeSequencer;
