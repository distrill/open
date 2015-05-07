exports.render = function( req, res ) {
    res.render( 'index', {
        title: 'is it damn open',
        userFirstName: req.user ? req.user.firstName : ''
    });
}
