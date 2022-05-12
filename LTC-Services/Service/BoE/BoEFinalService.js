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


    router.route('/GetAllBoE')
    .get(function (req, res) {
            const BoE = datamodel.BoE();
            var param = {
                include: { all: true, nested: true },
                 order: [['Id', 'DESC']] 
                };

            dataaccess.FindAll(BoE, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'BoE Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'No records found in BoE', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEFinalService', 'GetAllBoE', err);
                    res.status(200).json({ Success: false, Message: 'Error while accessing BoE', Data: null });
                });
    });

    router.route('/GetBoEDetailsById/:Id')
    .get(function (req, res) {
        const BoE = datamodel.BoE();
        var param = {
            include: { all: true, nested: true },
            where: { Id: req.params.Id }
        };
        dataaccess.FindAll(BoE, param)
            .then(function (result) {
                if (result != null) {
                    res.status(200).json({ success: true, message: "BoE access", Data: result })
                }
                else {
                    res.status(200).json({ Success: false, Message: 'No data found while accessing BoE', Data: null });
                }
            },
            function (err) {
                dataconn.errorlogger('BoEFinalService', 'GetBoEDetailsById', err);
                res.status(200).json({ success: false, message: "Error while accessing BoE", Data: null });
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
                    dataconn.errorlogger('BoEFinalService', 'GetDistinctPONumber', err);
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
                    dataconn.errorlogger('BoEFinalService', 'GetDistinctPONumber', err);
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
                    dataconn.errorlogger('BoEFinalService', 'GetAllPortMaster', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PortMaster', Data: null });
                });
    });

    router.route('/GetAllASNNumber')
    .post(function (req, res) {
            const BoEMasterDetails = datamodel.BoEMasterDetails();
            var param = { 
                where: { PO_NUMBER: req.body.PO_NUMBER },
                attributes:[
                    [sequelize.fn('DISTINCT', sequelize.col('ASN_NO')), 'ASNNumber'],
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
                    dataconn.errorlogger('BoEFinalService', 'GetAllASNNumber', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of BoEMasterDetails', Data: null });
                });
    });

    router.route('/GetDetailsByPONumber')
    .post(function (req, res) {
            const BoEMasterDetails = datamodel.BoEMasterDetails();
            var param = { 
                where:{ 
                    PO_NUMBER : req.body.PO_NUMBER,
                    ASN_NO : req.body.ASN_NO
                },
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
                    dataconn.errorlogger('BoEFinalService', 'GetDetailsByPONumber', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of BoEMasterDetails', Data: null });
                });
    });

    router.route('/GetAllHSN')
    .get(function (req, res) {

            const HSNMaster = datamodel.HSNMaster();
            var param = {
                order: [['Id']] 
            };

            dataaccess.FindAll(HSNMaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'HSNMaster Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of HSNMaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEFinalService', 'GetAllHSN', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of HSNMaster', Data: null });
                });
    });

    router.route('/GetDistinctIGST')
    .get(function (req, res) {

            const HSNMaster = datamodel.HSNMaster();
            var param = {
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('IGST')), 'IGST'],
                    'IGST_PERCENT'
                ],
            };

            dataaccess.FindAll(HSNMaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'HSNMaster Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of HSNMaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('BoEFinalService', 'GetDistinctPONumber', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of HSNMaster', Data: null });
                });
    });

    router.route('/Downloadfile/:Id')
    .get(function (req, res) {

            const BoE = datamodel.BoE();
            var param = {
                where: { Id: req.params.Id }
            };
            dataaccess.FindAll(BoE, param)
                .then(function (result) {
                    if (result != null) {
                        res.download(result[0].FilePath);
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'File Not Found', Data: null });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('BoEFinalService', 'Downloadfile', err);
                        res.status(200).json({ success: false, message: "Error while downloading file", Data: null });
                    });
    });

    router.route('/CheckDuplicateBoENumber/:BoENumber')
    .get(function (req, res) {

            const BoE = datamodel.BoE();
            var param = {
                where: { BoENumber: { [connect.Op.eq]: req.params.BoENumber } },
                attributes: [[connect.sequelize.fn('count', connect.sequelize.col('BoENumber')), 'Count']]
            };

            dataaccess.FindAll(BoE, param)
            .then(function (result) {
                if (result != null && result.length > 0 && result[0].dataValues.Count != null && result[0].dataValues.Count > 0) {
                        res.status(200).json({ Success: true, Message: 'BoENumber exists', Data: true });
                }
                else {
                        res.status(200).json({ Success: true, Message: 'BoENumber not exists', Data: false });
                }
            },
            function (err) {
                dataconn.errorlogger('BoEFinalService', 'CheckDuplicateBoENumber', err);
                res.status(200).json({ Success: false, Message: 'Error occured while checking duplicate BoENumber', Data: null });
            });
    });

    router.route('/CreateBoE')
    .post(upload.any(),function (req, res) {

        for (var key in req.body) {
            req.body[key] = req.body[key] == '' || req.body[key] == 'undefined' ? null : JSON.parse(req.body[key]);
        }

        let requestBody = req.body;
        let requestFiles = req.files;

        const BoE_Folder_Path = path.join(__dirname + '/../../' + config.Uploads_Folder + config.BoE_Folder);
        const BoENumber_Folder = requestBody.BoENumber;

        checkBoEFolderExists(BoE_Folder_Path, BoENumber_Folder)
        .then((results1) => {
            const folderPath = results1;
            uploadBoEFiles(requestFiles, folderPath)
            .then(async (results2) => {
                let fileData = results2;
                createBoE(requestBody,fileData)
                .then((results3) => {
                    //res.status(200).json({ Success: true, Message: 'BoE Created Successfully', Data: null });
                    let BoEId = results3.Id;
                    BoEReceiptAPI(requestBody,fileData,BoEId)
                    .then((results4)=>{
                        updateAfterResponse(results4)
                        .then((result5)=>{
                            res.status(200).json({ Success: true, Message: 'BoE Created Successfully', Data: null });
                        })
                        .catch((error5) => {
                            res.status(200).json({ Success: false, Message: 'Error occurred while updating data into database', Data: null });
                        })
                    })
                    .catch((error4) => {
                        res.status(200).json({ Success: false, Message: 'Error occurred while sending data to Receipt API', Data: null });
                    })
                })
                .catch((error3) => {
                    res.status(200).json({ Success: false, Message: 'Error occurred while saving data into database', Data: null });
                })
            })
            .catch((error2) => {
                res.status(200).json({ Success: false, Message: 'Error occurred while uploading files', Data: null });
            })
        })
        .catch((error1) => {
            res.status(200).json({ Success: false, Message: 'Error occurred while uploading files', Data: null });
        })

    });

    router.route('/PushBoE')
    .post(function (req, res) {

        let requestBody = req.body;
        let BoEId = req.body.Id;

        BoEReceiptAPI(requestBody,BoEId)
        .then((results1)=>{
            updateAfterResponse(results1)
            .then((result2)=>{
                res.status(200).json({ Success: true, Message: 'BoE Push Successfully', Data: null });
            })
            .catch((error2) => {
                res.status(200).json({ Success: false, Message: 'Error occurred while updating data into database', Data: null });
            })
        })
        .catch((error1) => {
            res.status(200).json({ Success: false, Message: 'Error occurred while sending data to Receipt API', Data: null });
        })
                
    });

    async function checkBoEFolderExists(BoE_Folder_Path, BoENumber) {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(path.join(BoE_Folder_Path, BoENumber))) {
                    fs.mkdirSync(path.join(BoE_Folder_Path, BoENumber));
                }
                resolve(path.join(BoE_Folder_Path, BoENumber));
            }
            catch (err) {
                // console.log("Error - checkFolderExists() : ",err);
                dataconn.errorlogger('BoEFinalService', 'checkFolderExists()', {message:'Error while creating folder' , stack:'Error while creating folder'});
                reject();
            }
        });
    }

    async function uploadBoEFiles(request, folderPath) {
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
                // console.log("Error - uploadBoEFiles() : ",error);
                dataconn.errorlogger('BoEFinalService', 'uploadBoEFiles()', {message:'Error while uploading file' , stack:'Error while uploading file'});
                reject();
            }
        });
    }

    function createBoE(request,fileData){
        return new Promise(async (resolve, reject) => {
            let requestBody = request;
            let fileDetails = fileData;
            connect.sequelize.transaction().then(trans => {
                const BoE = datamodel.BoE();
                var values = {
                    BoENumber: requestBody.BoENumber,
                    BoEDate: requestBody.BoEDate,
                    RecieptDate: requestBody.RecieptDate,
                    BoEExchangeRate: requestBody.BoEExchangeRate,
                    HAWB: requestBody.HAWB,
                    SupplierInvoiceNumber: requestBody.SupplierInvoiceNumber,
                    SupplierID: requestBody.SupplierID,
                    SupplierName: requestBody.SupplierName, 
                    SupplierSiteCode: requestBody.SupplierSiteCode, 
                    PONumber: requestBody.PONumber,
                    EntityCode: requestBody.EntityCode,
                    PortCode: requestBody.PortCode,
                    PortDesc: requestBody.PortDesc,
                    ASNNumber: requestBody.ASNNumber,
                    TotalCustomDuty: requestBody.TotalCustomDuty,
                    TotalGSTAmount: requestBody.TotalGSTAmount,
                    TotalAmountWithGST: requestBody.TotalAmountWithGST,
                    FileName: fileDetails.fileName,
                    FilePath: fileDetails.filePath,
                    StatusId:1,
                    CreatedBy: requestBody.userId,
                };
                dataaccess.CreateWithTransaction(BoE, values, trans)
                .then(function (result) {
                    if (result != null) {
                                const BoEMap = datamodel.BoEMap();
                                var mapDetails = [];
                                // console.log("requestBody.BoEMapDetails",requestBody.BoEMapDetails);
                                var promiseDetails = requestBody.BoEMapDetails.map(function (mapitem) {

                                        let DistributionCombinationCode = '';
                                        if(mapitem.DestType == 'Inventory'){
                                            DistributionCombinationCode = '511103-' + mapitem.EntityCode + '-' + mapitem.DeptCode + '-' + mapitem.LocationCode + '-99-999-999-999-999-9999-99999'
                                        }
                                        else{
                                            DistributionCombinationCode = mapitem.AccountCode + '-' + mapitem.EntityCode + '-' + mapitem.DeptCode + '-' + mapitem.LocationCode + '-99-999-999-999-999-9999-99999'
                                        }

                                        mapDetails.push({
                                            BoEId: result.Id,
                                            UOMCode: mapitem.UOMCode,
                                            AccountCode: mapitem.AccountCode,
                                            EntityCode: mapitem.EntityCode,
                                            DestType: mapitem.DestType,
                                            LocationCode: mapitem.LocationCode,
                                            DeptCode: mapitem.DeptCode,
                                            OrganizationCode:mapitem.OrganizationCode,
                                            HSNCode:mapitem.HSNCode,
                                            SupplierItemCode:mapitem.SupplierItemCode,
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
                                            UnitPrice: mapitem.UnitPrice,
                                            AssessableValueINR: mapitem.AssessableValueINR,
                                            TotalTaxableValue: mapitem.TotalTaxableValue,
                                            NewUnitPrice:mapitem.NewUnitPrice,
                                            TotalInUSD:mapitem.TotalInUSD,
                                            AssessableValue:mapitem.AssessableValue,
                                            GST:mapitem.GST,
                                            TotalInvoiceAmount:mapitem.TotalInvoiceAmount,
                                            ASNNumber: mapitem.ASN_NO,
                                            ReceiptLineNumber: mapitem.RCPT_LINE_NUM,
                                            ASNQuantity: mapitem.ASN_QTY_SHIP,
                                            IGST: mapitem.IGST,
                                            IGSTPercent: mapitem.IGST_PERCENT,
                                            InventoryItemId:mapitem.ItemID,
                                            DistributionCombination:DistributionCombinationCode,
                                            CreatedBy: requestBody.userId
                                        });    
                                });
    
                                Promise.all(promiseDetails).then(function () {
                                    dataaccess.BulkCreateWithTransaction(BoEMap, mapDetails, trans)
                                    .then((resultfinal) => {
                                            trans.commit();
                                            resolve(result);
                                        },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('BoEFinalService', 'createBoE()', err);
                                            reject();
                                    });
                                });
                    }
                }, 
                function (err) {
                    trans.rollback();
                    dataconn.errorlogger('BoEFinalService', 'createBoE()', err);
                    reject();
                });
            });
        });  
    }

    function BoEReceiptAPI(request,fileData,BoEId){
        return new Promise(async (resolve, reject) => {

                let currentDate = moment(new Date()).format('YYYY-MM-DD');
                let ReceiptSourceCode = configuration.BoEReceiptAPIData.HardCodedData.ReceiptSourceCode;
                let BusinessUnit = configuration.BoEReceiptAPIData.HardCodedData.BusinessUnit;
                let EmployeeId = configuration.BoEReceiptAPIData.HardCodedData.EmployeeId;
                let Lines_ReceiptSourceCode = configuration.BoEReceiptAPIData.HardCodedData.Lines_ReceiptSourceCode;
                let SourceDocumentCode = configuration.BoEReceiptAPIData.HardCodedData.SourceDocumentCode;
                let TransactionType = configuration.BoEReceiptAPIData.HardCodedData.TransactionType;
                let AutoTransactCode = configuration.BoEReceiptAPIData.HardCodedData.AutoTransactCode;
                let DatatypeCode = configuration.BoEReceiptAPIData.HardCodedData.DatatypeCode;
                let Description = configuration.BoEReceiptAPIData.HardCodedData.Description;
    
                let linesDataArray = [];
                let list = [];
    
                let HeaderOrganizationCode = '';
    
                linesDataArray = request.BoEMapDetails;
    
                linesDataArray.forEach((element,index) => {
                    if(element.OrganizationCode != null){
                        HeaderOrganizationCode = element.OrganizationCode
                    }
                    list.push({
                        // "ItemId": element.ItemID, //commented on 11 May 2022
                        "ReceiptSourceCode": Lines_ReceiptSourceCode,
                        "SourceDocumentCode": SourceDocumentCode,
                        "TransactionType": TransactionType,
                        "AutoTransactCode": AutoTransactCode,
                        "DocumentNumber": request.PONumber,
                        "OrganizationCode": element.OrganizationCode, 
                        "DocumentLineNumber": element.PONumber,
                        "Quantity": element.RecieptQuantity,
                        "UOMCode": element.UOMCode,
                        // "ASNLineNumber": element.RCPT_LINE_NUM, //commented on 11 May 2022
                        // "transactionDFF": [ //commented on 11 May 2022
                        //     {
                        //         "__FLEX_Context" : "BOE Details",
                        //         "bcd": element.BCD,
                        //         "bcdAmountInr": element.BCDAmountINR,             
                        //         "sws": element.SWS,
                        //         "swsAmountInr": element.SWSAmountINR,
                        //         "igst": element.GST,
                        //     }
                        // ]
                    });
                });
    
                var data = JSON.stringify({
                    // "ShipmentNumber": request.ASNNumber, //commented on 11 May 2022
                    "ReceiptSourceCode": ReceiptSourceCode,
                    "BusinessUnit": BusinessUnit,
                    "VendorName": request.SupplierName,
                    "VendorSiteCode": request.SupplierSiteCode,
                    "OrganizationCode": HeaderOrganizationCode, 
                    "EmployeeId": EmployeeId,
                    "TransactionDate": currentDate,
                    "attachments": [
                        {
                            "DatatypeCode": DatatypeCode,
                            "FileName": fileData.fileName,
                            "Title": fileData.fileName,
                            "Description": Description,
                            "FileContents": fileData.fileBase64Data
                        }
                    ],
                    "GLDate": currentDate,
                    // "DFF": [ //commented on 11 May 2022
                    //     {
                    //         "hawb": request.HAWB,
                    //         "boe": request.BoENumber,
                    //         "boeExchangeRate": request.BoEExchangeRate,
                    //         "totalCustomDuty": request.TotalCustomDuty
                    //     }
                    // ],
                    "lines": list
                });
    
                var config = {
                    method: configuration.BoEReceiptAPIData.configData.method,
                    url: configuration.BoEReceiptAPIData.configData.url,
                    headers: configuration.BoEReceiptAPIData.configData.headers,
                    data : data
                  };
    
                //   console.log("BoEFinalService - Reciept Data Body",data);
                  
                  axios(config)
                  .then(function (response) {
                        console.log("BoEFinalService - Reciept Response Body",response.data);
                        let updateData = {
                            ApiName:'Reciept',
                            Id:BoEId,
                            status:201,
                            userId:request.userId,
                            data:response.data.ReceiptNumber
                        }
                        resolve(updateData);
                  })
                  .catch(function (error) {
                    if (error.response) {
                        if (error.response.status == 400) {
                            dataconn.apiResponselogger('BoEFinalService - Receipt API', 0 , 0, error.response.status, error.response.data, request.userId);
                        }
                    }
                    let updateData = {
                        ApiName:'Reciept',
                        Id:BoEId,
                        status:400,
                        userId:request.userId
                    }
                    updateAfterResponse(updateData)
                    reject();
                  });
        });
    }

    function updateAfterResponse(updatedata){
        return new Promise((resolve, reject)=>{

            let APIName = updatedata.ApiName;
            let values;

            const BoE = datamodel.BoE();

            if(APIName == 'Reciept'){
                if(updatedata.status == 201){
                    values = {
                        StatusId:2,
                        RecieptNumber: updatedata.data,
                        ReceitAPIResponse: updatedata.status,
                        ModifiedBy: updatedata.userId,
                        ModifiedDate: connect.sequelize.fn("NOW"),
                    };
                }
                else{
                    values = {
                        ReceitAPIResponse: updatedata.status,
                        ModifiedBy: updatedata.userId,
                        ModifiedDate: connect.sequelize.fn("NOW"),
                    };
                }  
            }

            var params = { Id:updatedata.Id } 

            dataaccess.Update(BoE,values,params)
            .then(function (result) {
                 if (result != null) {
                    resolve();
                }
            }, function (err) {
                dataconn.errorlogger('BoEFinalService', 'updateAfterResponse()', err);
                reject();
            });
        })
    }

    //Cost API Start

    function FetchDetailsForCostAPI(){
        return new Promise(async (resolve, reject) => {
           
            const BoE = datamodel.BoE();
            const BoEMap = datamodel.BoEMap();
            var param = {
                attributes: ['Id','BoENumber','PONumber','RecieptNumber'],
                where: { 
                    StatusId: 2,
                    isCostUpdatedId: null
                 },
                include: [
                    { 
                        model: BoEMap,
                        attributes: ['Id','BoEId','InventoryItemId','NewUnitPrice'], //removed on 10 May 22 - RecieptNumber
                    },
                ]
            };

            dataaccess.FindAll(BoE, param)
                .then(function (result) {
                    if (result != null) {
                        let newBoEList = [];
                        //console.log(result)
                        result.forEach(element1 => {
                            let HeaderPONumber = element1.PONumber;
                            let BoERecieptNumber = element1.RecieptNumber; //added on 10 May 22 
                            let BoEDetailsMaps = element1.BoEMaps; //removed on 10 May 22 - element1.BoEDetailsMaps
                            BoEDetailsMaps.forEach(element2 => {
                                newBoEList.push({
                                    Id: element2.Id,
                                    BoEDetailsId: element2.BoEDetailsId,
                                    InventoryItemId: element2.InventoryItemId,
                                    RecieptNumber: BoERecieptNumber, //removed on 10 May 22 - element2.RecieptNumber
                                    NewUnitPrice: element2.NewUnitPrice,
                                    PONumber:HeaderPONumber
                                })
                            });
                        });

                        resolve(newBoEList);
                    }
                },
                function (err) {
                    dataconn.errorlogger('BoEFinalService', 'FetchDetailsForCostAPI()', err);
                    reject(err);
                });
        });
    }

    function FetchDetailsFormPOCostReport(BoEDetailsList){
        return new Promise(async (resolve, reject) => {
           
            const POCostReport = datamodel.POCostReport();
            var param = {};

            dataaccess.FindAll(POCostReport, param)
                .then(function (result) {
                    if (result != null) {

                        let POCostReportList = result;
                        let finalCostAPIList = [];

                        BoEDetailsList.forEach(element1 => {
                            POCostReportList.forEach(element2 => {
                                if(element1.InventoryItemId == element2.INVENTORY_ITEM_ID && element1.RecieptNumber == element2.GRN_NO && element1.PONumber == element2.TXN_SOURCE_REF_DOC_NUMBER){
                                    finalCostAPIList.push({
                                        Id: element1.Id,
                                        BoEDetailsId: element1.BoEDetailsId,
                                        NewUnitPrice: element1.NewUnitPrice,
                                        InventoryItemId:element1.InventoryItemId,
                                        RecieptNumber:element1.RecieptNumber,
                                        PONumber:element1.PONumber,
                                        TRANSACTION_ID:element2.TRANSACTION_ID,
                                        INVENTORY_ORG_ID:element2.INVENTORY_ORG_ID,
                                        TXN_SOURCE_DOC_TYPE:element2.TXN_SOURCE_DOC_TYPE
                                    })
                                }
                            });
                        });

                        resolve(finalCostAPIList);
                    }
                },
                function (err) {
                    dataconn.errorlogger('BoEFinalService', 'FetchDetailsFormPOCostReport()', err);
                    reject(err);
                });
        });
    }

    function CostAdjustmentAPI(requestData){
        return new Promise(async (resolve, reject) => {

            console.log("requestData.length",requestData.length);
            if(requestData.length != 0){
                let promises = []
                let request = requestData;
    
                let AdjustmentTypeCode = configuration.CostAdjustmentAPIData.HardCodedData.AdjustmentTypeCode;
                let AdjustmentStatusCode = configuration.CostAdjustmentAPIData.HardCodedData.AdjustmentStatusCode;
                let Reason = configuration.CostAdjustmentAPIData.HardCodedData.Reason;
                let CostElement = configuration.CostAdjustmentAPIData.HardCodedData.CostElement;
    
                request.forEach(element => {
                    var data = JSON.stringify({
                        "TransactionId": element.TRANSACTION_ID,
                        "AdjustmentTypeCode": AdjustmentTypeCode,
                        "AdjustmentStatusCode": AdjustmentStatusCode,
                        "Reason": Reason,
                        "AdjustmentDetail": [
                          {
                            "CostElement": CostElement,
                            "NewCost": element.NewUnitPrice
                          }
                        ]
                    });
                      
                    var config = {
                        method: configuration.CostAdjustmentAPIData.configData.method,
                        url: configuration.CostAdjustmentAPIData.configData.url,
                        headers: configuration.CostAdjustmentAPIData.configData.headers,
                        data : data
                    }; 
    
                    promises.push(axios(config));
                });
    
                Promise.all(promises).then(function (results) {
                    results.forEach(function (response, index, array) {
    
                        console.log("AdjustmentNumber", response.data.AdjustmentNumber);
    
                        const BoE = datamodel.BoE();
    
                        var values = {
                            isCostUpdatedId:1,
                            AdjustmentNumber:response.data.AdjustmentNumber,
                            ModifiedDate: connect.sequelize.fn("NOW"),
                        };
    
                        var param = {
                            Id: request.Id, //added on 10 May 22 
                            RecieptNumber: response.data.ReceiptNumber,
                            // InventoryItemId: response.data.ItemId, //commented on 10 May 22 
                        };
    
                        dataaccess.Update(BoE, values, param)
                        .then(() => {
                                if (index === array.length - 1) {
                                    console.log('CostAdjustmentAPI');
                                    resolve();
                                }
                            })
                        .catch((error) => {
                                console.log(error);
                        });
                    });
                })
                .catch(function (error) {
                        if (error.response) {
                            if (error.response.status == 400) {
                                dataconn.apiResponselogger('Cost Adjustment API', 0 , 0, error.response.status, error.response.data, 1);
                            }
                        }
                        reject(error.response.data);
                });
            }
            else{
                resolve();
            }
        });
    }

    module.exports.CostAPI = function(){

        var Schedulerdata = {
            SchedulerName:'Cost API',
            Start: connect.sequelize.fn('NOW'),
            End: null ,
        }
        dataconn.Schedulerlog(Schedulerdata);

        FetchDetailsForCostAPI()
        .then((result1)=>{
            console.log("Cost API Step 1 Completed");
            let BoEDetailsList = result1;
            FetchDetailsFormPOCostReport(BoEDetailsList)
            .then((result2)=>{
                console.log("Cost API Step 2 Completed");
                let FinalListForCostAPI = result2;
                console.log("FinalListForCostAPI",FinalListForCostAPI);
                CostAdjustmentAPI(FinalListForCostAPI)
                .then((responseResult)=>{
                    console.log("Cost API Step 3 Completed");
                    var Schedulerdata = {
                        SchedulerName:'Cost API',
                        Start: null,
                        End: connect.sequelize.fn('NOW') ,
                    }
                    dataconn.Schedulerlog(Schedulerdata);
                })
                .catch((error)=>{
                    console.log("Cost API Step 3 Error",error);
                })
            })
            .catch((error)=>{
                console.log("Cost API Step 2 Error",error);
            })
        })
        .catch((error)=>{
            console.log("Cost API Step 1 Error",error);
        })
    }

    router.route('/CostAdjustmentAPI')
    .get(function (req, res) {
        var Schedulerdata = {
            SchedulerName:'Cost API',
            Start: connect.sequelize.fn('NOW'),
            End: null ,
        }
        dataconn.Schedulerlog(Schedulerdata);

        FetchDetailsForCostAPI()
        .then((result1)=>{
            console.log("Cost API Step 1 Completed");
            let BoEDetailsList = result1;
            FetchDetailsFormPOCostReport(BoEDetailsList)
            .then((result2)=>{
                console.log("Cost API Step 2 Completed");
                let FinalListForCostAPI = result2;
                console.log("FinalListForCostAPI",FinalListForCostAPI);
                CostAdjustmentAPI(FinalListForCostAPI)
                .then((responseResult)=>{
                    console.log("Cost API Step 3 Completed");
                    var Schedulerdata = {
                        SchedulerName:'Cost API',
                        Start: null,
                        End: connect.sequelize.fn('NOW') ,
                    }
                    dataconn.Schedulerlog(Schedulerdata);

                    res.status(200).json({ Success: true, Message: 'Cost API Completed', Data: null });

                })
                .catch((error)=>{
                    console.log("Cost API Step 3 Error",error);
                    res.status(200).json({ Success: false, Message: 'Cost API Step 3 Error', Data: null });
                })
            })
            .catch((error)=>{
                console.log("Cost API Step 2 Error",error);
                res.status(200).json({ Success: false, Message: 'Cost API Step 2 Error', Data: null });
            })
        })
        .catch((error)=>{
            console.log("Cost API Step 1 Error",error);
            res.status(200).json({ Success: false, Message: 'Cost API Step 1 Error', Data: null });
        })
    });

    //Cost API Ends


    return router;

};

module.exports = routes;