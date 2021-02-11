const mongoose = require ("mongoose");

const ProductSchema = new mongoose.Schema ({
        
    name: {
            type: String,
            require: true
        },
    
    description: {
            type: String,
            require: false
        },
        
    value: {
            type: String,
            require: true
        },

    store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            require: true
        }

    }
);

module.exports = mongoose.model ("Product", ProductSchema);