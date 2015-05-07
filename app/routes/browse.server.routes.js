module.exports = function( app ) {
    var browse = require( '../controllers/browse.server.controller' );

    app.get( '/browse', browse.getStarted );

    app.get( '/browseMap', browse.getBrowseMap );

    app.get( '/testing', browse.getTesting );
}
