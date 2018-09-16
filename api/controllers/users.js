var mongoose = require('mongoose');
var users = mongoose.model('users');
var offers = mongoose.model('offers');
var email  = require('../../config/email.js');
var config = require('../../config/config.js');
var message = require('../messages.js');
var validator = require('validator');
var ObjectId = mongoose.Types.ObjectId; //Define ObjectId

//# Gerenal
exports.registeration = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['name', 'image', 'email', 'mobile', 'password', 'location', 'latitude', 'longitude'];

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

        users.findOne({email:request.body.email}, function(error, user) {

            if (!error && user) {

                response.json({

                    error: true,
                    message : message.userExisted
                });
            } else {

                var new_user = new users(request.body);
                new_user.coordinates = [ parseFloat(request.body.latitude), parseFloat(request.body.longitude) ];

                new_user.save(function(error, user) {

                    if (error) {

                        response.json({

                            error: true,
                            error_description: error.message,
                            error: message.serverErrorOccurred
                        });
                    } else {

                        email.sendHtmlEmail(request.body.email, 'Welcome to '+config.app.name+'!', '<table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="500" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table width="500" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="420" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" valign="top" style="font-size:17px; line-height:24px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;"> <a href="'+config.app.url+'" style="color: #4585f3; text-decoration:none" class="hover" target="_blank" rel="external">'+config.app.name+'</a> is a mobile cross-platform application that allows users to exchange FIAT for cryptocurrencies and viceversa using the nearby function like localbitcoins you can see the offers around you and pick your one.</td> </tr> <tr> <td align="left" height="15" valign="top" style="border-top:1px solid #e6e6e6;font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-size:17px; line-height:26px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">Thank you for using '+config.app.name+'!</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align="center" width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td align="center"> <table width="500" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 20px;color: #7f7f7f; padding-left: 45px; padding-right: 45px">© 2018 '+config.app.name+'</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table>');

                        response.json({

                            error: false,
                            message: message.userCreated
                        });
                    }
                });
            }
        });
    }
};

exports.mobileLogin = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['mobile'];

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

        users.find({mobile:request.query.mobile}, function(error, user) {

            if (error) {

                response.json({

                    error: true,
                    error_description: error.message,
                    error: message.serverErrorOccurred
                });
            } else {

                if (user.length) {

                    // User exists
                    // Update Pin
                    var generated_pin = Math.floor(1000 + Math.random() * 9000);

                    users.update({pin:generated_pin}, function (error, user) {

                        if (error) {

                            response.json({

                                error: true,
                                error_description: error.message,
                                message: message.serverErrorOccurred
                            });
                        } else {

                            response.json({

                                error: false,
                                verification_data: { pin: generated_pin },
                                message: message.verificationPinInstructions
                            });
                        }
                    });
                } else {

                    // User not exists
                    response.json({

                        error: true,
                        message: message.loginFailed
                    });
                }
            }
        });
    }
};

exports.verifyPin = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['source', 'pin'];

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

        var source = request.body.source;
        var pin = request.body.pin;

        if (validator.isEmail(source)) {

            users.find({email:source, pin:pin}, function(error, user) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        error: message.serverErrorOccurred
                    });
                } else {

                    if (user.length) {

                        // User exists
                        response.json({

                            error: false,
                            user : formatUser(user[0], false),
                            message: message.successVerified
                        });
                    } else {

                        // User not exists
                        response.json({

                            error: true,
                            message: messgae.invalidPin
                        });
                    }
                }
            });
        } else {

            //Locale identifier consists of at least a language identifier and a region identifier.
            if (validator.isMobilePhone(source, 'any')) {

                users.find({mobile:source, pin:pin}, function(error, user) {

                    if (error) {

                        response.json({

                            error: true,
                            error_description: error.message,
                            error: message.serverErrorOccurred
                        });
                    } else {

                        if (user.length) {

                            // User exists
                            response.json({

                                error: false,
                                user : formatUser(user[0], false),
                                message: message.successVerified
                            });
                        } else {

                            // User not exists
                            response.json({

                                error: true,
                                message: message.invalidPin
                            });
                        }
                    }
                });
            } else {

                response.json({

                    "error" : true,
                    message: 'Please make sure you enter the mobile associated with your '+config.app.name+' account.'
                });
            }
        }
    }
};

exports.emailLogin = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['email', 'password'];

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

        users.find({email:request.query.email, password:request.query.password}, function(error, user) {

            if (error) {

                response.json({

                    error: true,
                    error_description: error.message,
                    error: message.serverErrorOccurred
                });
            } else {

                if (user.length) {

                    // User exists
                    response.json({

                        error: false,
                        user : formatUser(user[0], false),
                        message: message.loginSuccess
                    });
                } else {

                    // User not exists
                    response.json({

                        error: true,
                        message: message.loginFailed
                    });
                }
            }
        });
    }
};

exports.forgotPassword = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['source'];

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

        var source = request.body.source;

        console.log(validator.isEmail(source));

        if (validator.isEmail(source)) {

            users.find({email:source}, function(error, user) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        error: message.serverErrorOccurred
                    });
                } else {

                    if (user.length) {

                        // User exists
                        email.sendHtmlEmail(source, 'Your '+config.app.name+' Password Reset Instructions.!', '<table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="500" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table width="500" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="420" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" valign="top" style="font-size:17px; line-height:24px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;"> You have just requested a password reset for the '+config.app.name+' account with email address <a style="color: #4585f3; text-decoration:none" class="hover" target="_blank" rel="external">'+user[0].email+'</a>.</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center"> <table cellspacing="0" cellpadding="0"> <tbody> <tr> <td bgcolor="#da4030" style="border-radius:45px"> <a href="'+config.app.url+'/changepassword/'+user[0].id+'" style="font-family:Helvetica,Arial,sans-serif; font-size: 17px;color:#ffffff;text-decoration:none;display:inline-block;padding:12px 40px;border-style: solid; border-width: 1px; border-color: #cf2d2d; border-radius: 45px;background-color: #da4030;background: -webkit-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -moz-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -o-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -ms-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: linear-gradient(to bottom, #e04f42 0%, #d0352c 100%);font-weight:bold" target="_blank" class="devicebutton" rel="external">Reset Password</a> </td> </tr> </tbody> </table> </td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" height="15" valign="top" style="border-top:1px solid #e6e6e6;font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-size:17px; line-height:26px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">Thank you for using '+config.app.name+'!</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align="center" width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td align="center"> <table width="500" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 20px;color: #7f7f7f; padding-left: 45px; padding-right: 45px">© 2018 '+config.app.name+'</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table>');

                        response.json({

                            error: false,
                            message:message.passwordResetInstructions
                        });
                    } else {

                        // User not exists
                        response.json({

                            error: true,
                            message: 'Please try again and make sure you enter the email address associated with your '+config.app.name+' account.'
                        });
                    }
                }
            });
        } else {

            //Locale identifier consists of at least a language identifier and a region identifier.
            if (validator.isMobilePhone(source, 'any')) {

                users.find({mobile:source}, function(error, user) {

                    if (error) {

                        response.json({

                            error: true,
                            error_description: error.message,
                            error: message.serverErrorOccurred
                        });
                    } else {

                        if (user.length) {

                            // Update Pin
                            var generated_pin = Math.floor(1000 + Math.random() * 9000);

                            users.update({pin:generated_pin}, function (error, user) {

                                if (error) {

                                    response.json({

                                        error: true,
                                        error_description: error.message,
                                        message: message.serverErrorOccurred
                                    });
                                } else {

                                    response.json({

                                        error: false,
                                        verification_data: { pin: generated_pin },
                                        message: message.verificationPinInstructions
                                    });
                                }
                            });
                        } else {

                            // User not exists
                            response.json({

                                error: true,
                                message: 'Please try again and make sure you enter the mobile associated with your '+config.app.name+' account.'
                            });
                        }
                    }
                });
            } else {

                response.json({

                    "error" : true,
                    message: 'Please make sure you enter the mobile associated with your '+config.app.name+' account.'
                });
            }
        }
    }
};

exports.userProfile = function(request, response) {

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

        if (ObjectId.isValid(id)) {

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
                        response.json({

                            error: true,
                            user: formatUser(user[0], true),
                            error: message.userProfilRetrevied
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

exports.changePassword = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['source', 'old_password', 'new_password'];

    var oldPassword = request.body.old_password;
    var newPassword = request.body.new_password;
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

        var source = request.body.source;

        if (validator.isEmail(source)) {

            users.find({email:source, password:oldPassword}, function(error, user) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        error: message.serverErrorOccurred
                    });
                } else {

                    if (user.length) {

                        // User exists
                        users.update({email:source}, {password: newPassword}, function (error, user) {

                            if (error) {

                                response.json({

                                    error: true,
                                    error_description: error.message,
                                    message: message.serverErrorOccurred
                                });
                            } else {

                                email.sendHtmlEmail(source, 'Your '+config.app.name+' password has been reset!', '<table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="500" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table width="500" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="420" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" valign="top" style="font-size:17px; line-height:24px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;"> The password for your '+config.app.name+' account <a style="color: #4585f3; text-decoration:none" class="hover" target="_blank" rel="external">'+source+'</a> was successfully reset.</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" height="15" valign="top" style="border-top:1px solid #e6e6e6;font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-size:17px; line-height:26px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">Thank you for using '+config.app.name+'!</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align="center" width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td align="center"> <table width="500" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 20px;color: #7f7f7f; padding-left: 45px; padding-right: 45px">© 2018 '+config.app.name+'</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table>');

                                response.json({

                                    error: false,
                                    message: 'Your '+config.app.name+' password has been reset!'
                                });
                            }
                        });
                    } else {

                        // User not exists
                        response.json({

                            error: true,
                            message: message.incorrectCredentials
                        });
                    }
                }
            });
        } else {

            //Locale identifier consists of at least a language identifier and a region identifier.
            if (validator.isMobilePhone(source, 'any')) {

                users.find({email:source, password:oldPassword}, function(error, user) {

                    if (error) {

                        response.json({

                            error: true,
                            error_description: error.message,
                            error: message.serverErrorOccurred
                        });
                    } else {

                        if (user.length) {

                            // User exists
                            users.update({mobile:source}, {password: newPassword}, function (error, user) {

                                if (error) {

                                    response.json({

                                        error: true,
                                        error_description: error.message,
                                        message: message.serverErrorOccurred
                                    });
                                } else {

                                    response.json({

                                        error: false,
                                        message: 'Your '+config.app.name+' password has been reset!'
                                    });
                                }
                            });
                        } else {

                            // User not exists
                            response.json({

                                error: true,
                                message: message.incorrectCredentials
                            });
                        }
                    }
                });
            } else {

                response.json({

                    "error" : true,
                    message: 'Please make sure you enter the mobile associated with your '+config.app.name+' account.'
                });
            }
        }
    }
};

exports.updatePassword = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['user_id', 'old_password', 'new_password'];

    var id = request.body.user_id;
    var old_password = request.body.old_password;
    var new_password = request.body.new_password;

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

        if (ObjectId.isValid(id)) {

            users.find({_id:id, password:old_password}, function(error, user) {

                if (error) {

                    response.json({

                        error: true,
                        error_description: error.message,
                        error: message.serverErrorOccurred
                    });
                } else {

                    if (user.length) {

                        // User exists
                        users.update({_id:id}, {password:new_password}, function (error, user) {

                            if (error) {

                                response.json({

                                    error: true,
                                    error_description: error.message,
                                    message: message.serverErrorOccurred
                                });
                            } else {

                                response.json({

                                    error: false,
                                    message: message.passwordUpdated
                                });
                            }
                        });
                    } else {

                        // User not exists
                        response.json({

                            error: true,
                            message: message.incorrectCredentials
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

exports.updateLanguage = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['user_id', 'language', 'language_code'];

    var id = request.body.user_id;
    var language = request.body.language;
    var language_code = request.body.language_code; //A language code is a code that assigns letters or numbers as identifiers or classifiers for languages. ISO 639 is a set of international standards that lists short codes for language names. The complete list of three-letter codes defined in part two (ISO 639-2) of the standard, including the corresponding two-letter (ISO 639-1) codes where they exist.

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

        if (ObjectId.isValid(id)) {

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
                        users.update({_id:id}, {language:language, language_code: language_code}, function (error, user) {

                            if (error) {

                                response.json({

                                    error: true,
                                    error_description: error.message,
                                    message: message.serverErrorOccurred
                                });
                            } else {

                                response.json({

                                    error: false,
                                    message: message.languageUpdated
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

exports.updateLocation = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['user_id', 'location', 'latitude', 'longitude'];

    var id = request.body.user_id;
    var location = request.body.location;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;

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

        if (ObjectId.isValid(id)) {

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
                        var coordinates = [ parseFloat(latitude), parseFloat(longitude) ];
                        users.update({_id:id}, {location:location, latitude: latitude, longitude: longitude,  coordinates: coordinates}, function (error, user) {

                            if (error) {

                                response.json({

                                    error: true,
                                    error_description: error.message,
                                    message: message.serverErrorOccurred
                                });
                            } else {

                                response.json({

                                    error: false,
                                    message: message.locationUpdated
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

//# Users
exports.userList = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['latitude', 'longitude', 'distance'];

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

        // Grab all of the query parameters from the body.
        var latitude = request.query.latitude;
        var longitude = request.query.longitude;
        var distance = request.query.distance;

        var query = users.find({'type':'Point'});

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
        query.exec(function(error, associate_users) {

            if (error) {

                response.json({

                    error: true,
                    error_description: error.message,
                    error: message.serverErrorOccurred
                });
            } else {

                var array_users = new Array();
                for (var i = 0; i < associate_users.length; i++) {

                    array_users.push(formatUser(associate_users[i], true));
                }

                response.json({

                    error: false,
                    user: array_users,
                    message:message.userListed
                });
            }
        });
    }
};

// Format Users
function formatUser (user, isOffers) {

    var user_params = JSON.stringify(user);
    var user_details = JSON.parse(user_params);

    var user_id = user_details['_id'];

    if (isOffers) {
        console.log(getUserOffers(user_id));
    }

    var user = {

        user_id: user_id,
        name: user_details['name'],
        email: user_details['email'],
        mobile: user_details['mobile'],
        image: user_details['image'],
        location: user_details['location'],
        latitude: user_details['latitude'],
        longitude: user_details['longitude'],
        language: user_details['language'],
        language_code: user_details['language_code'],
        created_at: user_details['created_at'],
        updated_at: user_details['updated_at'],
        status: user_details['status'],
        offers: null,
    };

    return user;
}

function getUserOffers(user_id) {

    offers.find({offer_by:user_id}, function(error, resultOffers) {

        return resultOffers;
    });
}