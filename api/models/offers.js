'use strict';
var mongoose = require('mongoose');
var schemaTypes = mongoose.Schema.Types;
var GeoJSON  = require('geojson'); //GeoJSON is a format for encoding a variety of geographic data structures.

//offers
var offersSchema = mongoose.Schema({
    offer_by: {

        type: String,
        required: "User who created offer cann't be empty."
    },
    offer: {

        type: String,
    },
    quantity: {

        type: schemaTypes.Double,
        required: "Quantity cann't be empty."
    },
    currency: {

        type: String,
    },
    unit: {

            type: String,
    },
    offer_type: {

        type: [{
            type: String,
            enum: ['s', 'b']
        }],
        default: ['s']
    },
    exchange_rate: {

        type: schemaTypes.Double,
        required: "Exchnage rate cann't be empty."
    },
    location: {

        type: String,
    },
    latitude: {

        type: schemaTypes.Double,
    },
    longitude: {

        type: schemaTypes.Double,
    },
    type: {

        type: String,
        enum: [
            'Point',
            'LineString',
            'Polygon'
        ],
        default: ['Point']
    },
    coordinates: {

        type: [Number],
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