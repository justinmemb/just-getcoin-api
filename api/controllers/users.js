
var mongoose = require('mongoose');
var users = mongoose.model('users');
var email  = require('../../config/email.js');
var config = require('../../config/config.js');
var message = require('../messages.js');
var validator = require('validator');

exports.registeration = function(request, response) {

    // Verify Required Parameters
    var required_fields = ['name', 'image', 'email', 'mobile', 'password', 'location', 'latitude', 'longitude', 'language'];

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
                new_user.save(function(error, user) {

                    if (error) {

                        response.json({

                            error: true,
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
                    error: message.serverErrorOccurred
                });
            } else {

                if (user.length) {

                    // User exists
                    response.json({

                        error: false,
                        user : user,
                        message: message.verificationPinInstructions
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

        if (validator.isEmail(source)) {

            users.find({email:source}, function(error, user) {

                if (error) {

                    response.json({

                        error: true,
                        error: message.serverErrorOccurred
                    });
                } else {

                    if (user.length) {

                        // User exists
                        email.sendHtmlEmail(request.body.email, 'Your '+config.app.name+' Password Reset Instructions.!', '<table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="500" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table width="500" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="420" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" valign="top" style="font-size:17px; line-height:24px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;"> You have just requested a password reset for the '+config.app.name+' account with email address <a style="color: #4585f3; text-decoration:none" class="hover" target="_blank" rel="external">'+user[0].email+'</a>.</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center"> <table cellspacing="0" cellpadding="0"> <tbody> <tr> <td bgcolor="#da4030" style="border-radius:45px"> <a href="'+config.app.url+'/changepassword/'+user[0].id+'" style="font-family:Helvetica,Arial,sans-serif; font-size: 17px;color:#ffffff;text-decoration:none;display:inline-block;padding:12px 40px;border-style: solid; border-width: 1px; border-color: #cf2d2d; border-radius: 45px;background-color: #da4030;background: -webkit-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -moz-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -o-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -ms-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: linear-gradient(to bottom, #e04f42 0%, #d0352c 100%);font-weight:bold" target="_blank" class="devicebutton" rel="external">Reset Password</a> </td> </tr> </tbody> </table> </td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" height="15" valign="top" style="border-top:1px solid #e6e6e6;font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-size:17px; line-height:26px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">Thank you for using '+config.app.name+'!</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align="center" width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td align="center"> <table width="500" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 20px;color: #7f7f7f; padding-left: 45px; padding-right: 45px">© 2018 '+config.app.name+'</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table>');

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

                // Update Pin
                var generated_pin = Math.floor(1000 + Math.random() * 9000);

                users.update({pin:generated_pin}, function (error, user) {

                    if (error) {

                        response.json({

                            error: true,
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

                response.json({

                    "error" : true,
                    message: 'Please make sure you enter the mobile associated with your '+config.app.name+' account.'
                });
            }
        }
    }
};

exports.userList = function(request, response) {

    users.find({}, function(error, associate_users) {

        if (error) {

            response.json({

                error: true,
                error: message.serverErrorOccurred
            });
        } else {

            response.json({

                error: false,
                user: associate_users,
                message:message.userListed
            });
        }
    });
};