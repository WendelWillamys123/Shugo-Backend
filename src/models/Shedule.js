const mongoose = require ("mongoose");

const SheduleSchema = new mongoose.Schema({

        times: [{

            start: {
                hours: Number,
                minutes: Number,
            },
            end: {
                hours: Number,
                minutes: Number,
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