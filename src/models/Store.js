const mongoose = require ("mongoose");
const bcrypt = require("bcryptjs");

const StoreSchema = new mongoose.Schema ({
        
    name: {
            type: String,
            require: true
        },

    email: {
            type: String,
            require: true
        },

    password: {
            type: String,
            require: true,
            select: false
        },

    slogan: {
            type: String,
            require: false
        },
    
    description: {
            type: String,
            require: false
        },

    CPF_CNPJ: {
            type: String,
            require: true
        },
     
    address: {
            type: String,
            require: true
        },

    phone: {
            type: String,
            require: true
        },

    category: {
            type: String,
            require: true
        },

    starRating: {
            type: String,
            require: false,
            default: 0,
        },

    products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            default: null
        }],

    shedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shedule',
            default: null
        },


    }
    
);

StoreSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})


module.exports = mongoose.model ("Store", StoreSchema);