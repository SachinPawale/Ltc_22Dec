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

    router.route('/GetAllRole')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { attributes: ['Id', 'Code', 'Desc','IsCentralAccess',  'IsActive'], order: ['Code'] };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllRole', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of Role', Data: null });
                });
        });

    router.route('/GetAllActiveRole')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { where: { IsActive: true }, attributes: ['Id', 'Code'] };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllActiveRole', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                });
        });

    router.route('/GetRoleById/:Id')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetRoleById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                });

        });

    router.route('/CheckDuplicateRole/:Value/:Id')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = {
                where: { Code: req.params.Value, Id: { [connect.Op.ne]: req.params.Id } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('Code')), 'Count']]
            };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'Role already exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'Role does not exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('RoleService', 'CheckDuplicateRole', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                    });
        });

    router.route('/CreateRole')
        .post(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var values = {
                Code: req.body.Code.toString().trim(),
                Desc: req.body.Desc,
                IsCentralAccess:req.body.IsCentralAccess,
                IsActive: req.body.IsActive,
                CreatedBy: req.body.UserId,
                CreatedByRoleId: req.body.UserRoleId,
            };
            dataaccess.Create(RoleMst, values)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role saved successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('RoleService', 'CreateRole', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'CreateRole', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        });

    router.route('/UpdateRole')
        .post(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var values = {
                Code: req.body.Code.toString().trim(),
                Desc: req.body.Desc,
                IsCentralAccess: req.body.IsCentralAccess,
                IsActive: req.body.IsActive,
                ModifiedBy: req.body.UserId,
                ModifiedByRoleId: req.body.UserRoleId,
                ModifiedDate: connect.sequelize.fn('NOW'),
            };
            var param = { Id: req.body.Id };
            dataaccess.Update(RoleMst, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role updated successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('RoleService', 'UpdateRole', { message: 'No object found', stack: '' });
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'UpdateRole', err);
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

                        const RoleMst = datamodel.RoleMst();

                        dataaccess.FindAll(RoleMst)
                            .then(function (result) {

                                var values = {
                                    Code: bd.Code.toString().trim(),
                                    Desc: bd.Desc,
                                    IsCentralAccess: bd.IsCentralAccess.toLowerCase().trim() == "yes" ? true : false,
                                    IsActive: bd.Status.toLowerCase().trim() == 'active' ? true : false,
                                    CreatedBy: UserId,
                                    CreatedByRoleId: UserRoleId,
                                    ModifiedBy: UserId,
                                    ModifiedByRoleId: UserRoleId,
                                };

                                dataaccess.Create(RoleMst, values)
                                    .then(function (results) {
                                        if (results != null) {
                                            next();
                                        }
                                        else {
                                            next({ Success: false, Message: 'Error occurred while saving records', Data: null });
                                        }
                                    }, function (err) {
                                        dataconn.errorlogger('RoleService', 'BulkUpload', err);
                                        next(err);

                                    });
                            }, function (err) {
                                dataconn.errorlogger('RoleService', 'BulkUpload', err);
                                next(err);

                            });
                    },
                        err => {
                            if (err) reject(err);
                            else resolve(bulkdata);
                        });
                });

                bulkRequest.then((data) => {
                    res.status(200).json({ Success: true, Message: 'All roles saved successfully', Data: data });
                }).catch((err) => {
                    dataconn.errorlogger('RoleService', 'BulkUpload', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                });

            } else {
                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
            }
        });

    router.route('/GetAllRoleList')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { attributes: ['Code'] };

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllRoleList', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                });
        });

    router.route('/CheckActiveRole/:Id')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            const UserMst = datamodel.UserMst();

            var param = { where: { RoleId: req.params.Id, IsActive: true } };

            Promise.all([
                dataaccess.FindAndCountAll(UserMst, param)
            ]).then(function (Users) {
                if (Users != null && Users.count > 0) {
                    res.status(200).json({ Success: true, Message: 'Can not deactivate this Role, its already used in user master', Data: true });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Can deactivate, Role is not used', Data: false });
                }
            }).catch(err => {
                dataconn.errorlogger('RoleService', 'CheckActiveRole', err);
                res.status(200).json({ Success: false, Message: 'User has no access of BG', Data: null });
            });
        });

    router.route('/GetAllActiveRoles/:IsCentralAccess')
        .get(function (req, res) {

            const RoleMst = datamodel.RoleMst();
            var param = { where: { IsCentralAccess: false }, attributes: ['Id', 'Code'] };

            if(req.params.IsCentralAccess == "true")
            {
                param = { where: { IsActive: true }, attributes: ['Id', 'Code'] };
            }

            dataaccess.FindAll(RoleMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Role access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('RoleService', 'GetAllActiveRoles', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Role', Data: null });
                });
        });

    return router;;
};

module.exports = routes;