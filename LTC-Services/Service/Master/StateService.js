 
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

    router.route('/GetAllState')
        .get(function (req, res) {

            const StateMst = datamodel.StateMst();
            var param = { attributes: ['Id', 'StateCode', 'Desc', 'IsActive'], order: [['Id']] };

            dataaccess.FindAll(StateMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'State Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('StateService', 'GetAllState', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of State', Data: null });
                });
        });

    router.route('/GetAllActiveState')
        .get(function (req, res) {

            const StateMst = datamodel.StateMst();
            var param = { where: { IsActive: true }, attributes: ['Id', 'StateCode','Desc'] };

            dataaccess.FindAll(StateMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'State access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('StateService', 'GetAllActiveState', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                });
        });

    router.route('/GetStateById/:Id')
        .get(function (req, res) {

            const StateMst = datamodel.StateMst();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(StateMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'State access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('StateService', 'GetStateById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                });

        });

    router.route('/CheckDuplicateState/:Value/:Id')
        .get(function (req, res) {

            const StateMst = datamodel.StateMst();
            var param = {
                where: { StateCode: req.params.Value, Id: { [connect.Op.ne]: req.params.Id } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('StateCode')), 'Count']]
            };

            dataaccess.FindAll(StateMst, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'State already exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'State does not exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('StateService', 'CheckDuplicateState', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                    });
        });

    router.route('/CreateState')
        .post(function (req, res) {

            const StateMst = datamodel.StateMst();
            var values = {
                StateCode: req.body.StateCode.toString().trim(),
                Desc: req.body.Desc,
                IsActive: req.body.IsActive,
                CreatedBy: req.body.UserId,
                CreatedByRoleId: req.body.UserRoleId,
            };
            dataaccess.Create(StateMst, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'State saved successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('StateService', 'CreateState', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('StateService', 'CreateState', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateState')
        .post(function (req, res) {

            const StateMst = datamodel.StateMst();
            var values = {
                StateCode: req.body.StateCode.toString().trim(),
                Desc: req.body.Desc,
                IsActive: req.body.IsActive,
                ModifiedBy: req.body.UserId,
                ModifiedByRoleId: req.body.UserRoleId,
                ModifiedDate: connect.sequelize.fn('NOW'),
            };
            var param = { Id: req.body.Id };
            dataaccess.Update(StateMst, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'State updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('StateService', 'UpdateState', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('StateService', 'UpdateState', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/BulkUpload')
        .post(function (req, res) {

            var bulkdata = req.body.data;
            var UserId = req.body.UserId;
            var UserRoleId = req.body.UserRoleId;

            if (bulkdata) {
                var bulkRequest = new Promise((resolve, reject) => {
                    async.eachOfSeries(bulkdata, (bd, next) => {

                        const StateMst = datamodel.StateMst();

                        dataaccess.FindAll(VendorMst)
                            .then(function (result) {

                                var values = {
                                    StateCode: bd.StateCode.toString().trim(),
                                    Desc: bd.Desc,
                                    IsActive: bd.Status.toLowerCase().trim() == 'active' ? true : false,
                                    CreatedBy: UserId,
                                    CreatedByRoleId: UserRoleId,
                                    ModifiedBy: UserId,
                                    ModifiedByRoleId: UserRoleId,
                                };

                                dataaccess.Create(StateMst, values)
                                    .then(function (results) {
                                        if (results != null) {
                                            next();
                                        }
                                        else {
                                            next({ Success: false, Message: 'Error occurred while saving records', Data: null });
                                        }
                                    }, function (err) {
                                        dataconn.errorlogger('StateService', 'BulkUpload', err);
                                        next(err);

                                    });
                            }, function (err) {
                                dataconn.errorlogger('StateService', 'BulkUpload', err);
                                next(err);

                            });
                    },
                        err => {
                            if (err) reject(err);
                            else resolve(bulkdata);
                        });
                });

                bulkRequest.then((data) => {
                    res.status(200).json({ Success: true, Message: 'All states saved successfully', Data: data });
                }).catch((err) => {
                    dataconn.errorlogger('StateService', 'BulkUpload', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });

            } else {
                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
            }
        });

    router.route('/GetAllStateList')
        .get(function (req, res) {

            const StateMst = datamodel.StateMst();
            var param = { attributes: ['StateCode'] };

            dataaccess.FindAll(StateMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'State access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('StateService', 'GetAllStateList', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of State', Data: null });
                });
        });


    return router;;
};

module.exports = routes;