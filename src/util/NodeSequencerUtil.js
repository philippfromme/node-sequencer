export function isEmitter(element) {
  return element.type === 'nodeSequencer:Emitter';
}

export function isListener(element) {
  return element.type === 'nodeSequencer:Listener';
}

export function isConnection(element) {
  return element.type === 'nodeSequencer:Connection';
}

export function isRoot(element) {
  return !element.parent;
}
