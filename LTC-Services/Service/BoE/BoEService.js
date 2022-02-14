var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var connect = require('../../Data/Connect');
var express = require('express');
var dataconn = require('../../Data/DataConnection');
var async = require('async');
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

var multer = require("multer");
var upload = multer();
const fse = require("fs-extra");
const fs = require("fs");
const config = require('../../Config');

var routes = function () {

    //Start Routes

    router.route('/GetAllBoEEntry')
        .get(function (req, res) {
            const BoEEntry = datamodel.BoEEntry();
            var param = { order: [['Id', 'DESC']] };

            dataaccess.FindAll(BoEEntry, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'BoEEntry Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of BoEEntry', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEService', 'GetAllBoEEntry', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of BoEEntry', Data: null });
                });
        });

    router.route('/GetDistinctPONumber/:VENDOR_ID')
        .get(function (req, res) {

            const BoEMasterDetails = datamodel.BoEMasterDetails();
            var param = {
                where: { VENDOR_ID: req.params.VENDOR_ID },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('PO_NUMBER')), 'PO_NUMBER'],
                    'ENTITY_CODE'
                ],
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
                    dataconn.errorlogger('BoEService', 'GetDistinctPONumber', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of BoEMasterDetails', Data: null });
                });
        });

    router.route('/GetDistinctVendor')
        .get(function (req, res) {

            const BoEMasterDetails = datamodel.BoEMasterDetails();
            var param = {
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('VENDOR_ID')), 'VENDOR_ID'],
                    'VENDOR_NAME',
                    'VENDOR_NUMBER',
                    'VENDOR_SITE_CODE',
                    'VENDOR_SITE_ID'
                ],
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
                    dataconn.errorlogger('BoEService', 'GetDistinctPONumber', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of BoEMasterDetails', Data: null });
                });
        });

    router.route('/GetAllPortMaster')
        .get(function (req, res) {
            const PortMaster = datamodel.PortMaster();
            var param = {
                attributes: ['Id', 'Code', 'Desc'],
                where: { IsActive: true },
                order: [['Id']]
            };

            dataaccess.FindAll(PortMaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'PortMaster Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of PortMaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEService', 'GetAllPortMaster', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PortMaster', Data: null });
                });
        });

    router.route('/GetBoEDetailsById')
        .post(function (req, res) {
            const BoEEntry = datamodel.BoEEntry();
            var param = {
                where: { Id: req.body.Id }
            };
            dataaccess.FindAll(BoEEntry, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ success: true, message: "BoEEntry access", Data: result })
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of BoEEntry', Data: null });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('BoEService', 'GetBoEDetailsById', err);
                        res.status(200).json({ success: false, message: "User has no access of BoEEntry", Data: null });
                    });
        });

    router.route('/CheckDuplicateBoENumber/:BoENumber')
        .get(function (req, res) {

            const BoEEntry = datamodel.BoEEntry();
            var param = {
                where: { BoENumber: { [connect.Op.eq]: req.params.BoENumber } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('BoENumber')), 'Count']]
            };

            dataaccess.FindAll(BoEEntry, param)
                .then(function (result) {
                    if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'BoENumber exists', Data: true });
                    }
                    else {
                        res.status(200).json({ Success: true, Message: 'BoENumber not exists', Data: false });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('BoEService', 'CheckDuplicateBoENumber', err);
                        res.status(200).json({ Success: false, Message: 'User has no access of BoEEntry', Data: null });
                    });
        });

    router.route('/Downloadfile/:Id')
        .get(function (req, res) {

            const BoEEntry = datamodel.BoEEntry();
            var param = {
                where: { Id: req.params.Id }
            };
            dataaccess.FindAll(BoEEntry, param)
                .then(function (result) {
                    if (result != null) {
                        res.download(result[0].FilePath);
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of BoEEntry', Data: null });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('BoEService', 'Downloadfile', err);
                        res.status(200).json({ success: false, message: "User has no access of BoEEntry", Data: null });
                    });
        });

    router.route('/CreateBoEEntry')
        .post(upload.any(), function (req, res) {

            for (var key in req.body) {
                req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : req.body[key];
            }

            let requestBody = req.body;
            let requestFiles = req.files;

            const BoE_Entry_Folder_Path = path.join(__dirname + '/../../' + config.Uploads_Folder + config.BoE_Entry_Folder);
            const BoENumber_Folder = requestBody.BoENumber;

            checkFolderExists(BoE_Entry_Folder_Path, BoENumber_Folder)
                .then((results) => {

                    const folderPath = results;

                    uploadFiles(requestFiles, folderPath)
                        .then(async (results) => {
                            let fileData = results;
                            //console.log('fileData',fileData.fileBase64Data);
                            saveFileDetails(requestBody, fileData)
                                //sendFileDetailsToInvoiceAPI(requestBody,fileData)
                                .then((recordDetails) => {
                                    //console.log("API Response",apiresult);
                                    sendFileDetailsToInvoiceAPI(requestBody, fileData)
                                        //saveFileDetails(requestBody,fileData,apiresult)
                                        .then((apiresult) => {
                                            saveFileDetailsAfterAPIResponseSuccess(recordDetails, apiresult)
                                                .then(() => {
                                                    res.status(200).json({ Success: true, Message: 'BoEEntry saved successfully', Data: null });
                                                })
                                                .catch((err) => {
                                                    console.log(err);
                                                    dataconn.errorlogger('BoE Service', 'CreateBoEEntry', err);
                                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                                })
                                        })
                                        .catch((err) => {
                                            // console.log(err);
                                            // res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                            dataconn.apiResponselogger('Invoice API', recordDetails.Id, 0, 400, err.response.data, requestBody.userId)

                                            console.log(err);
                                            saveFileDetailsAfterAPIResponseFails(recordDetails)
                                                .then(() => {
                                                    res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                                })
                                                .catch((err) => {
                                                    dataconn.errorlogger('BoE Service', 'CreateBoEEntry', err);
                                                    console.log(err);
                                                })
                                        })
                                })
                                .catch((err) => {
                                    console.log(err);
                                    dataconn.errorlogger('BoE Service', 'CreateBoEEntry', err);
                                    res.status(200).json({ Success: false, Message: 'Error occurred while uploading files', Data: err });
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                            dataconn.errorlogger('BoE Service', 'CreateBoEEntry', err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while uploading files', Data: err });
                        })
                })
                .catch((err) => {
                    console.log(err);
                    dataconn.errorlogger('BoE Service', 'CreateBoEEntry', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while uploading files', Data: err });
                })

        });

    async function checkFolderExists(BoE_Entry, BoENumber) {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(path.join(BoE_Entry, BoENumber))) {
                    fs.mkdirSync(path.join(BoE_Entry, BoENumber));
                }
                resolve(path.join(BoE_Entry, BoENumber));
            }
            catch (err) {
                dataconn.errorlogger('FileService', 'Folder_Exists', err);
                reject();
            }
        });
    }

    async function uploadFiles(request, folderPath) {
        return new Promise(async (resolve, reject) => {
            try {
                const fileDetails = request[0];
                if (!fileDetails) {
                    reject();
                }

                const newFileName = fileDetails.originalname;
                await fse.writeFile(
                    path.join(folderPath + '/' + newFileName),
                    fileDetails.buffer,
                    () => {
                        var result = path.join(folderPath + '/' + newFileName);

                        //let buff = fs.readFileSync(result);
                        let buff = fileDetails.buffer;
                        let base64data = buff.toString('base64');
                        let finalData = {
                            fileName: newFileName,
                            filePath: result,
                            fileBase64Data: base64data
                        }
                        resolve(finalData);
                    }
                );
            }
            catch (error) {
                console.log(error);
                reject(error);
            }
        });
    }

    function saveFileDetails(request, fileData) {
        return new Promise((resolve, reject) => {

            let requestBody = request;
            let fileDetails = fileData;
            // let apiResponse = JSON.parse(apiresult);

            // console.log("InvoiceId",apiResponse.InvoiceId)

            const BoEEntry = datamodel.BoEEntry();
            var values = {
                BoENumber: requestBody.BoENumber,
                BoEDate: requestBody.BoEDate,
                BoEExchangeRate: requestBody.BoEExchangeRate,
                
                BoEBCD: requestBody.BoEBCD,
                BoESWS: requestBody.BoESWS,
                BoEIGST: requestBody.BoEIGST,
                
                BoETotalAmount: requestBody.BoETotalAmount,

                HAWB: requestBody.HAWB,
                SupplierInvoiceNumber: requestBody.SupplierInvoiceNumber,
                //ShipmentNumber: requestBody.ShipmentNumber,
                ChallanNumber: requestBody.ChallanNumber,
                PONumber: requestBody.PONumber,
                EntityCode: requestBody.EntityCode,
                VendorID: requestBody.VendorID,
                VendorName: requestBody.VendorName, 
                VendorSiteCode: requestBody.VendorSiteCode, 
                PortCode: requestBody.PortCode,
                PortDesc: requestBody.PortDesc,

                //InvoiceId: apiResponse.InvoiceId,
                BoEDetailsCreated : 0,
                //StatusId: 1,
                FileName: fileDetails.fileName,
                FilePath: fileDetails.filePath,
                CreatedBy: requestBody.userId
            };
            dataaccess.Create(BoEEntry, values)
                .then(function (result) {
                    if (result != null) {
                        resolve(result);
                        //res.status(200).json({ Success: true, Message: 'BoEEntry saved successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('BoEService', 'CreateBoEEntry', { message: 'No object found', stack: '' });
                        reject();
                        //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEService', 'CreateBoEEntry', err);
                    reject();
                    //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        })
    }

    function sendFileDetailsToInvoiceAPI(request, fileData) {
        return new Promise(async (resolve, reject) => {

            let requestBody = request;
            let fileDetails = fileData;

            let InvoiceType = configuration.BoEInvoiceData.HardCodedData.InvoiceType;
            let InvoiceCurrency = configuration.BoEInvoiceData.HardCodedData.InvoiceCurrency;
            let BusinessUnit = configuration.BoEInvoiceData.HardCodedData.BusinessUnit;
            let Supplier = configuration.BoEInvoiceData.HardCodedData.Supplier;
            let SupplierSite = configuration.BoEInvoiceData.HardCodedData.SupplierSite;
            let Type = configuration.BoEInvoiceData.HardCodedData.Type;
            let Category = configuration.BoEInvoiceData.HardCodedData.Category;
            let DistributionLineType = configuration.BoEInvoiceData.HardCodedData.DistributionLineType;
            let LineNumber = configuration.BoEInvoiceData.HardCodedData.LineNumber;
            let DistributionLineNumber = configuration.BoEInvoiceData.HardCodedData.DistributionLineNumber;

            let Title = fileDetails.fileName.split('.').slice(0, -1).join('.');
            let InvoiceDate = moment(requestBody.BoEDate).format('YYYY-MM-DD');
            //console.log("requestBody.BoEDate",requestBody.BoEDate);
            //console.log("InvoiceDate",InvoiceDate);


            var data = JSON.stringify({
                "InvoiceType" : InvoiceType,  //HardCoded
                "InvoiceNumber": "ADV-" + requestBody.BoENumber,
                "InvoiceCurrency": InvoiceCurrency, //HardCoded
                "InvoiceAmount": requestBody.BoETotalAmount,
                "InvoiceDate": InvoiceDate,
                "BusinessUnit": BusinessUnit, //HardCoded
                "Supplier": Supplier, //HardCoded
                "SupplierSite": SupplierSite, //HardCoded
                "InvoiceGroup": requestBody.BoENumber,
                "Description": requestBody.BoENumber,
                "attachments": [
                    {
                        "Type": Type, //HardCoded
                        "FileName": fileDetails.fileName,
                        "Title": Title,
                        "Description": Title,
                        "Category": Category, //HardCoded
                        "FileContents": fileDetails.fileBase64Data
                    }
                ],
                "invoiceLines": [
                    {
                        "LineNumber": LineNumber, //HardCoded
                        "LineAmount": requestBody.BoETotalAmount,
                        "invoiceDistributions": [
                            {
                                "DistributionLineNumber": DistributionLineNumber, //HardCoded
                                "DistributionLineType": DistributionLineType, //HardCoded
                                "DistributionAmount": requestBody.BoETotalAmount,
                                "DistributionCombination": requestBody.EntityCode + "-324106-12-1001-99-999-999-999-999-9999-99999" //Entity code-Hardcoded
                            }
                        ]
                    }
                ]
            });

            //console.log("BoE Entry API request Body",data)

            var config = {
                method: configuration.BoEInvoiceData.configData.method,
                url: configuration.BoEInvoiceData.configData.url,
                headers: configuration.BoEInvoiceData.configData.headers,
                data: data
            };

            axios(config)
                .then(function (response) {
                    let resultData = JSON.stringify(response.data);
                    resolve(resultData);
                    //console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    reject(error)
                    //console.log(error);
                });
        });
    }

    function saveFileDetailsAfterAPIResponseSuccess(recordDetails, apiresult) {
        return new Promise((resolve, reject) => {

            let record = recordDetails;
            let apiResponse = JSON.parse(apiresult);
            //console.log("InvoiceId",apiResponse.InvoiceId)
            //console.log("record",record.Id)

            const BoEEntry = datamodel.BoEEntry();
            var values = {
                InvoiceId: apiResponse.InvoiceId,
                StatusId: 201,
            };
            resolve();
            var params = {
                Id: record.Id
            }
            dataaccess.Update(BoEEntry, values, params)
                .then(function (result) {
                    if (result != null) {
                        resolve();
                        //res.status(200).json({ Success: true, Message: 'BoEEntry saved successfully', Data: result });
                    }
                    else {
                        dataconn.errorlogger('BoEService', 'CreateBoEEntry', { message: 'No object found', stack: '' });
                        reject();
                        //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEService', 'CreateBoEEntry', err);
                    reject();
                    //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
        })
    }

    function saveFileDetailsAfterAPIResponseFails(recordDetails) {
        return new Promise((resolve, reject) => {

            let record = recordDetails;
            //console.log("record",record.Id)

            const BoEEntry = datamodel.BoEEntry();
            var values = {
                StatusId: 400,
            };
            resolve();
            var params = {
                Id: record.Id
            }
            dataaccess.Update(BoEEntry, values, params)
                .then(function (result) {
                    if (result != null) {
                        resolve();
                    }
                    else {
                        dataconn.errorlogger('BoEService', 'CreateBoEEntry', { message: 'No object found', stack: '' });
                        reject();
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEService', 'CreateBoEEntry', err);
                    reject();
                });
        })
    }

    router.route('/PushInvoiceAPI')
        .post(function (req, res) {

            let BoEId = req.body.BoEData.Id;
            let filePath = req.body.BoEData.FilePath;
            let fileName = req.body.BoEData.FileName;
            readFileAndConvertToBase64(filePath)
                .then((result) => {
                    let request = {
                        EntityCode: req.body.BoEData.EntityCode,
                        BoENumber: req.body.BoEData.BoENumber,
                        BoETotalAmount: req.body.BoEData.BoETotalAmount,
                        BoEDate: req.body.BoEData.BoEDate,
                        userId: req.body.userId,
                        Id: req.body.BoEData.Id
                    }

                    let fileData = {
                        fileName: fileName,
                        filePath: filePath,
                        fileBase64Data: result
                    }

                    pushFileDetailsToInvoiceAPI(request, fileData)
                        .then((apiresult) => {
                            let recordDetails = {
                                Id: BoEId
                            }
                            saveFileDetailsAfterAPIResponseSuccess(recordDetails, apiresult)
                                .then(() => {
                                    res.status(200).json({ Success: true, Message: 'BoEEntry updated successfully', Data: null });
                                })
                                .catch((err) => {
                                    console.log(err);
                                    res.status(200).json({ Success: false, Message: 'Error occurred while updating BoE details', Data: err });
                                })
                        })
                        .catch((err) => {
                            console.log(err);
                            res.status(200).json({ Success: false, Message: 'Error occurred while calling invoice API', Data: err });
                        })
                    //console.log("base64String",result);
                })
                .catch((err) => {
                    console.log(err);
                    res.status(200).json({ Success: false, Message: 'Error occurred while file to base64 conversion', Data: err });
                })

        });

    function readFileAndConvertToBase64(filePath) {
        return new Promise(async (resolve, reject) => {
            const base64String = await fs.readFileSync(filePath, { encoding: 'base64' });
            if (base64String) {
                resolve(base64String);
            }
            else {
                reject();
            }
        });
    }

    function pushFileDetailsToInvoiceAPI(request, fileData) {
        return new Promise(async (resolve, reject) => {

            let requestBody = request;
            let fileDetails = fileData;

            let InvoiceType = configuration.BoEInvoiceData.HardCodedData.InvoiceType;
            let InvoiceCurrency = configuration.BoEInvoiceData.HardCodedData.InvoiceCurrency;
            let BusinessUnit = configuration.BoEInvoiceData.HardCodedData.BusinessUnit;
            let Supplier = configuration.BoEInvoiceData.HardCodedData.Supplier;
            let SupplierSite = configuration.BoEInvoiceData.HardCodedData.SupplierSite;
            let Type = configuration.BoEInvoiceData.HardCodedData.Type;
            let Category = configuration.BoEInvoiceData.HardCodedData.Category;
            let DistributionLineType = configuration.BoEInvoiceData.HardCodedData.DistributionLineType;
            let LineNumber = configuration.BoEInvoiceData.HardCodedData.LineNumber;
            let DistributionLineNumber = configuration.BoEInvoiceData.HardCodedData.DistributionLineNumber;

            let Title = fileDetails.fileName.split('.').slice(0, -1).join('.');
            let InvoiceDate = moment(requestBody.BoEDate).format('YYYY-MM-DD');
            // console.log("requestBody.BoEDate",requestBody.BoEDate);
            // console.log("InvoiceDate",InvoiceDate);


            var data = JSON.stringify({
                "InvoiceType": InvoiceType,  //HardCoded
                "InvoiceNumber": requestBody.BoENumber,
                "InvoiceCurrency": InvoiceCurrency, //HardCoded
                "InvoiceAmount": requestBody.BoETotalAmount,
                "InvoiceDate": InvoiceDate,
                "BusinessUnit": BusinessUnit, //HardCoded
                "Supplier": Supplier, //HardCoded
                "SupplierSite": SupplierSite, //HardCoded
                "InvoiceGroup": requestBody.BoENumber,
                "Description": requestBody.BoENumber,
                "attachments": [
                    {
                        "Type": Type, //HardCoded
                        "FileName": fileDetails.fileName,
                        "Title": Title,
                        "Description": Title,
                        "Category": Category, //HardCoded
                        "FileContents": fileDetails.fileBase64Data
                    }
                ],
                "invoiceLines": [
                    {
                        "LineNumber": LineNumber, //HardCoded
                        "LineAmount": requestBody.BoETotalAmount,
                        "invoiceDistributions": [
                            {
                                "DistributionLineNumber": DistributionLineNumber, //HardCoded
                                "DistributionLineType": DistributionLineType, //HardCoded
                                "DistributionAmount": requestBody.BoETotalAmount,
                                "DistributionCombination": "102-221407-12-1001-99-999-999-999-999-9999-99999"
                            }
                        ]
                    }
                ]
            });

            var config = {
                method: configuration.BoEInvoiceData.configData.method,
                url: configuration.BoEInvoiceData.configData.url,
                headers: configuration.BoEInvoiceData.configData.headers,
                data: data
            };

            axios(config)
                .then(function (response) {
                    let resultData = JSON.stringify(response.data);
                    resolve(resultData);
                    //console.log(JSON.stringify(response.data));
                })
                .catch(function (error) {
                    dataconn.errorlogger('BoEService', 'CreateBoEEntry', err);
                    dataconn.apiResponselogger('Invoice API', requestBody.Id, 0, 400, error.response.data, requestBody.userId)
                    reject(error)
                    //console.log(error);
                });
        });
    }

    //End Routes

    return router;

};

module.exports = routes;