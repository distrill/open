/*          old testing.server.controller.js            */
var distance = require( 'google-distance' ),
    location = require( 'mongoose' ).model( 'Location' ),
    geocoderProvider = 'google',
    httpAdapter = 'http',
    extra = { formatter: null },
    geocoder = require( 'node-geocoder' )( geocoderProvider, httpAdapter, extra );

exports.renderStart = function( req, res ) {
    var toGeocode = 'Vancouver Marriott Downtown Hotel, Vancouver, BC';

    // begin geocode callback function
    geocoder.geocode( toGeocode, function( err, result ) {
        var originLat = result[ 0 ].latitude,
            originLong = result[ 0 ].longitude,
            dbLocations = [];

        // begin function to pull locations from db, nested callback of course
        location.find( {} ).find( function( err, locations ) {
            for( var i in locations ) {
                dbLocations.push( locations[ i ].address );
            }

            // begin distance matrix function
            distance.get( {
                origin: toGeocode,
                destinations: dbLocations
            },

            // and distance matrix callback
            function( err, data ) {
                if( err ) {
                    return console.log( err );
                } else {
                    var distances = [];
                    for ( var i in data ) {
                        distances.push( data[ i ] );
                    }
                    distances.sort( function( a, b ) {
                        return parseInt( a.durationValue ) - parseInt( b.durationValue );
                    });

                    // finally, six layers deep, render the page
                    res.render( 'start', {
                        title: 'get started',
                        start: toGeocode,
                        startLat: originLat,
                        startLong: originLong,
                        distance: distances
                    });
                }
            });
        });
    });
}
