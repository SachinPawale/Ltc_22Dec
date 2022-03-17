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

var routes = function () {
    router.route('/GetAssertDetailsByASSET_NUMBER')
        .post(function (req, res) {
            let ASSET_NUMBER_Obj = req.body.ASSET_NUMBER;
            const famiscmaster = datamodel.famiscmaster();
            var param = {
                where: { ASSET_NUMBER: ASSET_NUMBER_Obj },
            };
            dataaccess.FindAll(famiscmaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ success: true, message: "famiscmaster access", Data: result })
                    }
                    else {
                        res.status(200).json({
                            success: false, message: "User has no access of famiscmaster",
                            Data: "nothing"
                        });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('TransactionService', 'GetAssertDetailsByASSET_NUMBER', err);
                        res.status(200).json({ success: false, message: "User has no access of famiscmaster", Data: null });
                    })
        });

    router.route('/GetAssertDetailsByASSET_Id')
        .post(function (req, res) {
            let ASSET_Id = req.body.Id;
            const AssetDetails = datamodel.AssetDetails();
            var param = {
                where: { Id: ASSET_Id },
            };
            dataaccess.FindAll(AssetDetails, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ success: true, message: "AssetDetails access", Data: result })
                    }
                    else {
                        res.status(200).json({
                            success: false, message: "User has no access of AssetDetails",
                            Data: "nothing"
                        });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('TransactionService', 'GetAssertDetailsByASSET_Id', err);
                        res.status(200).json({ success: false, message: "User has no access of AssetDetails", Data: null });
                    })
        });

    router.route('/GetAllASSET_NUMBER/:LOCATION')
        .get(function (req, res) {

            const famiscmaster = datamodel.famiscmaster();
            var param = {
                attributes: ['Id', 'ASSET_NUMBER', 'ITEM_DESC', 'SUPPLIER_CODE'],
                where: { LOCATION: req.params.LOCATION },
                order: [['ASSET_NUMBER']]
            };

            dataaccess.FindAll(famiscmaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'famiscmaster Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of famiscmaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TransactionService', 'GetAllASSET_NUMBER', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of famiscmaster', Data: null });
                });
        });

    // router.route('/CreateAsset')
    //     .post(function (req, res) {
    //         const AssetDetails = datamodel.AssetDetails();
    //         var values = {
    //             SerialNumber: req.body.SerialNumber,
    //             ReceiptNumber: req.body.ReceiptNumber,
    //             AssetNumber: req.body.AssetNumber,
    //             OrganizationId: req.body.OrganizationId,
    //             LocationCode: req.body.ToLocation.LocationCode,
    //             AssetType: req.body.AssetType,
    //             Cost: req.body.Cost,
    //             LTD_DEP: req.body.LTD_DEP,
    //             NBV: req.body.NBV,
    //             AssertQuantity: req.body.AssertQuantity,
    //             Item: req.body.Item,
    //             UnitOfMeasure: req.body.UnitOfMeasure,
    //             Location: req.body.Location,
    //             InterfaceBatchNumber: req.body.InterfaceBatchNumber,
    //             TransactionDate: req.body.TransactionDate,
    //             DesORGCode: req.body.DesORGCode,
    //             DesTypeCode: req.body.DesTypeCode,
    //             Locator: req.body.Locator,
    //             DesSubInventoryCode: req.body.DesSubInventoryCode,
    //             DFFS: req.body.DFFS,
    //             CurrencyCode: 1,
    //             EntityCode: 1,
    //             StatusId: req.body.StatusId,
    //             CreatedBy: 1
    //         };
    //         dataaccess.Create(AssetDetails, values)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     res.status(200).json({ Success: true, Message: 'Asset saved successfully', Data: result });
    //                 }
    //                 else {
    //                     dataconn.errorlogger('TransactionService', 'CreateAsset', { message: 'No object found', stack: '' });
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('TransactionService', 'CreateAsset', err);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //             });
    //     });

    router.route('/GetAllASSET_Details')
        .get(function (req, res) {

            const AssetDetails = datamodel.AssetDetails();
            var param = { order: [['Id']] };

            dataaccess.FindAll(AssetDetails, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'AssetDetails Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of AssetDetails', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TransactionService', 'GetAllASSET_Details', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of AssetDetails', Data: null });
                });
        });

    router.route('/CreateOrganization')
        .get(function (req, res) {

            var config = {
                // method: 'get',
                // url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryOrganizations',
                // headers: {
                //     'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
                //     'Cookie': 'ak_bmsc=D9EB9F9CB408E75F55D392946AB7130A~000000000000000000000000000000~YAAQBl8sMdx7+Ah9AQAAt2W2cA3lv2apxvi/XpT3UD0ErCIWsRhegqAG+ig0JkkXodB6+GPuQdRWD9O/jWIdA+0fYu2PkPXDeZbyUMxXCzq79HMCYqudTrLdvJtwiMMApUFmOuA74kpWw8xIiBFEDQirPLms8fVwP2RFXqFPCJZwpTCsItwjM67iWBjujJBFQpS7NftX95lfjMXQORHnuaRixSJKVm5VAeD3F8tiVwHlfhREzyujqqhf7+ykAq8E2kUfm8TUer/8EJJS5+jGt6pFB1ufp7FBCs8gTs94Uoc97WOOlFSNr9+dvOswfn/JXAgFgBGTJB7unSBp0bx7M5gRzFzl/gfgaKqNzi5LQvXuEzHNePwf7ED49qXf4DTty/ZHtN2qTOw='
                // }
                method: configuration.OrganizationData.configData.method,
                url: configuration.OrganizationData.configData.url,
                headers: configuration.OrganizationData.configData.headers
            };

            axios(config)
                .then(function (response) {
                    const OrganizationDetails = datamodel.OrganizationDetails();

                    OrganizationDetails.destroy({
                        where: {},
                        truncate: true
                    })
                        .then(() => {
                            var bulkdata = response.data.items;
                            OrganizationDetails.bulkCreate(bulkdata).then(() => {
                                return OrganizationDetails.findAll();
                            })
                                .then(result => {
                                    res.status(200).json({ Success: true, Message: "All Organizations saved successfully", Data: result });
                                })
                                .catch(function (error) {
                                    dataconn.errorlogger('TransactionService', 'CreateOrganization', error);
                                    res.status(200).json({ Success: false, Message: "Error while saving Organizations", Data: error });
                                });
                        })
                        .catch(function (error) {
                            dataconn.errorlogger('TransactionService', 'CreateOrganization', error);
                            res.status(200).json({ Success: true, Message: "Error while saving Organizations", Data: error });
                        });
                })
                .catch(function (error) {
                    dataconn.errorlogger('TransactionService', 'CreateOrganization', error);
                    res.status(200).json({ Success: true, Message: "Error while saving Organizations", Data: error });
                });
        });

    router.route('/GetAllOrganization')
        .get(function (req, res) {

            const OrganizationDetails = datamodel.OrganizationDetails();
            var param = { attributes: ['OrganizationId', 'OrganizationCode', 'OrganizationName'], order: [['OrganizationName']] };
            dataaccess.FindAll(OrganizationDetails, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'OrganizationDetails Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of OrganizationDetails', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('TransactionService', 'GetAllOrganization', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of OrganizationDetails', Data: null });
                });
        });

    router.route('/GetAllMuptipleASSET_Details')
        .get(function (req, res) {

            const Asset = datamodel.Asset();
            var param = {
                include: { all: true, nested: true },
                order: [['Id', 'DESC']]
            };

            dataaccess.FindAll(Asset, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Asset Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Asset', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('transaction', 'GetAllMuptipleASSET_Details', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of Asset', Data: null });
                });
        });

    router.route('/CreateMultipleAsset')
        .post(function (req, res) {

            connect.sequelize.transaction().then(trans => {

                const Asset = datamodel.Asset();
                var values = {
                    SerialNumber: req.body.SerialNumber,
                    ReceiptNumber: req.body.ReceiptNumber,
                    AssetNumber: req.body.AssetNumber,
                    OrganizationId: req.body.Organization == null ? null : req.body.Organization.OrganizationId,
                    LocationCode: req.body.ToLocation == null ? null : req.body.ToLocation.LocationCode,
                    AssetType: req.body.AssetType,
                    InterfaceBatchNumber: req.body.InterfaceBatchNumber,
                    TransactionDate: req.body.TransactionDate,
                    DesORGCode: req.body.DesORGCode == null ? null : req.body.DesORGCode.OrganizationCode,
                    DesTypeCode: req.body.DesTypeCode,
                    Locator: req.body.Locator,
                    DesSubInventoryCode: req.body.DesSubInventoryCode,
                    DesSubInventoryName: req.body.DesSubInventoryName,
                    DFFS: req.body.DFFS,
                    FromLocation: req.body.FromLocation,
                    ToLocationWithSiteCode: req.body.ToLocationWithSiteCode,
                    StatusId: req.body.StatusId,
                    CreatedBy: req.body.userId
                };
                dataaccess.CreateWithTransaction(Asset, values, trans)
                    .then(function (result) {
                        if (result != null) {

                            let AssetType = req.body.AssetType;
                            let AssetIdForEmail = result.Id;
                            const AssetDetails = datamodel.AssetDetails();
                            var mapDetails = [];
                            var promiseDetails = req.body.AssetDetails.map(function (mapitem) {
                                if (AssetType == 'CAM' || AssetType == 'SRN') {
                                    mapDetails.push({
                                        AssetId: result.Id,
                                        AssetNumber: mapitem.ASSET_NUMBER,
                                        AssetDesc: mapitem.ASSET_DESC,
                                        Cost: mapitem.COST,
                                        LTD_DEP: mapitem.DEPRN_RESERVE,
                                        NBV: mapitem.NBV,
                                        AssertQuantity: mapitem.CURRENT_UNITS,
                                        Item: mapitem.ITEM_NUMBER,
                                        ItemDesc: mapitem.ITEM_DESC,
                                        UnitOfMeasure: mapitem.PRIMARY_UOM_CODEA,
                                        Location: mapitem.LOCATION,
                                        SupplierCode: mapitem.SUPPLIER_CODE,
                                        LocationCode: mapitem.LOCATION_CODE,
                                        DepartmentCode: mapitem.DEPTARTMENT_CODE,
                                        CreatedBy: req.body.userId
                                    });
                                }
                                else {
                                    mapDetails.push({
                                        AssetId: result.Id,
                                        Cost: mapitem.COST,
                                        AssertQuantity: mapitem.ITEM_QUANTITY,
                                        LotNumber: mapitem.LOT_NUMBER,
                                        Item: mapitem.ITEM_NUMBER,
                                        ItemDesc: mapitem.ITEM_DESC,
                                        UnitOfMeasure: mapitem.PRIMARY_UOM_CODE,
                                        Location: mapitem.INTERNAL_LOCATION_CODE,
                                        SupplierCode: mapitem.SUPPLIER_ITEM_CODE,
                                        LocationCode: mapitem.LOCATION_CODE,
                                        DepartmentCode: mapitem.DEPTARTMENT_CODE,
                                        CreatedBy: req.body.userId
                                    });
                                }
                            });

                            Promise.all(promiseDetails).then(function () {
                                dataaccess.BulkCreateWithTransaction(AssetDetails, mapDetails, trans)
                                    .then((assetresult) => {
                                        trans.commit();

                                        // let pdftemplateData = {
                                        //     //URL: req.protocol + '://' + req.get('host'),
                                        //     data: req.body.AssetDetails,
                                        //     Remarks: "Pending For Approval"
                                        // };

                                        if(req.body.StatusId != 3){
                                            let formatedCost = Number(parseFloat(req.body.totalNBVForEmail).toFixed(2)).toLocaleString('en', {
                                                minimumFractionDigits: 2
                                            });
    
                                            let mailtemplateData = {
                                                AssetType: req.body.AssetType,
                                                AssetNumber: req.body.InterfaceBatchNumber,
                                                FromLocation: req.body.Organization.OrganizationName,
                                                ToLocation: req.body.DesORGCode.OrganizationName,
                                                FromLocationWithSiteCode: req.body.FromLocation,
                                                ToLocationWithSiteCode: req.body.ToLocationWithSiteCode,
                                                TotalAmount: formatedCost,
                                                ui_url : configuration.ui_url
                                            };
                                            let mailData = {
                                                fromEmail: req.body.userEmail,
                                                toEmail: configuration.EmailIds.ForApproval.ToEmailIds,
                                                ccEmail : configuration.EmailIds.ForApproval.CcEmailIds,
                                                subjectEmail: req.body.AssetType + ' - ' + req.body.InterfaceBatchNumber + " For Approval"
                                            };
                                            //const pdfTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetPDF.ejs');
                                            const emailTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetResponse.ejs');
                                            sentAssetMail(AssetIdForEmail,mailtemplateData,mailData,emailTemplatePath);
                                        }

                                        res.status(200).json({ Success: true, Message: 'Asset saved successfully', Data: result });
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('TransactionService', 'CreateMultipleAsset', err);
                                            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                                        });
                            });
                        }

                    }, function (err) {
                        trans.rollback();
                        dataconn.errorlogger('TransactionService', 'CreateMultipleAsset', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                    });
            });
        });

    router.route('/GetMultipleAssertDetailsByASSET_Id')
        .post(function (req, res) {
            const Asset = datamodel.Asset();
            const OrganizationDetails = datamodel.OrganizationDetails();
            var param = {
                where: { Id: req.body.Id },
                include: { all: true, nested: true },
            };
            dataaccess.FindAll(Asset, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ success: true, message: "AssetDetails access", Data: result })
                    }
                    else {
                        res.status(200).json({
                            success: false, message: "User has no access of AssetDetails",
                            Data: "nothing"
                        });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('transaction', 'GetMultipleAssertDetailsByASSET_Id', err);
                        res.status(200).json({ success: false, message: "User has no access of AssetDetails", Data: null });
                    })
        });

    router.route('/GetAllLocation/:TYPE')
        .get(function (req, res) {

            let TYPE = req.params.TYPE

            const LocationDetails = datamodel.LocationDetails();
            if (TYPE == 'CAM') {
                var param = {
                    where: { InventoryOrganizationId: null },
                };
            }
            else if (TYPE == 'SRN') {
                var param = {
                    where: {
                        InventoryOrganizationId: { [Op.ne]: null }
                    }
                };
            }
            else if (TYPE == 'RMO') {
                var param = {
                    where: {
                        InventoryOrganizationId: { [Op.ne]: null }
                    }
                };
            }

            dataaccess.FindAll(LocationDetails, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ success: true, message: "LocationDetails access", Data: result })
                    }
                    else {
                        res.status(200).json({
                            success: false, message: "User has no access of LocationDetails",
                            Data: null
                        });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('TransactionService', 'GetAllLocation', err);
                        res.status(200).json({ success: false, message: "User has no access of LocationDetails", Data: null });
                    })
        });

    router.route('/CreateLocationDetails')
        .get(function (req, res) {
            var config = {
                // method: 'get',
                // url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/hcmRestApi/resources/11.13.18.05/locationsV2/',
                // headers: {
                //     'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
                // }
                method: configuration.LocationData.configData.method,
                url: configuration.LocationData.configData.url,
                headers: configuration.LocationData.configData.headers
            };
            axios(config)
                .then(function (response) {
                    const LocationDetails = datamodel.LocationDetails();
                    LocationDetails.destroy({
                        where: {},
                        truncate: true
                    })
                        .then(() => {
                            var bulkdata = response.data.items;
                            LocationDetails.bulkCreate(bulkdata).then(() => {
                                return LocationDetails.findAll();
                            })
                                .then(result => {
                                    res.status(200).json({ Success: true, Message: "All LocationDetails saved successfully", Data: result });
                                })
                                .catch(function (error) {
                                    dataconn.errorlogger('TransactionService', 'CreateLocationDetails', error);
                                    res.status(200).json({ Success: false, Message: "Error while saving LocationDetails", Data: error });
                                });
                        })
                        .catch(function (error) {
                            dataconn.errorlogger('TransactionService', 'CreateLocationDetails', error);
                            res.status(200).json({ Success: true, Message: "Error while saving LocationDetails", Data: error });
                        });
                })
                .catch(function (error) {
                    dataconn.errorlogger('TransactionService', 'CreateLocationDetails', error);
                    res.status(200).json({ Success: true, Message: "Error while saving LocationDetails", Data: error });
                });
        });

    // router.route('/miscReciept')
    //     .post(function (req, res) {

    //         let assetDetails = req.body.assetDetails;
    //         let list = [];


    //         assetDetails.forEach((element, index) => {
    //             list.push(
    //                 {
    //                     "id": "part" + (index + 1),
    //                     "path": "/inventoryStagedTransactions",
    //                     "operation": "create",
    //                     "payload": {
    //                         "OrganizationName": element.OrganizationName,
    //                         "InventoryItemId": element.InventoryItemId,
    //                         "TransactionTypeId": "Miscellaneous Receipt", //Hard Coded
    //                         "TransactionQuantity": element.TransactionQuantity,
    //                         "TransactionUnitOfMeasure": element.TransactionUnitOfMeasure,
    //                         "TransactionInterfaceId": element.TransactionInterfaceId,
    //                         "TransactionDate": element.TransactionDate,
    //                         "TransactionHeaderId": element.TransactionHeaderId,
    //                         "SubinventoryCode": element.SubinventoryCode,
    //                         "DistributionAccountId": element.DistributionAccountId,
    //                         "SourceCode": element.SourceCode,
    //                         "SourceLineId": element.SourceLineId,
    //                         "SourceHeaderId": element.SourceHeaderId,
    //                         "UseCurrentCostFlag": "false", //Hard Coded
    //                         "TransactionCost": element.TransactionCost,
    //                         "TransactionCostIdentifier": element.TransactionCostIdentifier,
    //                         "TransactionMode": "3", //Hard Coded
    //                         "costs": [{
    //                             "CostComponentCode": "ITEM_PRICE", //Hard Coded
    //                             "Cost": element.Cost
    //                         }],

    //                     }
    //                 }

    //             );
    //         });

    //         var data = JSON.stringify({
    //             "parts": list
    //         });

    //         var config = {
    //             method: 'post',
    //             url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05',
    //             headers: {
    //                 'Content-Type': 'application/vnd.oracle.adf.batch+json',
    //                 'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
    //             },
    //             data: data
    //         };

    //         axios(config)
    //             .then(function (response) {
    //                 console.log("MiscReceipt response", response.data);
    //                 res.status(200).json({ Success: true, Message: "Success", Data: response.data });
    //             })
    //             .catch(function (error) {
    //                 res.status(200).json({ Success: false, Message: "Error", Data: list });
    //             });
    //     });

    // router.route('/transferMoveOrder')
    // .post(function (req, res) {


    //     let AssetType = req.body.AssetRequestBody.AssetType;
    //     let InterfaceSourceCode = "EXT";
    //     let SupplyRequestStatus = "NEW";
    //     let SupplyOrderSource = "EXT";
    //     let SupplyOrderReferenceId = 1;
    //     let TransferCostCurrencyCode = "INR";
    //     let ProcessRequestFlag = "Y";
    //     let SupplyOrderReferenceLineId = 1;
    //     let BackToBackFlag = "N";
    //     let PreparerEmail = "akshay.arora@depthconsulting.in";
    //     let DeliverToRequesterEmail = "akshay.arora@depthconsulting.in";
    //     let SupplyType = "TRANSFER";
    //     let DestinationTypeCode;
    //     if(AssetType == "CAM"){
    //         DestinationTypeCode = "EXPENSE"
    //     }
    //     else if(AssetType == "SRN"){
    //         DestinationTypeCode = "INVENTORY"
    //     }
    //     else{
    //         DestinationTypeCode = "INVENTORY"
    //     }

    //     var data = JSON.stringify({
    //         "InterfaceSourceCode": InterfaceSourceCode, //HardCoded
    //         "InterfaceBatchNumber": "batch100001", //Seq4
    //         "SupplyRequestStatus": SupplyRequestStatus, //HardCoded
    //         "SupplyRequestDate": "2021-12-03T11:00:03.503-08:00",
    //         "SupplyOrderSource": SupplyOrderSource, //HardCoded
    //         "SupplyOrderReferenceNumber": "200001", //Seq5
    //         "SupplyOrderReferenceId": SupplyOrderReferenceId, //HardCoded
    //         "TransferCostCurrencyCode": TransferCostCurrencyCode , //HardCoded
    //         "ProcessRequestFlag": ProcessRequestFlag, //HardCoded
    //         "supplyRequestLines": [
    //           {
    //             "InterfaceBatchNumber": "batch100001", //Seq4
    //             "SupplyOrderReferenceLineNumber": "300001", //Seq6
    //             "SupplyOrderReferenceLineId": SupplyOrderReferenceLineId, //HardCoded
    //             "DestinationOrganizationCode": "LTC_GUJARAT",
    //             "SourceOrganizationCode": "LTC_DELHI",
    //             "DestinationSubinventoryCode": "Stores GJ",
    //             "SourceSubinventoryCode": "Stores DL",
    //             "ItemNumber": "LTC-10000253",
    //             "InterfaceSourceCode": InterfaceSourceCode, //HardCoded
    //             "SupplyOrderSource": SupplyOrderSource, //HardCoded
    //             "BackToBackFlag": BackToBackFlag, //HardCoded
    //             "NeedByDate": "2021-12-04T01:01:12.123-08:00",
    //             "Quantity": 10,
    //             "UOMCode": "EA",
    //             "PreparerEmail": PreparerEmail, //HardCoded
    //             "DeliverToRequesterEmail": DeliverToRequesterEmail, //HardCoded
    //             "DestinationTypeCode": DestinationTypeCode,
    //             "SupplyType": SupplyType //HardCoded
    //           }
    //         ]
    //       });

    //       var config = {
    //         method: 'post',
    //         url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/supplyRequests',
    //         headers: { 
    //           'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
    //           'Content-Type': 'application/json'
    //         },
    //         data : data
    //       };

    //       axios(config)
    //       .then(function (response) {
    //         console.log(JSON.stringify(response.data));
    //       })
    //       .catch(function (error) {
    //         console.log(error);
    //       });

    // });


    //     router.route('/UpdateAsset')
    //     .post(async function (req, res) {

    //         let sequencedata =  await getMaxSeqId();
    //         let Seqeuence1 = (sequencedata.Seq1 != null)?(sequencedata.Seq1) : 10000001;
    //         let Seqeuence2 = (sequencedata.Seq2 != null)?(sequencedata.Seq2) : 20000001;
    //         let Seqeuence3 = (sequencedata.Seq3 != null)?(sequencedata.Seq3) : 30000001;
    //         let asset = req.body.AssetRequestBody.AssetDetails;
    //         let status = req.body.StatusId;

    //         if(status == 1 || status == 2){

    //             if(status == 1){
    //                 const Asset = datamodel.Asset();
    //                 var values = {
    //                     Remarks: req.body.Remarks,
    //                     StatusId: 2,
    //                     ModifiedBy: req.body.ModifiedBy,
    //                     ModifiedDate: connect.sequelize.fn('NOW'),
    //                 };
    //                 var param = { Id: req.body.Id };
    //                 await dataaccess.Update(Asset, values, param)
    //             }



    //                 //API calling start

    //                 let TransactionTypeName = "Miscellaneous Receipt";
    //                 let TransactionMode = 1;
    //                 let UseCurrentCostFlag = false;
    //                 let CostComponentCode = "ITEM_PRICE";

    //                 console.log("Misc Start");

    //                 let x = asset.map(async(element) => {
    //                     if(element.miscResponseStatus != 201){
    //                         Seqeuence1 = Seqeuence1 + 1;
    //                         Seqeuence2 = Seqeuence2 + 1;
    //                         Seqeuence3 = Seqeuence3 + 1;

    //                         const AssetDetails = datamodel.AssetDetails();
    //                                 var values = {
    //                                     Seq1: Seqeuence1,
    //                                     Seq2: Seqeuence2,
    //                                     Seq3: Seqeuence3
    //                                 };
    //                                 var param = { Id: element.Id };
    //                              dataaccess.Update(AssetDetails, values, param);

    //                         var data = JSON.stringify({
    //                             "OrganizationName": req.body.AssetRequestBody.OrganizationDetail.OrganizationName,
    //                             "ItemNumber": element.Item,
    //                             "TransactionTypeName": TransactionTypeName, //Hardcoded
    //                             "TransactionQuantity": element.AssertQuantity,
    //                             "TransactionUnitOfMeasure": element.UnitOfMeasure,
    //                             "TransactionDate": moment(req.body.AssetRequestBody.TransactionDate).format('YYYY-MM-DD'),
    //                             "SubinventoryCode": req.body.AssetRequestBody.AssetType,
    //                             "SourceCode": req.body.AssetRequestBody.AssetType,
    //                             "SourceLineId": Seqeuence1,
    //                             "SourceHeaderId": Seqeuence2,
    //                             "TransactionMode": TransactionMode, //Hardcoded
    //                             "UseCurrentCostFlag": UseCurrentCostFlag, //Hardcoded
    //                             "TransactionCostIdentifier": Seqeuence3,
    //                             "lots": [
    //                               {
    //                                 "LotNumber": element.AssetNumber + "-" + moment(req.body.AssetRequestBody.TransactionDate).format('YYYYMMDD'),
    //                                 "TransactionQuantity": element.AssertQuantity
    //                               }
    //                             ],
    //                             "costs": [
    //                               {
    //                                 "Cost": element.Cost,
    //                                 "CostComponentCode": CostComponentCode //Hardcoded
    //                               }
    //                             ]
    //                           });

    //                           var config = {
    //                             method: 'post',
    //                             url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryStagedTransactions',
    //                             headers: { 
    //                               'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
    //                               'Content-Type': 'application/json'
    //                             },
    //                             data : data
    //                           };

    //                           //console.log("Body data:", data)

    //                              axios(config)
    //                                 .then(async function (response) {
    //                                 console.log("AssetNumber response status:",response.status)
    //                                 //console.log("AssetNumber response TransactionHeaderId:",response.data.TransactionHeaderId)
    //                                 //console.log("AssetNumber response TransactionInterfaceId:",response.data.TransactionInterfaceId)

    //                                 const AssetDetails = datamodel.AssetDetails();
    //                                 var values = {
    //                                     TransactionTypeName : TransactionTypeName,
    //                                     TransactionMode : TransactionMode,
    //                                     UseCurrentCostFlag : UseCurrentCostFlag,
    //                                     CostComponentCode : CostComponentCode,
    //                                     miscResponseStatus: response.status,
    //                                     TransactionHeaderId: response.data.TransactionHeaderId,
    //                                     TransactionInterfaceId : response.data.TransactionInterfaceId,
    //                                     ModifiedDate: connect.sequelize.fn("NOW"),
    //                                 };
    //                                 var param = { Id: element.Id };
    //                                 dataaccess.Update(AssetDetails, values, param);
    //                           })
    //                           .catch(function (error) {
    //                             //console.log("catch error",error);
    //                             console.log("error response status",error.response.status);
    //                             console.log("error response data",error.response.data);
    //                             dataconn.apiResponselogger('Misc Reciept API',requestBody.AssetRequestBody.Id,0,error.response.status,error.response.data,1);
    //                           });
    //                     }
    //                 });

    //                 await Promise.all(x);

    //                 console.log("Misc End");

    //                 const AssetDetails = datamodel.AssetDetails();
    //                 var param = {
    //                     attributes: [ ['miscResponseStatus',"mis"] ] ,
    //                     where: { AssetId : req.body.Id }           
    //                 };

    //                 let miscResponseStatusdata = await dataaccess.FindAll(AssetDetails, param);
    //                 let misAPIStatus = true;
    //                 miscResponseStatusdata.forEach((element) => {
    //                     if(element.dataValues.mis != 201){
    //                         misAPIStatus = false;
    //                     }
    //                     //console.log("miscResponseStatusdata",element.dataValues.mis)

    //                 });

    //                     console.log("misAPIStatus",misAPIStatus)
    //                 if(misAPIStatus == true){
    //                     TransferMoveOrderApi(req.body,sequencedata);
    //                 }

    //                 //API calling end
    //                 res.status(200).json({ Success: true, Message: 'AssetDetails updated successfully', Data: null });

    //         }
    //         else{
    //             const Asset = datamodel.Asset();
    //             var values = {
    //                 Remarks: req.body.Remarks,
    //                 StatusId: req.body.StatusId,
    //                 ModifiedBy: req.body.ModifiedBy,
    //                 ModifiedDate: connect.sequelize.fn('NOW'),
    //             };
    //             var param = { Id: req.body.Id };
    //             dataaccess.Update(Asset, values, param)
    //                 .then(function (result) {
    //                     if (result != null) {
    //                         res.status(200).json({ Success: true, Message: 'AssetDetails updated successfully', Data: result });
    //                     }
    //                     else {
    //                         dataconn.errorlogger('StateService', 'UpdateAsset', { message: 'No object found', stack: '' });
    //                         res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //                     }
    //                 }, function (err) {
    //                     dataconn.errorlogger('StateService', 'UpdateAsset', err);
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
    //                 });
    //         }
    //     });

    // async function TransferMoveOrderApi(request,sequence){

    //         console.log("Transfer Start");
    //         let requestBody = request;
    //         let sequencedata = sequence;
    //         let Seqeuence4 = requestBody.AssetRequestBody.InterfaceBatchNumber;
    //         //let Seqeuence4 = (sequencedata.Seq4 != null)?(sequencedata.Seq4) : 40000001;
    //         let Seqeuence5 = (sequencedata.Seq5 != null)?(sequencedata.Seq5 + 1) : 50000001;
    //         let Seqeuence6 = (sequencedata.Seq6 != null)?(sequencedata.Seq6) : 60000001;
    //         let AssetType = requestBody.AssetRequestBody.AssetType;
    //         let InterfaceSourceCode = "EXT";
    //         let SupplyRequestStatus = "NEW";
    //         let SupplyOrderSource = "EXT";
    //         let SupplyOrderReferenceId = 1;
    //         let TransferCostCurrencyCode = "INR";
    //         let ProcessRequestFlag = "Y";
    //         let SupplyOrderReferenceLineId = 1;
    //         let BackToBackFlag = "N";
    //         let PreparerEmail = "akshay.arora@depthconsulting.in";
    //         let DeliverToRequesterEmail = "akshay.arora@depthconsulting.in";
    //         let SupplyType = "TRANSFER";
    //         let DestinationTypeCode;
    //         if(AssetType == "CAM"){
    //             DestinationTypeCode = "EXPENSE"
    //         }
    //         else if(AssetType == "SRN"){
    //             DestinationTypeCode = "INVENTORY"
    //         }
    //         else{
    //             DestinationTypeCode = "INVENTORY"
    //         }

    //         let asset = requestBody.AssetRequestBody.AssetDetails;
    //         let list = [];

    //         asset.forEach((element) => {
    //             Seqeuence6 = Seqeuence6 + 1;
    //             list.push({
    //                 "InterfaceBatchNumber": Seqeuence4, //Seq4
    //                 "SupplyOrderReferenceLineNumber": Seqeuence6, //Seq6
    //                 "SupplyOrderReferenceLineId": Seqeuence6, //HardCoded
    //                 "DestinationOrganizationCode": requestBody.AssetRequestBody.DesORGCode,
    //                 "SourceOrganizationCode": requestBody.AssetRequestBody.OrganizationDetail.OrganizationCode,
    //                 "DestinationSubinventoryCode": requestBody.AssetRequestBody.DesSubInventoryCode,
    //                 "SourceSubinventoryCode": requestBody.AssetRequestBody.AssetType,
    //                 "ItemNumber": element.Item,
    //                 "InterfaceSourceCode": InterfaceSourceCode, //HardCoded
    //                 "SupplyOrderSource": SupplyOrderSource, //HardCoded
    //                 "BackToBackFlag": BackToBackFlag, //HardCoded
    //                 "NeedByDate": moment(requestBody.AssetRequestBody.TransactionDate).format('YYYY-MM-DD'),
    //                 "Quantity": element.AssertQuantity,
    //                 "UOMCode": element.UnitOfMeasure,
    //                 "PreparerEmail": PreparerEmail, //HardCoded
    //                 "DeliverToRequesterEmail": DeliverToRequesterEmail, //HardCoded
    //                 "DestinationTypeCode": DestinationTypeCode, //HardCoded
    //                 "SupplyType": SupplyType, //HardCoded
    //                 "DestinationLocation": requestBody.AssetRequestBody.LocationCode 
    //             })
    //         });

    //         var data = JSON.stringify({
    //             "InterfaceSourceCode": InterfaceSourceCode, //HardCoded
    //             "InterfaceBatchNumber": Seqeuence4, //Seq4
    //             "SupplyRequestStatus": SupplyRequestStatus, //HardCoded
    //             "SupplyRequestDate": moment(requestBody.AssetRequestBody.TransactionDate).format('YYYY-MM-DD'),
    //             "SupplyOrderSource": SupplyOrderSource, //HardCoded
    //             "SupplyOrderReferenceNumber": Seqeuence5, //Seq5
    //             "SupplyOrderReferenceId": Seqeuence5, //HardCoded
    //             "TransferCostCurrencyCode": TransferCostCurrencyCode , //HardCoded
    //             "ProcessRequestFlag": ProcessRequestFlag, //HardCoded
    //             "supplyRequestLines": list
    //           });

    //           var config = {
    //             method: 'post',
    //             url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/supplyRequests',
    //             headers: { 
    //               'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
    //               'Content-Type': 'application/json'
    //             },
    //             data : data
    //           };

    //           axios(config)
    //           .then(function (response) {
    //               console.log("transfer Response")
    //             // console.log(JSON.stringify(response.status));
    //             // console.log(JSON.stringify(response.data));

    //             if(response.status == 201){
    //                 let supplyRequestLines = response.data.supplyRequestLines;
    //                 console.log("Sequence 5",Seqeuence5);
    //                 console.log("Sequence 6",Seqeuence6);

    //                 supplyRequestLines.forEach((element) => {
    //                     const AssetDetails = datamodel.AssetDetails();
    //                     var values = {   
    //                         Seq4: response.data.InterfaceBatchNumber,
    //                         Seq5: response.data.SupplyOrderReferenceNumber,
    //                         Seq6: element.SupplyOrderReferenceLineNumber,
    //                         transferResponseStatus: response.status,
    //                         ModifiedDate: connect.sequelize.fn("NOW"),
    //                     };
    //                     var param = { 
    //                         AssetId: requestBody.AssetRequestBody.Id ,
    //                         Item : element.ItemNumber
    //                     };
    //                     dataaccess.Update(AssetDetails, values, param);
    //                 });

    //                 console.log("Transfer End");

    //                 const Asset = datamodel.Asset();
    //                     var values = {
    //                         StatusId: 1,
    //                         ModifiedBy: 1,
    //                         ModifiedDate: connect.sequelize.fn('NOW'),
    //                     };
    //                 var param = { Id: requestBody.AssetRequestBody.Id };
    //                 dataaccess.Update(Asset, values, param)

    //             }

    //           })
    //           .catch(function (error) {
    //             console.log("error response status",error.response.status);
    //             console.log("error response data",error.response.data);
    //             dataconn.apiResponselogger('Transfer Move Order',requestBody.AssetRequestBody.Id,0,error.response.status,error.response.data,1);
    //           });
    // }

    //API Sync Start

    async function getMaxSeqId() {
        const AssetDetails = datamodel.AssetDetails();
        var param = {
            attributes: [
                [Sequelize.fn('MAX', Sequelize.col('Seq1')), "Seq1"],
                [Sequelize.fn('MAX', Sequelize.col('Seq2')), "Seq2"],
                [Sequelize.fn('MAX', Sequelize.col('Seq3')), "Seq3"],
                [Sequelize.fn('MAX', Sequelize.col('Seq4')), "Seq4"],
                [Sequelize.fn('MAX', Sequelize.col('Seq5')), "Seq5"],
                [Sequelize.fn('MAX', Sequelize.col('Seq6')), "Seq6"],
            ],
            raw: true
        };
        try {
            let data = await dataaccess.FindOne(AssetDetails, param);
            return data;
        }
        catch (error) {
            return error;
        }


    }

    router.route('/Getmaxseq')
        .get(async function (req, res) {
            try {
                let data = await getMaxSeqId();
                res.status(200).json({ success: true, message: "", Data: data })
            }
            catch (error) {
                res.status(500).json({ success: false, message: "", Data: null })
            }
        });

    router.route('/ApproveRejectAsset')
        .post(async function (req, res) {

            console.log("ApproveRejectAsset API Started")

            let request = req.body;
            let sequencedata = await getMaxSeqId();
            let status = req.body.StatusId;

            if (status == 1 || status == 2) {

                if (status == 1) {
                    const Asset = datamodel.Asset();
                    var values = {
                        Remarks: req.body.Remarks,
                        StatusId: 2,
                        ModifiedBy: req.body.ModifiedBy,
                        ModifiedDate: connect.sequelize.fn('NOW'),
                    };
                    var param = { Id: req.body.Id };
                    await dataaccess.Update(Asset, values, param)
                }

                MiscRecieptAPI(request, sequencedata)
                    .then(async (result) => {

                        console.log("misc resolved")

                        setTimeout(async function () {
                            console.log("wait")
                            const AssetDetails = datamodel.AssetDetails();
                            var param = {
                                attributes: [['miscResponseStatus', "mis"], "Id", "ModifiedDate"],
                                where: { AssetId: req.body.Id }
                            };

                            let miscResponseStatusdata = await dataaccess.FindAll(AssetDetails, param);
                            let misAPIStatus = true;
                            let AssetModifiedDate = '';
                            // console.log("miscResponseStatusdata", miscResponseStatusdata);
                            miscResponseStatusdata.forEach((element) => {
                                AssetModifiedDate = element.dataValues.ModifiedDate;
                                // AssetModifiedDate.push({

                                //     Id: element.dataValues.Id,
                                //     ModifiedDate: element.dataValues.ModifiedDate,
                                // })
                                if (element.dataValues.mis != 201) {
                                    misAPIStatus = false;
                                }
                            });
                            console.log("AssetModifiedDate", AssetModifiedDate);

                            console.log("Check misAPIStatus", misAPIStatus);
                            if (misAPIStatus == true) {
                                TransferMethodAPI(request, sequencedata, AssetModifiedDate)
                                    .then((finalresult) => {
                                        console.log("ApproveRejectAsset API Ended")

                                        let formatedCost = Number(parseFloat(request.TotalAmount).toFixed(2)).toLocaleString('en', {
                                            minimumFractionDigits: 2
                                        });

                                        let mailtemplateData = {
                                            AssetType: request.AssetType,
                                            AssetNumber: request.InterfaceBatchNumber,
                                            FromLocation: request.FromLocation,
                                            ToLocation: request.ToLocation,
                                            FromLocationWithSiteCode: request.FromLocationWithSiteCode,
                                            ToLocationWithSiteCode: request.ToLocationWithSiteCode,
                                            TotalAmount: formatedCost,
                                            ui_url : configuration.ui_url
                                        };
                                        let mailData = {
                                            fromEmail: request.userEmail,
                                            toEmail: configuration.EmailIds.Approved.ToEmailIds,
                                            ccEmail : request.userEmail + ';' + configuration.EmailIds.Approved.CcEmailIds,
                                            subjectEmail: req.body.AssetType + ' - ' + req.body.InterfaceBatchNumber + " Approved"
                                        };
                                        const emailTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/approveAssetResponse.ejs');
                                        sentAssetMail(req.body.Id,mailtemplateData,mailData,emailTemplatePath);

                                        res.status(200).json({ Success: true, Message: 'AssetDetails updated successfully', Data: null });
                                    })
                                    .catch((error) => {
                                        console.log("error1",error);
                        
                                    
                                        dataconn.errorlogger('TransactionService', 'ApproveRejectAsset', error);
                                        res.status(200).json({ success: false, message: "Transfer Method API Error", Data: error });
                                    });
                            }
                            else {
                                console.log("misAPIStatus false , ApproveRejectAsset API Ended");
                                //dataconn.errorlogger('TransactionService', 'ApproveRejectAsset', err);
                                res.status(200).json({ Success: true, Message: 'AssetDetails updated successfully', Data: null });
                            }
                        }, 1000)


                    })
                    .catch((error) => {
                        console.log("error 2",error);
                        dataconn.errorlogger('TransactionService', 'ApproveRejectAsset', error);
                        res.status(200).json({ success: false, message: "Misc Method API Error", Data: error });
                    });

            }
            else {
                const Asset = datamodel.Asset();
                var values = {
                    Remarks: req.body.Remarks,
                    StatusId: req.body.StatusId,
                    ModifiedBy: req.body.ModifiedBy,
                    ModifiedDate: connect.sequelize.fn('NOW'),

                };


                var param = { Id: req.body.Id };
                dataaccess.Update(Asset, values, param)
                    .then(function (result) {
                        if (result != null) {
                            
                            let formatedCost = Number(parseFloat(request.TotalAmount).toFixed(2)).toLocaleString('en', {
                                  minimumFractionDigits: 2
                            });

                            //let formatedCost = (parseFloat(request.TotalAmount).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                            let mailtemplateData = {
                                AssetType: request.AssetType,
                                AssetNumber: request.InterfaceBatchNumber,
                                FromLocation: request.FromLocation,
                                ToLocation: request.ToLocation,
                                FromLocationWithSiteCode: request.FromLocationWithSiteCode,
                                ToLocationWithSiteCode: request.ToLocationWithSiteCode,
                                TotalAmount: formatedCost,
                                ui_url : configuration.ui_url
                            };
                            let mailData = {
                                fromEmail: request.userEmail,
                                toEmail: request.userEmail,
                                ccEmail : configuration.EmailIds.Rejected.CcEmailIds,
                                subjectEmail: req.body.AssetType + ' - ' + req.body.InterfaceBatchNumber + " Rejected"
                            };
                            const emailTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/rejectAssetResponse.ejs');
                            sentAssetMail(req.body.Id,mailtemplateData,mailData,emailTemplatePath);
                            
                            res.status(200).json({ Success: true, Message: 'AssetDetails updated successfully', Data: result });
                        }
                        else {
                            dataconn.errorlogger('TransactionService', 'ApproveRejectAsset', { message: 'No object found', stack: '' });
                            res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                        }
                    }, function (err) {
                        console.log("error 3",error);
                        dataconn.errorlogger('TransactionService', 'ApproveRejectAsset', err);
                        res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    });
            }
        });

    async function MiscRecieptAPI(request, sequence) {

        return new Promise(async (resolve, reject) => {

            const AssetDetails = datamodel.AssetDetails();
            var param = {
                attributes: [['miscResponseStatus', "mis"]],
                where: { AssetId: request.Id }
            };

            let miscResponseStatusdata = await dataaccess.FindAll(AssetDetails, param);
            let misAPIStatus = true;
            miscResponseStatusdata.forEach((element) => {
                if (element.dataValues.mis != 201) {
                    misAPIStatus = false;
                }
            });

            if (misAPIStatus == true) {
                resolve();
            }
            else {
                console.log("MiscRecieptAPI Started")
                let requestBody = request;
                //console.log("Asset Type",requestBody.AssetRequestBody.AssetType)
                let requestAssetType = requestBody.AssetRequestBody.AssetType;
                let sequencedata = sequence;
                let Seqeuence1 = (sequencedata.Seq1 != null) ? (sequencedata.Seq1) : configuration.miscRecieptData.SequenceData.Seqeuence1;
                let Seqeuence2 = (sequencedata.Seq2 != null) ? (sequencedata.Seq2) : configuration.miscRecieptData.SequenceData.Seqeuence2;
                let Seqeuence3 = (sequencedata.Seq3 != null) ? (sequencedata.Seq3) : configuration.miscRecieptData.SequenceData.Seqeuence3;
                let asset = requestBody.AssetRequestBody.AssetDetails;

                let TransactionTypeName = configuration.miscRecieptData.HardCodedData.TransactionTypeName;
                let TransactionMode = configuration.miscRecieptData.HardCodedData.TransactionMode;
                let UseCurrentCostFlag = configuration.miscRecieptData.HardCodedData.UseCurrentCostFlag;
                let CostComponentCode = configuration.miscRecieptData.HardCodedData.CostComponentCode;

                let promises = [];

                asset.forEach(async (element, index, array) => {
                    if (element.miscResponseStatus != 201) {
                        Seqeuence1 = Seqeuence1 + 1;
                        Seqeuence2 = Seqeuence2 + 1;
                        Seqeuence3 = Seqeuence3 + 1;

                        const AssetDetails = datamodel.AssetDetails();
                        var values = {
                            Seq1: Seqeuence1,
                            Seq2: Seqeuence2,
                            Seq3: Seqeuence3
                        };
                        var param = { Id: element.Id };
                        dataaccess.Update(AssetDetails, values, param);

                        var data = JSON.stringify({
                            "OrganizationName": requestBody.AssetRequestBody.OrganizationDetail.OrganizationName,
                            "ItemNumber": element.Item,
                            "TransactionTypeName": TransactionTypeName, //Hardcoded
                            "TransactionQuantity": element.AssertQuantity,
                            "TransactionUOM": element.UnitOfMeasure,
                            "TransactionDate": moment(requestBody.AssetRequestBody.TransactionDate).format('YYYY-MM-DD'),
                            "SubinventoryCode": requestBody.AssetRequestBody.AssetType,
                            "SourceCode": requestBody.AssetRequestBody.AssetType,
                            "SourceLineId": Seqeuence1,
                            "SourceHeaderId": Seqeuence2,
                            "TransactionMode": TransactionMode, //Hardcoded
                            "UseCurrentCostFlag": UseCurrentCostFlag, //Hardcoded
                            "TransactionCostIdentifier": Seqeuence3,
                            "lots": [
                                {
                                    "LotNumber": requestAssetType == 'RMO' ? element.LotNumber : element.AssetNumber + "-" + moment(requestBody.AssetRequestBody.TransactionDate).format('YYYYMMDD'),
                                    "TransactionQuantity": element.AssertQuantity
                                }
                            ],
                            "costs": [
                                {
                                    "Cost": requestAssetType == 'RMO' ? element.Cost : element.NBV,
                                    "CostComponentCode": CostComponentCode //Hardcoded
                                }
                            ]
                        });

                        // console.log("data", data)
                        var config = {
                            method: configuration.miscRecieptData.configData.method,
                            url: configuration.miscRecieptData.configData.url,
                            headers: configuration.miscRecieptData.configData.headers,
                            data: data
                        };

                        promises.push(axios(config));

                        // axios(config)
                        // .then(async function (response) {
                        //         console.log("AssetNumber response status:",response.status)

                        //         const AssetDetails = datamodel.AssetDetails();
                        //         var values = {
                        //             TransactionTypeName : TransactionTypeName,
                        //             TransactionMode : TransactionMode,
                        //             UseCurrentCostFlag : UseCurrentCostFlag,
                        //             CostComponentCode : CostComponentCode,
                        //             miscResponseStatus: response.status,
                        //             TransactionHeaderId: response.data.TransactionHeaderId,
                        //             TransactionInterfaceId : response.data.TransactionInterfaceId,
                        //             ModifiedDate: connect.sequelize.fn("NOW"),
                        //         };
                        //         var param = { Id: element.Id };
                        //         dataaccess.Update(AssetDetails, values, param)
                        //         .then(()=>{
                        //             console.log("Misc Loop index",index);
                        //             if (index === array.length -1){
                        //                 console.log('Misc Method For each Ended');
                        //                 resolve();
                        //             } 
                        //         })
                        //         .catch((error)=>{
                        //             console.log(error);
                        //             //reject();
                        //         });
                        // })
                        // .catch(function (error) {
                        //     //console.log("catch error",error);
                        //     // console.log("error response status",error.response.status);
                        //     //  console.log("error response data",error.response.data);
                        //      if(error.response.status == 400){
                        //         dataconn.apiResponselogger('Misc Reciept API',requestBody.AssetRequestBody.Id,0,error.response.status,error.response.data,1);
                        //      }
                        //     //reject();
                        // });
                    }
                });

                Promise.all(promises).then(function (results) {
                    results.forEach(function (response, index, array) {

                        // console.log("AssetNumber response status:", response.status);
                        // console.log("AssetNumber response:", response);
                        let responseSeq1 = response.data.SourceLineId;
                        let responseSeq2 = response.data.SourceHeaderId;
                        let responseSeq3 = response.data.TransactionCostIdentifier;

                        console.log("Seq1", responseSeq1);
                        console.log("Seq2", responseSeq2);
                        console.log("Seq3", responseSeq3);
                        console.log("TransactionHeaderId", response.data.TransactionHeaderId);
                        console.log("TransactionInterfaceId", response.data.TransactionInterfaceId);


                        const AssetDetails = datamodel.AssetDetails();
                        var values = {
                            TransactionTypeName: TransactionTypeName,
                            TransactionMode: TransactionMode,
                            UseCurrentCostFlag: UseCurrentCostFlag,
                            CostComponentCode: CostComponentCode,
                            miscResponseStatus: response.status,
                            TransactionHeaderId: response.data.TransactionHeaderId,
                            TransactionInterfaceId: response.data.TransactionInterfaceId,
                            ModifiedDate: connect.sequelize.fn("NOW"),
                        };
                        var param = {
                            Seq1: responseSeq1,
                            Seq2: responseSeq2,
                            Seq3: responseSeq3
                        };
                        dataaccess.Update(AssetDetails, values, param)
                            .then(() => {
                                if (index === array.length - 1) {
                                    console.log('Misc Method For each Ended');
                                    resolve();
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });

                        if (response.status != 201) {
                            dataconn.apiResponselogger('Misc Reciept API', requestBody.AssetRequestBody.Id, 0, response.status, response.data, 1);
                        }
                    });
                })
                    .catch(function (error) {
                        console.log("error 4", error);
                        dataconn.errorlogger('TransactionService', 'Misc Function Promise.all Error', error);

                        if (error.response) {
                            if (error.response.status == 400) {
                                dataconn.apiResponselogger('Misc Reciept API', requestBody.AssetRequestBody.Id, 0, error.response.status, error.response.data, 1);
                            }
                        }
                        reject();
                    });

            }
        });
    }

    async function TransferMethodAPI(request, sequence, ModifiedDate) {
        return new Promise((resolve, reject) => {
            console.log("TransferMethodAPI Started")

            let requestBody = request;
            let sequencedata = sequence;
            let Seqeuence4 = requestBody.AssetRequestBody.InterfaceBatchNumber;
            //let Seqeuence4 = (sequencedata.Seq4 != null)?(sequencedata.Seq4) : 40000001;
            let Seqeuence5 = (sequencedata.Seq5 != null) ? (sequencedata.Seq5 + 1) : configuration.transferMoveOrderData.SequenceData.Seqeuence5;

            let Seqeuence6 = (sequencedata.Seq6 != null) ? (sequencedata.Seq6) : configuration.transferMoveOrderData.SequenceData.Seqeuence6;
            let AssetType = requestBody.AssetRequestBody.AssetType;
            // let ApiSeqeuence5 = AssetType + '-' + Seqeuence5;
            let InterfaceSourceCode = configuration.transferMoveOrderData.HardCodedData.InterfaceSourceCode;
            let SupplyRequestStatus = configuration.transferMoveOrderData.HardCodedData.SupplyRequestStatus;
            let SupplyOrderSource = configuration.transferMoveOrderData.HardCodedData.SupplyOrderSource;
            //let SupplyOrderReferenceId = 1;
            let TransferCostCurrencyCode = configuration.transferMoveOrderData.HardCodedData.TransferCostCurrencyCode;
            let ProcessRequestFlag = configuration.transferMoveOrderData.HardCodedData.ProcessRequestFlag;
            //let SupplyOrderReferenceLineId = 1;
            let BackToBackFlag = configuration.transferMoveOrderData.HardCodedData.BackToBackFlag;
            let PreparerEmail = configuration.transferMoveOrderData.HardCodedData.PreparerEmail;
            let DeliverToRequesterEmail = configuration.transferMoveOrderData.HardCodedData.DeliverToRequesterEmail;
            let SupplyType = configuration.transferMoveOrderData.HardCodedData.SupplyType;
            let DestinationTypeCode;
            if (AssetType == "CAM") {
                DestinationTypeCode = configuration.transferMoveOrderData.HardCodedData.DestinationTypeCode.CAM
            }
            else if (AssetType == "SRN") {
                DestinationTypeCode = configuration.transferMoveOrderData.HardCodedData.DestinationTypeCode.SRN
            }
            else {
                DestinationTypeCode = configuration.transferMoveOrderData.HardCodedData.DestinationTypeCode.RMO
            }

            let asset = requestBody.AssetRequestBody.AssetDetails;
            let list = [];
            console.log("AssetData", asset);
            asset.forEach(async (element) => {
                // let AssetModifiedDate = "";
                // ModifiedDateArray.forEach((element2) => {
                //     if (element.Id == element2.Id) {
                //         AssetModifiedDate = element2.ModifiedDate
                //     }
                // });
                // console.log("AssetModifiedDate", AssetModifiedDate);
                console.log("ModifiedDate", moment(ModifiedDate).format('YYYY-MM-DD'));

                Seqeuence6 = Seqeuence6 + 1;
                list.push({
                    "supplyRequestLinesXferDFF":
                        [{
                            "locationCode": element.LocationCode.toString(),
                            "departmentCode": element.DepartmentCode.toString(),
                            "camDate": moment(element.CreatedDate).format('YYYY-MM-DD'),
                            "camApprovalDate": moment(ModifiedDate).format('YYYY-MM-DD'),
                            "assetNumber": AssetType == 'RMO' ? "" : element.AssetNumber,
                            "remarks": requestBody.AssetRequestBody.DFFS,
                            "source": AssetType
                        }
                        ],
                    "InterfaceBatchNumber": Seqeuence4, //Seq4
                    "SupplyOrderReferenceLineNumber": Seqeuence6, //Seq6
                    "SupplyOrderReferenceLineId": Seqeuence6, //HardCoded
                    "DestinationOrganizationCode": requestBody.AssetRequestBody.DesORGCode,
                    "SourceOrganizationCode": requestBody.AssetRequestBody.OrganizationDetail.OrganizationCode,
                    "DestinationSubinventoryCode": requestBody.AssetRequestBody.DesSubInventoryName,
                    "SourceSubinventoryCode": requestBody.AssetRequestBody.AssetType,
                    "ItemNumber": element.Item,
                    "InterfaceSourceCode": InterfaceSourceCode, //HardCoded
                    "SupplyOrderSource": SupplyOrderSource, //HardCoded
                    "BackToBackFlag": BackToBackFlag, //HardCoded
                    "NeedByDate": moment(requestBody.AssetRequestBody.TransactionDate).format('YYYY-MM-DD'),
                    "Quantity": element.AssertQuantity,
                    "UOMCode": element.UnitOfMeasure,
                    "PreparerEmail": PreparerEmail, //HardCoded
                    "DeliverToRequesterEmail": DeliverToRequesterEmail, //HardCoded
                    "DestinationTypeCode": DestinationTypeCode, //HardCoded
                    "SupplyType": SupplyType, //HardCoded
                    "DestinationLocation": requestBody.AssetRequestBody.LocationCode
                });

                const AssetDetails = datamodel.AssetDetails();
                var values = {
                    Seq4: Seqeuence4,
                    Seq5: Seqeuence5,
                    // ApiSeq5: ApiSeqeuence5,
                    Seq6: Seqeuence6,

                };
                var param = {
                    Id: element.Id
                };
                await dataaccess.Update(AssetDetails, values, param)

            });

            var data = JSON.stringify({
                "InterfaceSourceCode": InterfaceSourceCode, //HardCoded
                "InterfaceBatchNumber": Seqeuence4, //Seq4
                "SupplyRequestStatus": SupplyRequestStatus, //HardCoded
                "SupplyRequestDate": moment(requestBody.AssetRequestBody.TransactionDate).format('YYYY-MM-DD'),
                "SupplyOrderSource": SupplyOrderSource, //HardCoded
                "SupplyOrderReferenceNumber": Seqeuence5, //Seq5
                "SupplyOrderReferenceId": Seqeuence5, //HardCoded
                "TransferCostCurrencyCode": TransferCostCurrencyCode, //HardCoded
                "ProcessRequestFlag": ProcessRequestFlag, //HardCoded
                "supplyRequestLines": list
            });

            var config = {
                // method: 'post',
                // url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/supplyRequests',
                // headers: { 
                //   'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
                //   'Content-Type': 'application/json'
                // },
                method: configuration.transferMoveOrderData.configData.method,
                url: configuration.transferMoveOrderData.configData.url,
                headers: configuration.transferMoveOrderData.configData.headers,
                data: data
            };

            console.log("Transfer data Sent - ", data)

            axios(config)
                .then(function (response) {

                    if (response.status == 201) {
                        //console.log("Transfer response.data.supplyRequestLines - ",response.data.supplyRequestLines)

                        let supplyRequestLines = response.data.supplyRequestLines;

                        supplyRequestLines.forEach(async (element, index, array) => {
                            const AssetDetails = datamodel.AssetDetails();
                            var values = {
                                // Seq4: response.data.InterfaceBatchNumber,
                                // Seq5: response.data.SupplyOrderReferenceNumber,
                                // Seq6: element.SupplyOrderReferenceLineNumber,
                                transferResponseStatus: response.status,
                                ModifiedDate: connect.sequelize.fn("NOW"),
                            };
                            var param = {
                                AssetId: requestBody.AssetRequestBody.Id,
                                Seq6: element.SupplyOrderReferenceLineNumber
                            };
                            await dataaccess.Update(AssetDetails, values, param)
                                .then(async () => {
                                    if (index === array.length - 1) {
                                        const Asset = datamodel.Asset();
                                        var values = {
                                            StatusId: 1,
                                            //ModifiedBy: 1,
                                            ModifiedDate: connect.sequelize.fn('NOW'),
                                        };
                                        var param = { Id: requestBody.AssetRequestBody.Id };
                                        await dataaccess.Update(Asset, values, param).then(() => {
                                            console.log("TransferMethodAPI Ended");
                                            resolve();
                                        })
                                            .catch((error) => {
                                                console.log("error 5",error);
                                                dataconn.errorlogger('TransactionService', 'Transfer Move Order Promise.all Error ', error);
                                                res.status(400).json({ Success: false, Message: 'TransferMethodAPI Error', Data: null });
                                                //reject();
                                            });
                                    }
                                })
                                .catch((error) => {
                                    console.log("error 6",error);
                                    dataconn.errorlogger('TransactionService', 'Transfer Move Order Promise.all Error ', error);
                                    res.status(400).json({ Success: false, Message: 'TransferMethodAPI Error', Data: null });
                                    //reject();
                                })
                        });
                    }
                })
                .catch(function (error) {
                    console.log("error response", error);
                    dataconn.errorlogger('TransactionService', 'Transfer Move Order Promise.all Error', error);
                    // console.log("error response data",error.response.data);
                    if (error.response) {
                        if (error.response.status == 400) {
                            dataconn.apiResponselogger('Transfer Move Order', requestBody.AssetRequestBody.Id, 0, error.response.status, error.response.data, 1);
                        }
                    }
                    reject();
                });
        });
    }

    // router.route('/CurrencyMaster')
    //     .post(function (req, res) {
    //         const CurrencyMaster = datamodel.CurrencyMaster();

    //         var values = {
    //             Id: req.body.Id,
    //             CuurencyCode: req.body.EntityCode,
    //             CurrencyName: req.body.EntityName,
    //             IsActive: req.body.IsActive,
    //             CreatedOn: req.body.CreatedOn,
    //             CreatedBy: req.body.CreatedBy,
    //             ModifiedBy: req.body.ModifiedBy,
    //             ModifiedOn: req.body.ModifiedOn,
    //         };
    //         dataaccess.Create(CurrencyMaster, values)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     res.status(200).json({ Success: true, Message: 'CurrencyMaster saved successfully', Data: result });
    //                 }
    //                 else {
    //                     dataconn.errorlogger('TransactionService', 'CreateCurrencyMaster', { message: 'No object found', stack: '' });
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('TransactionService', 'CreateCurrencyMaster', err);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //             })
    //     })

    // router.route('/EntityMaster')
    //     .post(function (req, res) {
    //         const EntityMaster = datamodel.EntityMaster();

    //         var values = {
    //             Id: req.body.Id,
    //             EntityCode: req.body.EntityCode,
    //             EntityName: req.body.EntityName,
    //             IsActive: req.body.IsActive,
    //             CreatedOn: req.body.CreatedOn,
    //             CreatedBy: req.body.CreatedBy,
    //             ModifiedBy: req.body.ModifiedBy,
    //             ModifiedOn: req.body.ModifiedOn,
    //         };
    //         dataaccess.Create(EntityMaster, values)
    //             .then(function (result) {
    //                 if (result != null) {
    //                     res.status(200).json({ Success: true, Message: 'EntityMaster saved successfully', Data: result });
    //                 }
    //                 else {
    //                     dataconn.errorlogger('TransactionService', 'CreateEntityMaster', { message: 'No object found', stack: '' });
    //                     res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //                 }
    //             }, function (err) {
    //                 dataconn.errorlogger('TransactionService', 'CreateEntityMaster', err);
    //                 res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
    //             })
    //     })

    // router.route('/sentmail')
    // .get(function (req, res) {

    //     const templateData = {
    //         InterfaceNumber: 987456123,
    //         data:[
    //             { AssetNumber:1001 , Cost :10 , AssetType : 'CAM' },
    //             { AssetNumber:1002 , Cost :20 , AssetType : 'SRN' },
    //             { AssetNumber:1003 , Cost :30 , AssetType : 'RMO' },
    //             { AssetNumber:1004 , Cost :40 , AssetType : 'CAM' },
    //             { AssetNumber:1005 , Cost :50 , AssetType : 'SRN' },
    //         ]
    //     }
    //     const templatePath = path.join(__dirname +'/../../Templates/LTC_Response/pdfTemplate.ejs');
    //     emailService.htmlToPdf(templatePath,templateData)
    //     .then((results)=>{
    //         res.status(200).json({ success: true, message: "Success", Data: results })
    //     })
    //     .catch((err)=>{
    //         res.status(200).json({ success: true, message: "Error", Data: err })
    //     })        
    // });

    router.route('/convertPDF')
        .get(function (req, res) {

            const templateData = {
                Remarks: "No reason",
                data: [
                    { AssetNumber: 1001, AssetDesc: "A", Cost: 10, Item: 101 },
                    { AssetNumber: 1002, AssetDesc: "B", Cost: 20, Item: 102 },
                    { AssetNumber: 1003, AssetDesc: "C", Cost: 30, Item: 103 },
                    { AssetNumber: 1004, AssetDesc: "D", Cost: 40, Item: 104 },
                    { AssetNumber: 1005, AssetDesc: "E", Cost: 50, Item: 105 },
                ]
            }
            const templatePath = path.join(__dirname + '/../../Templates/LTC_Response/pdfTemplate.ejs');
            emailService.htmlToPdf(templatePath, templateData)
                .then((results) => {
                    console.log('File Path : ', results);
                    let attachmentFilePath = results.fileSavePath;
                    let attachmentFileName = results.fileName;
                    let templateLocation = path.join(__dirname + '/../../Templates/LTC_Response/response.ejs');
                    let templatedata = {
                        Status: 'Approved Successfully'
                    }
                    emailService.notifyMail("Notification.Centre@Lightstorm.in", "sachin.pawale@neweltechnologies.com", "Asset Status", templateLocation, templatedata, attachmentFilePath, attachmentFileName)
                        .then((results) => {

                            let mailObj = {
                                assetId: 121,
                                mailTo: results.messageData.to,
                                mailFrom: results.messageData.from,
                                mailSubject: results.messageData.subject,
                                mailBody: results.messageData.html,
                                messageId: results.info.messageId,
                                mailStatus: true,
                            }
                            dataconn.maillogger(mailObj);
                            res.status(200).json({ success: true, message: "Success", Data: null })
                        })
                        .catch((err) => {
                            console.log(err)
                            let mailObj = {
                                assetId: 121,
                                mailTo: err.messageData.to,
                                mailFrom: err.messageData.from,
                                mailSubject: err.messageData.subject,
                                mailBody: err.messageData.html,
                                messageId: null,
                                mailStatus: false,
                            }
                            dataconn.maillogger(mailObj);
                            res.status(200).json({ success: false, message: "Error", Data: null })
                        });
                })
                .catch((error) => {
                    dataconn.errorlogger('TransactionService', 'convertPDF', error);
                    console.log('Error : ', error)
                });

        });

    // function sentAssetDetailsMail(pdftemplateData, mailtemplateData, mailData, pdfHTMLPath, emailHTMLPath) {
    //     const templateData = pdftemplateData;
    //     const pdftemplatePath = pdfHTMLPath;
    //     //const pdftemplatePath = path.join(__dirname +'/../../Templates/LTC_Response/pdfTemplate.ejs');
    //     emailService.htmlToPdf(pdftemplatePath, templateData)
    //         .then((results) => {
    //             console.log('File Path : ', results);
    //             let attachmentFilePath = results.fileSavePath;
    //             let attachmentFileName = results.fileName;
    //             let templateLocation = emailHTMLPath;
    //             //let templateLocation = path.join(__dirname +'/../../Templates/LTC_Response/response.ejs');
    //             let templateData = mailtemplateData;
    //             let fromEmail = mailData.fromEmail;
    //             let toEmail = mailData.toEmail;
    //             let ccEmail = mailData.ccEmail;
    //             let subjectEmail = mailData.subjectEmail;


    //             emailService.notifyMail(fromEmail, toEmail,ccEmail, subjectEmail, templateLocation, templateData, attachmentFilePath, attachmentFileName)
    //                 .then((results) => {

    //                     let mailObj = {
    //                         assetId: 121,
    //                         mailTo: results.messageData.to,
    //                         mailFrom: results.messageData.from,
    //                         mailSubject: results.messageData.subject,
    //                         mailBody: results.messageData.html,
    //                         messageId: results.info.messageId,
    //                         mailStatus: true,
    //                     }
    //                     dataconn.maillogger(mailObj);
    //                     console.log('Email Sent');
    //                     //res.status(200).json({ success: true, message: "Success", Data: null })
    //                 })
    //                 .catch((err) => {
    //                     console.log(err)
    //                     let mailObj = {
    //                         assetId: 121,
    //                         mailTo: err.messageData.to,
    //                         mailFrom: err.messageData.from,
    //                         mailSubject: err.messageData.subject,
    //                         mailBody: err.messageData.html,
    //                         messageId: null,
    //                         mailStatus: false,
    //                     }
    //                     dataconn.maillogger(mailObj);
    //                     console.log('Email Not Sent');
    //                     //res.status(200).json({ success: false, message: "Error", Data: null })
    //                 });
    //         })
    //         .catch((error) => {
    //             dataconn.errorlogger('TransactionService', 'convertPDF', error);
    //             console.log('Error : ', error)
    //         });
    // }

    // router.route('/dumpExcel')
    //     .get(function (req, res) {
    //         excelService.ExportExcelFile()
    //             .then((results) => {
    //                 const famiscmaster1 = datamodel.famiscmaster1();
    //                 famiscmaster1.destroy({
    //                     where: {},
    //                     truncate: true
    //                 })
    //                     .then(() => {
    //                         var bulkdata = results.workSheetsFromFile;
    //                         famiscmaster1.bulkCreate(bulkdata).then(() => {
    //                             return famiscmaster1.findAll();
    //                         })
    //                             .then((result) => {
    //                                 res.status(200).json({ Success: true, Message: "All records saved successfully", Data: null });
    //                             })
    //                             .catch(function (error) {
    //                                 dataconn.errorlogger('TransactionService', 'dumpExcel', error);
    //                                 res.status(200).json({ Success: false, Message: "Error while saving details", Data: error });
    //                             });
    //                     })
    //                     .catch(function (error) {
    //                         dataconn.errorlogger('TransactionService', 'dumpExcel', error);
    //                         res.status(200).json({ Success: true, Message: "Error while truncate", Data: error });
    //                     });
    //             })
    //             .catch((error) => {
    //                 dataconn.errorlogger('TransactionService', 'dumpExcel', error);
    //                 res.status(200).json({ Success: false, Message: 'Error', Data: error });
    //             });
    //     });

    router.route('/CreateSubInventoryDetails')
        .get(function (req, res) {
            var config = {
                method: configuration.SubinventoryData.configData.method,
                url: configuration.SubinventoryData.configData.url,
                headers: configuration.SubinventoryData.configData.headers
            };
            axios(config)
                .then(function (response) {
                    const SubInventoryDetails = datamodel.SubInventoryDetails();
                    SubInventoryDetails.destroy({
                        where: {},
                        truncate: true
                    })
                        .then(() => {
                            var bulkdata = response.data.items;
                            SubInventoryDetails.bulkCreate(bulkdata).then(() => {
                                return SubInventoryDetails.findAll();
                            })
                                .then(result => {
                                    res.status(200).json({ Success: true, Message: "All SubInventoryDetails saved successfully", Data: result });
                                })
                                .catch(function (error) {
                                    dataconn.errorlogger('TransactionService', 'CreateSubInventoryDetails', error);
                                    res.status(200).json({ Success: false, Message: "Error while saving SubInventoryDetails", Data: error });
                                });
                        })
                        .catch(function (error) {
                            dataconn.errorlogger('TransactionService', 'CreateSubInventoryDetails', error);
                            res.status(200).json({ Success: true, Message: "Error while saving SubInventoryDetails", Data: error });
                        });
                })
                .catch(function (error) {
                    dataconn.errorlogger('TransactionService', 'CreateSubInventoryDetails', error);
                    res.status(200).json({ Success: true, Message: "Error while saving SubInventoryDetails", Data: error });
                });
        });

    router.route('/GetSubInventoryDetails')
        .post(function (req, res) {
            const SubInventoryDetails = datamodel.SubInventoryDetails();
            var param = {
                where: {
                    Description: req.body.Description,
                    OrganizationId: req.body.OrganizationId,
                    IsActive: true
                }
            };
            dataaccess.FindAll(SubInventoryDetails, param)
                .then(function (result) {
                    if (result.length != 0) {
                        res.status(200).json({ success: true, message: "SubInventoryDetails access", Data: result })
                    }
                    else {
                        res.status(200).json({ success: false, message: "No such SubInventoryDetails data found", Data: null });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('transaction', 'GetSubInventoryDetails', err);
                        res.status(200).json({ success: false, message: "User has no access of SubInventoryDetails", Data: null });
                    })
        });

    router.route('/GetDistinctAssetLocation')
        .get(function (req, res) {

            const famiscmaster = datamodel.famiscmaster();
            var param = {
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('LOCATION')), 'Asset_Location']],
            };

            dataaccess.FindAll(famiscmaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Famiscmaster Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of Famiscmaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('transaction', 'GetDistinctAssetLocation', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of Famiscmaster', Data: null });
                });
        });


    //RMO Start

    router.route('/GetDistinctItemLocation')
        .get(function (req, res) {

            const rmomaster = datamodel.rmomaster();
            var param = {
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('INTERNAL_LOCATION_CODE')), 'INTERNAL_LOCATION_CODE'],
                    'LOCATION_NAME'
                ],
            };

            dataaccess.FindAll(rmomaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'rmomaster Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of rmomaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('transaction', 'GetDistinctItemLocation', err);
                    res.status(200).json({ Success: false, Message: 'User has no access of rmomaster', Data: null });
                });
        });

    router.route('/GetItemDetailsByITEM_NUMBER')
        .post(function (req, res) {
            let ITEM_NUMBER_Obj = req.body.ITEM_NUMBER;
            let INTERNAL_LOCATION_CODE_Obj = req.body.INTERNAL_LOCATION_CODE;
            const rmomaster = datamodel.rmomaster();
            var param = {
                where: {
                    INTERNAL_LOCATION_CODE: INTERNAL_LOCATION_CODE_Obj,
                    ITEM_NUMBER: ITEM_NUMBER_Obj
                },
            };
            dataaccess.FindAll(rmomaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ success: true, message: "rmomaster access", Data: result })
                    }
                    else {
                        res.status(200).json({ success: false, message: "User has no access of rmomaster", Data: null });
                    }
                },
                    function (err) {
                        dataconn.errorlogger('transaction', 'GetAssertDetailsByITEM_NUMBER', err);
                        res.status(200).json({ success: false, message: "User has no access of rmomaster", Data: null });
                    })
        });

    router.route('/GetAllITEM_NUMBER/:INTERNAL_LOCATION_CODE')
        .get(function (req, res) {

            const rmomaster = datamodel.rmomaster();
            var param = {
                attributes: ['Id', 'ITEM_NUMBER', 'INTERNAL_LOCATION_CODE', 'ITEM_DESC', 'SUPPLIER_ITEM_CODE', 'SUPPLIER_ITEM_DESC', 'LOT_NUMBER'],
                where: { INTERNAL_LOCATION_CODE: req.params.INTERNAL_LOCATION_CODE },
                order: [['ITEM_NUMBER']]
            };

            dataaccess.FindAll(rmomaster, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'rmomaster Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of rmomaster', Data: null });
                    }
                }, function (err) {
                    dataconn.errorlogger('transaction', 'GetAllITEM_NUMBER', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of rmomaster', Data: null });
                });
        });


    //RMO End

    //Update start

    router.route('/UpdateMultipleAsset')
        .post(function (req, res) {

            let oldAssetDetails = req.body.oldAssetDetails;
            let newAssetDetails = req.body.updateAssetDetails;
            let AssetId = req.body.AssetId;
            let UserId = req.body.userId;
            AssetHistory(oldAssetDetails, AssetId, UserId)
                .then(async (result) => {
                    console.log('AssetHistory');
                    setTimeout(async function () {
                        DeleteAssetDetails(AssetId)
                            .then(async (result) => {
                                console.log('DeleteAssetDetails');
                                setTimeout(async function () {
                                    console.log("deleted Successfully");

                                    UpdateAssetDetails(newAssetDetails, AssetId, UserId)
                                        .then(async (result) => {
                                            console.log('UpdateAssetDetails');
                                            setTimeout(async function () {
                                                console.log("Update Succesfully");
                                                res.status(200).json({ Success: true, Message: "Asset Updated successfully", Data: null });
                                            }, 1000)
                                        })

                                        .catch((error) => {
                                            console.log("error", error);
                                            dataconn.errorlogger('TransactionService', 'UpdateMultipleAsset', error);
                                            res.status(200).json({ Success: false, Message: 'error', Data: error });
                                        })
                                }, 1000)
                            })
                            .catch((error) => {
                                dataconn.errorlogger('TransactionService', 'UpdateMultipleAsset', error);
                                res.status(200).json({ Success: false, Message: 'Error', Data: error });
                            })
                    }, 1000)
                })
                .catch((error) => {
                    dataconn.errorlogger('TransactionService', 'UpdateMultipleAsset', error);
                    res.status(200).json({ Success: false, Message: 'Error', Data: error });
                })
        });

    async function AssetHistory(request, AssetId, UserId) {
        return new Promise(async (resolve, reject) => {
            connect.sequelize.transaction().then(trans => {
                const AssetHistory = datamodel.AssetHistory();
                var values = {
                    AssetId: AssetId,
                    SerialNumber: request.SerialNumber,
                    ReceiptNumber: request.ReceiptNumber,
                    AssetNumber: request.AssetNumber,
                    OrganizationId: request.OrganizationId,
                    LocationCode: request.LocationCode,
                    AssetType: request.AssetType,
                    InterfaceBatchNumber: request.InterfaceBatchNumber,
                    TransactionDate: request.TransactionDate,
                    DesORGCode: request.DesORGCode,
                    DesTypeCode: request.DesTypeCode,
                    Locator: request.Locator,
                    //DesSubInventoryCode: request.AssetType == 'CAM' ? 'CAM' : request.DesSubInventoryCode,
                    DesSubInventoryCode: request.DesSubInventoryCode,
                    DesSubInventoryName: request.DesSubInventoryName,
                    DFFS: request.DFFS,
                    FromLocation: request.FromLocation,
                    ToLocationWithSiteCode: request.ToLocationWithSiteCode,
                    StatusId: request.StatusId,
                    Remarks: request.Remarks,
                    CreatedBy: UserId
                };
                dataaccess.CreateWithTransaction(AssetHistory, values, trans)
                    .then(function (result) {
                        if (result != null) {
                            let AssetType = request.AssetType;
                            const AssetDetailsHistory = datamodel.AssetDetailsHistory();
                            var mapDetails = [];
                            var promiseDetails = request.AssetDetails.map(function (mapitem) {
                                if (AssetType == 'CAM' || AssetType == 'SRN') {
                                    mapDetails.push({
                                        AssetId: AssetId,
                                        AssetNumber: mapitem.AssetNumber,
                                        AssetDesc: mapitem.AssetDesc,
                                        Cost: mapitem.Cost,
                                        LTD_DEP: mapitem.LTD_DEP,
                                        NBV: mapitem.NBV,
                                        AssertQuantity: mapitem.AssertQuantity,
                                        Item: mapitem.Item,
                                        ItemDesc: mapitem.ItemDesc,
                                        UnitOfMeasure: mapitem.UnitOfMeasure,
                                        Location: mapitem.Location,
                                        SupplierCode: mapitem.SupplierCode,
                                        LocationCode: mapitem.LocationCode,
                                        DepartmentCode: mapitem.DepartmentCode,

                                        CreatedBy: UserId,
                                    });
                                }
                                else {
                                    mapDetails.push({
                                        AssetId: AssetId,
                                        Cost: mapitem.Cost,
                                        AssertQuantity: mapitem.AssertQuantity,
                                        LotNumber: mapitem.LotNumber,
                                        Item: mapitem.Item,
                                        ItemDesc: mapitem.ItemDesc,
                                        UnitOfMeasure: mapitem.UnitOfMeasure,
                                        Location: mapitem.Location,
                                        SupplierCode: mapitem.SupplierCode,
                                        LocationCode: mapitem.LocationCode,
                                        DepartmentCode: mapitem.DepartmentCode,
                                        CreatedBy: UserId
                                    });
                                }

                            });

                            Promise.all(promiseDetails).then(function () {
                                dataaccess.BulkCreateWithTransaction(AssetDetailsHistory, mapDetails, trans)
                                    .then((assetresult) => {
                                        trans.commit();
                                        resolve();
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('transaction', 'CreateMultipleAsset', err);
                                            reject();
                                        });
                            });
                        }

                    }, function (err) {
                        trans.rollback();
                        dataconn.errorlogger('transaction', 'CreateMultipleAsset', err);
                        reject();
                    });
            });

        });
    }

    async function DeleteAssetDetails(reqAssetId) {
        return new Promise(async (resolve, reject) => {

            const AssetDetails = datamodel.AssetDetails();

            AssetDetails.destroy({
                where: {
                    AssetId: reqAssetId
                }
            }).then(() => {
                resolve();
            })
                .catch((err) => {
                    dataconn.errorlogger('transaction', 'DeleteAssetDetails', err);
                    reject();
                })

        });
    }

    async function UpdateAssetDetails(request, AssetId, UserId) {
        return new Promise(async (resolve, reject) => {
            connect.sequelize.transaction().then(trans => {
                const Asset = datamodel.Asset();
                console.log(request);
                var values = {
                    //AssetId: AssetId,
                    SerialNumber: request.SerialNumber,
                    ReceiptNumber: request.ReceiptNumber,
                    AssetNumber: request.AssetNumber,
                    OrganizationId: request.Organization == null ? null : request.Organization.OrganizationId,
                    LocationCode: request.ToLocation == null ? null : request.ToLocation.LocationCode,
                    AssetType: request.AssetType,
                    InterfaceBatchNumber: request.InterfaceBatchNumber,
                    TransactionDate: request.TransactionDate,
                    DesORGCode: request.DesORGCode == null ? null : request.DesORGCode.OrganizationCode,
                    DesTypeCode: request.DesTypeCode,
                    Locator: request.Locator,
                    //DesSubInventoryCode: request.AssetType == 'CAM' ? 'CAM' : request.DesSubInventoryCode,
                    DesSubInventoryCode: request.DesSubInventoryCode,
                    DesSubInventoryName: request.DesSubInventoryName,
                    DFFS: request.DFFS,
                    FromLocation: request.FromLocation,
                    ToLocationWithSiteCode: request.ToLocationWithSiteCode,
                    StatusId: request.StatusId,
                    Remarks: null,
                    CreatedBy: UserId
                };
                var param = {
                    Id: AssetId
                }
                dataaccess.UpdateWithTransaction(Asset, values, param, trans)

                    .then(function (result) {

                        if (result != null) {
                            console.log("UpdateWithTransaction Asset");

                            let AssetType = request.AssetType;
                            const AssetDetails = datamodel.AssetDetails();
                            var mapDetails = [];
                            console.log('request.AssetDetails', request.AssetDetails);
                            var promiseDetails = request.AssetDetails.map(function (mapitem) {
                                if (AssetType == 'CAM' || AssetType == 'SRN') {
                                    mapDetails.push({
                                        AssetId: AssetId,
                                        AssetNumber: mapitem.ASSET_NUMBER,
                                        AssetDesc: mapitem.ASSET_DESC,
                                        Cost: mapitem.COST,
                                        LTD_DEP: mapitem.DEPRN_RESERVE,
                                        NBV: mapitem.NBV,
                                        AssertQuantity: mapitem.CURRENT_UNITS,
                                        Item: mapitem.ITEM_NUMBER,
                                        ItemDesc: mapitem.ITEM_DESC,
                                        UnitOfMeasure: mapitem.PRIMARY_UOM_CODEA,
                                        Location: mapitem.LOCATION,
                                        SupplierCode: mapitem.SUPPLIER_CODE,
                                        LocationCode: mapitem.LOCATION_CODE,
                                        DepartmentCode: mapitem.DEPTARTMENT_CODE,
                                        CreatedBy: UserId,
                                    });
                                }
                                else {
                                    mapDetails.push({
                                        AssetId: AssetId,
                                        Cost: mapitem.COST,
                                        AssertQuantity: mapitem.ITEM_QUANTITY,
                                        LotNumber: mapitem.LOT_NUMBER,
                                        Item: mapitem.ITEM_NUMBER,
                                        ItemDesc: mapitem.ITEM_DESC,
                                        UnitOfMeasure: mapitem.PRIMARY_UOM_CODE,
                                        Location: mapitem.INTERNAL_LOCATION_CODE,
                                        SupplierCode: mapitem.SUPPLIER_ITEM_CODE,
                                        LocationCode: mapitem.LOCATION_CODE,
                                        DepartmentCode: mapitem.DEPTARTMENT_CODE,
                                        CreatedBy: UserId
                                    });
                                }
                            });
                            console.log("BeforePromiseAll then");
                            Promise.all(promiseDetails).then(function () {
                                console.log('mapDetails', mapDetails);

                                dataaccess.BulkCreateWithTransaction(AssetDetails, mapDetails, trans)
                                    .then((assetresult) => {
                                        console.log("AfterPromiseAll then");
                                        trans.commit();

                                        if(request.StatusId != 3){
                                            let formatedCost = Number(parseFloat(request.totalNBVForEmail).toFixed(2)).toLocaleString('en', {
                                                minimumFractionDigits: 2
                                            });
    
                                            let mailtemplateData = {
                                                AssetType: request.AssetType,
                                                AssetNumber: request.InterfaceBatchNumber,
                                                FromLocation: request.Organization.OrganizationName,
                                                ToLocation: request.DesORGCode.OrganizationName,
                                                FromLocationWithSiteCode: request.FromLocation,
                                                ToLocationWithSiteCode: request.ToLocationWithSiteCode,
                                                TotalAmount: formatedCost,
                                                ui_url : configuration.ui_url
                                            };
                                            let mailData = {
                                                fromEmail: request.userEmail,
                                                toEmail: configuration.EmailIds.ForApproval.ToEmailIds,
                                                ccEmail : configuration.EmailIds.ForApproval.CcEmailIds,
                                                subjectEmail: request.AssetType + ' - ' + request.InterfaceBatchNumber + " For Approval"
                                            };
                                            const emailTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetResponse.ejs');
                                            sentAssetMail(AssetId,mailtemplateData,mailData,emailTemplatePath);
                                        }

                                        resolve();
                                    },
                                        function (err) {
                                            trans.rollback();
                                            dataconn.errorlogger('transaction', 'CreateMultipleAsset', err);
                                            reject();
                                        });
                            });
                        }

                    }, function (err) {
                        trans.rollback();
                        dataconn.errorlogger('transaction', 'CreateMultipleAsset', err);
                        reject();
                    });
            });
        });
    }


    //Update end

    router.route('/UpdateMultipleAssetDraft')
        .post(function (req, res) {

            // let oldAssetDetails = req.body.oldAssetDetails;
            let newAssetDetails = req.body.updateAssetDetails;
            let AssetId = req.body.AssetId;
            let UserId = req.body.userId;

            // AssetHistory(oldAssetDetails, AssetId, UserId)
            //     .then(async (result) => {
            // console.log('AssetHistory');
            // setTimeout(async function () {
            DeleteAssetDetails(AssetId)
                .then(async (result) => {
                    console.log('DeleteAssetDetails');
                    setTimeout(async function () {
                        console.log("deleted Successfully");

                        UpdateAssetDetails(newAssetDetails, AssetId, UserId)
                            .then(async (result) => {
                                console.log('UpdateAssetDetails');
                                setTimeout(async function () {
                                    console.log("Update Succesfully");
                                    res.status(200).json({ Success: true, Message: "Asset Updated successfully", Data: null });
                                }, 1000)
                            })
                            .catch((error) => {
                                console.log("error", error);
                                dataconn.errorlogger('TransactionService', 'UpdateMultipleAssetDraft', error);
                                res.status(200).json({ Success: false, Message: 'error', Data: error });
                            })
                    }, 1000)
                })
                .catch((error) => {
                    dataconn.errorlogger('TransactionService', 'UpdateMultipleAssetDraft', error);
                    res.status(200).json({ Success: false, Message: 'Error', Data: error });
                })
            // }, 1000)
            // })
            // .catch((error) => {
            //     dataconn.errorlogger('TransactionService', 'UpdateMultipleAsset', error);
            //     res.status(200).json({ Success: false, Message: 'Error', Data: error });
            // })

        });

    
        function sentAssetMail(AssetIdForEmail,mailtemplateData, mailData, emailHTMLPath) {
          let fromEmail = mailData.fromEmail;
          let toEmail = mailData.toEmail;
          let ccEmail = mailData.ccEmail;
          let subjectEmail = mailData.subjectEmail;
          let templateLocation = emailHTMLPath;
          let templateData = mailtemplateData;

          emailService.notifyMail(fromEmail,toEmail,ccEmail,subjectEmail,templateLocation,templateData)
            .then((results) => {
              let mailObj = {
                assetId: AssetIdForEmail,
                mailTo: results.messageData.to,
                mailFrom: results.messageData.from,
                mailCc: results.messageData.cc,
                mailSubject: results.messageData.subject,
                mailBody: results.messageData.html,
                messageId: results.info.messageId,
                mailStatus: true,
              };
              dataconn.maillogger(mailObj);
              console.log("Email Sent");
            })
            .catch((err) => {
              console.log(err);
              let mailObj = {
                assetId: AssetIdForEmail,
                mailTo: err.messageData.to,
                mailFrom: err.messageData.from,
                mailCc: err.messageData.cc,
                mailSubject: err.messageData.subject,
                mailBody: err.messageData.html,
                messageId: null,
                mailStatus: false,
              };
              dataconn.maillogger(mailObj);
              console.log("Email Not Sent");
            });
        }

    return router;

};

module.exports = routes;