module.exports = function( app ) {
    var browse = require( '../controllers/browse.server.controller' );

    app.get( '/browse', browse.getStarted );
}
