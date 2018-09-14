'use strict';
var mongoose = require('mongoose');

//users
var userSchema = mongoose.Schema({
    firstName:{
        type: String,
        required: "First name field cann't be empty."
    },
    lastName:{
        type: String,
        required: "Last name field cann't be empty."
    },
    mobile:{
        type: String,
        required: "Mobile number field cann't be empty."
    },
    email:{
        type: String,
        required: "Email field cann't be empty."
    },
    password:{
        type: String,
        required: "Password field cann't be empty."
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