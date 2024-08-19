const { addAllUsers } = require('../controllers/userController.js');
const { addAllRestaurants } = require('../controllers/restaurantController.js');
const { addAllReviews } = require('../controllers/reviewController.js');

const fs = require('fs')

const userJSON = 'data/thescoop.user.json';
const restaurantJSON = 'data/thescoop.restaurant.json'
const reviewJSON = 'data/thescoop.review.json'

function parseJSON( path ){
    return JSON.parse(fs.readFileSync(path))
}

// Wrappers for loading records
async function loadUsers() {
    addAllUsers(parseJSON(userJSON))
}

async function loadRestaurants() {
    addAllRestaurants(parseJSON(restaurantJSON))
}

async function loadReviews() {
    addAllReviews(parseJSON(reviewJSON))
}

module.exports = { loadUsers, loadRestaurants, loadReviews }