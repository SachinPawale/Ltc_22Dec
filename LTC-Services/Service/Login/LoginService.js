var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');

var routes = function () {

    router.route('/AuthenticateUser')
        .post(function (req, res) {

            const UserMst = datamodel.UserMst();
            const UserRoleMap = datamodel.UserRoleMap();
            const RoleMst = datamodel.RoleMst();

            var param = {
                where: { LoginId: { [connect.Op.eq]: req.body.UserName }, IsActive: true },
                attributes: ['Id', 'LoginId', 'EmpCode', 'EmpName', 'EmailId', 'DefaultRoleId'],
                include: [
                    { model: UserRoleMap, attributes: ['RoleId'], include: [{ model: RoleMst, attributes: ['Code', 'IsCentralAccess'], where: { IsActive: true } }] },
                ]
            };
            dataaccess.FindOne(UserMst, param)
                .then(function (userresult) {
                    if (userresult != null) {
                        var param = {
                            where: { LoginId: { [connect.Op.eq]: req.body.UserName }, Password: { [connect.Op.eq]: req.body.Password } },
                            attributes: ['LoginId']
                        };

                        dataaccess.FindOne(UserMst, param)
                            .then(function (result) {
                                if (result != null) {
                                    res.status(200).json({ Success: true, Message: 'Authenticated', Data: userresult });
                                }
                                else {
                                    res.status(200).json({ Success: false, Message: 'You have entered an invalid username and password', Data: null });
                                }
                            }, function (err) {
                                dataconn.errorlogger('LoginService', 'AuthenticateUser', err);
                                res.status(200).json({ Success: false, Message: 'User does not exists in the system', Data: null });
                            });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User does not exists in the system', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('LoginService', 'AuthenticateUser', err);
                    res.status(200).json({ Success: false, Message: 'User does not exists in the system', Data: null });
                });
        });

    return router;
};







module.exports = routes;