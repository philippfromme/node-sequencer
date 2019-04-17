import ChangePropertiesHandler from './cmd/ChangePropertiesHandler';

class Modeling {
  constructor(commandStack) {
    this._commandStack = commandStack;

    commandStack.registerHandler('nodeSequencer.changeProperties', ChangePropertiesHandler);
  }

  changeProperties(element, properties) {
    this._commandStack.execute('nodeSequencer.changeProperties', {
      element,
      properties
    });
  }
}

Modeling.$inject = [ 'commandStack' ];

export default Modeling;