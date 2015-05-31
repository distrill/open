var Location = require( 'mongoose' ).model( 'Location' ),
    passport = require( 'passport' );

/****************************************************
 *                                                  *
 *  all i have is C in CRUD, need to add the rest   *
 *                                                  *
 ****************************************************/

exports.create = function( req, res, next ) {           // right now this still posts if server has timed out,
    var location = new Location( req.body ),            // only check is if admin when the page renders
        latitude = null,                                // add a check here as well so it won't post unless adin
        longitude = null;
    location.save( function( err ) {
        if( err ) {
            console.log( 'ERROR: locations.server.controller.create(): ' + err );
            res.redirect( '/' );
            // return next( err );
        } else {
            res.render( 'addLocation', {
                title: 'Add Location',
                addAnother: true,
            });
        }
    });
};

exports.renderAddLocation = function( req, res, next ) {
    // if( req.user && req.user.group === 'admin' ) {
        res.render( 'addLocation', {
            title: 'Add Location',
            addAnother: false,
        });
    // } else {
    //     return res.redirect( '/' );
    // }
};
