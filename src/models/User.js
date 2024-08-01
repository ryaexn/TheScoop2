const { Schema, SchemaTypes, mode, model, mongoose } = require('mongoose');

const userSchema = new Schema({
    
    username: { type: String, required: true, unique: true}, 
    password: { type: String, required: true},
    email: { type: String, required: true},

    image: { type: String, default: 'placeholder-icon.jpg'},

    createdAt: {type: Date, default: Date.now()},

    // deleted
    // deletedAt: {type: Date, default: null},

    firstname: { type: String, required: true}, 
    lastname: { type: String, required: true}, 

    // bio
    bio: { type: String, default: `This person has no bio (yet) 'cause they're quirky like that.`},
    
    // reviews
    reviews: {type: [Schema.Types.ObjectId], ref: 'Review', default: []},
    reviewsMarkedHelpful: {type: [Schema.Types.ObjectId], ref: 'Review', default: []},

    deleteDate: {type: Date},
    isDeleted: {type: Boolean, default: false}
});

// Configure to not return deleted records in queries
userSchema.pre(['find', 'findOne', 'findById', 'countDocuments'], function() {
    this.where({ isDeleted: false });
});

const User = model('users', userSchema); 

module.exports = User;