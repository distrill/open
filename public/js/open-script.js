var socket = io();

console.log( 'i am in open-script.js' );
// socket.on( 'connection', function( data ) {
//     console.log( 'open-script.js' );
// });

// socket.emit( 'open-script', 'open-script.js' );

// if the user accepts location data, use it and load browse page
// otherwise the page doesn't change. so default behavior is
// for them to have to enter manually.
navigator.geolocation.getCurrentPosition( function( position ) {
    // console.log( 'navigator.geolocation sucess.' );
    var userLocation = {
        userLat: position.coords.latitude,
        userLng: position.coords.longitude
    };
    socket.emit( 'userLocation', userLocation );
    window.location.replace( '/browse' );
});
