var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var mailer = require('../../Common/Mailer');
var commonfunc = require('../../Common/CommonFunctions');
var async = require('async');
var promise = connect.Sequelize.Promise;

var routes = function () {
    router.route('/UserTrackJourney')
        .post(function (req, res) {

            const UserJourney = datamodel.UserJourney();
            var values = {
                UserId: req.body.UserId,
                EventName: req.body.EventName,
                RequestBody: req.body.RequestBody,
                ResponseBody: req.body.ResponseBody
            };
            dataaccess.Create(UserJourney, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ success: true, message: 'User Tracking Journey Saved Successfully', data: result })
                    }
                    else {
                        dataconn.errorlogger('UserJourneyService', 'UserJourney', { message: 'No object found', stack: '' })
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('UserJourneyService', 'UserJourney', err);
                    }
                )
        })
    return router;
};
module.exports = routes;