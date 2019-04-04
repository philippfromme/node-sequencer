import ChangePropertiesHandler from './cmd/ChangePropertiesHandler';

class Modeling {
  constructor(commandStack) {
    this._commandStack = commandStack;

    commandStack.registerHandler('gitter.changeProperties', ChangePropertiesHandler);
  }

  changeProperties(element, properties) {
    this._commandStack.execute('gitter.changeProperties', {
      element,
      properties
    });
  }
}

Modeling.$inject = [ 'commandStack' ];

export default Modeling;