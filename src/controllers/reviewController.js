const Review  = require('../models/Review.js');
const User = require('../models/User.js');
const Restaurant = require('../models/Restaurant.js');

async function countReviews() {
    try {
        const count = await Review.countDocuments();
        console.log(`Number of documents in the Review collection: ${count}`);
    } catch (error) {
        console.error('Error counting documents:', error);
    }
}

async function clearReviews() {
    try {
        await Review.deleteMany({});
        await countReviews();
    } catch (error) {
        console.error('Error clearing collection:', error);
    }
}

async function addAllReviews(parsedJson){
    try {
        await clearReviews(); 
        console.log("Inserting reviews...");
        
        const insertedDocs = await Review.insertMany(parsedJson);
        
        await countReviews();
    } catch (error) {
        console.error('Error loading reviews:', error);
        throw error; // THROW ERR AGAIN
    }
}

// RETURN RESTO
async function updateRestaurantFromReview(req){

    try{
        const rating = Number(req.body.newreviewRating);
        const resto = await Restaurant.findById(req.body.newreviewRestaurant);
       
        // Update rating, numberOfReviews, noOf Stars
        
        var newReviewsCount = resto.numberOfReviews + 1;
        var sumOfCurrentRatings = Math.round(resto.numberOfReviews * resto.rating);

        // round to one decimal place
        var newRating = Math.round(((rating + sumOfCurrentRatings) / newReviewsCount) * 10) / 10;

        var restoData = {
            rating: newRating,
            numberOfReviews: newReviewsCount,
        } 

        switch(rating){
            case 5:
                restoData.noOfFiveStars = resto.noOfFiveStars + 1;
                break;
            case 4:
                restoData.noOfFourStars = resto.noOfFourStars + 1;
                break;
            case 3:
                restoData.noOfThreeStars = resto.noOfThreeStars + 1;
                break;
            case 2:
                restoData.noOfTwoStars = resto.noOfTwoStars + 1;
                break;
            case 1:
                restoData.noOfOneStars = resto.noOfOneStars + 1;
                break;
        }

        await Restaurant.findByIdAndUpdate(resto._id, restoData, {runValidators: true});

        return resto;
    }catch(err){
        console.log("Error updating restaurant with new review");
        console.log(err);
    }
}

async function handleCreateReviewRequest(req, resp){
    try {

        // Update restaurant, 
        const resto = await updateRestaurantFromReview(req);
        const restoId = resto._id;
        
    
        var reviewData = new Review( {
            username : req.session.username,
            restoName : resto.name,
            title: req.body.newreviewTitle,
            body: req.body.newreviewDesc,
            rating: req.body.newreviewRating,
            media: req.file ? req.file.filename : ""
        });

        const newreview = await reviewData.save()
        const reviewId = newreview._id;

        await Restaurant.findByIdAndUpdate(restoId, {$push: {reviews: reviewId}});
        
        resp.redirect(`/view-restaurant/${restoId}#review${reviewId}`);
    } catch (err){
        console.log("Error creating review...");
        console.log(err);
    }
}

async function handleLikeUnlikeRequest(req, resp){

    try {
        const reviewId = req.body.reviewId
        const review = await Review.findById(reviewId);
        
        const like = req.body.isLike == 'true';
        
        if (like) {
            
            await Review.findByIdAndUpdate(reviewId, {
                helpfulMarks : review.helpfulMarks + 1
            });
            resp.send({success: true})
        } else {
            
            await Review.findByIdAndUpdate(reviewId, {
                helpfulMarks : (review.helpfulMarks - 1)
            });
            resp.send({success: true})
        }
    } catch(err){
        console.log(`Error liking/unliking review ${req.body.reviewId}`);
        console.log(err);
    }
    
}

async function resetLikes(){
   await Review.updateMany({}, { $set: { helpfulMarks: 0 } });
   console.log("Likes resetted");
}

async function fetchReviewDetails(req, resp){
    
    console.log(req.body);
    const { reviewId } = req.body;
    try {
        const review = await Review.findById(reviewId);
        // console.log(review);
        resp.json(review);
        // resp.send({success: true, review: review});
    } catch (err) {
        console.log("Error retrieving review ", reviewId);
        console.log(err);
    }
}

// the given review is the one with the OLD rating 
// IF DELETE, newRating = 0
async function updateRestaurantFromEditReview(review, newRating, isDelete){
    
    // console.log(review);
    try {
        const restaurant = await Restaurant.findOne({name: review.restoName});

        const oldRating = review.rating;
        let reviewCount = restaurant.numberOfReviews;
        
        // console.log(`${reviewCount} ` + typeof reviewCount);
        var sumRatings = restaurant.rating * reviewCount;
            sumRatings -= review.rating;

        if(isDelete){
            reviewCount -= 1;
        } 
        
        var changedRating;

        if (reviewCount === 0){
            changedRating = 0
        } else {
            changedRating = ((sumRatings + newRating) /  reviewCount) * 10 
        }

            console.log( `${sumRatings} + ${newRating} / ${reviewCount} = ${changedRating}`);
            changedRating = Math.round(changedRating) / 10; 

        console.log(newRating);
        
        console.log(sumRatings);
        console.log(changedRating);

        var data = {
            rating: changedRating,
            numberOfReviews :reviewCount
        }

       
        if (!isDelete){
            switch(newRating){
                case 5: data.noOfFiveStars  = restaurant.noOfFiveStars + 1; break;
                case 4: data.noOfFourStars = restaurant.noOfFourStars + 1; break;
                case 3: data.noOfThreeStars = restaurant.noOfThreeStars + 1; break;
                case 2: data.noOfTwoStars = restaurant.noOfTwoStars + 1; break;
                case 1: data.noOfOneStars = restaurant.noOfOneStars + 1; break;
            }
        } 
        
        switch(oldRating){
            case 5: data.noOfFiveStars  = restaurant.noOfFiveStars - 1; break;
            case 4: data.noOfFourStars = restaurant.noOfFourStars - 1; break;
            case 3: data.noOfThreeStars = restaurant.noOfThreeStars - 1; break;
            case 2: data.noOfTwoStars = restaurant.noOfTwoStars - 1; break;
            case 1: data.noOfOneStars = restaurant.noOfOneStars - 1; break;
        }

        const updatedResto = await Restaurant.findByIdAndUpdate(restaurant._id, data, {new: true, runValidators: true});
        // console.log(updatedResto);
       
    } catch (err) {
        console.log("Error updating restaurant review ratings for " + review.restoName);
        console.log(err);
    }
}


async function updateReviewDetails(req, resp){

    console.log(req.file);
    // console.log(req.body);
    const reviewId =  req.body.reviewId;

    try {
        const updateData = {
            rating : Number(req.body.rating) ,
            title : req.body.title,
            body : req.body.description,
            media : req.file ? (req.file.filename) : ""
        }; 

        const currentReview = await Review.findById(reviewId);
        const currentRating = currentReview.rating;

        if (updateData.rating != currentReview.rating){
            updateRestaurantFromEditReview(currentReview, updateData.rating, false);
        }

        const updatedReview = await Review.findByIdAndUpdate(reviewId, updateData, {runValidators: true, new: true});

        //console.log("OLD"+currentReview)
        //console.log("NEW"+updatedReview);
        resp.send({success: true});
    } catch (err) {
        console.log(`Error updating review ${reviewId}`);
        console.log(err);
        resp.status(200).json({error: "Error"}); 
    }
}

async function deleteReviewRequest(req, resp){
    console.log('delete ' + req.body.reviewId);
    const r = req.body.reviewId;
    try {
        
        // delete Review in actual review collex

        const deletedReview = await Review.findByIdAndUpdate(r, {
            deletedAt: Date.now(), 
            isDeleted: true});

        // delete Review in restaurant
        await Restaurant.updateMany(
            { reviews: r},
            { $pull: { reviews: r } } // Pull operation to remove the review ID from the array
        );

        // call UpdateRestaurantFromEditReview
        await updateRestaurantFromEditReview(deletedReview, 0, true);
        resp.send({success: true});

    } catch(err) {
        console.log(`Error deleting `)
        console.log(err);
    }
}

module.exports = {
    countReviews,
    clearReviews,
    addAllReviews,
    handleCreateReviewRequest,
    handleLikeUnlikeRequest, 
    resetLikes,
    fetchReviewDetails,
    updateReviewDetails,
    deleteReviewRequest
}