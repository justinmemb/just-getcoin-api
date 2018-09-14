'use strict';
var mongoose = require('mongoose');
require('mongoose-double')(mongoose);
var SchemaTypes = mongoose.Schema.Types;

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
        type: SchemaTypes.Double,
    },
    latitude: {
        type: SchemaTypes.Double,
    },
    longitude: {
        type: SchemaTypes.Double,
    },
    language: {
        type: String,
    },
    pin: {
        type: String,
    },
    created_at: {
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

//Routes will go here
module.exports = mongoose.model('users', userSchema);