//Files & Modules
var config = require('../../resources/config.js');
var message = require('../../resources/messages.js');

//Models
var mongoose = require('mongoose');
var users = mongoose.model('users');
var offers = mongoose.model('offers');
var chats = mongoose.model('chats');
var deals = mongoose.model('deals');

//Controllers
var users_controller = require('./users.js');
var chats_controller = require('./chats.js');
var notifications_controller = require('./notifications.js');

//Define ObjectId
var object_id = mongoose.Types.ObjectId;

//Node Packages
//Firebase
//The Firebase Admin SDK allows you to integrate your own backend services with Firebase Cloud Messaging (FCM).
var firebase_admin = require("firebase-admin");
var json_path = "../../resources/firebase/"+ config.firebase.jsonfile;
var service_account = require(json_path);

//Firebase Initialization
firebase_admin.initializeApp({

    credential: firebase_admin.credential.cert(service_account),
    databaseURL: ""
});

var options = {

    priority: "high",
    timeToLive: 60 * 60 *24
};

exports.associated_options = options;

// #Chat Action
exports.sendMessage = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['to_user_id', 'for_user_id', 'body'];

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

        var to_user = request.body.to_user_id;
        var for_user = request.body.for_user_id;
        var body = request.body.body;

        //Receiver
        if (object_id.isValid(to_user)) {

            users.find({_id:to_user}, function(error, result_to) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        error: message.serverErrorOccurred
                    });
                } else {

                    if (result_to.length) {

                        // Receiver exists
                        // Sender
                        if (object_id.isValid(for_user)) {

                            users.find({_id:for_user}, function(error, result_for) {

                                if (error) {

                                    response.json({

                                        error: true,
                                        error_description: error.message,
                                        error: message.serverErrorOccurred
                                    });
                                } else {

                                    if (result_for.length) {

                                        var request_params = JSON.stringify(result_to[0]);
                                        var to_user_details = JSON.parse(request_params);

                                        var request_params = JSON.stringify(result_for[0]);
                                        var for_user_details = JSON.parse(request_params);

                                        var user_cloudkey = to_user_details['cloud_key'];

                                        var chat = {

                                            for_user: for_user,
                                            to_user: to_user,
                                            body: body,
                                        };
                                        var new_chat = new chats(chat);

                                        new_chat.save(function(error, chat) {

                                            if (error) {

                                                response.json({

                                                    error: true,
                                                    error_description: error.message,
                                                    error: message.serverErrorOccurred
                                                });
                                            } else {

                                                // For send notification
                                                var payload = {
                                                    notification: {

                                                        title: for_user_details['name'],
                                                        body: body
                                                    }, data: {

                                                        for_user_id: for_user,
                                                        to_user_id: to_user,
                                                        body: body
                                                    }
                                                };

                                                chats_controller.sendReceiverMessage(user_cloudkey, payload, chats_controller.associated_options, function (error, response) {

                                                    if (error) {

                                                        console.log("Error sending message:", error);
                                                    } else {

                                                        console.log("Successfully sent message:", response);
                                                    }
                                                });

                                                response.json({

                                                    error: false,
                                                    message: message.chatSaved
                                                });
                                            }
                                        });
                                    } else {

                                        // Sender not exists
                                        response.json({

                                            error: true,
                                            message: message.invalidSender
                                        });
                                    }
                                }
                            });
                        } else {

                            // Sender not exists
                            response.json({

                                error: true,
                                message: message.invalidSender
                            });
                        }
                    } else {

                        // Receiver not exists
                        response.json({

                            error: true,
                            message: message.invalidReceiver
                        });
                    }
                }
            });
        } else {

            // Receiver not exists
            response.json({

                error: true,
                message: message.invalidReceiver
            });
        }
    }
};

exports.chatList = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['to_user_id', 'for_user_id'];

    var sender_id = request.query.for_user_id;
    var receiver_id = request.query.to_user_id;
    var offer_id = request.query.offer_id;

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

        // Sender
        if (object_id.isValid(sender_id)) {

            users.find({_id:sender_id}, function(error, for_user) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        message: message.serverErrorOccurred
                    });
                } else {

                    if (for_user.length) {

                        // Sender exists
                        // Receiver
                        if (object_id.isValid(receiver_id)) {

                            users.find({_id:receiver_id}, function(error, to_user) {

                                if (error) {

                                    response.json({

                                        error: true,
                                        error_description: error.message,
                                        message: message.serverErrorOccurred
                                    });
                                } else {

                                    if (to_user.length) {

                                        // Receiver exists
                                        // Offer
                                        if (offer_id) {

                                            if (object_id.isValid(offer_id)) {

                                                offers.find({_id:offer_id}, function(error, for_offer) {

                                                    if (error) {

                                                        response.json({

                                                            error: true,
                                                            error_description: error.message,
                                                            error: message.serverErrorOccurred
                                                        });
                                                    } else {

                                                        if (for_offer.length) {

                                                            // Offer exists
                                                            chats_controller.getChat(sender_id, receiver_id, function (result) {

                                                                if (result['chats']) {

                                                                    var array_chats = new Array();
                                                                    array_chats.push.apply(array_chats, result['chats']);

                                                                    deals.findOne({ for_user: sender_id, to_user: receiver_id, offer_id: offer_id }, function(error, deal) {

                                                                        if (!deal) {

                                                                            var offer_params = JSON.stringify(for_offer[0]);
                                                                            var offer_details = JSON.parse(offer_params);

                                                                            var offer_creator = offer_details['offer_by'];

                                                                            if (offer_creator != sender_id) {

                                                                                // Deal exists
                                                                                var last_chat = {

                                                                                    for_user: sender_id,
                                                                                    to_user: receiver_id,
                                                                                    body: message.confirmMeetingMessage,
                                                                                    take_action: 1
                                                                                };
                                                                                array_chats.push(last_chat);
                                                                            }

                                                                            response.json({

                                                                                error: false,
                                                                                chats: array_chats,
                                                                                message: message.chatListed
                                                                            });
                                                                        }
                                                                    });
                                                                } else {

                                                                    response.json(result);
                                                                }
                                                            });
                                                        } else {

                                                            // Offer not exists
                                                            response.json({

                                                                error: true,
                                                                message: message.invalidOffer
                                                            });
                                                        }
                                                    }
                                                });
                                            } else {

                                                // Offer not exists
                                                response.json({

                                                    error: true,
                                                    message: message.invalidOffer
                                                });
                                            }
                                        } else {

                                            chats_controller.getChat(sender_id, receiver_id, function (result) {

                                                response.json(result);
                                            });
                                        }
                                    } else {

                                        // Receiver not exists
                                        response.json({

                                            error: true,
                                            message: message.invalidReceiver
                                        });
                                    }
                                }
                            });
                        } else {

                            // Receiver not exists
                            response.json({

                                error: true,
                                message: message.invalidReceiver
                            });
                        }
                    } else {

                        // Sender not exists
                        response.json({

                            error: true,
                            message: message.invalidSender
                        });
                    }
                }
            });
        } else {

            // Sender not exists
            response.json({

                error: true,
                message: message.invalidSender
            });
        }
    }
};

exports.chatUserList = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['user_id'];

    var sender_id = request.query.user_id;

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
   
    
};

if (error) {

    // Required field(s) are missing or empty
    response.json({

        "error" : true,
        "message" : 'Required field(s) ' + error_fields + 'is missing or empty!'
    });
} else {

    // Sender
    if (object_id.isValid(sender_id)) {

        users.find({_id:sender_id}, function(error, for_user) {

            if (error) {

                response.json({

                    error: true,
                    error_description: error.message,
                    message: message.serverErrorOccurred
                });
            } else { 
                if (for_user.length) {

                    // Sender exists
                    // To sender
                    chats.aggregate([{ $group: {  _id: { for_user: '$for_user', to_user: sender_id } } }], function(error, chat_users) {

                        if (error) {

                            response.json({

                                error: true,
                                error_description: error.message,
                                message: message.serverErrorOccurred
                            });
                        } else {
                            var array_chat_users = new Array();
                                chat_users.forEach(function(element){

                                    var current_id = element['_id']['for_user'];
                                    if (!array_chat_users.includes(current_id)) {

                                        array_chat_users.push(current_id);
                                    }
                                });

                                // For sender
                                chats.aggregate([{ $group: {  _id: { for_user: sender_id, to_user:'$to_user'  } } }], function(error, chat_users) {

                                    if (error) {

                                        response.json({
                                            error: true,
                                            error_description: error.message,
                                            message: message.serverErrorOccurred
                                        }); 
                                    } else {

                                        chat_users.forEach(function(element){

                                            var current_id = element['_id']['to_user'];
                                            if (!array_chat_users.includes(current_id)) {

                                                array_chat_users.push(current_id);
                                            }
                                        }); 
                                       
                                        // Remove self from list
                                        var sender_id_index = array_chat_users.indexOf(sender_id);
                                        array_chat_users.splice(sender_id_index, 1);

                                        var chat_user_details = new Array();
                                        for (var i = 0; i <array_chat_users.length; i++) {

                                            users_controller.getUserById(array_chat_users[i], function (error, user_details) {

                                                if (user_details) {

                                                    chat_user_details.push(users_controller.formatUsers(user_details, false));
                                                
                                                }

                                                if (array_chat_users[array_chat_users.length-1] == chat_user_details[chat_user_details.length-1]['user_id']) {

                                                    response.json({

                                                        error: false,
                                                        chats: chat_user_details,
                                                        message: message.chatUsersListed
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }).sort({created_at:1});
                            }
                        }).sort({created_at:1});
                    }
                
                
            }
           
        });
       
    }


}


