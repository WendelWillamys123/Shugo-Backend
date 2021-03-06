const mongoose = require ("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema ({
        
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
      
    }
);

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next();
})


module.exports = mongoose.model ("User", UserSchema);