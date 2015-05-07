process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require( './config/mongoose' ),
    express = require( './config/express' ),
    passport = require( './config/passport' );

var db = mongoose();
var app = express( db );
var passport = passport();

// var server = require( 'http' ).createServer( app );



// function handler(request, response) {
// 	request.addListener('end', function() {
// 		files.serve(request, response);
// 	});
// }


app.listen( 3030 );
// server.listen( 3030 );

module.exports = app;

console.log( 'open-three running at http://localhost:3030/' );
