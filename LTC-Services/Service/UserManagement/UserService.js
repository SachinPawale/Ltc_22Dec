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

    router.route('/GetAllUser')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();

            var param = {
                attributes: ['Id', 'LoginId', 'EmpCode', 'EmpName', 'EmailId', 'IsActive'],
                include: [
                    { model: UserRoleMap, attributes: ['RoleId'], include: [{ model: RoleMst, attributes: ['Code'] }] },
                ],
                order: [['CreatedDate']]
            };

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUser', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of User', Data: null });
                });
        });

    router.route('/GetAllActiveUser')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = { where: { IsActive: true }, attributes: ['Id', 'LoginId', 'EmpName'] };

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllActiveUser', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                });
        });

    router.route('/GetUserById/:Id')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();

            var param = {
                where: { Id: req.params.Id },
                include: [
                    { model: UserRoleMap, attributes: ['RoleId'], include: [{ model: RoleMst, attributes: ['Code'] }] },
                ],
                order: [['ModifiedDate']]
            };

            dataaccess.FindOne(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetUserById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                });

        });

    router.route('/FindAllUsers/:Text')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = {
                where: { IsActive: true, EmpName: { [connect.Op.iLike]: req.params.Text + '%' } },
                attributes: ['Id', 'LoginId', 'EmpName']
            };
            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'FindAllUsers', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                });

        });

    router.route('/CheckDuplicateUser/:Value/:Id')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = {
                where: { LoginId: { [connect.Op.iLike]: req.params.Value }, Id: { [connect.Op.ne]: req.params.Id } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('LoginId')), 'Count']]
            };

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'User already exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User does not exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('UserService', 'CheckDuplicateUser', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                    });
        });

    router.route('/CreateUser')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                var loginid = "";
                var password = "";
                if (!req.body.ADUser) {
                    loginid = req.body.LoginId;
                    password = commonfunc.RandomString(8, '#aA');
                }
                else {
                    password = '1';
                }
                const UserMst = datamodel.UserMst();
                var values = {
                    ADUser: req.body.ADUser,
                    LoginId: req.body.LoginId,
                    EmpCode: req.body.EmpCode,
                    EmpName: req.body.EmpName,
                    EmailId: req.body.EmailId,
                    DefaultRoleId: req.body.DefaultRoleId,
                    Password: password,
                    IsActive: req.body.IsActive,
                    CreatedBy: req.body.UserId,
                    CreatedByRoleId: req.body.UserUserId,
                    ModifiedBy: req.body.UserId,
                    ModifiedByRoleId: req.body.UserUserId,
                };
                dataaccess.CreateWithTransaction(UserMst, values, trans)
                    .then(function (result) {
                        if (result != null) {

                            const UserRoleMap = datamodel.UserRoleMap();
                            var mapRoles = [];
                            var promiseRoles = req.body.RoleId.map(function (mapitem) { mapRoles.push({ UserId: result.Id, RoleId: mapitem }); });

                            Promise.all(promiseRoles).then(function () {
                                dataaccess.BulkCreateWithTransaction(UserRoleMap, mapRoles, trans)
                                    .then((roleresult) => {

                                        trans.commit();

                                        if (!req.body.ADUser) {
                                            var toEmail = req.body.EmailId;
                                            var subject = 'New user created';
                                            var templateData = { loginid: loginid, password: password, ui_url: mailer.ui_url };
                                            mailer.sendMail(
                                                undefined,
                                                undefined,
                                                'notification',
                                                undefined,
                                                toEmail,
                                                undefined,
                                                undefined,
                                                subject,
                                                'UserMaster/NewUser',
                                                templateData
                                            ).then(function (emailresult) {
                                                console.log(emailresult);
                                            });
                                        }
                                        res.status(200).json({ Success: true, Message: 'User saved successfully', Data: result });
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('UserService', 'CreateUser', err);
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                        });
                            });
                        }

                    }, function (err) {
                        trans.rollback();
                        dataconn.errorlogger('UserService', 'CreateUser', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    });
            });
        });

    router.route('/UpdateUser')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                const UserMst = datamodel.UserMst();
                var values = {
                    ADUser: req.body.ADUser,
                    LoginId: req.body.LoginId,
                    EmpCode: req.body.EmpCode,
                    EmpName: req.body.EmpName,
                    EmailId: req.body.EmailId,
                    IsActive: req.body.IsActive,
                    DefaultRoleId: req.body.DefaultRoleId,
                    ModifiedBy: req.body.UserId,
                    ModifiedByUserId: req.body.UserUserId,
                    ModifiedDate: connect.sequelize.fn('NOW'),
                };
                var param = { Id: req.body.Id };

                dataaccess.UpdateWithTransaction(UserMst, values, param, trans)
                    .then(function (result) {
                        if (result != null) {


                            const UserRoleMap = datamodel.UserRoleMap();
                            var roledeleteresult = { UserId: req.body.Id };

                            dataaccess.DeleteWithTransaction(UserRoleMap, roledeleteresult, trans)
                                .then(function (roledeleteresult) {

                                    var mapRoles = [];
                                    var promisesRoles = req.body.RoleId.map(function (mapitem) { mapRoles.push({ UserId: req.body.Id, RoleId: mapitem }); });

                                    Promise.all(promisesRoles).then(function () {
                                        dataaccess.BulkCreateWithTransaction(UserRoleMap, mapRoles, trans)
                                            .then((roleresult) => {
                                                trans.commit();
                                                res.status(200).json({ Success: true, Message: 'User updated successfully', Data: result });
                                            }, function (err) {
                                                trans.rollback();
                                                dataconn.errorlogger('UserService', 'UpdateUser', err);
                                                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                            });
                                    });
                                }, function (err) {
                                    trans.rollback();
                                    dataconn.errorlogger('UserService', 'UpdateUser', err);
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                });
                        };
                    });
            });
        });


    router.route('/GetAllUserList')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();
            var param = { attributes: ['LoginId', 'EmpCode', 'EmpName'] };

            dataaccess.FindAll(UserMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetAllUserList', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of User', Data: null });
                });
        });

    router.route('/CheckActiveUser/:Id')
        .get(function (req, res) {

            const UserMst = datamodel.UserMst();

            var param = { where: { UserId: req.params.Id, IsActive: true } };

            Promise.all([
                dataaccess.FindAndCountAll(UserMst, param)
            ]).then(function (Users) {
                if (Users != null && Users.count > 0) {
                    res.status(200).json({ Success: true, Message: 'Can not deactivate this User, its already used in user master', Data: true });
                }
                else {
                    res.status(200).json({ Success: false, Message: 'Can deactivate, User is not used', Data: false });
                }
            }).catch(err => {
                dataconn.errorlogger('UserService', 'CheckActiveUser', err);
                res.status(200).json({ Success: false, Message: 'User has no access of BG', Data: null });
            });
        });

    router.route("/GetUserRolesById/:Id")
        .get(function (req, res) {

            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();
            var param = {
                where: { UserId: req.params.Id },
                include: [{ model: RoleMst, attributes: ['Id', 'Code'], where: { IsActive: true } }]
            };

            dataaccess.FindAll(UserRoleMap, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User data access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of User data', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'GetUserRolesById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of User data', Data: null });
                });
        });

    router.route("/UpdateUserDefaultRole")
        .post(function (req, res) {

            const UserMst = datamodel.UserMst();

            var values = { DefaultRoleId: req.body.RoleId };
            var param = { Id: req.body.UserId };

            dataaccess.Update(UserMst, values, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'User Default Role updated successfully', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of User data', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('UserService', 'UpdateUserDefaultRole', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of User data', Data: null });
                });
        });

    return router;
};

module.exports = routes;