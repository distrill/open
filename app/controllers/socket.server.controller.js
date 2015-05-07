module.exports = function( io, socket ) {
    socket.on( 'userLocation', function( location ) {
        console.log( location.userLat );
        console.log( location.userLng );
    });
}
