var Location = require( 'mongoose' ).model( 'Location' ),
    passport = require( 'passport' );

exports.create = function( req, res, next ) {           // right now this still posts if server has timed out,
    var location = new Location( req.body ),            // only check is if admin when the page renders
        latitude = null,                                // add a check here as well so it won't post unless adin
        longitude = null;
    location.save( function( err ) {
        if( err ) {
            return next( err );
        } else {
            res.render( 'addLocation', {
                title: 'Add Location',
                addAnother: true,
            });
        }
    });
};

exports.renderAdmin = function( req, res, next ) {
    if( req.user && req.user.group === 'admin' ) {
        res.redirect( '/addLocation' );
    } else {
        return res.redirect( '/' );
    }
};

exports.renderAddLocation = function( req, res, next ) {
    if( req.user && req.user.group === 'admin' ) {
        res.render( 'addLocation', {
            title: 'Add Location',
            addAnother: false,
        });
    } else {
        return res.redirect( '/' );
    }
};

exports.renderAddAnother = function( req, res, next ) {
    if( req.user && req.user.group === 'admin' ) {
        res.render( 'addAnother', {
            title: 'Add Location'
        });
    } else {
        return res.redirect( '/' );
    }
};

exports.mapCheck = function( req, res, next ) {
    gmaps.reverseGeocode('41.850033,-87.6500523', function(err, data){
        util.puts(JSON.stringify(data));
    });
}
