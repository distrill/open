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
        hours: {
            mon: [],
            tue: [],
            wed: [],
            thu: [],
            fri: [],
            sat: [],
            sun: []
        },
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
        },
        image: String
});

LocationSchema.post( 'save', function( doc ){
    var toGeocode = doc.address,
        model = require( 'mongoose' ).model( 'Location' );


    // TODO: fix this nonsense.
    // use damn object[ key ] notation
    // this is hideous
    var tempHours = doc.hours.mon;
    doc.hours.mon = [];
    doc.hours.mon.push( {
        open: tempHours[ 0 ],
        close: tempHours[ 1 ]
    });
    tempHours = doc.hours.tue;
    doc.hours.tue = [];
    doc.hours.tue.push( {
        open: tempHours[ 0 ],
            close: tempHours[ 1 ]
        });
    tempHours = doc.hours.wed;
    doc.hours.wed = [];
    doc.hours.wed.push( {
        open: tempHours[ 0 ],
        close: tempHours[ 1 ]
    });
    tempHours = doc.hours.thu;
    doc.hours.thu = [];
    doc.hours.thu.push( {
        open: tempHours[ 0 ],
        close: tempHours[ 1 ]
    });
    tempHours = doc.hours.fri;
    doc.hours.fri = [];
    doc.hours.fri.push( {
        open: tempHours[ 0 ],
        close: tempHours[ 1 ]
    });
    tempHours = doc.hours.sat;
    doc.hours.sat = [];
    doc.hours.sat.push( {
        open: tempHours[ 0 ],
        close: tempHours[ 1 ]
    });
    tempHours = doc.hours.sun;
    doc.hours.sun = [];
    doc.hours.sun.push( {
        open: tempHours[ 0 ],
        close: tempHours[ 1 ]
    });


    // console.log( doc.hours.mon );
    geocoder.geocode( toGeocode, function( err, res ) {
        // console.log( res );
        if( err ) {
            console.log( "ERROR: location.server.model: " + err );
        } else if( !res[ 0 ] ) {
            console.log( 'pls. no superman no here. FILL OUT THE FORM BEFORE YOU SUBMIT, DUMMY!' );
        } else {
            model.update( { _id: doc._id }, {
                lat: res[ 0 ].latitude,
                lng: res[ 0 ].longitude,
                address: res[ 0 ].formattedAddress,
                hours: doc.hours
            }, {}, function( err, doc ) {
                    if( err ) {
                        console.log( 'error updating document with lat/lng: ' + err );
                    }
            });
        }
    });

});

mongoose.model( 'Location', LocationSchema );
