
function isAuthenticated(req, res, next) {

    res.locals.isLoggedIn = req.session.userId ? true : false; 
    res.locals.isOwnerLoggedIn = req.session.isOwnerLoggedIn;

    res.locals.username = req.session.username;
    res.locals.userId = req.session.userId;
    res.locals.userIcon = req.session.userIcon;

    console.log("-------CURRENT SESSION-------------------\n");
    console.log(req.session);
    console.log("-----------------------------------------\n");
    
    next();
}

module.exports = {isAuthenticated};