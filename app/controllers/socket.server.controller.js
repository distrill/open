var browse = require( '../controllers/browse.server.controller' ),
    distance = require( 'google-distance' ),
    location = require( 'mongoose' ).model( 'Location' ),
    geocoder = require( 'node-geocoder' )( 'google', 'http', {formatter: null} );


distance.apiKey = 'AIzaSyCYbk1deYkS-RaJV45xOxm2z5TQHA9r6V8';


module.exports = function( io, socket ) {
    var result = {};

    socket.on( 'userLocation', function( location ) {
        dbQueryHelper( socket, location );
    });

    socket.on( 'manualLocationEntry', function( location ) {
            //  get lat/lng from user location entry for use in dbQueryHelper
            geocoder.geocode( location, function( err, result ) {
                var userOrigin = {
                    lat: result[ 0 ].latitude,
                    lng: result[ 0 ].longitude
                }
                socket.emit( 'manualLocationGeocoded', userOrigin );
                dbQueryHelper( socket, userOrigin );
            });
    })
}

function dbQueryHelper( socket, userOrigin ) {
    location.find( {
        lat: { $lt: ( userOrigin.lat + 0.1 ), $gt: ( userOrigin.lat - 0.1 ) },
        lng: { $lt: ( userOrigin.lng + 0.1 ), $gt: ( userOrigin.lng - 0.1 ) }} ).find( function( err, locations ) {
            if( err ) {
                console.log( 'ERROR in socket.server.controller.js: ' + err );
            } else {
                var distances = [];
                for( var i in locations ) {
                    distances.push( locations[ i ].address );
                    console.log( locations[ i ].hours );
                }
                distanceMatrixHelper( socket, userOrigin, locations, distances );
            }
        });
}

function distanceMatrixHelper( socket, userOrigin, locations, distances ) {
    distance.get( {
      origin: userOrigin.lat + ', ' + userOrigin.lng,
      destinations: distances
    }, function( err, data ) {
        if( err ) { console.log( 'ERRR: ' + err ); }
        for( var i in data ) {
            isOpen( locations[ i ] );
            locations[ i ].distance = data[ i ].distanceValue;
        }
        locations.sort( function( a, b ) {
            return parseInt( a.distance ) - parseInt( b.distance );
        });
        socket.emit( 'distances', locations );
    });
}

function isOpen( location ) {
    var date = new Date();
    var day = date.getDay();
    var time = ( date.getHours() * 100 ) + date.getMinutes();
    switch ( date.getDay() ) {
        case 0:
            console.log( 'sunday' );
            break;
        case 1:
            console.log( 'monday' );
            break;
        case 2:
            console.log( 'tuesday' );
            break;
        case 3:
            console.log( 'wednesday' );
            break;
        case 4:
            console.log( 'thursday' );
            break;
        case 5:
            console.log( (time > location.friOpen && time < location.friClose ) || ( time < location.thuClose ) );
            break;
        case 6:
            console.log( 'saturday' );
            break;
        };
    console.log( time );
    // console.log( time > 1500 );
    // console.log( time < 1500 );
    // console.log( date.getMinutes() );
}
