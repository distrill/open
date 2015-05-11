module.exports = function( io ){
    io.on( 'connection', function( socket ) {
        console.log( 'socket connected.' );
        what = require( '../app/controllers/socket.server.controller.js' )( io, socket );
    });
};
