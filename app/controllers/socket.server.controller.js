var browse = require( '../controllers/browse.server.controller' ),
    distance = require( 'google-distance' ),
    location = require( 'mongoose' ).model( 'Location' ),
    geocoder = require( 'node-geocoder' )( 'google', 'http', {formatter: null} );


distance.apiKey = 'AIzaSyCYbk1deYkS-RaJV45xOxm2z5TQHA9r6V8';;

//  listeners for socket events
module.exports = function( io, socket ) {
    var result = {};

    socket.on( 'userLocation', function( location ) {
        dbQueryHelper( socket, location );
    });
}


//  pulls data from database to be compared against
//  user location. atm we pull all data, will need to
//  use (a) querie(s) soon though
function dbQueryHelper( socket, userOrigin ) {
    location.find( {} ).find( function( err, locations ) {
        var dbLocations = [];
        for( var i in locations ) {
            dbLocations.push( locations[ i ].address );
        }
        //  just to break up callback hell, call next helper
        distanceMatrixHelper( socket, userOrigin, dbLocations );
    });
}


//  take distances from dbQueryHelper (dbLocations) and
//  run them through google's distance matrix api (distance)
function distanceMatrixHelper( socket, userOrigin, dbLocations ) {
    var distances = [];
    distance.get( {
        origin: userOrigin.lat + "," + userOrigin.lng,
        destinations: dbLocations
    }, function ( err, data ) {
        if( err ) {
            return console.log( err );
        } else {
            //  populate distances with custom objects:
            //  address, distance, and sort value from
            //  distance matrix api. the rest from db later
            for ( var i in data ) {
                distances.push( {
                    place: null,
                    lat: null,
                    lng: null,
                    address: data[ i ].destination,
                    distance: data[ i ].distance,
                    sort: data[ i ].distanceValue,
                });
            }
            //  just to break up callback hell, call next helper
            combineDistanceDestination( socket, userOrigin, dbLocations, distances );
        };
    });
}


//  'the rest from db later': this is later.
//  fill distances objects with place (name), lat, and lng
function combineDistanceDestination( socket, userOrigin, dbLocations, distances ) {
    location.find( {} ).find( function( err, locations ) {
        for( var i in distances ) {
            distances[ i ].place = locations[ i ].place;
            distances[ i ].lat = locations[ i ].lat;
            distances[ i ].lng = locations[ i ].lng;
        }
        // sort distance objects by distance (distanceValue)
        distances.sort( function( a, b ) {
            return parseInt( a.sort ) - parseInt( b.sort );
        });
        socket.emit( 'distances', distances );
    });
}
