var browse = require( '../controllers/browse.server.controller' );

module.exports = function( io, socket ) {
    socket.on( 'userLocation', function( location ) {
        browse.WHAT( {
            lat: location.userLat,
            long: location.userLng
        });
    });
}
