var socket = io();

// if the user accepts location data, use it and load browse page
// otherwise the page doesn't change. so default behavior is
// for them to have to enter manually.
navigator.geolocation.getCurrentPosition( function( position ) {
    var userLocation = {
        userLat: position.coords.latitude,
        userLng: position.coords.longitude
    };
    socket.emit( 'userLocation', userLocation );
    window.location.replace( '/browse' );
});
