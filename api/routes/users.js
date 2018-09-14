// //Mongoose
// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
//
// var users = mongoose.model('users');
// var email  = require('../../config/email.js');
// var config = require('../../config/config.js');
//
// var ObjectId = mongoose.Types.ObjectId; //Define ObjectId

// router.get('/forgotpassword', function(request, response, next) {
//
//     next();
// });
//
// router.post('/forgotpassword', function(request, response, next) {
//
//     users.find({email:request.body.email}, function(error, user) {
//
//         if (error) {
//
//             response.json({
//
//                 error: true,
//                 error: error.message
//             });
//         } else {
//
//             if (user.length) {
//
//                 //user exists
//                 email.sendHtmlEmail(request.body.email, 'Your '+config.app.name+' Password Reset Instructions.!', '<table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="500" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table width="500" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="420" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" valign="top" style="font-size:17px; line-height:24px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;"> You have just requested a password reset for the '+config.app.name+' account with email address <a style="color: #4585f3; text-decoration:none" class="hover" target="_blank" rel="external">'+user[0].email+'</a>.</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center"> <table cellspacing="0" cellpadding="0"> <tbody> <tr> <td bgcolor="#da4030" style="border-radius:45px"> <a href="'+config.app.url+'/changepassword/'+user[0].id+'" style="font-family:Helvetica,Arial,sans-serif; font-size: 17px;color:#ffffff;text-decoration:none;display:inline-block;padding:12px 40px;border-style: solid; border-width: 1px; border-color: #cf2d2d; border-radius: 45px;background-color: #da4030;background: -webkit-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -moz-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -o-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: -ms-linear-gradient(top, #e04f42 0%, #d0352c 100%); background: linear-gradient(to bottom, #e04f42 0%, #d0352c 100%);font-weight:bold" target="_blank" class="devicebutton" rel="external">Reset Password</a> </td> </tr> </tbody> </table> </td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" height="15" valign="top" style="border-top:1px solid #e6e6e6;font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-size:17px; line-height:26px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">Thank you for using '+config.app.name+'!</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align="center" width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td align="center"> <table width="500" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 20px;color: #7f7f7f; padding-left: 45px; padding-right: 45px">© 2018 '+config.app.name+'</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table>');
//
//                 response.json({
//
//                     error: false,
//                     message: 'Your password reset instructions successfully sent on your email address!'
//                 });
//             } else {
//
//                 //user not exists
//                 response.json({
//
//                     error: true,
//                     message: 'Please try again and make sure you enter the email address associated with your '+config.app.name+' account.'
//                 });
//             }
//         }
//     });
// });
//
// router.get('/changepassword', function(request, response, next) {
//
//     next();
// });
//
// router.post('/changepassword', function(request, response, next) {
//
//     users.find({email:request.body.email, password: request.body.oldPassword}, function(error, user) {
//
//         if (error) {
//
//             response.json({
//
//                 error: true,
//                 error: error.message
//             });
//         } else {
//
//             if (user.length) {
//
//                 //user exists
//                 var newPassword = request.body.newPassword;
//                 if (newPassword) {
//
//                     users.update({email:request.body.email}, {password: newPassword}, function (error, user) {
//
//                         email.sendHtmlEmail(request.body.email, 'Your '+config.app.name+' password has been reset!', '<table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="500" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td> <table width="500" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="center"> <table width="420" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" valign="top" style="font-size:17px; line-height:24px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;"> The password for your '+config.app.name+' account <a style="color: #4585f3; text-decoration:none" class="hover" target="_blank" rel="external">'+request.body.email+'</a> was successfully reset.</td> </tr> <tr> <td colspan="2" height="15" align="center" style="font-size:1px;line-height:1px;">&nbsp;</td> </tr> <tr> <td align="left" height="15" valign="top" style="border-top:1px solid #e6e6e6;font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-size:17px; line-height:26px; font-family:Helvetica Neue, Arial, sans-serif; color:#666666; font-weight:normal;">Thank you for using '+config.app.name+'!</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <table align="center" width="100%" bgcolor="#f2f2f2" cellpadding="0" cellspacing="0" border="0"> <tbody> <tr> <td align="center"> <table width="500" cellpadding="0" cellspacing="0" border="0" align="center"> <tbody> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> <tr> <td align="center" valign="top" style="font-family: Helvetica, arial, sans-serif; font-size: 13px; line-height: 20px;color: #7f7f7f; padding-left: 45px; padding-right: 45px">© 2018 '+config.app.name+'</td> </tr> <tr> <td align="left" height="15" valign="top" style="font-size:1px; line-height:1px;">&nbsp;</td> </tr> </tbody> </table> </td> </tr> </tbody> </table>');
//
//                         response.json({
//
//                             error: false,
//                             message: 'Your '+config.app.name+' password has been reset!'
//                         });
//                     });
//                 } else {
//
//                     response.json({
//
//                         error: false,
//                         message: 'Provide new password!'
//                     });
//                 }
//             } else {
//
//                 //user not exists
//                 response.json({
//
//                     error: true,
//                     message: 'Incorrect credentials.'
//                 });
//             }
//         }
//     });
// });
//
// router.get('/logout', function(request, response, next) {
//
//     response.json({
//
//         error: false,
//         message: 'Your are successfully logout!.'
//     });
// });
//
//
// module.exports = router;

'use strict';
var users = require('../controllers/users.js');

module.exports = function(app) {

    //Registration
    app.route('/register').post(users.registeration);

    //Login
    app.route('/mobile_login').get(users.mobileLogin);
    app.route('/email_login').get(users.emailLogin);

    //Forgot Password
    app.route('/forgot_password').post(users.forgotPassword);

    //User Listing
    app.route('/user_list').post(users.userList);
};