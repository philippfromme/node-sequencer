import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

class Cropping extends CommandInterceptor {
  constructor(eventBus, nodeSequencerConnectionCropping) {
    super(eventBus);

    function cropConnection(event) {
      const { context } = event;

      if (!context.cropped) {
        const connection = context.connection;
        connection.waypoints = nodeSequencerConnectionCropping.getCroppedWaypointsFromConnection(connection);
        context.cropped = true;
      }
    }

    this.executed([
      'connection.layout',
      'connection.create',
      'connection.reconnectEnd',
      'connection.reconnectStart'
    ], cropConnection);
  }
}

Cropping.$inject = [ 'eventBus', 'nodeSequencerConnectionCropping' ];

// export default doesn't work
export default Cropping;
