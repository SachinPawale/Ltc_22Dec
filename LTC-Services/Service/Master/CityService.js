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

    router.route('/GetAllCity')
        .get(function (req, res) {

            const CityMst = datamodel.CityMst();
            const StateMst = datamodel.StateMst();

            var param = {
                attributes: ['Id', 'CityCode', 'Desc', 'StateID', 'IsActive'],
                include: [{ model: StateMst, attributes: ['Desc'], where: { IsActive: true } }],
                order: ['Id']
            };

            dataaccess.FindAll(CityMst, param)
                .then(function (result) {
                    if (result != null) {
                    res.status(200).json({ Success: true, Message: 'City Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('CityService', 'GetAllCity', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of City', Data: null });
                });
        });

    router.route('/GetAllActiveCity')
        .get(function (req, res) {

            const CityMst = datamodel.CityMst();
            var param = { where: { IsActive: true }, attributes: ['Id', 'CityCode','Desc'] };

            dataaccess.FindAll(CityMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'City access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('CityService', 'GetAllActiveCity', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                });
        });

    router.route('/GetCityById/:Id')
        .get(function (req, res) {

            const CityMst = datamodel.CityMst();
            const StateMst = datamodel.StateMst();
            var param = {
                attributes: ['Id', 'CityCode', 'Desc', 'StateID', 'IsActive'],
                include: [{ model: StateMst, attributes: ['Desc'] }],
                where: { Id: req.params.Id }  
            }; 

            dataaccess.FindOne(CityMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'City access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('CityService', 'GetCityById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                });

        });

    router.route('/GetCityByStateID/:StateID')
        .get(function (req, res) {

            const CityMst = datamodel.CityMst();
            var StateIDs = [];
            StateIDs = req.params.StateID.split(',');
            
            var param = {
                 where: { IsActive: true, StateID: { [connect.Op.in]: StateIDs }},
                 attributes: ['Id', 'Desc']
            }; 

            dataaccess.FindAll(CityMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'City access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('CityService', 'GetCityByStateID', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                });

        });

    router.route('/CheckDuplicateCity/:Value/:Id')
        .get(function (req, res) {

            const CityMst = datamodel.CityMst();
            var param = {
                where: { CityCode: req.params.Value, Id: { [connect.Op.ne]: req.params.Id } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('CityCode')), 'Count']]
            };

            dataaccess.FindAll(CityMst, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'City already exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'City does not exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('CityService', 'CheckDuplicateCity', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                    });
        });

    router.route('/CreateCity')
        .post(function (req, res) {

            const CityMst = datamodel.CityMst();
            var values = {
                CityCode: req.body.CityCode.toString().trim(),
                Desc: req.body.Desc,
                StateID: req.body.StateID,
                IsActive: req.body.IsActive,
                CreatedBy: req.body.UserId,
                CreatedByRoleId: req.body.UserRoleId,
            };
            dataaccess.Create(CityMst, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'City saved successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('CityService', 'CreateCity', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('CityService', 'CreateCity', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateCity')
        .post(function (req, res) {

            const CityMst = datamodel.CityMst();
            var values = {
                CityCode: req.body.CityCode.toString().trim(),
                Desc: req.body.Desc,
                StateID: req.body.StateID,
                IsActive: req.body.IsActive,
                ModifiedBy: req.body.UserId,
                ModifiedByRoleId: req.body.UserRoleId,
                ModifiedDate: connect.sequelize.fn('NOW'),
            };
            var param = { Id: req.body.Id };
            dataaccess.Update(CityMst, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'City updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('CityService', 'UpdateCity', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('CityService', 'UpdateCity', err);
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

                        const CityMst = datamodel.CityMst();

                        dataaccess.FindAll(CityMst)
                            .then(function (result) {

                                var values = {
                                    CityCode: bd.CityCode.toString().trim(),
                                    Desc: bd.Desc,
                                    StateID: bd.StateID,
                                    IsActive: bd.Status.toLowerCase().trim() == 'active' ? true : false,
                                    CreatedBy: UserId,
                                    CreatedByRoleId: UserRoleId,
                                    ModifiedBy: UserId,
                                    ModifiedByRoleId: UserRoleId,
                                };

                                dataaccess.Create(CityMst, values)
                                    .then(function (results) {
                                        if (results != null) {
                                            next();
                                        }
                                        else {
                                            next({ Success: false, Message: 'Error occurred while saving records', Data: null });
                                        }
                                    }, function (err) {
                                        dataconn.errorlogger('CityService', 'BulkUpload', err);
                                        next(err);

                                    });
                            }, function (err) {
                                dataconn.errorlogger('CityService', 'BulkUpload', err);
                                next(err);

                            });
                    },
                        err => {
                            if (err) reject(err);
                            else resolve(bulkdata);
                        });
                });

                bulkRequest.then((data) => {
                    res.status(200).json({ Success: true, Message: 'All City saved successfully', Data: data });
                }).catch((err) => {
                    dataconn.errorlogger('CityService', 'BulkUpload', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });

            } else {
                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
            }
        });

    router.route('/GetAllCityList')
        .get(function (req, res) {

            const CityMst = datamodel.CityMst();
            var param = { attributes: ['CityCode'] };

            dataaccess.FindAll(CityMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'City access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('CityService', 'GetAllCityList', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
                });
        });

    // router.route('/CheckActiveCity/:Id')
    //     .get(function (req, res) {
        
    //         const UserCityMap = datamodel.UserCityMap();

    //         var param = { where: { CityId: req.params.Id } };

    //         Promise.all([
    //             dataaccess.FindAndCountAll(UserCityMap, param)
    //         ]).then(function (Users) {
    //             if (Users != null && Users.count > 0) {
    //                 res.status(200).json({ Success: true, Message: 'Can not deactivate this City, its already used in user master', Data: true });
    //             }
    //             else {
    //                 res.status(200).json({ Success: false, Message: 'Can deactivate, City is not used', Data: false });
    //             }
    //         }).catch(err => {
    //             dataconn.errorlogger('CityService', 'CheckActiveCity', err);
    //             res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
    //         });
    //     });

    return router;;
};

module.exports = routes;