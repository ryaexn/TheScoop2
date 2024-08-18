const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const bcrypt = require('bcryptjs');

async function loginUser(req, username, password) {
    try {
        const userProfile = await User.findOne({ username: username });
        if (userProfile) {
        
            const isMatchUserProfile = await bcrypt.compare(password, userProfile.password);
            if (isMatchUserProfile) {
                req.session.userId = userProfile._id;
                req.session.username = userProfile.username;
                req.session.userIcon = userProfile.image;
                req.session['isLoggedIn'] = true;
                req.session['isOwnerLoggedIn'] = false;
            
                return { success: true, redirectUrl: "/index?login=success" };
            }
        } else {
            const restaurantUser = await Restaurant.findOne({ username:username });
            if (restaurantUser) { 
                const isMatchRestoProfile = await bcrypt.compare(password, restaurantUser.password);
                if (isMatchRestoProfile) {
                    req.session.userId = restaurantUser._id;
                    req.session.username = restaurantUser.username;
                    req.session.userIcon = restaurantUser.media[1];
                    req.session['isLoggedIn'] = true;
                    req.session['isOwnerLoggedIn'] = true;
                    return { success: true, redirectUrl: `/view-restaurant/${restaurantUser._id}`};
                }
            }
        }
        return { success: false, message: "Incorrect username or password." };
    } catch (error) {
        console.error('Error during login process:', error);
        return { success: false, message: "Internal Server Error", statusCode: 500 };
    }
}

async function handleLogoutRequest(req,res) {
    req.session.destroy(() => {
        res.redirect('/'); 
    });
};

async function handleLoginRequest(req, res) {
    const { username, password } = req.body;
    const loginResult = await loginUser(req, username, password);

    if (loginResult.success) {
        return res.redirect(loginResult.redirectUrl);
    } else {
        const redirectUrl = loginResult.statusCode === 500 ? '/error' : `/index?login=failed`;
        return res.redirect(redirectUrl);
    }
}

async function validateUsername(req, res){
    try {
        const {username} = req.body;

        // Get usernames from user and restaurant collections
        const [user_usernames, restaurant_usernames] = await Promise.all([
            User.find({}, 'username').exec(),
            Restaurant.find({}, 'username').exec()
        ]);

        // Extract usernames from documents and combine into one array
        const all_usernames = [
            ...user_usernames.map(doc => doc.username),
            ...restaurant_usernames.map(doc => doc.username)
        ];

        if (!all_usernames.includes(username)){
            res.status(200).json({message: "OK"});
        } else {
            res.status(400).json({error: "Username already exists."});
        }

    } catch (err) {
        console.log("Error getting all usernames.")
        console.error(err);
        res.status(400).send("Error validating usernames.");
        return;
    }
}

async function validateRestoName(req, res){

    try {

        const {restoName} = req.body;
        const matches = await Restaurant.countDocuments({name: restoName.trim()});

        if (matches != 0){
            res.status(400).json({error: "Restaurant name already exists."});
        } else {
            res.status(200).json({message: "OK"});
        }

    } catch (err) {
        console.log("Error getting resto names.");
        console.log(err);
        res.status(500).send("Internal server error");
    }
}

// This only redirects to sign up page
async function handleSignUpRequest(req, res){
    
    // const allUsernames = await getAllUsernames();
    // console.log(`Users: ${JSON.stringify(allUsernames)}`);

    res.render('sign-up', {
        // usernameList: JSON.stringify(allUsernames)

    });
}

module.exports = {
    handleLoginRequest, 
    handleLogoutRequest, 
    validateUsername,
    validateRestoName,
    handleSignUpRequest
}