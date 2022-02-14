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
                    dataconn.errorlogger('BoEService', 'GetAllHSN', err);
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
                    dataconn.errorlogger('BoEService', 'GetDistinctPONumber', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of HSNMaster', Data: null });
                });
    });

    router.route('/GetAllBoENumber')
    .get(function (req, res) {
            const BoEEntry = datamodel.BoEEntry();
            var param = { 
                attributes:['Id','BoENumber','VendorID','VendorName','VendorSiteCode','PONumber','BoEExchangeRate','BoETotalAmount','SupplierInvoiceNumber'],
                where : { BoEDetailsCreated : 0 },
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

    router.route('/GetAllASNNumber')
    .post(function (req, res) {
            const BoEMasterDetails = datamodel.BoEMasterDetails();
            var param = { 
                where: { PO_NUMBER: req.body.PO_NUMBER },
                attributes:[
                    [sequelize.fn('DISTINCT', sequelize.col('ASN_NO')), 'ASNNumber'],
                    //'ASN_QTY_SHIP'
                ],
                //order: [['Id']] 
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
                    dataconn.errorlogger('BoEDetailsService', 'GetAllASNNumber', err);
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
                    dataconn.errorlogger('BoEDetailsService', 'GetDetailsByPONumber', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of BoEMasterDetails', Data: null });
                });
    });

    router.route('/CreateUserBoEDetails')
    .post(function (req, res) {

        let currentDate = moment(new Date()).format('YYYY-MM-DD');
        res.status(200).json({ Success: true, Message: '', Data: currentDate });
        // connect.sequelize.transaction().then(trans => {
        //     const BoEDetails = datamodel.BoEDetails();
        //     var values = {
        //         BoENumber: req.body.BoENumber.BoENumber,
        //         VendorID: req.body.BoENumber.VendorID,
        //         VendorName: req.body.VendorName,
        //         VendorSiteCode:req.body.BoENumber.VendorSiteCode,
        //         PONumber: req.body.PONumber,
        //         BoEDetailsDate: req.body.BoEDetailsDate,
        //         BoEExchangeRate:req.body.BoEExchangeRate,
        //         //StatusId: req.body.StatusId,
        //         CreatedBy: req.body.userId
        //     };
        //     dataaccess.CreateWithTransaction(BoEDetails, values, trans)
        //     .then(function (result) {
        //                 if (result != null) {
        //                     const BoEDetailsMap = datamodel.BoEDetailsMap();
        //                     var mapDetails = [];
        //                     var promiseDetails = req.body.BoEDetailsMap.map(function (mapitem) {
        //                             mapDetails.push({
        //                                 BoEDetailsId: result.Id,
        //                                 UOMCode: mapitem.UOMCode,
        //                                 AccountCode: mapitem.AccountCode,
        //                                 EntityCode: mapitem.EntityCode,
        //                                 DestType: mapitem.DestType,
        //                                 LocationCode: mapitem.LocationCode,
        //                                 DeptCode: mapitem.DeptCode,
        //                                 POLineNumber: mapitem.PONumber,
        //                                 ItemNumber: mapitem.ItemNumber,
        //                                 ItemDesc: mapitem.ItemDesc,
        //                                 POQuantity: mapitem.POQuantity,
        //                                 POPendingQuantity: mapitem.POPendingQuantity,
        //                                 ReceiptQuantity: mapitem.RecieptQuantity,
        //                                 BCD: mapitem.BCD,
        //                                 SWS: mapitem.SWS,
        //                                 Rate: mapitem.Rate,
        //                                 BCDinINR: mapitem.BCDAmountINR,
        //                                 SWSinINR: mapitem.SWSAmountINR,
        //                                 NewUnitPrice:mapitem.NewUnitPrice,
        //                                 TotalInUSD:mapitem.TotalInUSD,
        //                                 AssessableValue:mapitem.AssessableValue,
        //                                 GST:mapitem.GST,
        //                                 TotalInvoiceAmount:mapitem.TotalInvoiceAmount,
        //                                 CreatedBy: req.body.userId
        //                             });
                                
        //                     });

        //                     Promise.all(promiseDetails).then(function () {
        //                         dataaccess.BulkCreateWithTransaction(BoEDetailsMap, mapDetails, trans)
        //                         .then((result) => {
        //                                 trans.commit();
        //                                 res.status(200).json({ Success: true, Message: 'BoE Details saved successfully', Data: result });
        //                             },
        //                                 function (err) {
        //                                     trans.rollback();
        //                                     dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetails', err);
        //                                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
        //                         });
        //                     });
        //                 }

        //             }, 
        //             function (err) {
        //                 trans.rollback();
        //                 dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetails', err);
        //                 res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
        //     });
        // });
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

    router.route('/CreateUserBoEDetailsAPI')
    .post(function (req, res) {
        let requestBody = req.body;
        createBoEUserDetails(requestBody)
        .then((createResult)=>{
            console.log("createResult",createResult.Id);
            let BoEId = createResult.Id;
            //res.status(200).json({ Success: true, Message: 'Success', Data: createResult });
            ReceiptAPI(requestBody,BoEId)
            .then((recieptResult)=>{
                let recieptNumber = recieptResult.data;
                console.log("recieptNumber",recieptNumber);

                const BoEDetailsMap = datamodel.BoEDetailsMap();

                values = {
                    RecieptNumber: recieptNumber,
                    ModifiedBy: requestBody.userId,
                    ModifiedDate: connect.sequelize.fn("NOW"),
                };

                var params = { 
                    BoEDetailsId:BoEId 
                } 
    
                dataaccess.Update(BoEDetailsMap, values,params)
                .then(function (result) {
                    if (result != null) {
                        updateAfterResponse(recieptResult)
                        .then((updateresult)=>{
                            StandardInvoiceAPI(requestBody,BoEId,recieptNumber)
                            .then((standardResult)=>{
                                console.log("standardResult",standardResult);
                                updateAfterResponse(standardResult)
                                .then(()=>{


                                    const BoEEntry = datamodel.BoEEntry();
                                    let values = {
                                        BoEDetailsCreated: 1,
                                        ModifiedBy: requestBody.userId,
                                        ModifiedDate: connect.sequelize.fn("NOW"),
                                    }
                                    var params = { BoENumber : requestBody.BoENumber.BoENumber } 

                                    console.log("BoE Entry values",values);
                                    console.log("BoE Entry params",params);

                                    dataaccess.Update(BoEEntry, values,params)
                                    .then(function (result) {
                                        if (result != null) {
                                            console.log("BoE Entry result",result);
                                            res.status(200).json({ Success: true, Message: 'Submitted Successfully', Data: null }); 
                                        }
                                    }, function (updateBoEEntryError) {
                                        console.log("update BoE Entry AfterResponse StandardInvoice",updateBoEEntryError);
                                        dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', updateBoEEntryError);
                                        res.status(200).json({ Success: false, Message: 'Error occurred in BoE Entry update', Data: updateBoEEntryError }); 
                                    });

                                })
                                .catch((updateerror)=>{
                                    console.log("updateAfterResponse StandardInvoice",updateerror);
                                    dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', updateerror);
                                    res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: updateerror }); 
                                })
                            })
                            .catch((standardError)=>{
                                console.log("standardError",standardError);
                                dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', standardError);
                                res.status(200).json({ Success: false, Message: 'Error occurred in Standard Invoice API', Data: standardError });
                            })
                        })
                        .catch((updateerror)=>{
                            console.log("updateAfterResponse Reciept",updateerror);
                            dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', updateerror);
                            res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: updateerror });
                        })
                   }
                }, function (err) {
                    console.log("updateAfterResponse Reciept map details",err);
                    dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', err);
                    res.status(200).json({ Success: false, Message: 'Error occurred in while updating boemapdetials', Data: err });
                });

            })
            .catch((recieptError)=>{
                console.log("recieptError",recieptError);
                dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', recieptError);
                res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: recieptError });
            })

        })
        .catch((createError)=>{
            console.log("createError",createError);
            dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', createError);
            res.status(200).json({ Success: false, Message: 'Error occurred in create BoE Details', Data: createError });
        })
    });

    function createBoEUserDetails(request){
        return new Promise(async (resolve, reject) => {
            let reqBody = request;
            connect.sequelize.transaction().then(trans => {
                const BoEDetails = datamodel.BoEDetails();
                var values = {
                    BoENumber: reqBody.BoENumber.BoENumber,
                    VendorID: reqBody.BoENumber.VendorID,
                    VendorName: reqBody.VendorName,
                    VendorSiteCode: reqBody.BoENumber.VendorSiteCode,
                    PONumber: reqBody.PONumber,
                    BoEShipmentNumber:reqBody.BoEShipmentNumber,
                    RecieptDate: reqBody.RecieptDate,
                    BoEExchangeRate: reqBody.BoEExchangeRate,
                    BoETotalAmount: reqBody.BoETotalAmount,
                    TotalInvoiceAmount: reqBody.TotalInvoiceAmount,
                    TotalGSTAmount: reqBody.TotalGSTAmount,
                    TotalInvoiceAmountWithGST: reqBody.TotalInvoiceAmountWithGST,
                    StatusId: 1,
                    CreatedBy: reqBody.userId
                };
                dataaccess.CreateWithTransaction(BoEDetails, values, trans)
                .then(function (result) {
                            if (result != null) {
                                const BoEDetailsMap = datamodel.BoEDetailsMap();
                                var mapDetails = [];
                                var promiseDetails = reqBody.BoEDetailsMap.map(function (mapitem) {

                                        //let DistributionCombinationCode = mapitem.DestType == 'Inventory' ? '511103-' + mapitem.EntityCode + '-' + mapitem.DeptCode + '-' + mapitem.LocationCode + '-99-999-999-999-999-9999-99999'  : mapitem.AccountCode + '-' + mapitem.EntityCode + '-' + mapitem.DeptCode + '-' + mapitem.LocationCode + '-99-999-999-999-999-9999-99999' ;
                                        let DistributionCombinationCode = '';
                                        if(mapitem.DestType == 'Inventory'){
                                            DistributionCombinationCode = '511103-' + mapitem.EntityCode + '-' + mapitem.DeptCode + '-' + mapitem.LocationCode + '-99-999-999-999-999-9999-99999'
                                        }
                                        else{
                                            DistributionCombinationCode = mapitem.AccountCode + '-' + mapitem.EntityCode + '-' + mapitem.DeptCode + '-' + mapitem.LocationCode + '-99-999-999-999-999-9999-99999'
                                        }

                                        mapDetails.push({
                                            BoEDetailsId: result.Id,
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
                                            DistributionCombination:DistributionCombinationCode,
                                            InventoryItemId:mapitem.ItemID,
                                            CreatedBy: reqBody.userId
                                        });    
                                });
    
                                Promise.all(promiseDetails).then(function () {
                                    dataaccess.BulkCreateWithTransaction(BoEDetailsMap, mapDetails, trans)
                                    .then((resultfinal) => {
                                            trans.commit();
                                            resolve(result);
                                            //res.status(200).json({ Success: true, Message: 'BoE Details saved successfully', Data: result });
                                        },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetails', err);
                                            reject(err);
                                            //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                    });
                                });
                            }
                        }, 
                        function (err) {
                            trans.rollback();
                            dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetails', err);
                            reject(err);
                            //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                });
            });
        });  
    }

    function ReceiptAPI(request,BoEId){
        return new Promise(async (resolve, reject) => {

                let currentDate = moment(new Date()).format('YYYY-MM-DD');
                let ASNType = configuration.ReceiptAPIData.HardCodedData.ASNType;
                let ReceiptSourceCode = configuration.ReceiptAPIData.HardCodedData.ReceiptSourceCode;
                let BusinessUnit = configuration.ReceiptAPIData.HardCodedData.BusinessUnit;
                let EmployeeId = configuration.ReceiptAPIData.HardCodedData.EmployeeId;
                let Lines_ReceiptSourceCode = configuration.ReceiptAPIData.HardCodedData.Lines_ReceiptSourceCode;
                let SourceDocumentCode = configuration.ReceiptAPIData.HardCodedData.SourceDocumentCode;
                let TransactionType = configuration.ReceiptAPIData.HardCodedData.TransactionType;
                let AutoTransactCode = configuration.ReceiptAPIData.HardCodedData.AutoTransactCode;
    
                let linesDataArray = [];
                let list = [];
    
                let HeaderOrganizationCode = '';
                //let HeaderASN = '';
    
                linesDataArray = request.BoEDetailsMap;
    
                linesDataArray.forEach((element,index) => {
                    if(element.OrganizationCode != null){
                        HeaderOrganizationCode = element.OrganizationCode
                        //HeaderASN = element.ASN_NO
                    }
                    list.push({
                        "ItemId": element.ItemID,
                        "ReceiptSourceCode": Lines_ReceiptSourceCode,  //HardCoded
                        "SourceDocumentCode": SourceDocumentCode,  //HardCoded
                        "TransactionType": TransactionType,  //HardCoded
                        "AutoTransactCode": AutoTransactCode,  //HardCoded
                        "DocumentNumber": request.PONumber,
                        "OrganizationCode": element.OrganizationCode, 
                        "DocumentLineNumber": element.PONumber, //PO_line number(27 jan) done
                        //"DocumentLineNumber": index + 1,
                        "Quantity": element.RecieptQuantity,
                        "UOMCode": element.UOMCode,
                        "ASNLineNumber": element.RCPT_LINE_NUM //RCPT_LINE_NUM (27 jan) done
                    });
                });
    
                var data = JSON.stringify({
                    //"ASNType": ASNType,  //HardCoded(removed on 27 jan) done
                    "ShipmentNumber": request.BoEDetailsMap[0].ASN_NO, //ASN number(27 jan) done
                    "ReceiptSourceCode": ReceiptSourceCode,  //HardCoded
                    "VendorName": request.VendorName,
                    "VendorSiteCode": request.BoENumber.VendorSiteCode,
                    "BusinessUnit": BusinessUnit,  //HardCoded
                    "OrganizationCode": HeaderOrganizationCode, 
                    "EmployeeId": EmployeeId,  //HardCoded
                    "TransactionDate": currentDate,
                    "GLDate": currentDate,
                    "lines": list
                });
    
                var config = {
                    method: configuration.ReceiptAPIData.configData.method,
                    url: configuration.ReceiptAPIData.configData.url,
                    headers: configuration.ReceiptAPIData.configData.headers,
                    data : data
                  };
    
                  console.log("Reciept Data Body",data);
                  
                  axios(config)
                  .then(function (response) {
                        //let responseData = JSON.stringify(response.data);
                        //console.log(responseData.ReceiptNumber);
                        console.log("Reciept Response Body",response.data);
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
                            dataconn.apiResponselogger('Receipt API', 0 , 0, error.response.status, error.response.data, userId);
                        }
                    }
                    let updateData = {
                        ApiName:'Reciept',
                        Id:BoEId,
                        status:400,
                        userId:request.userId
                    }
                    updateAfterResponse(updateData)
                    reject(error);
                  });
            //}

        });
    }

    function StandardInvoiceAPI(request,BoEId,recieptNumber){
        return new Promise(async (resolve, reject) => {

            let reqBody = request;
            let currentDate = moment(new Date()).format('YYYY-MM-DD');
            let InvoiceCurrency = configuration.StandardInvoiceAPIData.HardCodedData.InvoiceCurrency;
            let BusinessUnit = configuration.StandardInvoiceAPIData.HardCodedData.BusinessUnit;
            let Supplier = configuration.StandardInvoiceAPIData.HardCodedData.Supplier;
            let SupplierSite = configuration.StandardInvoiceAPIData.HardCodedData.SupplierSite;
            let LineType = configuration.StandardInvoiceAPIData.HardCodedData.LineType;
            let DistributionLineNumber = configuration.StandardInvoiceAPIData.HardCodedData.DistributionLineNumber;
            let DistributionLineType = configuration.StandardInvoiceAPIData.HardCodedData.DistributionLineType;

            let linesDataArray = [];
            let list = [];
            linesDataArray = reqBody.BoEDetailsMap;

            linesDataArray.forEach((element,index) => {
                let DistributionCombinationCode = '';
                let lineDescription = reqBody.PONumber + '-' + recieptNumber + '-' + element.RCPT_LINE_NUM ;
                 if(element.DestType == 'Inventory'){
                    DistributionCombinationCode =  element.EntityCode + '-511103' + '-' + element.DeptCode + '-' + element.LocationCode + '-99-999-999-999-999-9999-99999'
                }
                else{
                    DistributionCombinationCode = element.EntityCode + '-' + element.AccountCode + '-' + element.DeptCode + '-' + element.LocationCode + '-99-999-999-999-999-9999-99999'
                }
                list.push({
                    "LineNumber": index + 1,
                    "LineType": LineType,  //HardCoded
                    "AccountingDate": currentDate,
                    "Description": lineDescription, //PONUMBER-ReceiptNumber-ReceiptLineNumber
                    "LineAmount": element.TotalInvoiceAmount, //TotalInvoiceAmount row
                    "AssessableValue": element.AssessableValue, //AssessableValue row
                    "TaxClassification": element.IGST, // row
                    "invoiceDistributions": [
                      {
                        "DistributionLineNumber": DistributionLineNumber,  //HardCoded
                        "DistributionLineType": DistributionLineType,  //HardCoded
                        "DistributionAmount": element.TotalInvoiceAmount, //TotalInvoiceAmount row
                        "DistributionCombination": DistributionCombinationCode //logic
                      }
                    ]
                });
            });

            var data = JSON.stringify({
                "InvoiceNumber": reqBody.BoENumber.BoENumber, //BoENumber header table
                "InvoiceCurrency": InvoiceCurrency,  //HardCoded
                "InvoiceAmount": reqBody.TotalInvoiceAmountWithGST, //total of all rows
                "InvoiceDate": moment(reqBody.RecieptDate).format('YYYY-MM-DD'), //BoEDetailsDate i.e Reciept date
                "BusinessUnit": BusinessUnit,  //HardCoded
                "Supplier": Supplier,  //HardCoded
                "SupplierSite": SupplierSite,  //HardCoded
                "InvoiceGroup": reqBody.BoENumber.BoENumber, //BoENumber header table
                "Description": reqBody.BoENumber.BoENumber, //BoENumber header table
                "invoiceLines": list
            });

            var config = {
                    method: configuration.StandardInvoiceAPIData.configData.method,
                    url: configuration.StandardInvoiceAPIData.configData.url,
                    headers: configuration.StandardInvoiceAPIData.configData.headers,
                    data : data
            };
            
            console.log("StandardAPI Body Data",data);

            axios(config)
            .then(function (response) {
                //console.log("StandardAPI response",response.data);

                let updateData = {
                    ApiName:'StandardInvoice',
                    Id:BoEId,
                    status:201,
                    userId:request.userId,
                    data:response.data.InvoiceId
                }

                resolve(updateData);
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status == 400) {
                        dataconn.apiResponselogger('Standard Invoice API', 0 , 0, error.response.status, error.response.data, request.userId);
                    }
                }
                let updateData = {
                    ApiName:'StandardInvoice',
                    Id:BoEId,
                    status:400,
                    userId:request.userId
                }
                updateAfterResponse(updateData)
                reject(error);
            });  
        });
    }

    function updateAfterResponse(updatedata){
        return new Promise((resolve, reject)=>{

            let APIName = updatedata.ApiName;
            let values;

            const BoEDetails = datamodel.BoEDetails();

            if(APIName == 'Reciept'){
                if(updatedata.status == 201){
                    values = {
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
            else{
                if(updatedata.status == 201){
                    values = {
                        StatusId:2,
                        InvoiceId:updatedata.data,
                        StandardInvoiceAPIResponse: updatedata.status,
                        ModifiedBy: updatedata.userId,
                        ModifiedDate: connect.sequelize.fn("NOW"),
                    };
                }
                else{
                    values = {
                        StandardInvoiceAPIResponse: updatedata.status,
                        ModifiedBy: updatedata.userId,
                        ModifiedDate: connect.sequelize.fn("NOW"),
                    };
                }
                
            }

            var params = { Id:updatedata.Id } 

            dataaccess.Update(BoEDetails, values,params)
            .then(function (result) {
                 if (result != null) {
                    resolve();
                }
            }, function (err) {
                reject(err);
            });
        })
    }

    router.route('/PushUserBoEDetailsAPI')
    .post(async function (req, res) {
            let requestBody = req.body;
            let BoEId = req.body.BoEId;

            const BoEDetails = datamodel.BoEDetails();
            var param = {
                attributes: [
                    ['ReceitAPIResponse', "ReceitAPIResponse"],
                    ['RecieptNumber', "RecieptNumber"],
            ],
                where: { Id: BoEId }
            };

            let ReceitAPIResponseData = await dataaccess.FindAll(BoEDetails, param);
            
            setTimeout(async function (){
                if(ReceitAPIResponseData[0].dataValues.ReceitAPIResponse == 201){
                    let recieptNumber = ReceitAPIResponseData[0].dataValues.RecieptNumber;
                    StandardInvoiceAPI(requestBody,BoEId,recieptNumber)
                    .then((standardResult)=>{
                        console.log("standardResult",standardResult);
                        updateAfterResponse(standardResult)
                        .then(()=>{
                                    const BoEEntry = datamodel.BoEEntry();
                                    let values = {
                                        BoEDetailsCreated: 1,
                                        ModifiedBy: requestBody.userId,
                                        ModifiedDate: connect.sequelize.fn("NOW"),
                                    }
                                    var params = { BoENumber : requestBody.BoENumber.BoENumber } 

                                    // console.log("BoE Entry values",values);
                                    // console.log("BoE Entry params",params);

                                    dataaccess.Update(BoEEntry, values,params)
                                    .then(function (result) {
                                        if (result != null) {
                                            res.status(200).json({ Success: true, Message: 'Submitted Successfully', Data: null }); 
                                        }
                                    }, function (updateBoEEntryError) {
                                        console.log("update BoE Entry AfterResponse StandardInvoice",updateBoEEntryError);
                                        dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', updateBoEEntryError);
                                        res.status(200).json({ Success: false, Message: 'Error occurred in BoE Entry update', Data: updateBoEEntryError }); 
                                    });
                            //res.status(200).json({ Success: true, Message: 'Submitted Successfully', Data: null }); 
                        })
                        .catch((updateerror)=>{
                            console.log("updateAfterResponse StandardInvoice",updateerror);
                            dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', updateerror);
                            res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: updateerror }); 
                        })
                    })
                    .catch((standardError)=>{
                        console.log("standardError",standardError);
                        dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', standardError);
                        res.status(200).json({ Success: false, Message: 'Error occurred in Standard Invoice API', Data: standardError });
                    })
                }
                else{
                    ReceiptAPI(requestBody,BoEId)
                    .then((recieptResult)=>{
                        let recieptNumber = recieptResult.data;
                        console.log("recieptNumber",recieptNumber);
                        updateAfterResponse(recieptResult)
                        .then((updateresult)=>{
                            StandardInvoiceAPI(requestBody,BoEId,recieptNumber)
                            .then((standardResult)=>{
                                console.log("standardResult",standardResult);
                                updateAfterResponse(standardResult)
                                .then(()=>{
                                    //res.status(200).json({ Success: true, Message: 'Submitted Successfully', Data: null }); 
                                    const BoEEntry = datamodel.BoEEntry();
                                    let values = {
                                        BoEDetailsCreated: 1,
                                        //ModifiedBy: requestBody.userId,
                                        ModifiedDate: connect.sequelize.fn("NOW"),
                                    }
                                    var params = { Id : BoEId } 

                                    dataaccess.Update(BoEEntry, values,params)
                                    .then(function (result) {
                                        if (result != null) {
                                            res.status(200).json({ Success: true, Message: 'Submitted Successfully', Data: null }); 
                                        }
                                    }, function (updateBoEEntryError) {
                                        console.log("update BoE Entry AfterResponse StandardInvoice",updateBoEEntryError);
                                        dataconn.errorlogger('BoEDetailsService', 'CreateUserBoEDetailsAPI', updateBoEEntryError);
                                        res.status(200).json({ Success: false, Message: 'Error occurred in BoE Entry update', Data: updateBoEEntryError }); 
                                    });
                                })
                                .catch((updateerror)=>{
                                    console.log("updateAfterResponse StandardInvoice",updateerror);
                                    dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', updateerror);
                                    res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: updateerror }); 
                                })
                            })
                            .catch((standardError)=>{
                                console.log("standardError",standardError);
                                dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', standardError);
                                res.status(200).json({ Success: false, Message: 'Error occurred in Standard Invoice API', Data: standardError });
                            })
                        })
                        .catch((updateerror)=>{
                            console.log("updateAfterResponse Reciept",updateerror);
                            dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', updateerror);
                            res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: updateerror });
                        })
        
                    })
                    .catch((recieptError)=>{
                        console.log("recieptError",recieptError);
                        dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', recieptError);
                        res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: recieptError });
                    })  
                }
            },2000)

            // ReceiptAPI(requestBody,BoEId)
            // .then((recieptResult)=>{
            //     let recieptNumber = recieptResult.data;
            //     console.log("recieptNumber",recieptNumber);
            //     updateAfterResponse(recieptResult)
            //     .then((updateresult)=>{
            //         StandardInvoiceAPI(requestBody,BoEId,recieptNumber)
            //         .then((standardResult)=>{
            //             console.log("standardResult",standardResult);
            //             updateAfterResponse(standardResult)
            //             .then(()=>{
            //                 res.status(200).json({ Success: true, Message: 'Submitted Successfully', Data: null }); 
            //             })
            //             .catch((updateerror)=>{
            //                 console.log("updateAfterResponse StandardInvoice",updateerror);
            //                 dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', updateerror);
            //                 res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: updateerror }); 
            //             })
            //         })
            //         .catch((standardError)=>{
            //             console.log("standardError",standardError);
            //             dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', standardError);
            //             res.status(200).json({ Success: false, Message: 'Error occurred in Standard Invoice API', Data: standardError });
            //         })
            //     })
            //     .catch((updateerror)=>{
            //         console.log("updateAfterResponse Reciept",updateerror);
            //         dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', updateerror);
            //         res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: updateerror });
            //     })

            // })
            // .catch((recieptError)=>{
            //     console.log("recieptError",recieptError);
            //     dataconn.errorlogger('BoEDetailsService', 'PushUserBoEDetailsAPI', recieptError);
            //     res.status(200).json({ Success: false, Message: 'Error occurred in Receipt API', Data: recieptError });
            // })

        
    });

    function FetchDetailsForCostAPI(){
        return new Promise(async (resolve, reject) => {
           
            const BoEDetails = datamodel.BoEDetails();
            const BoEDetailsMap = datamodel.BoEDetailsMap();
            var param = {
                attributes: ['Id','BoENumber','PONumber','RecieptNumber'],
                where: { StatusId: 2 },
                include: [
                    { 
                        model: BoEDetailsMap,
                        attributes: ['Id','BoEDetailsId','InventoryItemId','RecieptNumber','NewUnitPrice'],
                        where: { isCostUpdatedId: null } 
                    },
                ]
            };

            dataaccess.FindAll(BoEDetails, param)
                .then(function (result) {
                    if (result != null) {
                        let newBoEList = [];
                        //console.log(result)
                        result.forEach(element1 => {
                            let HeaderPONumber = element1.PONumber;
                            let BoEDetailsMaps = element1.BoEDetailsMaps;
                            BoEDetailsMaps.forEach(element2 => {
                                newBoEList.push({
                                    Id: element2.Id,
                                    BoEDetailsId: element2.BoEDetailsId,
                                    InventoryItemId: element2.InventoryItemId,
                                    RecieptNumber: element2.RecieptNumber,
                                    NewUnitPrice: element2.NewUnitPrice,
                                    PONumber:HeaderPONumber
                                })
                            });
                        });

                        resolve(newBoEList);
                    }
                },
                function (err) {
                    dataconn.errorlogger('BoEDetailsService', 'FetchDetailsForCostAPI', err);
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
                    dataconn.errorlogger('BoEDetailsService', 'FetchDetailsFormPOCostReport', err);
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
    
                        const BoEDetailsMap = datamodel.BoEDetailsMap();
    
                        var values = {
                            isCostUpdatedId:1,
                            AdjustmentNumber:response.data.AdjustmentNumber,
                            ModifiedDate: connect.sequelize.fn("NOW"),
                        };
    
                        var param = {
                            RecieptNumber: response.data.ReceiptNumber,
                            InventoryItemId: response.data.ItemId,
                        };
    
                        dataaccess.Update(BoEDetailsMap, values, param)
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

    // router.route('/CostAPI')
    // .get(function (req, res) {
    //     FetchDetailsForCostAPI()
    //     .then((result1)=>{
    //         let BoEDetailsList = result1;
    //         FetchDetailsFormPOCostReport(BoEDetailsList)
    //         .then((result2)=>{
    //             let FinalListForCostAPI = result2;
    //             CostAdjustmentAPI(FinalListForCostAPI)
    //             .then((responseResult)=>{
    //                 res.status(200).json({ success: true, message: "Fetch Details Form PO Cost Report", Data: null })
    //             })
    //             .catch((error)=>{
    //                 res.status(200).json({ success: false, message: "Cost Adjustment API", Data: null })
    //             })
    //         })
    //         .catch((error)=>{
    //             res.status(200).json({ success: false, message: "Fetch Details Form PO Cost Report", Data: null })
    //         })
    //     })
    //     .catch((error)=>{
    //         res.status(200).json({ success: false, message: "Fetch Details For Cost API", Data: null })
    //     })
    // });

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

    //End Routes

    return router;

};

module.exports = routes;