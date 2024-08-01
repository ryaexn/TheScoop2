const Restaurant = require('../models/Restaurant.js');
const Review = require('../models/Review.js');
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');


async function countRestaurants() {
    try {
        const count = await Restaurant.countDocuments();
        console.log(`Number of documents in the Restaurant collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}


async function clearRestaurants() {
    try {
        await Restaurant.deleteMany({});
        await countRestaurants();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}


async function addAllRestaurants(parsedJson) {
    try {
        await clearRestaurants(); 
        console.log("Inserting restaurants...")

        const hashedRestos = await Promise.all(parsedJson.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            return { ...user, password: hashedPassword };
        }));

        await Restaurant.insertMany(hashedRestos)
        await countRestaurants()
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}

async function getAllRestaurants(){

    try {
        const restaurants = await Restaurant.find().sort({ rating: -1 }).exec();
        const restaurantCount = await Restaurant.countDocuments();

        for(let i=0; i<restaurantCount; i++ ){
            restaurants[i] = restaurants[i].toObject();
            restaurants[i].rating = Math.floor(restaurants[i].rating);
            restaurants[i].tag = restaurants[i].tag[0];
            restaurants[i].mainMedia = restaurants[i].media[1];
            restaurants[i].fiveMinusRating = 5 - restaurants[i].rating;
            restaurants[i].index = i;
        }

        return restaurants;
    } catch(err){
        console.log("Error retrieving all records from Restaurants collection.\n");
        console.log(err);
    }
}

async function searchRestaurantsByName(searchName){

    try {
        const query = { name: { $regex: searchName, $options: 'i' } };  // Case-insensitive regex search

        const restaurants = await Restaurant.find(query).exec();
        const restaurantCount = await Restaurant.find(query).countDocuments();

        for(let i=0; i<restaurantCount; i++){
            restaurants[i] = restaurants[i].toObject();
            restaurants[i].rating = Math.floor(restaurants[i].rating);
            restaurants[i].tag = restaurants[i].tag[0];
            restaurants[i].mainMedia = restaurants[i].media[1];
            restaurants[i].fiveMinusRating = 5 - restaurants[i].rating;
            restaurants[i].index = i;
        }

        return {restaurants, restaurantCount};
    } catch(err){
        console.log(`Error retrieving restaurants with name ${searchName}.\n`);
        console.log(err);
    }
}

async function searchRestaurantsByCategory(categoryTarget){
    try {
        const query = {tag: { $in: [categoryTarget] }}; 
        
        const restaurants = await Restaurant.find(query).sort({rating: -1}).exec();
        const restaurantCount = await Restaurant.find(query).countDocuments();

        for(let i=0; i<restaurantCount; i++){
            restaurants[i] = restaurants[i].toObject(); 
            restaurants[i].rating = Math.floor(restaurants[i].rating);
            restaurants[i].tag = restaurants[i].tag[0];
            restaurants[i].mainMedia = restaurants[i].media[1];
            restaurants[i].fiveMinusRating = 5 - restaurants[i].rating;
            restaurants[i].index = i;
        }

        return {restaurants, restaurantCount};
    } catch(err){
        console.log(`Error retrieving restaurants under category ${categoryTarget}.\n`);
        console.log(err);
    }
}

// For viewing all establishments in the view-establishments page
async function handleViewRestaurantsRequest(req, resp){
    
    var isSearchRequest = false;
    var isCategoryRequest = false;
    const searchTarget = req.query.searchTarget;
    const category = req.query.category; 

    if(searchTarget && (searchTarget !== "")){
        var { restaurants, restaurantCount } = await searchRestaurantsByName(searchTarget);
        isSearchRequest = true;

    } else if (category && (category !== "")){
        var { restaurants, restaurantCount } = await searchRestaurantsByCategory(category);
        isCategoryRequest = true;
    }
    else {
        // Get all establishments 
        var restaurants = await getAllRestaurants();
    }

    resp.render('view-restaurants', {
    
        restaurants: restaurants,
        restaurantCount: restaurantCount,
        
        isSearchRequest: isSearchRequest,
        searchTarget: searchTarget,

        isCategoryRequest: isCategoryRequest,
        category: category
    });
}

async function searchRestaurantById(targetId){
    try {
        const restaurant = await Restaurant.findById(targetId).exec();
        return restaurant.toObject();

    } catch(err){
        console.log(`Error finding restaurant with id ${targetId}.\n`);
        console.log(err);
    }
}

async function searchRestaurantByName(targetName){
    try {
        const restaurant = await Restaurant.findOne({name: targetName}).exec();
        return restaurant.toObject();

    } catch(err){
        console.log(`Error finding restaurant with name ${targetName}.\n`);
        console.log(err);
    }
}

async function getReviewsUnderRestaurant(restaurant){
    try {
        let reviewResults = [];
        let count = restaurant.numberOfReviews;

        for (let i=count-1; i >= 0; i--){
            
            // find review given reviews arr of restaurant
            let review_id = restaurant.reviews[i];
            reviewResults[i] = await Review.findById(review_id).exec();

            // console.log(`i = ${i}`,reviewResults[i]);
            reviewResults[i] = reviewResults[i].toObject();

            // find associated user given the review found
            let user = await User.findOne({username: reviewResults[i].username}).exec();
            
            reviewResults[i].authorImage = user.image;
            reviewResults[i].fullName = user.firstname + " " + user.lastname; // format name
        }

        reviewResults.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // sort by most recent
        
        return reviewResults;
    } catch(err) {
        console.log(`Error getting reviews with ids: ${restaurant.reviews}\n`);
        console.log(err);
    }
}


// For viewing a specific establishment, view-establishments page 
// Also handles requests determining which view for owner, reviewer
async function handleViewRestaurantDetailsRequest(req, resp){

    const restaurantId = req.params.id; 
    const restoName = req.params.restoName;

    if(restaurantId){
        var restaurant = await searchRestaurantById(restaurantId);
    } else {
        var restaurant = await searchRestaurantByName(restoName);
    }
    if (restaurant.numberOfReviews > 0){
        var associatedReviews = await getReviewsUnderRestaurant(restaurant);
    }

    // For Edit Resto Modal
    // Initialize flags
    let isGelato = false;
    let isFrozenYogurt = false;
    let isVegan = false;
    let isPremium = false;
    let isChocolate = false;
    let is4Kids = false;

    // Check tags and set flags
    if (restaurant.tag.includes("Gelato")) isGelato = true;
    if (restaurant.tag.includes("Frozen Yogurt")) isFrozenYogurt = true;
    if (restaurant.tag.includes("Vegan")) isVegan = true;
    if (restaurant.tag.includes("Premium")) isPremium = true;
    if (restaurant.tag.includes("Chocolate")) isChocolate = true;
    if (restaurant.tag.includes("4 Kids")) is4Kids = true;
    
    // console.log(`isGelato: ${isGelato}`);
    // console.log(`isFrozenYogurt: ${isFrozenYogurt}`);
    // console.log(`isVegan: ${isVegan}`);
    // console.log(`isPremium: ${isPremium}`);
    // console.log(`isChocolate: ${isChocolate}`);
    // console.log(`is4Kids: ${is4Kids}`);
    // console.log(`${req.session.isLoggedIn} ? ${req.session.userId} ? ${restaurant._id}`)

    // Only owners have edit access
    const hasEditAccess = ( req.session.isLoggedIn && (req.session.userId == restaurant._id) );

    console.log(`Edit Access: ${hasEditAccess}`);
    

    resp.render('view-restaurant', {
        
        restaurant: restaurant,
        reviews: associatedReviews,
        hasEditAccess: hasEditAccess,
        currentUsername: req.session.username,

        isGelato: isGelato,
        isFrozenYogurt: isFrozenYogurt,
        isVegan: isVegan,
        isPremium: isPremium,
        isChocolate: isChocolate,
        is4Kids: is4Kids
        });
}

async function createNewRestaurant(body){
    try{
        const {email, restoname, username, password, tag} = body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const restaurantData = new Restaurant({
            name: restoname,
            username: username,
            password: hashedPassword,
            email: email,
            tag: [tag]
        });

        const resto = await restaurantData.save();
        console.log(resto);

        return resto;
    } catch(err){
        console.log(`Error creating restaurant given: ${body}`);
        console.log(err);
    }
}

async function processSignUpRestaurant(req, res){
    console.log(req.body);
    
    const newRestaurant = await createNewRestaurant(req.body);
        console.log(newRestaurant);

    const restoName = req.body.restoname;

    req.session.userId = newRestaurant._id;
    req.session.username = newRestaurant.username;
    req.session.isLoggedIn = true;
    req.session.isOwnerLoggedIn = true;


    // res.redirect(`/view-restaurant/${restoName}`); // cant use this because name is not unique
    res.redirect(`/view-restaurant/${newRestaurant._id}`);
}   

async function updateRestaurantPhoto(req, res){
    console.log(req.body);
    console.log(req.file);

    const userId = req.session.userId;
    const index = req.body.index;
    // console.log(req.file);
    try{
        if (req.file){
            const resto = await Restaurant.findByIdAndUpdate(userId, {$set: { [`media.${index}`] : req.file.filename} }, {new:true});
            res.success = true;
            console.log(resto);
        }
        res.send({success: true});
    } catch(err){
        console.log("Error updating photo for resto" + userId + " " + req.session.username);
        console.log(err);
    }
}

async function updateRestaurant(restoId, body){

    try{

        let tags = [];
        
        // LOL, design ur database well, guys
        if (body.isGelato) {
            tags.push("Gelato");
        } if (body.isVegan) {
            tags.push("Vegan");
        } if (body.isFrozenYogurt) {
            tags.push("Frozen Yogurt");
        } if (body.isPremium) {
            tags.push("Premium");
        } if (body.is4Kids) {
            tags.push("4 Kids");
        } if (body.isChocolate) {
            tags.push("Chocolate");
        }

        console.log(`tags: ${tags}`);

        const restoData = {
            name : body.restoName,
            location : body.address,
            pricePoint : body.pricePoint,
            description: body.desc,
            shortDescription: body.shortdesc,
            tag: tags 
        };

        
        // const updatedResto = await Restaurant.find()


        const updatedResto = await Restaurant.findByIdAndUpdate(restoId, restoData, 
            {runValidators: true});

        if (updatedResto.name != restoData.name){
            await Review.updateMany({restoName: updatedResto.name}, { $set: {restoName: restoData.name}});
        }

        console.log(updatedResto);
        
    } catch(err){
        console.log(`Error updating restaurant of id: ${restoId}`);
        console.log(err);
    }
}

async function handleEditRestaurantRequest(req, res){
    
    console.log(req.body);
    const restoId = req.session.userId;
        
    try {
        await updateRestaurant(restoId, req.body);
    } catch(err){
        console.log(err);
    }

    res.redirect(`/view-restaurant/${req.session.userId}`);
}

async function deleteRestaurantRequest(req, resp){

    const userId = req.session.userId;
    try {
        const updateData = {
            isDeleted : true,
            deleteDate : Date.now()
        }

        const updatedUser = await Restaurant.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });

        console.log(updatedUser.name);
        const name = updatedUser.name;
        await Review.updateMany({restoName: name }, {isDeleted: true, deletedAt: Date.now()});
        
        resp.send({success: true})

    } catch(err) {
        
        console.log(`Error deleting user ${userId}`);
        console.log(err);
    }
}

async function handleReplyReviewRequest(req, resp){

    try {   
        console.log(req.body.replyMessage);
        console.log(req.body.reviewId);

        const reviewId = req.body.reviewId;
        const rep = req.body.replyMessage;
        const restoId = req.session.userId;

        const review = await Review.findByIdAndUpdate(reviewId, { reply: rep }, {new: true});
        console.log(review);
        
        resp.redirect(`/view-restaurant/${restoId}#review${reviewId}`);

    } catch (err) {
        console.log(`Error replying to ${req.body.reviewId}`);
        console.log(err);
    }
}

module.exports = { 
    countRestaurants,
    clearRestaurants,
    addAllRestaurants,
    handleViewRestaurantsRequest,
    handleViewRestaurantDetailsRequest,
    processSignUpRestaurant,
    updateRestaurantPhoto,
    handleEditRestaurantRequest,
    deleteRestaurantRequest,
    handleReplyReviewRequest,
};

