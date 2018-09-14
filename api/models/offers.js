'use strict';
var mongoose = require('mongoose');
var schemaTypes = mongoose.Schema.Types;

//offers
var offersSchema = mongoose.Schema({
    offer_by: {

        type: String,
        required: "User who created offer cann't be empty."
    },
    offer: {

        type: String,
    },
    offer_amount: {

        type: schemaTypes.Double,
        required: "Amount cann't be empty."
    },
    offer_currency: {

        type: [{
            type: String,
            enum: ['Bitcoin', 'Litecoin', 'Namecoin', 'SwiftCoin', 'Bytecoin']
        }],
        default: ['Bitcoin']
    },
    offer_unit: {

        type: [{
            type: String,
            enum: ['BTC', 'LTC', 'NMC', 'STC', 'BCN']
        }],
        default: ['BTC']
    },
    offer_type: {

        type: [{
            type: String,
            enum: ['s', 'b']
        }],
        default: ['s']
    },
    status: {
        type: [{
            type: String,
            enum: ['p', 'a', 'r']
        }],
        default: ['p']
    },
    created_at: {

        type: Date,
        default: Date.now
    },
    updated_at: {

        type: Date,
        default: Date.now
    }
});

// Sets the created_at parameter equal to the current time
offersSchema.pre('save', function(next) {

    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {

        this.created_at = now;
    }
    next();
});

//Routes will go here
module.exports = mongoose.model('offers', offersSchema);