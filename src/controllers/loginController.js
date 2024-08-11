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
                    return { success: true, redirectUrl: "/view-restaurant/" + restaurantUser._id };
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

async function getAllUsernames(){
    try {
        const user_usernames = await User.find({}, 'username').exec();

        // Get all usernames from Restaurant collection
        const restaurant_usernames = await Restaurant.find({}, 'username').exec();

        // Extract usernames from documents and combine into one array
        const all_usernames = [
            ...user_usernames.map(doc => doc.username),
            ...restaurant_usernames.map(doc => doc.username)
        ];

        // console.log("All usernames:", all_usernames);
        return all_usernames;
    } catch (err) {
        console.log("Error getting all usernames.")
        console.error(err);
    }
}

// This only redirects to sign up page
async function handleSignUpRequest(req, res){
    
    const allUsernames = await getAllUsernames();
    // console.log(`Users: ${JSON.stringify(allUsernames)}`);

    res.render('sign-up', {
        usernameList: JSON.stringify(allUsernames)

    });
}

module.exports = {handleLoginRequest, handleLogoutRequest, handleSignUpRequest}