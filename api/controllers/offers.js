var mongoose = require('mongoose');
var users = mongoose.model('users');
var offers = mongoose.model('offers');
var email  = require('../../config/email.js');
var config = require('../../config/config.js');
var message = require('../messages.js');
var objectId = mongoose.Types.ObjectId; //Define ObjectId

// #offers
exports.createOffer = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['user_id', 'amount', 'currency', 'unit', 'type'];

    var id = request.body.user_id;
    var amount = request.body.amount;
    var currency = request.body.currency;
    var unit = request.body.unit;
    var type = request.body.type;

    var error = false;
    var error_fields = "";

    var request_params = JSON.stringify(request.body);
    var objectValue = JSON.parse(request_params);

    required_fields.forEach(function(element) {

        if (!objectValue[element]) {

            error = true;
            error_fields += element + ', ';
        }
    });

    if (error) {

        // Required field(s) are missing or empty
        response.json({

            "error" : true,
            "message" : 'Required field(s) ' + error_fields + 'is missing or empty!'
        });
    } else {
        if (object_id.isValid(id)) {

            users.find({_id:id}, function(error, user) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        error: message.serverErrorOccurred
                    });
                } else {
                    if (user.length) {



                        // User exists
                        var user_params = JSON.stringify(user[0]);
                        var user_details = JSON.parse(user_params);

                        var feed = {

                            feed_by: user_details['_id'],
                            feed: feed_body
                        };
                        var new_feed = new feedbacks(feed);

                        new_feed.save(function(error, fee){
                            if (error) {

                                response.json({

                                    error: true,
                                    error_description: error.message,
                                    error: message.serverErrorOccurred
                                });
                            } else {
                                email.sendHtmlEmail(config.mail.feedbackemail, 'Feedback on '+ config.app.name +' by '+ user_details['name'] +'!', '<table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="500" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table width="500" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="420" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" valign="top" style="font-size:17px; line-height:24px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">' + feed.feed + '</td> </tr> <tr> <td align="left" height="15" valign="top" style="border-top:1px solid #e6e6e6;font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-size:17px; line-height:26px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">Thank you for using '+config.app.name+'!</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align="center" width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td align="center"> <table width="500" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 20px;color: #7f7f7f; padding-left: 45px; padding-right: 45px">© 2018 '+config.app.name+'</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table>');

                                response.json({

                                    error: false,
                                    message: message.feedSaved
                                });

                            }


                        });
                       
                        

      
                    } else {
                       // User not exists
                       response.json({

                            error: true,
                            message: message.invalidUser
                        }); 
                    } 

                }
               
                
            });
        } else{

            // User not exists
            response.json({

                error: true,
                message: message.invalidUser
            });
        }                


    }



};




exports.feedbackList = function(request, response) {
   
    feedback_controller.getAllFeedbacks(function (error, feedback_details) {

        if (error) {

            response.json({

                error: true,
                feedbacks: null,
                message: message.serverErrorOccurred
            });
        } else {

            response.json({

                error: false,
                feedbacks: feedback_details['feedbacks'].sort({created_at:-1}),
                message: message.feedListed
            });
        }
    });



};


// Get all feedbacks
// exports.getAllFeedbacks = function(callback) {

//     var result;
//     feedbacks.find({}, function(error, result_feeds) {

//         if (error) {

//             result = {

//                 error: true,
//                 error_description: error.message
//             };
//             return callback(result, null);
//         } else {

//             if (result_feeds.length > 0) {

//                 var array_feeds = new Array();
//                 var feedbackCount = 0;
//                 result_feeds.forEach((currentFeed, index, array) => {

//                     asyncFunction(currentFeed, (currentUser) => {

//                         var feedback_details = {};
//                         feedback_details['details'] = feedback_controller.formatFeedbacks(currentFeed);
//                         feedback_details['user'] = users_controller.formatUsers(currentUser, false);
//                         array_feeds.push(feedback_details);
//                         feedbackCount++;

//                         if (feedbackCount === array.length) {

//                             result = {

//                                 error: false,
//                                 feedbacks: array_feeds
//                             };
//                             return callback(null, result);
//                         }
//                     });
//                 });
//             } else {

//                 result = {

//                     error: false,
//                     feedbacks: new Array()
//                 };
//                 return callback(null, result);
//             }
//         }
//     }).sort({created_at:-1});
// };
exports.getAllFeedbacks = function(callback) {

    var result;
    feedbacks.find({}, function(error, result_feeds) {

        if (error) {

            result = {

                error: true,
                error_description: error.message
            };
            return callback(result, null);
        } else {

            if (result_feeds.length > 0) {

                var array_feeds = new Array();
                var feedbackCount = 0;
                result_feeds.forEach((currentFeed, index, array) => {

                    asyncFunction(currentFeed, (currentUser) => {

                    var feedback_details = {};
                    feedback_details['details'] = feedback_controller.formatFeedbacks(currentFeed);
                    feedback_details['user'] = users_controller.formatUsers(currentUser, false);
                    array_feeds.push(feedback_details);
                    feedbackCount++;

                    if (feedbackCount === array.length) {

                        result = {

                            error: false,
                            feedbacks: array_feeds
                        };
                        return callback(null, result);
                    }
                });
            });
            } else {

                result = {

                    error: false,
                    feedbacks: new Array()
                };
                return callback(null, result);
            }
        }
    }).sort({created_at:-1});
};
// Format Feedback
exports.formatFeedbacks = function (feed) {

    var feed_params = JSON.stringify(feed);
    var feed_details = JSON.parse(feed_params);

    var feed_id = feed_details['_id'];

    var feed = {

        feed_id: feed_id,
        feed_by: feed_details['feed_by'],
        feed: feed_details['feed'],
        created_at: feed_details['created_at'],
        updated_at: feed_details['updated_at'],
    };

    return feed;
}

// Users offers
exports.getUserOffers = function(user_id, latitude, longitude, distance, callback) {

    var query = offers.find({'type':'Point', offer_by:user_id}).sort({created_by:-1});

    // Include filter by Max Distance
    if (distance) {

        // Using MongoDB's geospatial querying features.
        query = query.where('coordinates').near({
            center: {
                type: 'Point',
                coordinates: [latitude, longitude]
            },
            // Converting meters to miles
            maxDistance: distance * 1609.34,
            spherical: true
        });
    }

    // Execute Query and Return the Query Results
    query.exec(function(error, result_offers) {

        if (error) {

            return callback(error, null);
        } else {

            var array_offers = new Array();
            for (var i = 0; i < result_offers.length; i++) {

                array_offers.push(offers_controller.formatOffers(result_offers[i]));
            }

            users_controller.getUserById(user_id, function (error, user_details) {

                var offers_details = {};
                offers_details['details'] = users_controller.formatUsers(user_details, false),
                offers_details['offers'] = array_offers
                return callback(null, offers_details);
            });
        }
    });
};



// Get offer by id
exports.getOfferById = function(offer_id, callback) {

    var result;
    if (object_id.isValid(offer_id)) {

        offers.find({_id:offer_id}, function(error, offer) {

            if (error) {

                result = {

                    error: true,
                    message: message.serverErrorOccurred
                };
                return callback(result, null);
            } else {

                if (offer.length) {

                    // Offer exists
                    return callback(null , offers_controller.formatOffers(offer[0]));
                } else {

                    // Offer not exists
                    result = {
                        error: true,
                        message: message.invalidOffer
                    };
                    return callback(result, null);
                }
            }
        });



    } else {

        // User not exists
        result = {

            error: true,
            message: message.invalidUser
        };
        return callback(result, null);
    }
};

// Format Offers
exports.formatOffers = function (offer) {

    var offer_params = JSON.stringify(offer);
    var offer_details = JSON.parse(offer_params);

    var offer_id = offer_details['_id'];

    var offer = {

        offer_id: offer_id,
        type: offer_details['offer_type'],
        status: offer_details['status'],
        created_at: offer_details['created_at'],
        updated_at: offer_details['updated_at'],
        offer_by: offer_details['offer_by'],
        offer: offer_details['offer'],
        quantity: offer_details['quantity'],
        currency: offer_details['currency'],
        unit: offer_details['unit'],
        location: offer_details['location'],
        latitude: offer_details['latitude'],
        longitude: offer_details['longitude'],
        exchange_rate: offer_details['exchange_rate'],
    };

    return offer;
}
