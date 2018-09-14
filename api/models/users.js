'use strict';
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var GeoJSON  = require('geojson'); //GeoJSON is a format for encoding a variety of geographic data structures.
var schemaTypes = mongoose.Schema.Types;

//users
var userSchema = mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
    },
    mobile:{
        type: String,
        required: "Mobile number field cann't be empty."
    },
    password:{
        type: String,
        required: "Password field cann't be empty."
    },
    image: {
        type: String,
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
    language: {
        type: String,
        default: 'English'
    },
    language_code: {
        type: String,
        default: 'eng'
    },
    pin: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: [{
            type: String,
            enum: ['a', 'i']
        }],
        default: ['a']
    }
});

// Sets the created_at parameter equal to the current time
userSchema.pre('save', function(next) {

    var now = new Date();
    this.updated_at = now;
    if (!this.created_at) {

        this.created_at = now;
    }
    next();
});

userSchema.index({

    coordinates: '2dsphere'
});

//Routes will go here
module.exports = mongoose.model('users', userSchema);