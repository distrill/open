var distance = require( 'google-distance' ),
    location = require( 'mongoose' ).model( 'Location' ),
    geocoder = require( 'node-geocoder' )( 'google', 'http', {formatter: null} );

    var userLatLng = null;

distance.apiKey = 'AIzaSyCYbk1deYkS-RaJV45xOxm2z5TQHA9r6V8';

/*
 *                          food for thought.
 *  right now i am calling helper functions that all have anonymous callbacks.
 *  maybe consider calling the current 'helper' functions instead
 *  and naming the current anonymous ones 'helper' insteaad..
 *  i'm not sure that it would help readability, but it might,
 *  also may help with debugging. although as it is the anonymous functions
 *  are at least contained within named functions. would that bubble up
 *  in the stack and be helpful / relevant?
 */

exports.getStarted = function( req, res, next ) {
    if( !userLatLng ) {
        res.render( 'tempMap', {
            title: 'is it damn open',
            userFirstName: req.user ? req.user.firstName : '',
            error: 'could not find or use browser data location. please enter manually.'
        });
    }
    else {
        dbQueryHelper( res, userLatLng );
    }
}

exports.getBrowseMap = function( req, res, next ) {
    res.render( 'browseMap', {
        title: 'map this map that'
    });
};

exports.getTesting = function( req, res, next ) {
    res.render( 'noLocationStart', {
        title: 'title'
    });
};

exports.WHAT = function( userLoc ) {
    userLatLng = {
        lat: userLoc.lat,
        long: userLoc.long
    }
    return jsDbQueryHelper( userLatLng );
    // console.log( userLoc.lat );
    // console.log( userLoc.long );
    // dbQueryHelper( )
}

exports.what2 = function( io, socket ) {
    console.log( 'what2 in browse.server.controller.etc' );
    socket.emit( 'fromBrowseController', null );
}




/************************************************************
 *                getStarted helper functions               *
 ************************************************************/
// function jsGeocodeHelper( res, origin ) {
//     geocoder.geocode( origin, function( err, result ) {
//         var userOrigin = {
//             // place: origin,
//             lat: result[ 0 ].latitude,
//             long: result[ 0 ].longitude
//         }
//         dbQueryHelper( res, userOrigin );
//     });
// }

function jsDbQueryHelper( userOrigin ) {
    location.find( {} ).find( function( err, locations ) {
        var dbLocations = [];
        for( var i in locations ) {
            dbLocations.push( locations[ i ].address );
        }
        return jsDistanceMatrixHelper( userOrigin, dbLocations );
    });
}

function jsDistanceMatrixHelper( userOrigin, dbLocations ) {
    var distances = [];
    distance.get( {
        origin: userOrigin.lat + "," + userOrigin.long,
        destinations: dbLocations
    }, function ( err, data ) {
        if( err ) {
            return console.log( err );
        } else {
            for ( var i in data ) {
                distances.push( {
                    place: null,
                    lat: null,
                    long: null,
                    address: data[ i ].destination,
                    distance: data[ i ].distance,
                    sort: data[ i ].distanceValue,
                });
            }
            return jsCombineDistanceDestination( userOrigin, dbLocations, distances );
        };
    });
}

function jsCombineDistanceDestination( userOrigin, dbLocations, distances ) {
    location.find( {} ).find( function( err, locations ) {
        for( var i in distances ) {
            distances[ i ].place = locations[ i ].place;
            distances[ i ].lat = locations[ i ].lat;
            distances[ i ].long = locations[ i ].long;
        }
        distances.sort( function( a, b ) {
            return parseInt( a.sort ) - parseInt( b.sort );
        });
        console.log( distances );
        return distances;
    });
}

// function jsRenderBrowse( res, userOrigin, dbLocations, distances) {
//     console.log( userOrigin );
//     res.render( 'browseMap', {
//         title: 'map browse',
//         start: userOrigin.place,
//         startLat: userOrigin.lat,
//         startLong: userOrigin.long,
//         distance: distances
//     });
// };
/************************************************************/




/************************************************************
 *                getStarted helper functions               *
 ************************************************************/
function geocodeHelper( res, origin ) {
    geocoder.geocode( origin, function( err, result ) {
        var userOrigin = {
            // place: origin,
            lat: result[ 0 ].latitude,
            long: result[ 0 ].longitude
        }
        dbQueryHelper( res, userOrigin );
    });
}

function dbQueryHelper( res, userOrigin ) {
    location.find( {} ).find( function( err, locations ) {
        var dbLocations = [];
        for( var i in locations ) {
            dbLocations.push( locations[ i ].address );
        }
        distanceMatrixHelper( res, userOrigin, dbLocations );
    });
}

function distanceMatrixHelper( res, userOrigin, dbLocations ) {
    var distances = [];
    distance.get( {
        origin: userOrigin.lat + "," + userOrigin.long,
        destinations: dbLocations
    }, function ( err, data ) {
        if( err ) {
            return console.log( err );
        } else {
            for ( var i in data ) {
                distances.push( {
                    place: null,
                    lat: null,
                    long: null,
                    address: data[ i ].destination,
                    distance: data[ i ].distance,
                    sort: data[ i ].distanceValue,
                });
            }
            combineDistanceDestination( res, userOrigin, dbLocations, distances );
        };
    });
}

function combineDistanceDestination( res, userOrigin, dbLocations, distances ) {
    location.find( {} ).find( function( err, locations ) {
        for( var i in distances ) {
            distances[ i ].place = locations[ i ].place;
            distances[ i ].lat = locations[ i ].lat;
            distances[ i ].long = locations[ i ].long;
        }
        distances.sort( function( a, b ) {
            return parseInt( a.sort ) - parseInt( b.sort );
        });
        renderBrowse( res, userOrigin, dbLocations, distances );
    });
}

function renderBrowse( res, userOrigin, dbLocations, distances) {
    console.log( userOrigin );
    res.render( 'browseMap', {
        title: 'map browse',
        start: userOrigin.place,
        startLat: userOrigin.lat,
        startLong: userOrigin.long,
        distance: distances
    });
};
/************************************************************/
