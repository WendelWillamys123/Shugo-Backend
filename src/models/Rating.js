const mongoose = require ("mongoose");

const RatingSchema = new mongoose.Schema ({
    
    stars: {
        type: Number,
        require: true
    },

    description: {
            type: String,
            require: false
        },

    store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            require: true
        },

    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        }

    }
);

module.exports = mongoose.model ("Rating", RatingSchema);