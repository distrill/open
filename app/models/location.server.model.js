var mongoose = require( 'mongoose' ),
    crypto = require( 'crypto' ),
    Schema = mongoose.Schema,
    geocoderProvider = 'google',
    httpAdapter = 'http',
    extra = { formatter: null },
    geocoder = require( 'node-geocoder' )( geocoderProvider, httpAdapter, extra );

var LocationSchema = new Schema( {
        place: String,
        address: String,
        delivery: {
            type: Boolean,
            default: false
        },
        monOpen: Number,
        monClose: Number,
        tueOpen: Number,
        tueClose: Number,
        wedOpen: Number,
        wedClose: Number,
        thuOpen: Number,
        thuClose: Number,
        friOpen: Number,
        friClose: Number,
        satOpen: Number,
        satClose: Number,
        sunOpen: Number,
        sunClose: Number,
        lat: {
            type: Number,
            index: true,
        },
        lng: {
            type: Number,
            index: true,
        },
        distance: {
            type: Number,
            default: null
        },
        open: {
            type: Boolean,
            default: false
        }

});

LocationSchema.post( 'save', function( doc ){
    var toGeocode = doc.address,
        model = require( 'mongoose' ).model( 'Location' );
    geocoder.geocode( toGeocode, function( err, res ) {
        console.log( res );
        model.update(   { _id: doc._id },
                        { lat: res[ 0 ].latitude, lng: res[ 0 ].longitude, address: res[ 0 ].formattedAddress },
                        {}, function( err, doc ) {
                            if( err ) {
                                console.log( 'error updating document with lat/lng: ' + err );
                            }
        });
    });
});

mongoose.model( 'Location', LocationSchema );
