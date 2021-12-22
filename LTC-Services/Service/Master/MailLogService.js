var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {

    router.route('/GetAllMailLog')
        .get(function (req, res) {

            const MailLog = datamodel.MailLog();
            var param = {
                attributes: ['Id', 'RequestId', 'MailTo', 'MailCC', 'MailSubject', 'MailStatus', 'CreatedDate'],
                order: [['CreatedDate']]
            };

            dataaccess.FindAll(MailLog, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'MailLog Access', Data: result });
                    }
                    else {
                        res.status(200).json({
                            Success: false, Message: 'User has no access of MailLog', Data: null
                        });
                    }
                }, function (err) {
                    dataconn.errorlogger('MailLogService', 'GetAllMailLog', err);
                    res.status(200).json({
                        Success: false, Message: 'user has no access of MailLog', Data: null
                    });
                });
        });

        router.route('/GetMailLogById/:Id')
        .get(function (req, res) {

            const MailLogMst = datamodel.MailLogMst();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(MailLogMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'MailLog access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of MailLog', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('MailLogService', 'GetMailLogById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of MailLog', Data: null });
                });

        });

        return router;
};

module.exports = routes;