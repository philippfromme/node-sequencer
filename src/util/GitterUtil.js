export function isEmitter(element) {
  return element.type === 'gitter:Emitter';
}

export function isListener(element) {
  return element.type === 'gitter:Listener';
}

export function isConnection(element) {
  return element.type === 'gitter:Connection';
}

export function isRoot(element) {
  return !element.parent;
}
