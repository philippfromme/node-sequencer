class ChangePropertiesHandler {

  execute(context) {
    const { element, properties } = context;

    const oldProperties = {};

    Object.keys(properties).forEach(propertyKey => {

      // copy old property
      oldProperties[propertyKey] = element[propertyKey];

      // set new property
      element[propertyKey] = properties[propertyKey];
    });

    context.oldProperties = oldProperties;

    return element;
  }

  revert(context) {
    const { element, oldProperties } = context;

    Object.keys(oldProperties).forEach(propertyKey => {

      // set new property
      element[propertyKey] = oldProperties[propertyKey];
    });

    return element;
  }
}

export default ChangePropertiesHandler;
