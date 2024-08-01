const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');
const Restaurant = require('./Restaurant');

const reviewSchema = new Schema({

    restoName: { type: String, required: true },
    username: { type: String, required: true },

    // Rating
    rating: { type: Number, required: true },

    helpfulMarks: { type: Number, default: 0 },

    title: { type: String, required: true },
    body: { type: String, required: false },

    media: { type: String, default: ""},
    reply: { type: String},

    createdAt: { type: Date, default: Date.now },
    deletedAt: {type: Date},
    isDeleted: {type: Boolean, default: false}

});

reviewSchema.set('toObject', { virtuals: true });
reviewSchema.set('toJSON', { virtuals: true });

// Configure to not return deleted records in queries
reviewSchema.pre(['find', 'findOne', 'findById', 'countDocuments'], function() {
    this.where({ isDeleted: false });
});

const Review = model('review', reviewSchema); 

module.exports = Review;