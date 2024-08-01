const Restaurant = require('../models/Restaurant.js');
const User = require('../models/User.js');
const Review = require('../models/Review.js')

const mongoose = require('mongoose');

async function getHeroFeature(){
    try {
        // Get randomized review with 5 stars and image
        const reviews = await Review.find({
            media: {$ne: ''},
            rating: 5
        }).sort({createdAt: -1}).exec()

        const resultCount = await Review.find({
            media: {$ne: ''},
            rating: 5
        }).countDocuments();

        let randomNumber = 0;
        
        if (resultCount >= 2){
            randomNumber = Math.floor(Math.random() * 10) % resultCount;
        }

    
        const review = reviews[randomNumber].toObject();
        console.log(`HERO INDEX: ${randomNumber}`);

        // Get resto that was rated
        const restaurant = await Restaurant.findOne({name: review.restoName});
        // Get author of associated review
        const userOfReview = await User.findOne({username: review.username}).exec()
        // console.log(userOfReview);

        const heroReview = {
            restaurantId: restaurant._id,
            restoname: review.restoName,
            title: review.title,
            body: review.body,
            media: review.media,
            fullNameOfUser: userOfReview.firstname + " " + userOfReview.lastname,
        }

        // console.log(heroReview)
        return heroReview;

    } catch(err) {
        console.log("Error getting featured review for Hero Section\n")
        console.log(err)
    }
}


async function getTopEstablishmentsFeature(){

    try {
        // Get top 3 highest rated restos
        const topEstablishments = await Restaurant.find()
                                    .sort({ rating: -1 }).limit(3).exec();
    

        for(let i=0; i<3; i++ ){
            topEstablishments[i] = topEstablishments[i].toObject(); // aarte ng hbs 
            topEstablishments[i].rating = Math.floor(topEstablishments[i].rating); // Floor rating
            topEstablishments[i].tag = topEstablishments[i].tag[0]; // Get first tag
            topEstablishments[i].mainMedia = topEstablishments[i].media[1]; 
            topEstablishments[i].fiveMinusRating = 5 - topEstablishments[i].rating;
        }

        return topEstablishments

    } catch(err) {
        console.log("Error getting top three establishments\n")
        console.log(err)
    }
}

async function getLatestReviews(){

    try {
        const latestReviews = await Review.find().sort({createdAt: -1}).limit(4).exec();

        // Get associated users 
        for (var i=0; i<4; i++){
            latestReviews[i] = latestReviews[i].toObject();
            
            let userOfReview = await User.findOne({username: latestReviews[i].username});
            let restaurant = await Restaurant.findOne({name: latestReviews[i].restoName});

            // console.log(latestReviews[i]);
            latestReviews[i].restoId = restaurant._id;
            latestReviews[i].fullNameOfUser = userOfReview.firstname + " " + userOfReview.lastname;
            latestReviews[i].userIcon = userOfReview.image;
            latestReviews[i].isHelpful = (latestReviews[i].helpfulMarks > 0);
            latestReviews[i].index = i;
        }
        return latestReviews; 
    } catch(err) {
        console.log("Error getting four latest reviews @ " + i + "\n");

        console.log(err);
    } 
}


async function handleIndexResponse(req, resp){
    // Get hero section: Latest Review with 5 stars and image
    const heroReview = await getHeroFeature();
        // console.log(heroReview);
    
    // Get top establishments sections
    const topEstablishments = await getTopEstablishmentsFeature();
        // console.log(topEstablishments)

    const latestReviews = await getLatestReviews();
        // console.log(latestReviews)

    let loginSuccess = false, 
    loginFailed = false;

    if (req.query.login){
        let status = req.query.login;
        if (status === 'success'){
            loginSuccess = true;

        } else if (status=== 'failed'){
            loginFailed = true;
        }
    }

    let is404 = false;
    if(req.query.error){
        is404 = true;
    }
    //console.log(req.session);

    resp.render('index', {
        loginSuccess: loginSuccess,
        loginFailed: loginFailed,
        is404: is404,
        
        // features
        hero: heroReview,
        topEstablishments: topEstablishments,
        latestReviews: latestReviews
    });

    // Get four latest reviews
}


module.exports = {handleIndexResponse};