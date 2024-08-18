const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const restaurantSchema = new Schema({
    
    name: {type: String, required: true, unique: true},
    location: {type: String, default: 'Philippines'},

    //media
    media: {type: [String], default: ['resto-placeholder.png', 'resto-placeholder.png', 'resto-placeholder.png']},

    // owner credentials
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},

    // data about the pricing
    pricePoint: {type: String, default:'Moderate'},

    // description
    description: {type: String, default: 'This restaurant has no description because they are quirky like that. Perhaps the owner will soon update this.'},
    shortDescription: {type: String, default: 'This restaurant has no short description because they are quirky like that.'},
    tag: { type: [String], required: true},

    // ratings
    rating: {type : Number, default: 0},
    numberOfReviews: {type : Number, default: 0},
    noOfFiveStars: {type : Number,  default: 0},
    noOfFourStars: {type : Number, default: 0},
    noOfThreeStars: {type : Number, default: 0},
    noOfTwoStars: {type : Number, default: 0},
    noOfOneStars: {type : Number, default: 0},

    // reviews
    reviews: {type: [Schema.Types.ObjectId], ref: 'Review', default: []},

    createdAt: { type: Date, default: Date.now },
    deletedAt: {type: Date},
    isDeleted: {type: Boolean, default: false}
});

// middle ware 
// restaurantSchema.pre('validate', function(next) {
//     const totalStars = this.noOfFiveStars + this.noOfFourStars + this.noOfThreeStars + this.noOfTwoStars + this.noOfOneStars;
//     if (totalStars !== this.numberOfReviews) {
//         return next(new Error('The sum of star ratings must equal the total number of reviews.'));
//     }
//     next();
// });

// Configure to not return deleted records in queries
restaurantSchema.pre(['find', 'findOne', 'findById', 'countDocuments'], function() {
    this.where({ isDeleted: false });
});



const Restaurant = model('restaurant', restaurantSchema); 
module.exports = Restaurant;