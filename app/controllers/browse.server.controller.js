exports.getStarted = function( req, res, next ) {
    res.render( 'browse', {
        title: 'is it damn open',
        userFirstName: req.user ? req.user.firstName : '',
        error: 'could not find or use browser data location. please enter manually.'
    });
};
