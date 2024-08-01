
const Review = require('../models/Review.js');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const path = require('path');

// const Review = require('../models/Review'); 

async function countUsers() {
    try {
        const count = await User.countDocuments();
        console.log(`Number of documents in the User collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}

async function clearUsers() {
    try {
        await User.deleteMany({});
        await countUsers();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}

async function addAllUsers(parsedJson) {
    try {
        await clearUsers(); 
        console.log("Clearing existing profiles and preparing to insert new profiles...");

        /*
        
        */
        const hashedProfiles = await Promise.all(parsedJson.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
        }));

        await User.insertMany(hashedProfiles);
        
        await countUsers();
    } catch (error) {
        console.error('Error loading profiles:', error);
    }
}

async function getTwoReviewsFromUser(username){
    try{
        const reviews = await Review.find({username: username}).sort({createdAt: -1}).exec();
        const reviewsCount = await Review.find({username: username}).countDocuments();
        
        for(let i=0; (i<reviewsCount && i<2) ; i++){
            reviews[i]=reviews[i].toObject();
        }

        if(reviewsCount >= 2){
            let temp = reviews[0];
            reviews[0] = reviews[1];
            reviews[1] = temp; 
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
    try {
        const user = await User.findOne({username: username}).exec();

        // console.log(user);
        return user.toObject();
    } catch(err) {
        console.log(`Error finding user with username: ${username}`);
        console.log(err);
    }
}

async function handleViewUserRequest(req, resp){

    const targetUserName = req.params.username;
    const user = await getUserByUsername(targetUserName);
    let {reviews, reviewsCount}= await getTwoReviewsFromUser(user.username);
    
    

    resp.render('view-user-profile', {
        user: user,
        reviews: reviews,
        reviewsCount: reviewsCount,

        isOwnProfile: targetUserName == req.session.username
    });
}

async function createNewUser(body){
    try {
        const {username, email, firstname, lastname, password} = body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = new User({
            username: username,
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
        });

        const user = await userData.save();
        // console.log(user);
        
        return user;
        
    } catch(err) {
        console.log("Error creating new user given " + body);
        console.log(err)
    }
}

async function processSignUpRequest(req, res){

    console.log(req.body);
    console.log(req.session);
    
    const newUser = await createNewUser(req.body);
    
    req.session.userId = newUser._id;
    req.session.username = newUser.username;

    res.redirect('/edit-user-profile');
}

module.exports = {
    countUsers,
    clearUsers,
    addAllUsers,
    handleViewUserRequest,
    processSignUpRequest
};