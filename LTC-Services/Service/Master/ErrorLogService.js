var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {

    router.route('/GetAllErrorLog')
        .get(function (req, res) {

            const ErrorLog = datamodel.ErrorLog();
            var param = {
                attributes: ['Id', 'ServiceName', 'FunctionName', 'CreatedDate'],
                order: [['CreatedDate']]
            };

            dataaccess.FindAll(ErrorLog, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'ErrorLog Access', Data: result });
                    }
                    else {
                        res.status(200).json({
                            Success: false, Message: 'User has no access of ErrorLog', Data: null
                        });
                    }
                }, function (err) {
                    dataconn.errorlogger('ErrorLogService', 'GetAllErrorLog', err);
                    res.status(200).json({
                        Success: false, Message: 'user has no access of ErrorLog', Data: null
                    });
                });
        });

        router.route('/GetErrorLogById/:Id')
        .get(function (req, res) {

            const ErrorLogMst = datamodel.ErrorLog();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(ErrorLogMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'ErrorLog access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of ErrorLog', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('ErrorLogService', 'GetErrorLogById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of ErrorLog', Data: null });
                });

        });

        return router;
};

module.exports = routes;