var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var dataconn = require('../../Data/DataConnection');
var datamodel = require("../../Data/DataModel");
var dataaccess = require("../../Data/DataAccess");

var routes = function() {
    router.route('/GetAllPlan')
        .get(function(req, res) {

            const PlanMaster = datamodel.PlanMaster();
            var param = {
                attributes: [
                    'Id', 'PlanName', 'MinimumBrokerage', 'MinimumRevenue', 'MinimumPayout',
                    'FreedomPack', 'BeginnerPack', 'ProfessionalPack', 'BrokerageTill1L',
                    'BrokerageTill3L', 'BrokerageTill5L', 'BrokerageAbove5L', 'FlatBrokerage',
                    'FD', 'PL', 'CC', 'MF', 'OtherProducts', 'IsActive', 'CreatedBy', 'CreatedDate',
                    'ModifiedBy', 'ModifiedDate'
                ],
                order: [
                    ['Id']
                ]
            };

            dataaccess.FindAll(PlanMaster, param)
                .then(function(result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'PlanMaster Access', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User has no access of PlanMaster', Data: null });
                    }
                }, function(err) {
                    dataconn.errorlogger('PlanMasterService', 'GetAllPlan', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PlanMaster', Data: null });
                });
        });

    router.route('/GetAllActivePlan')
        .get(function(req, res) {

            const PlanMaster = datamodel.PlanMaster();
            var param = {
                where: { IsActive: true },
                attributes: [
                    'Id', 'PlanName', 'MinimumBrokerage', 'MinimumRevenue', 'MinimumPayout',
                    'FreedomPack', 'BeginnerPack', 'ProfessionalPack', 'BrokerageTill1L',
                    'BrokerageTill3L', 'BrokerageTill5L', 'BrokerageAbove5L', 'FlatBrokerage',
                    'FD', 'PL', 'CC', 'MF', 'OtherProducts', 'IsActive', 'CreatedBy', 'CreatedDate',
                    'ModifiedBy', 'ModifiedDate'
                ]
            };

            dataaccess.FindAll(PlanMaster, param)
                .then(function(result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Plan access', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Plan', Data: null });
                    }
                }, function(err) {
                    dataconn.errorlogger('PlanMasterService', 'GetAllActivePlan', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Plan', Data: null });
                });
        });

    router.route('/GetPlanById/:Id')
        .get(function(req, res) {

            const PlanMaster = datamodel.PlanMaster();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(PlanMaster, param)
                .then(function(result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Plan access', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Plan', Data: null });
                    }
                }, function(err) {
                    dataconn.errorlogger('PlanMasterService', 'GetPlanById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Plan', Data: null });
                });

        });

    router.route('/CheckDuplicatePlan/:Value/:Id')
        .get(function(req, res) {

            const PlanMaster = datamodel.PlanMaster();
            var param = {
                where: {
                    PlanName: req.params.Value,
                    Id: {
                        [connect.Op.ne]: req.params.Id
                    }
                },
                attributes: [
                    [connect.sequelize.fn('count', connect.sequelize.col('PlanName')), 'Count']
                ]
            };

            dataaccess.FindAll(PlanMaster, param)
                .then(function(result) {
                        if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                            res.status(200).json({ Success: true, Message: 'Plan already exists', Data: true });
                        } else {
                            res.status(200).json({ Success: false, Message: 'Plan does not exists', Data: false });
                        }
                    },
                    function(err) {
                        dataconn.errorlogger('PlanMasterService', 'CheckDuplicatePlan', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of Plan', Data: null });
                    });
        });

    router.route('/CreatePlan')
        .post(function(req, res) {

            const PlanMaster = datamodel.PlanMaster();
            var values = {
                PlanName: req.body.PlanName,
                MinimumBrokerage: req.body.MinimumBrokerage,
                MinimumRevenue: req.body.MinimumRevenue,
                MinimumPayout: req.body.MinimumPayout,
                FreedomPack: req.body.FreedomPack,
                BeginnerPack: req.body.BeginnerPack,
                ProfessionalPack: req.body.ProfessionalPack,
                BrokerageTill1L: req.body.BrokerageTill1L,
                BrokerageTill3L: req.body.BrokerageTill3L,
                BrokerageTill5L: req.body.BrokerageTill5L,
                BrokerageAbove5L: req.body.BrokerageAbove5L,
                FlatBrokerage: req.body.FlatBrokerage,
                FD: req.body.FD,
                PL: req.body.PL,
                CC: req.body.CC,
                MF: req.body.MF,
                OtherProducts: req.body.OtherProducts,
                IsActive: req.body.IsActive,
                CreatedBy: req.body.UserId,
                CreatedByRoleId: req.body.UserRoleId,
                CreatedDate: connect.sequelize.fn('NOW'),
            };
            dataaccess.Create(PlanMaster, values)
                .then(function(result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Plan saved successfully', Data: result });
                    } else {
                        dataconn.errorlogger('PlanMasterService', 'CreatePlan', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function(err) {
                    dataconn.errorlogger('PlanMasterService', 'CreatePlan', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdatePlan')
        .post(function(req, res) {

            const PlanMaster = datamodel.PlanMaster();
            var values = {
                PlanName: req.body.PlanName,
                MinimumBrokerage: req.body.MinimumBrokerage,
                MinimumRevenue: req.body.MinimumRevenue,
                MinimumPayout: req.body.MinimumPayout,
                FreedomPack: req.body.FreedomPack,
                BeginnerPack: req.body.BeginnerPack,
                ProfessionalPack: req.body.ProfessionalPack,
                BrokerageTill1L: req.body.BrokerageTill1L,
                BrokerageTill3L: req.body.BrokerageTill3L,
                BrokerageTill5L: req.body.BrokerageTill5L,
                BrokerageAbove5L: req.body.BrokerageAbove5L,
                FlatBrokerage: req.body.FlatBrokerage,
                FD: req.body.FD,
                PL: req.body.PL,
                CC: req.body.CC,
                MF: req.body.MF,
                OtherProducts: req.body.OtherProducts,
                IsActive: req.body.IsActive,
                ModifiedBy: req.body.UserId,
                ModifiedByRoleId: req.body.UserRoleId,
                ModifiedDate: connect.sequelize.fn('NOW'),
            };
            var param = { Id: req.body.Id };
            dataaccess.Update(PlanMaster, values, param)
                .then(function(result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Plan updated successfully', Data: result });
                    } else {
                        dataconn.errorlogger('PlanMasterService', 'UpdatePlan', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function(err) {
                    dataconn.errorlogger('PlanMasterService', 'UpdatePlan', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });
        });

    router.route('/BulkUpload')
        .post(function(req, res) {

            var bulkdata = req.body.data;
            var UserId = req.body.UserId;
            var UserRoleId = req.body.UserRoleId;

            if (bulkdata) {
                var bulkRequest = new Promise((resolve, reject) => {
                    async.eachOfSeries(bulkdata, (bd, next) => {

                            const PlanMaster = datamodel.PlanMaster();
                            dataaccess.FindAll(PlanMaster)
                                .then(function(result) {
                                    var values = {
                                        PlanName: bd.PlanName,
                                        MinimumBrokerage: bd.MinimumBrokerage,
                                        MinimumRevenue: bd.MinimumRevenue,
                                        MinimumPayout: bd.MinimumPayout,
                                        FreedomPack: bd.FreedomPack,
                                        BeginnerPack: bd.BeginnerPack,
                                        ProfessionalPack: bd.ProfessionalPack,
                                        BrokerageTill1L: bd.BrokerageTill1L,
                                        BrokerageTill3L: bd.BrokerageTill3L,
                                        BrokerageTill5L: bd.BrokerageTill5L,
                                        BrokerageAbove5L: bd.BrokerageAbove5L,
                                        FlatBrokerage: bd.FlatBrokerage,
                                        FD: bd.FD,
                                        PL: bd.PL,
                                        CC: bd.CC,
                                        MF: bd.MF,
                                        OtherProducts: bd.OtherProducts,
                                        IsActive: bd.Status.toLowerCase().trim() == 'active' ? true : false,
                                        CreatedBy: UserId,
                                        CreatedByRoleId: UserRoleId,
                                        ModifiedBy: UserId,
                                        ModifiedByRoleId: UserRoleId,
                                    };

                                    dataaccess.Create(PlanMaster, values)
                                        .then(function(results) {
                                            if (results != null) {
                                                next();
                                            } else {
                                                next({ Success: false, Message: 'Error occurred while saving records', Data: null });
                                            }
                                        }, function(err) {
                                            dataconn.errorlogger('PlanMasterService', 'BulkUpload', err);
                                            next(err);

                                        });
                                }, function(err) {
                                    dataconn.errorlogger('PlanMasterService', 'BulkUpload', err);
                                    next(err);

                                });
                        },
                        err => {
                            if (err) reject(err);
                            else resolve(bulkdata);
                        });
                });

                bulkRequest.then((data) => {
                    res.status(200).json({ Success: true, Message: 'All plans saved successfully', Data: data });
                }).catch((err) => {
                    dataconn.errorlogger('PlanMasterService', 'BulkUpload', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });

            } else {
                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
            }
        });

    router.route('/GetAllPlanList')
        .get(function(req, res) {

            const PlanMaster = datamodel.PlanMaster();
            var param = {
                attributes: ['Id', 'PlanName', 'IsActive']
            };

            dataaccess.FindAll(PlanMaster, param)
                .then(function(result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'PlanMaster access', Data: result });
                    } else {
                        res.status(200).json({ Success: false, Message: 'User has no access of PlanMaster', Data: null });
                    }
                }, function(err) {
                    dataconn.errorlogger('PlanMasterService', 'GetAllPlanList', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of PlanMaster', Data: null });
                });
        });

    return router;
};

module.exports = routes;