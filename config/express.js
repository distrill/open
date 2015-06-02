var config = require( './config' ),
    configMulter = require( '../config/multer.js' ),
    http = require( 'http' ),
    socketio = require( 'socket.io' ),
    express = require( 'express' ),
    morgan = require( 'morgan' ),
    compress = require( 'compression' ),
    bodyParser = require( 'body-parser' ),
    methodOverride = require( 'method-override' ),
    session = require( 'express-session' ),
    flash = require( 'connect-flash' ),
    passport = require( 'passport' ),
    multer = require( 'multer' );

module.exports = function( db ) {
    var app = express();
    var server = http.createServer( app );
    var io = socketio.listen( server );

    if( process.env.NODE_ENV === 'development' ) {
        app.use( morgan( 'dev' ));
    } else if( process.env.NODE_ENV === 'production' ) {
        app.use( compress() );
    }

    app.use( bodyParser.urlencoded( {
        extended: true
    }));
    app.use( bodyParser.json() );
    app.use( methodOverride() );

    app.use( multer( configMulter.settings ));

    app.use( session( {
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret,
    }));

    app.set( 'views', './app/views' );
    app.set( 'view engine', 'ejs' );

    app.use( flash() );
    app.use( passport.initialize() );
    app.use( passport.session() );

    require( '../app/routes/index.server.routes.js' )( app );
    require( '../app/routes/users.server.routes.js' )( app );
    require( '../app/routes/locations.server.routes.js' )( app );
    require( '../app/routes/browse.server.routes.js' )( app );
    // require( '../app/routes/testing.server.routes.js' )( app );

    app.use( express.static( './public' ));

    require( './socketio.js' )( io );

    return server;
};
