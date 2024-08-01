const multer = require('multer');
const path = require('path');

const reviewStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets/reviews');
    },
    filename: function(req, file, cb) {
        
        const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
        cb(null, file.originalname);
    }
});

const userStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets/icons');
    },
    filename: function(req, file, cb) {
        const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
        cb(null, file.originalname);
    }
});

const restaurantStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/assets');
    },
    filename: function(req, file, cb) {
        const suffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // cb(null, file.fieldname + '-' + suffix + path.extname(file.originalname));
        cb(null, file.originalname);
    }
});

const uploadReviewMedia = multer({
    storage: reviewStorage,
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
      },
    onError : function(err, next) {
        console.log('error', err);
        next(err);
      }
});

const uploadUserImage = multer({
    storage: userStorage, 
    limits: {
        files: 1
    }
});

const uploadRestaurantImage = multer({
    storage: restaurantStorage, 
    limits: {
        files: 1
    }
});



module.exports = {
    uploadReviewMedia,
    uploadUserImage,
    uploadRestaurantImage
}