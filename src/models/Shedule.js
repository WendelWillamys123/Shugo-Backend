const mongoose = require ("mongoose");

const SheduleSchema = new mongoose.Schema({

        times: [{

            start: {
                hours: Number,
                minutes: Number,
                require: true
            },
            end: {
                hours: Number,
                minutes: Number,
                require: true
            },

            index: Number,
        }],

        store: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Store',
            require: true
        },
        
    });

module.exports = mongoose.model ("Shedule", SheduleSchema);