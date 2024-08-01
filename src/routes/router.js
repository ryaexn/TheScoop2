 const express = require('express');
const path = require('path');
const router = express.Router();

const { isAuthenticated } = require('../middleware/auth');

const { handleIndexResponse} = require('../controllers/indexController');
const { handleLoginRequest, handleLogoutRequest, handleSignUpRequest } = require('../controllers/loginController');
const { handleViewRestaurantsRequest, handleViewRestaurantDetailsRequest, processSignUpRestaurant, updateRestaurantPhoto, handleEditRestaurantRequest, deleteRestaurantRequest, handleReplyReviewRequest } = require('../controllers/restaurantController');
const { handleViewUserRequest, processSignUpRequest } = require('../controllers/userController');
const { handleEditUserResponse, processEditUser, verifyCurrentPassword, changePasswordRequest, deleteUserRequest, updateUserPhoto } = require('../controllers/editUserController');
const { uploadReviewMedia, uploadUserImage, uploadRestaurantImage } = require('../middleware/upload');
const { handleCreateReviewRequest, handleLikeUnlikeRequest, resetLikes, fetchReviewDetails, updateReviewDetails, deleteReviewRequest } = require('../controllers/reviewController');

router.use(isAuthenticated);


// Landing Page
router.get(['/', '/index'], handleIndexResponse);
router.get('/about', (req,res) => res.render('about'));
// Login, Sign up redirection
router.post('/login', handleLoginRequest);
router.get('/logout', handleLogoutRequest);
router.get('/sign-up', handleSignUpRequest);

// Sign up form processing
router.post('/register-user', processSignUpRequest);
router.post('/register-restaurant', processSignUpRestaurant);

// View, Edit Restaurants
router.get('/view-restaurants', handleViewRestaurantsRequest);
router.get(['/view-restaurant/:id', '/view-restaurant/name/:restoName'], handleViewRestaurantDetailsRequest);
router.post('/update-resto-picture', uploadRestaurantImage.single('restoImage'), updateRestaurantPhoto);
router.post('/edit-restaurant', handleEditRestaurantRequest);
router.post('/delete-resto-account', deleteRestaurantRequest);


// View, Edit User profiles
router.get('/edit-user-profile', handleEditUserResponse);
router.get('/view-user-profile/:username', handleViewUserRequest);
router.post('/update-user', processEditUser);
router.post('/verify-current-password', verifyCurrentPassword);
router.post('/save-password', changePasswordRequest);
router.post('/delete-account', deleteUserRequest);
router.post('/upload-icon', uploadUserImage.single('newUserIcon') , updateUserPhoto);


// Create, Edit, Reply to reviews
router.post('/process-review', uploadReviewMedia.single('newReviewImage'), handleCreateReviewRequest);
router.post(['/like', '/unlike'], handleLikeUnlikeRequest);
router.post('/process-review-reply', handleReplyReviewRequest);
router.post('/fetch-review-details', fetchReviewDetails);
router.post('/update-review', uploadReviewMedia.single('newReviewImage'), updateReviewDetails);
router.post('/delete-review', deleteReviewRequest);

// // // TODO: Handle missing pages 
router.get('*', (req, resp) => {
    console.log("404");
    resp.redirect("/?error=true");
})

// resetLikes();

module.exports = router;