var locations = require( '../../app/controllers/locations.server.controller' );

module.exports = function( app ) {

    app .route( '/admin' )
        .get( locations.renderAddLocation )
        .post( locations.create );

    app .route( '/addLocation' )
        .get( locations.renderAddLocation )
        .post( locations.create );

}
