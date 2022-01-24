var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var connect = require('../../Data/Connect');
var express = require('express');
var dataconn = require('../../Data/DataConnection');
var router = express.Router();
var axios = require('axios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var moment = require('moment');
const configuration = require('../../Config');
const emailService = require('../../Common/EmailService');
const path = require('path');
const excelService = require('../../Common/ExcelFile');
const sequelize = connect.sequelize;
const config = require('../../Config');

// var multer = require("multer");
// var upload = multer();
// const fse = require("fs-extra");
// const fs = require("fs");

var routes = function () {

    //Start Routes

    router.route('/GetAllBoENumber')
    .get(function (req, res) {
            const BoEEntry = datamodel.BoEEntry();
            var param = { 
                attributes:['Id','BoENumber','VendorID','VendorName','PONumber','BoEExchangeRate'],
                order: [['Id']] 
            };

            dataaccess.FindAll(BoEEntry, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'BoEEntry Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of BoEEntry', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEDetailsService', 'GetAllBoENumber', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of BoEEntry', Data: null });
                });
    });

    router.route('/GetDetailsByPONumber')
    .post(function (req, res) {
            const BoEMasterDetails = datamodel.BoEMasterDetails();
            var param = { 
                where:{ PO_NUMBER : req.body.PO_NUMBER },
                order: [['Id']] 
            };

            dataaccess.FindAll(BoEMasterDetails, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'BoEMasterDetails Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of BoEMasterDetails', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEDetailsService', 'GetDetailsByPONumber', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of BoEMasterDetails', Data: null });
                });
    });

    router.route('/CreateUserBoEDetails')
    .post(function (req, res) {

        connect.sequelize.transaction().then(trans => {
            const BoEDetails = datamodel.BoEDetails();
            var values = {
                BoENumber: req.body.BoENumber.BoENumber,
                VendorID: req.body.BoENumber.VendorID,
                VendorName: req.body.VendorName,
                PONumber: req.body.PONumber,
                BoEDetailsDate: req.body.BoEDetailsDate,
                //StatusId: req.body.StatusId,
                CreatedBy: req.body.userId
            };
            dataaccess.CreateWithTransaction(BoEDetails, values, trans)
            .then(function (result) {
                        if (result != null) {
                            const BoEDetailsMap = datamodel.BoEDetailsMap();
                            var mapDetails = [];
                            var promiseDetails = req.body.BoEDetailsMap.map(function (mapitem) {
                                    mapDetails.push({
                                        BoEDetailsId: result.Id,
                                        POLineNumber: mapitem.PONumber,
                                        ItemNumber: mapitem.ItemNumber,
                                        ItemDesc: mapitem.ItemDesc,
                                        POQuantity: mapitem.POQuantity,
                                        POPendingQuantity: mapitem.POPendingQuantity,
                                        ReceiptQuantity: mapitem.RecieptQuantity,
                                        BCD: mapitem.BCD,
                                        SWS: mapitem.SWS,
                                        Rate: mapitem.Rate,
                                        BCDinINR: mapitem.BCDAmountINR,
                                        SWSinINR: mapitem.SWSAmountINR,
                                        NewUnitPrice:mapitem.NewUnitPrice,
                                        CreatedBy: req.body.userId
                                    });
                                
                            });

                            Promise.all(promiseDetails).then(function () {
                                dataaccess.BulkCreateWithTransaction(BoEDetailsMap, mapDetails, trans)
                                .then((result) => {
                                        trans.commit();
                                        res.status(200).json({ Success: true, Message: 'BoE Details saved successfully', Data: result });
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetails', err);
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                });
                            });
                        }

                    }, 
                    function (err) {
                        trans.rollback();
                        dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetails', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
            });
        });
    });

    router.route('/GetAllUserBoEDetails')
    .get(function (req, res) {
            const BoEDetails = datamodel.BoEDetails();
            var param = { 
                order: [['Id','DESC']] 
            };

            dataaccess.FindAll(BoEDetails, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'BoEDetails Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of BoEDetails', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEDetailsService', 'GetAllUserBoEDetails', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of BoEDetails', Data: null });
                });
    });

    router.route('/GetBoEUserDetailsById')
    .post(function (req, res) {
        const BoEDetails = datamodel.BoEDetails();
        var param = {
            include: { all: true, nested: true },
            where: { Id: req.body.Id }
        };
        dataaccess.FindAll(BoEDetails, param)
            .then(function (result) {
                if (result != null) {
                    res.status(200).json({ success: true, message: "BoEDetails access", Data: result })
                }
                else {
                    res.status(200).json({ Success: false, Message: 'User has no access of BoEDetails', Data: null });
                }
            },
            function (err) {
                dataconn.errorlogger('BoEDetailsService', 'GetBoEUserDetailsById', err);
                res.status(200).json({ success: false, message: "User has no access of BoEDetails", Data: null });
            });
    });

    //End Routes

    return router;

};

module.exports = routes;