'use strict';
var users = require('../controllers/users.js');
var feedbacks = require('../controllers/feedbacks.js');
var offers = require('../controllers/offers.js');
var notifications = require('../controllers/notifications.js');

module.exports = function(app) {

    //# General
        //Registration
        app.route('/users/register/').post(users.registeration);

        //Login
        app.route('/users/mobile_login').get(users.mobileLogin);
        app.route('/users/email_login').get(users.emailLogin);

        //Verify Pin
        app.route('/users/verify_pin/').post(users.verifyPin);

        //Forgot Password
        app.route('/users/forgot_password').post(users.forgotPassword);

        //Change Password
        app.route('/users/change_password/').post(users.changePassword);

        //Update Password
        app.route('/users/update_password/').post(users.updatePassword);

        //Change Password
        app.route('/users/change_language/').post(users.changeLanguage);

        //Change Location
        app.route('/users/change_location/').post(users.changeLocation);

        //Profile
        app.route('/users/get_profile').get(users.userProfile);

    //# Users
        //User Listing
        app.route('/users/user_list').get(users.userList);

    //# Others
        //Feedback
        app.route('/feedbacks/').post(feedbacks.createFeedback);

    //# Notifications
        //Notification Listing
        app.route('/notifications').get(notifications.notificationList);

    //# Offers
        //Offer Listing
        app.route('/offers').get(offers.offerList);

        //Offer Listing
        app.route('/create_offer').post(offers.createOffer);
};