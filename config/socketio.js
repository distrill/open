module.exports = function( io ){
    io.on( 'connection', function( socket ) {
        console.log( 'what the heck.' );
        what = require( '../app/controllers/socket.server.controller.js' )( io, socket );
    });
};
