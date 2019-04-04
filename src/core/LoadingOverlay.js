import {
  domify,
  classes as domClasses
} from 'min-dom';

class LoadingOverlay {
  constructor(eventBus, canvas) {
    this._canvas = canvas;

    this._loadingComponents = [];

    this.init();
  }

  init() {
    this.$overlay = domify(`
      <div class="loading-overlay hidden">
        <div class="pill animated pulse infinite">Loading</div>
      </div>
    `);

    this._canvas.getContainer().appendChild(this.$overlay);
  }

  addLoadingComponent(loadingComponent) {
    if (!this._loadingComponents.includes(loadingComponent)) {
      this._loadingComponents.push(loadingComponent);
    }

    domClasses(this.$overlay).remove('hidden');
  }

  removeLoadingComponent(loadingComponent) {
    this._loadingComponents = this._loadingComponents.filter(c => {
      c !== loadingComponent;
    });

    if (!this._loadingComponents.length) {
      domClasses(this.$overlay).add('hidden');
    }
  }
}

LoadingOverlay.$inject = [ 'eventBus', 'canvas' ];

export default LoadingOverlay;
