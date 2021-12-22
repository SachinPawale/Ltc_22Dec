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

    router.route('/GetAllNotifyconfig')
        .get(function (req, res) {

            const NotifyconfigMst = datamodel.NotifyconfigMst();
            const NotifyLobMap = datamodel.NotifyLobMap();
            const NotifyRoleMap = datamodel.NotifyRoleMap();
            const RoleMst = datamodel.RoleMst();
            const LOBMst = datamodel.LOBMst();
            const InventoryTypeMst = datamodel.InventoryTypeMst();

            var param = {
                attributes: ['Id', 'InventoryTypeId', 'TriggerDays', 'FrequencyId', 'TemplateId', 'IsActive'],
                include: [
                    { model: NotifyLobMap, attributes: ['LobId'], include: [{ model: LOBMst, attributes: ['Code'] }] },
                    { model: NotifyRoleMap, attributes: ['RoleId'], include: [{ model: RoleMst, attributes: ['Code'] }] },
                    { model: InventoryTypeMst, attributes: ['Code'] }
                ],

                order: [['CreatedDate']]
            };

            dataaccess.FindAll(NotifyconfigMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Notifyconfig Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Notify config', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('NotifyconfigService', 'GetAllNotifyconfig', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of Notify config', Data: null });
                });
        });

    router.route('/GetAllActiveNotifyconfig')
        .get(function (req, res) {

            const NotifyconfigMst = datamodel.NotifyconfigMst();
            const NotifyLobMap = datamodel.NotifyLobMap();
            const NotifyRoleMap = datamodel.NotifyRoleMap();
            const RoleMst = datamodel.RoleMst();
            const LOBMst = datamodel.LOBMst();
            const InventoryTypeMst = datamodel.InventoryTypeMst();

            var param = {
                where: { IsActive: true },
                attributes: ['Id', 'InventoryTypeId', 'TriggerDays', 'FrequencyId', 'TemplateId', 'IsActive'],
                include: [
                    { model: NotifyLobMap, attributes: ['LobId'], include: [{ model: LOBMst, attributes: ['Code'] }] },
                    { model: NotifyRoleMap, attributes: ['RoleId'], include: [{ model: RoleMst, attributes: ['Code'] }] },
                    { model: InventoryTypeMst, attributes: ['Code'] }
                ],

                order: [['CreatedDate']]
            };

            dataaccess.FindAll(NotifyconfigMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Notify config access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Notify config', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('NotifyconfigService', 'GetAllActiveNotifyconfig', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Notify config', Data: null });
                });
        });

    router.route('/GetNotifyconfigById/:Id')
        .get(function (req, res) {

            const NotifyconfigMst = datamodel.NotifyconfigMst();
            const NotifyLobMap = datamodel.NotifyLobMap();
            const NotifyRoleMap = datamodel.NotifyRoleMap();
            const RoleMst = datamodel.RoleMst();
            const LOBMst = datamodel.LOBMst();
            const InventoryTypeMst = datamodel.InventoryTypeMst();

            var param = {
                where: { Id: req.params.Id },
                attributes: ['Id', 'InventoryTypeId', 'TriggerDays', 'FrequencyId', 'TemplateId', 'IsActive'],
                include: [
                    { model: NotifyLobMap, attributes: ['LobId'], include: [{ model: LOBMst, attributes: ['Code'] }] },
                    { model: NotifyRoleMap, attributes: ['RoleId'], include: [{ model: RoleMst, attributes: ['Code'] }] },
                    { model: InventoryTypeMst, attributes: ['Code'] }
                ],
                order: [['CreatedDate']]
            };

            dataaccess.FindOne(NotifyconfigMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Notify config access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Notify config', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('NotifyconfigService', 'GetNotifyconfigById', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Notify config', Data: null });
                });
        });

    router.route('/CreateNotifyconfig')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                const NotifyconfigMst = datamodel.NotifyconfigMst();
                var values = {
                    FrequencyId: req.body.FrequencyId,
                    TriggerDays: req.body.TriggerDays,
                    TemplateId: req.body.TemplateId,
                    InventoryTypeId: req.body.InventoryTypeId,
                    IsActive: req.body.IsActive,
                    CreatedBy: req.body.UserId,
                    CreatedByRoleId: req.body.UserRoleId,
                };
                dataaccess.CreateWithTransaction(NotifyconfigMst, values, trans)
                    .then(function (result) {
                        if (result != null) {

                            const NotifyLobMap = datamodel.NotifyLobMap();
                            var mapLobs = [];
                            var promisesLobs = req.body.LobId.map(function (mapitem) { mapLobs.push({ NotifyconfigId: result.Id, LobId: mapitem }); });

                            Promise.all(promisesLobs).then(function () {
                                dataaccess.BulkCreateWithTransaction(NotifyLobMap, mapLobs, trans)
                                    .then((lobresult) => {
                                        const NotifyRoleMap = datamodel.NotifyRoleMap();
                                        var mapRoles = [];
                                        var promisesRoles = req.body.RoleId.map(function (mapitem) { mapRoles.push({ NotifyconfigId: result.Id, RoleId: mapitem }); });

                                        Promise.all(promisesRoles).then(function () {

                                            dataaccess.BulkCreateWithTransaction(NotifyRoleMap, mapRoles, trans)
                                                .then((roleresult) => {
                                                    trans.commit();
                                                    res.status(200).json({ Success: true, Message: 'Notify Config saved successfully', Data: result });
                                                },
                                                    function (err) {
                                                        trans.rollback();
                                                        dataconn.errorlogger('NotifyConfigService', 'CreateNotifyConfig', err);
                                                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                                    });
                                        });
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('NotifyConfigService', 'CreateNotifyConfig', err);
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                        });
                            },
                                function (err) {
                                    trans.rollback();
                                    dataconn.errorlogger('NotifyConfigService', 'CreateNotifyConfig', err);
                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                });
                        }
                        else {
                            trans.rollback();
                            dataconn.errorlogger('NotifyConfigService', 'CreateNotifyConfig', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        }
                    },
                        function (err) {
                            trans.rollback();
                            dataconn.errorlogger('NotifyConfigService', 'CreateNotifyConfig', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                        });
            });
        });

    router.route('/UpdateNotifyconfig')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {
                 
            const NotifyconfigMst = datamodel.NotifyconfigMst();
            var values = {
                InventoryTypeId: req.body.InventoryTypeId,
                FrequencyId: req.body.FrequencyId,                
                TriggerDays: req.body.TriggerDays,
                TemplateId: req.body.TemplateId,
                IsActive: req.body.IsActive,
                ModifiedBy: req.body.UserId,
                ModifiedByRoleId: req.body.UserRoleId,
                ModifiedDate: connect.sequelize.fn('NOW'),
            };
            var param = { Id: req.body.Id };

            dataaccess.UpdateWithTransaction(NotifyconfigMst, values, param, trans)
                .then(function (result) {
                    if (result != null) {

                        const NotifyLobMap = datamodel.NotifyLobMap();
                        var lobparams = { NotifyconfigId: req.body.Id };

                        dataaccess.DeleteWithTransaction(NotifyLobMap, lobparams, trans)
                        .then(function(lobdeleteresult) {

                            mapLobs = [];
                            var promisesLobs = req.body.LobId.map(function (mapitem) { mapLobs.push({ NotifyconfigId: req.body.Id, LobId: mapitem }); });

                            Promise.all(promisesLobs).then(function () {
                                dataaccess.BulkCreateWithTransaction(NotifyLobMap, mapLobs, trans)
                                .then((lobresult) => {

                                    const NotifyRoleMap = datamodel.NotifyRoleMap();
                                    var roledeleteresult = { NotifyconfigId: req.body.Id };

                                    dataaccess.DeleteWithTransaction(NotifyRoleMap, roledeleteresult, trans)
                                    .then(function (roledeleteresult) {

                                        var mapRoles = [];
                                        var promisesRoles = req.body.RoleId.map(function (mapitem) { mapRoles.push({ NotifyconfigId: req.body.Id, RoleId: mapitem }); });

                                        Promise.all(promisesRoles).then(function (){
                                            dataaccess.BulkCreateWithTransaction(NotifyRoleMap, mapRoles, trans)
                                            .then((roleresult) => {
                                                trans.commit();
                                                res.status(200).json({ Success: true, Message: 'Notifyconfig updated successfully', Data: result });
                                            }, 
                                            function (err) {
                                                trans.rollback();
                                                dataconn.errorlogger('NotifyconfigService', 'UpdateNotifyconfig', err);
                                                res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                            });
                                        });
                                    });
                                },
                                function (err) {
                                    trans.rollback();
                                    dataconn.errorlogger('NotifyconfigService', 'UpdateNotifyconfig', err);
                                    res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                });
                            });
                        },   function (err) {
                            trans.rollback();
                            dataconn.errorlogger('NotifyconfigService', 'UpdateNotifyconfig', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                        });
                    };
                });
            });
        });
 
    router.route('/GetAllNotifyconfigList')
        .get(function (req, res) {

            const NotifyconfigMst = datamodel.NotifyconfigMst();
            var param = { attributes: ['RoleId'] };

            dataaccess.FindAll(NotifyconfigMst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Notifyconfig access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Notifyconfig', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('NotifyconfigService', 'GetAllNotifyconfigList', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Notifyconfig', Data: null });
                });
        });

    return router;;
};

module.exports = routes;