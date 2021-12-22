var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var mailer = require('../../Common/Mailer');
var commonfunc = require('../../Common/CommonFunctions');
var async = require('async');

var routes = function() {

    router.route('/CheckUserExist')
    .post(function (req, res) {

        const UserMst = datamodel.UserMst();
        var param = {
            where : {
                IsActive:true, 
                ADUser: false,
                [connect.Op.or]: [{ EmailId: {[ connect.Op.iLike] : req.body.EmailId}}, {LoginId: {[connect.Op.iLike]: req.body.LoginId}}]
            }
        };

        dataaccess.FindOne(UserMst, param)
        .then(function (result){
            if(result != null)
            {
                var Id = result.Id;
                var toEmail = result.EmailId;
                var loginid = result.LoginId;
                var password = commonfunc.RandomString(8, '#aA');
                var values = {Password : password};
                var param = {Id: Id};

                dataaccess.Update(UserMst, values, param)
                .then (function (result){
                    if(result != null)
                    {
                        var subject = 'Temporary password generated';
                        var templatedata = {loginid:loginid, password:password, ui_url: mailer.ui_url};
                        mailer.sendmail(
                            undefined,
                            undefined,
                            'notification',
                            undefined,
                            toEmail,
                            undefined,
                            undefined,
                            subject,
                            'Usermaster/NewPassword',
                            templatedata
                        ).then(function (emailresult) {
                            console.log(emailresult);
                        });
                        res.status(200).json({ Success: true, Message: 'New password has been sent to user Email Id', Data: null});
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Error occurred while generating password', Data: null});
                    }},
                    function(err){
                        dataconn.errorlogger('PasswordService', 'CheckUserExixts', err);
                        res.status(200).json({Success: false, Message: 'Error occurred while generating password', Data: null});
                    });

                    }
                    else{
                        res.status(200).json({Success: false, Message: 'User does not exist in the system', Data: null});
                    }
            }, 
            function(err)
            {
                dataconn.errorlogger('PasswordService', 'CheckUserExixts', err);
                res.status(200).json({Success: false, Message: 'User does not exists in the system', Data: null});
            });
        });

        router.route('/UpdatePassword')
        .post(function (req, res) {

            const UserMst = datamodel.UserMst();

            var values = {Password: req.body.Password};
            var param = {Id: req.body.UserId};

            dataaccess.Update(UserMst, values, param)
            .then(function (result) {
                if(result != null){
                    res.status(200).json({Success: true, Message: 'Password changed successfully', Data:result});
                }else
                {
                    dataconn.errorlogger('PasswordService', 'UpdatePassword', { message : 'No object found', stack: '' });
                    res.status(200).json({Success: false, Message: 'Error occurred while updating record', Data: null });
                }
            },
            function(err){
                dataconn.errorlogger('PasswordService', 'UpdatePassword', err);
                res.status(200).json({Success: false, Message: 'Error occurred while updating record', Data: null });
             });
        });
        return router;
};

module.exports = routes;