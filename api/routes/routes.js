'use strict';
var users = require('../controllers/users.js');
var feedbacks = require('../controllers/feedbacks.js');
var offers = require('../controllers/offers.js');
var notifications = require('../controllers/notifications.js');
var cryptocurrencies = require('../controllers/cryptocurrencies.js');
var others = require('../controllers/others.js');

module.exports = function(app) {

    //# General
        //Registration
        app.route('/users/register/').post(users.registeration);

        //Login
        app.route('/users/login/mobile').get(users.mobileLogin);
        app.route('/users/login/email').get(users.emailLogin);

        //Verify Pin
        app.route('/users/verify/pin/').post(users.verifyPin);

        //Forgot Password
        app.route('/users/password/forgot/').post(users.forgotPassword);

        //Change Password
        app.route('/users/password/change/').post(users.changePassword);

        //Update Password
        app.route('/users/update/password/').post(users.updatePassword);

        //Change Password
        app.route('/users/update/language/').post(users.updateLanguage);

        //Change Location
        app.route('/users/update/location/').post(users.updateLocation);

        //Profile
        app.route('/users/profile').get(users.userProfile);

    //# Users
        //User Listing
        app.route('/users/list').get(users.userList);

    //# Others
        //Feedback
        app.route('/feedbacks/create/').post(feedbacks.createFeedback);

    //# Notifications
        //Notification Listing
        app.route('/notifications/list').get(notifications.notificationList);

    //# Offers
        //Offer Listing
        app.route('/offers').get(offers.offerList);

        //Offer Listing
        app.route('/offers/create/').post(offers.createOffer);

    //# Crypto Currencies
        //Currency Listing
        app.route('/currency').get(cryptocurrencies.listCryptoCurrencies);

        //Offer Listing
        app.route('/currency/create/').post(cryptocurrencies.createCryptoCurrencies);

    //# Crypto Currencies
        //Currency Listing
        app.route('/cryptocurrency/marketprice/').get(others.marketPrices);
};