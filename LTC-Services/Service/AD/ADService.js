var express = require('express');
var router = express.Router();
var activedirectory = require('../../Common/ActiveDirectory');
var dataconn = require('../../Data/DataConnection');

var routes = function () {

    router.route('/FindUsers/:Text')
        .get(function (req, res) {
            var opts = {
                filter: '(&(objectClass=person)(objectClass=user)(|(cn=' + req.params.Text + '*)|(description=' + req.params.Text + '*)|(mail=' + req.params.Text + '*)))',
                entryParser: function (entry, raw, callback) {
                    if (entry.ignore) return (null);
                    callback(entry);
                }
            };
            activedirectory.findUsers(opts, false, function (err, users) {
                if (err) {
                    dataconn.errorlogger('ADService', 'FindUsers', err);
                }

                if ((!users) || (users.length == 0)) {
                    res.status(200).json({ Success: false, Message: 'No users found', Data: [{ displayName: 'No users found' }] });
                }
                else {
                    res.status(200).json({ Success: true, Message: users.length + 'users found', Data: users });
                }
            });
        });

    router.route('/FindUser/:Text')
        .get(function (req, res) {

            var sAMAccountName = req.params.Text;
            activedirectory.findUser(sAMAccountName, true, function (err, user) {
                if (err) {
                    dataconn.errorlogger('ADService', 'FindUser', err);
                }

                if (!user) {
                    res.status(200).json({ Success: false, Message: 'User ' + req.params.Text + ' not found', Data: null });
                }
                else {
                    res.status(200).json({ Success: true, Message: 'User found', Data: user });
                }
            });
        });

    router.route('/FindUserWithManager/:Text')
        .get(function (req, res) {

            var sAMAccountName = req.params.Text;

            activedirectory.findUser(sAMAccountName, true, function (err, user) {

                if (err) {
                    dataconn.errorlogger('ADService', 'FindUserWithManager', err);
                }

                if (!user) {
                    res.status(200).json({ Success: false, Message: 'User ' + req.params.Text + ' not found', Data: null });
                }
                else {
                    var managerdn = user.manager;
                    activedirectory.findUser(managerdn, false, function (err, manager){
                        if(err){
                            dataconn.errorlogger('ADService' , 'FindUserWithManager', err);
                        }
                        res.status(200).json({ Success:true, Message: 'User found', Data: [{User: user, Manager: manager}] });
                    });
                }
            });
        });
        return router;
};

module.exports = routes;