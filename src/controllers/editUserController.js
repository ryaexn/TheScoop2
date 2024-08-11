const Review  = require('../models/Review.js');
const User = require('../models/User.js');
const Restaurant = require('../models/Restaurant.js');
const isAuthenticated = require('../middleware/auth');
const bcrypt = require('bcryptjs');

async function getReviewsFromUser(username){
    try{
        const reviews = await Review.find({username: username}).sort({createdAt: -1}).exec();
        const reviewsCount = await Review.find({username: username}).countDocuments();
        
        for(let i=0; i<reviewsCount; i++){
            reviews[i]=reviews[i].toObject();
        }
        // console.log(reviews);
        console.log(`Retrieved ${reviewsCount} reviews from ${username}`);

        return {reviews, reviewsCount};
    } catch(err) {
        console.log(`Error finding reviews under username: ${username}`);
        console.log(err);
    }
}

async function getUserByUsername(username){
    
    try{
        const user = await User.findOne({username: username}).exec();

        // console.log(user);
        return user.toObject();
    } catch(err) {
        console.log(`Error finding user with username: ${username}`);
        console.log(err);
    }
}

async function handleEditUserResponse(req, resp){

    // const tempUsername = "notchxna"

    const username = resp.locals.username;

    const user = await getUserByUsername(username);
    const {reviews, reviewsCount} = await getReviewsFromUser(username);
    // console.log(reviewsCount);
    // console.log(user);
    resp.render('edit-user-profile',{
        
        user: user,
        reviews: reviews,
        reviewsCount: reviewsCount 
    });
}

async function updateUser(userId, body){
    try {

        const updateData = {
            firstname: body.firstname,
            lastname: body.lastname,
            email: body.email,
            bio: body.bio
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        
        return updateUser;
    } catch(err) {
        console.log(`Error updating user ${userId}`);
        console.log(err);
    }
}

async function processEditUser(req, resp){


    const updatedUser = await updateUser(req.session.userId, req.body);
    // console.log(updatedUser);

    resp.redirect(`/view-user-profile/${req.session.username}`);
}

async function verifyCurrentPassword(req, resp){

    // Check if current pass is same with input
    const user = await User.findById(req.session.userId);
    if (user) {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        console.log("Password-match: " + isMatch);
        if(isMatch){
            resp.send({success: true})
        } else {
            console.log("Wrong current password.")
            resp.send({success: false})
        }
    } 
}

async function changePasswordRequest(req, resp){

    // console.log(`New password: ${req.body.newPassword}`);
    const userId = req.session.userId;
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, 
            { password: hashedPassword }, 
            { new: true, runValidators: true });

        if (updatedUser){
            resp.send({success: true});
            console.log("Password change successful.");
        } else {
            resp.send({error: "Error changing passwords"});
        }
    } catch(err){
        console.log(`Error changing password for user: ${userId}`)
    }
}

async function deleteUserRequest(req, resp){
    const userId = req.session.userId;
    try {
        const updateData = {
            isDeleted : true,
            deleteDate : Date.now()
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        
        resp.send({success: true})
    } catch(err) {
        
        console.log(`Error deleting user ${userId}`);
        console.log(err);
    }
}

async function updateUserPhoto(req, resp){
    const userId = req.session.userId;
    
    // console.log(req.file);
    try{
        if (req.file){
            const user = await User.findByIdAndUpdate(userId, {image: req.file.filename}, {new:true});

            resp.locals.userIcon = user.image;
            req.session.userIcon = user.image;

            isAuthenticated(req, resp, resp.send({success: true}));
            
            // console.log(user);
        }
    } catch(err){
        console.log(err);
    }
}


module.exports = {
    handleEditUserResponse,
    processEditUser,
    verifyCurrentPassword,
    changePasswordRequest,
    deleteUserRequest,
    updateUserPhoto
}