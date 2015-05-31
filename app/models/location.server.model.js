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
        }

});

LocationSchema.post( 'save', function( doc ){
    var toGeocode = doc.address,
        // monday = doc.address
        // tuesday = doc.tuesday
        model = require( 'mongoose' ).model( 'Location' );


        // var keys = Object.keys( doc.hours ),
        //     i = 1;
        // for( i in keys ) {
        //     console.log( doc.hours.keys[ i ] );
        // }
    // for( var elem in doc.hours ) {
    //     if( doc.hours.hasOwnProperty( elem ) ) {
    //         console.log( elem );
    //     }
    // }


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
                hours: doc.hours },
                {}, function( err, doc ) {
                    if( err ) {
                        console.log( 'error updating document with lat/lng: ' + err );
                    }
            });
        }
    });
});

// what the heck. move this to browseMapsScript.js or whatever name
// function works fine here for now but will be more accurate if calculated in client
// here now because i'm handling the hours object awkwardly atm. should just
// pass whole hours object to map marker, for 100 reasons, not articulated here.
// function isOpen( doc ) {
//     var date = new Date();
//     var day = date.getDay();
//     var time = ( date.getHours() * 100 ) + date.getMinutes();
//     switch( day ) {
//         case 1:
//             if( time > doc.hours.mon[ 0 ].open && time < doc.hours.mon[ 0 ].close )
//                 return true;
//             if( time < doc.hours.mon[ 0 ].open )
//                 return ( time < ( doc.hours.sun[ 0 ].close % 1200 ));
//             return false;
//         case 2:
//             if( time > doc.hours.tue[ 0 ].open && time < doc.hours.tue[ 0 ].close )
//                 return true;
//             if( time < doc.hours.tue[ 0 ].open )
//                 return ( time < ( doc.hours.mon[ 0 ].close % 1200 ));
//             return false;
//         case 3:
//             if( time > doc.hours.wed[ 0 ].open && time < doc.hours.wed[ 0 ].close )
//                 return true;
//             if( time < doc.hours.wed[ 0 ].open )
//                 return ( time < ( doc.hours.tue[ 0 ].close % 1200 ));
//             return false;
//         case 4:
//             if( time > doc.hours.thu[ 0 ].open && time < doc.hours.thu[ 0 ].close )
//                 return true;
//             if( time < doc.hours.thu[ 0 ].open )
//                 return ( time < ( doc.hours.wed[ 0 ].close % 1200 ));
//             return false;
//         case 5:
//             if( time > doc.hours.fri[ 0 ].open && time < doc.hours.fri[ 0 ].close )
//                 return true;
//             if( time < doc.hours.fri[ 0 ].open )
//                 return ( time < ( doc.hours.thu[ 0 ].close % 1200 ));
//             return false;
//         case 6:
//             if( time > doc.hours.sat[ 0 ].open && time < doc.hours.sat[ 0 ].close )
//                 return true;
//             if( time < doc.hours.sat[ 0 ].open )
//                 return ( time < ( doc.hours.fri[ 0 ].close % 1200 ));
//             return false;
//         case 0:
//             if( time > doc.hours.sun[ 0 ].open && time < doc.hours.sun[ 0 ].close )
//                 return true;
//             if( time < doc.hours.sun[ 0 ].open )
//                 return ( time < ( doc.hours.sat[ 0 ].close % 1200 ));
//             return false;
//     }
//     function isOpenHeler( today, yesterday,  time ) {
//         if( time > doc.hours.today[ 0 ].open && time < doc.hours.today[ 0 ].close )
//             return true;
//         if( time < doc.hours.today[ 0 ].open )
//             return ( time < ( doc.hours.mon[ 0 ].close % 1200 ));
//         return false;
//     }
//     // if after open and before close, open
//     // else, if before yesterday close, open
//     // close
// }
// LocationSchema.post( 'save' )

mongoose.model( 'Location', LocationSchema );
