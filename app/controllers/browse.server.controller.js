var distance = require( 'google-distance' ),
    location = require( 'mongoose' ).model( 'Location' ),
    geocoder = require( 'node-geocoder' )( 'google', 'http', {formatter: null} ),
    server = require( '../../server.js' );
    // io = require( 'socket.io' )( server );

    response = null,
    userOrigin = {},
    dbLocations = [],
    distances = [];

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
    response = res;
    userOrigin = {};
    dbLocations = [];
    distances = [];
    toGeocode = 'Royal Anne Hotel, Kelowna, BC';
    geocodeHelper();
}

exports.getBrowseMap = function( req, res, next ) {
    res.render( 'noLocationStart', {
        title: 'map this map that'
    });
};

exports.getTesting = function( req, res, next ) {
    res.render( 'tempMap', {
        title: "title"
    });
};




/************************************************************
 *                getStarted helper functions               *
 ************************************************************/
function geocodeHelper() {
    geocoder.geocode( toGeocode, function( err, result ) {
        userOrigin = {
            place: toGeocode,
            lat: result[ 0 ].latitude,
            long: result[ 0 ].longitude
        }
        dbQueryHelper();
    });
}

function dbQueryHelper() {
    location.find( {} ).find( function( err, locations ) {
        for( var i in locations ) {
            dbLocations.push( locations[ i ].address );
        }
        distanceMatrixHelper();
    });
}

function distanceMatrixHelper() {
    distance.get( {
        origin: toGeocode,
        destinations: dbLocations
    }, distanceMatrixCallback );
}

function distanceMatrixCallback( err, data ) {
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
        combineDistanceDestination();
    };
};

function combineDistanceDestination() {
    location.find( {} ).find( function( err, locations ) {
        for( var i in distances ) {
            distances[ i ].place = locations[ i ].place;
            distances[ i ].lat = locations[ i ].lat;
            distances[ i ].long = locations[ i ].long;
        }
        distances.sort( function( a, b ) {
            return parseInt( a.sort ) - parseInt( b.sort );
        });
        renderBrowse();
    });
}

function renderBrowse() {
    response.render( 'browse', {
        title: 'get started',
        start: userOrigin.place,
        startLat: userOrigin.lat,
        startLong: userOrigin.long,
        distance: distances
    });
};
/************************************************************/
