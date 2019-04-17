/**
 * Lets modules register for exporting configurations on NodeSequencer#save.
 */
class ExportConfig {
  constructor() {
    this.registeredExports = {};
  }

  registerExport(options) {
    if (!options) {
      throw new Error('options not found');
    }

    if (this.registeredExports[options.id]) {
      throw new Error('already registered');
    }

    this.registeredExports[options.id] = {
      exportConfig: options.exportConfig || function() {},
      importConfig: options.importConfig || function() {}
    };
  }

  export() {
    const exportedConfigs = {};

    Object.keys(this.registeredExports).forEach(id => {
      exportedConfigs[id] = this.registeredExports[id].exportConfig();
    });

    return exportedConfigs;
  }

  import(exportedConfigs) {
    Object.keys(exportedConfigs).forEach(id => {
      this.registeredExports[id].importConfig(exportedConfigs[id]);
    });
  }
}

export default ExportConfig;