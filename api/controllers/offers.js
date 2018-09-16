var mongoose = require('mongoose');
var users = mongoose.model('users');
var offers = mongoose.model('offers');
var cryptocurrencies = mongoose.model('cryptocurrencies');
var email  = require('../../config/email.js');
var config = require('../../config/config.js');
var message = require('../messages.js');
var objectId = mongoose.Types.ObjectId; //Define ObjectId

// #offers
exports.createOffer = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['user_id', 'quantity', 'currency_id', 'type', 'location', 'latitude', 'longitude', 'exchange_rate'];

    var id = request.body.user_id;
    var quantity = request.body.quantity;
    var currency_id = request.body.currency_id;
    var type = request.body.type;
    var location = request.body.location;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var rate = request.body.exchange_rate

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

        if (objectId.isValid(id)) {

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
                        if (objectId.isValid(currency_id)) {

                            cryptocurrencies.find({_id:currency_id}, function(error, currency) {

                                if (error) {

                                    response.json({

                                        error: true,
                                        error_description: error.message,
                                        error: message.serverErrorOccurred
                                    });
                                } else {

                                    if (currency.length) {

                                        // Currency exists
                                        var request_params = JSON.stringify(user[0]);
                                        var user_details = JSON.parse(request_params);

                                        var currency_params = JSON.stringify(currency[0]);
                                        var currency_details = JSON.parse(currency_params);

                                        var offer_description = '';
                                        if (type == 's') {

                                            offer_description = user_details['name'] +" want to sell "+ quantity +" "+ currency_details['currency'] +" at "+ rate +" "+currency_details['currency_symbol'];
                                        } else if (type == 'b') {

                                            offer_description = user_details['name']+ " want to buy "+ quantity +" "+ currency_details['currency'] +" at "+ rate +" "+currency_details['currency_symbol'];
                                        }
                                        var offer = {

                                            offer_by: user_details['_id'],
                                            offer: offer_description,
                                            quantity: parseInt(quantity),
                                            currency: currency_details['currency'],
                                            unit: currency_details['currency_symbol'],
                                            offer_type: type,
                                            location: location,
                                            latitude: latitude,
                                            longitude: longitude,
                                            exchange_rate: rate
                                        };

                                        var new_offer = new offers(offer);
                                        new_offer.coordinates = [ parseFloat(latitude), parseFloat(longitude) ];

                                        new_offer.save(function(error, offer) {

                                            if (error) {

                                                response.json({

                                                    error: true,
                                                    error_description: error.message,
                                                    message: message.serverErrorOccurred
                                                });
                                            } else {

                                                response.json({

                                                    error: false,
                                                    message: message.offerCreated
                                                });
                                            }
                                        });
                                    } else {

                                        // Currency not exists
                                        response.json({

                                            error: true,
                                            message: message.invalidCurrency
                                        });
                                    }
                                }
                            });
                        } else {

                            // Currency not exists
                            response.json({

                                error: true,
                                message: message.invalidCurrency
                            });
                        }
                    } else {

                        // User not exists
                        response.json({

                            error: true,
                            message: message.invalidUser
                        });
                    }
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
};

exports.offerList = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['user_id'];

    var id = request.query.user_id;

    var error = false;
    var error_fields = "";

    var request_params = JSON.stringify(request.query);
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

        if (objectId.isValid(id)) {

            users.find({_id:id}, function(error, user) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        message: message.serverErrorOccurred
                    });
                } else {

                    if (user.length) {

                        // User exists
                        offers.find({offer_by:id}, function(error, offers) {

                            if (error) {

                                response.json({

                                    error: true,
                                    error_description: error.message,
                                    message: message.serverErrorOccurred
                                });
                            } else {

                                var array_offers = new Array();
                                for (var i = 0; i < offers.length; i++) {

                                    array_offers.push(formatOffers(offers[i]));
                                }

                                response.json({

                                    error: false,
                                    offers: array_offers,
                                    message: message.offerListed
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
        } else {

            // User not exists
            response.json({

                error: true,
                message: message.invalidUser
            });
        }
    }
};

// Format Offers
function formatOffers (offer) {

    var offer_params = JSON.stringify(offer);
    var offer_details = JSON.parse(offer_params);
    console.log(offer_details);

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