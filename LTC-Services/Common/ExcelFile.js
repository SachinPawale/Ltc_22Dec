// const excel = require ("node-excel-export");
// module.exports.CreateExcelFile = function(filename columns tabledata cb) {

//     let specification = {};
//     columns.forEach(element => {
        
//     });
// }
const xlsx =  require('node-xlsx');
const path = require('path');
const fs = require('fs');
var connect = require('../Data/Connect');
// const XlsxDataAsJson = require("xlsx_data_as_json");
const parseString = require('xml2js').parseString;
// const xlsx2json = require('xlsx2json')
// const xlsx2json = require('node-xlsx2json');
// const { Sequelize } = require('../Data/Connect');
// const { now } = require('sequelize/types/lib/utils');
var dataconn = require('../Data/DataConnection');

module.exports.ExportExcelFile = function(Filename,RequestID) {
    return new Promise(async(resolve, reject) => {
        try{
            let finalObject = [];
            const FA_HeaderObject =['ASSET_ID','ASSET_NUMBER','CURRENT_UNITS','COST','ADJ_COST','DEPRN_RESERVE','NBV','LOCATION','ITEM_NUMBER','ATTRIBUTE1','PRIMARY_UOM_CODE','INVENTORY_ITEM_ID','ITEM_DESC','ASSET_DESC','SUPPLIER_ITEM_DESC','SUPPLIER_ITEM_CODE','COA_DEPT_CODE','COA_LOCATION_CODE'];
            const RMO_HeaderObject = ['LINE_NUM','LOCATION_NAME','INTERNAL_LOCATION_CODE','ITEM_NUMBER','PRIMARY_UOM_CODE','INVT_ITEM_ID','ITEM_DESC','SUPPLIER_ITEM_DESC','SUPPLIER_ITEM_CODE','RECEIPT_NUM','TRN_QTY','LOT_NUMBER','COST','LOC_CODE','DEPT_CODE'];
            const PO_HeaderObject=['PO_HEADER_ID','VENDOR_NAME','VENDOR_NUMBER','VENDOR_SITE_CODE','VENDOR_SITE_ID','VENDOR_ID','PO_NUMBER','DOCUMENT_STATUS','TYPE_LOOKUP_CODE','CURRENCY_CODE','APPROVED_FLAG','COMMENTS','LINE_STATUS','LINE_NUM','ITEM_ID','ITEM_NUMBER','ITEM_DESCRIPTION','UOM_CODE','UNIT_PRICE','LINE_QTY','CANCEL_FLAG','VENDOR_PRODUCT_NUM','DESTINATION_TYPE_CODE','DISTRI_STATUS','QUANTITY','QUANTITY_RECEIVED','QUANTITY_ACCEPTED','QUANTITY_REJECTED','QUANTITY_BILLED','QUANTITY_CANCELLED','SHIPMENT_NUM','MATCH_OPTION','DEPT','LOCATION','DEST_TYPE','BAL_QTY','ENTITY_CODE','ENTITY_DESC','FIRST_PARTY_REGN_NUMBER','ACC_CODE','ACCOUNT_DESC','BCD_PERCENT','SWS_PERCENT','ASN_NO','RCPT_LINE_NUM','ASN_QTY_SHIP','HSN_CODE','SUPPLIER_ITEM_DESC','SUPPLIER_ITEM_CODE','ORGANIZATION_CODE'];
            //const POCost_HeaderObject =['TRANSACTION_ID','INVENTORY_ITEM_ID','INVENTORY_ORG_ID','TXN_SOURCE_DOC_TYPE','GRN_NO','TXN_SOURCE_REF_DOC_NUMBER'];
            const POCost_HeaderObject =['TRANSACTION_ID','INVENTORY_ITEM_ID','INVENTORY_ORG_ID','TXN_SOURCE_DOC_TYPE','GRN_NO','TXN_SOURCE_REF_DOC_NUMBER','CREATION_DATE'];

            const TDSGST_HeaderObject = ['PartyId','PartySiteId','PartyTypeCode','PartyName','PartyNumber','PartySiteNumber','TaxRegimeCode','RegistrationTypeCode','RegistrationStatusCode','EffectiveFrom','RegistrationNumber','RoundingRuleCode','ValidationType','ValidationLevel'];


            let MismatchedColumn=[];
            console.log('path - ',path.join(__dirname + '/../Upload/'+Filename+'/ESS_O_'+RequestID+'_BIP.xml'));
            if(fs.existsSync(path.join(__dirname + '/../Upload/'+Filename+'/ESS_O_'+RequestID+'_BIP.xml'))){

                console.log('ExportExcel File exists');
                // const excelpath = path.join(__dirname + '/../ExcelFile/'+Filename+'.xlsx');
                // //TO compare Column
                // const workSheetsFromFile = xlsx.parse(excelpath);
                //TO retrieve column based on Column Name
                var rows = []//await XlsxDataAsJson.parseFile(excelpath);
                if(Filename == 'FA')
                {
                    let ExcelColumnArray = [];
                    const xmlFile = fs.readFileSync(path.join(__dirname + '/../Upload/'+Filename+'/ESS_O_'+RequestID+'_BIP.xml'), 'utf8');
                      parseString(xmlFile, function (err, result) {
                        jsonTextFromXML = JSON.parse(JSON.stringify(result));
                        // jsonresult = JSON.stringify(result)
                        });

                        if(Object.keys(jsonTextFromXML['DATA_DS'])[0] == 'G_1' && Object.keys(jsonTextFromXML['DATA_DS']['G_1']).length > 0){
                            var ColumnList = Object.keys(jsonTextFromXML['DATA_DS']['G_1'][0])

                                // console.log('xml result',jsonresult['DATA_DS']['G_1'].length);
                                ColumnList.forEach(ExcelColumnelement=>{
                                if(FA_HeaderObject.includes(ExcelColumnelement))
                                {
                                    console.log('FA_Report Includes '+ExcelColumnelement);
                                }
                                else{
                                    console.log('FA_Report Column Mismatched '+ExcelColumnelement);
                                    MismatchedColumn.push(ExcelColumnelement);
                                }
                            });
                            // workSheetsFromFile[0].data.slice(0,1).forEach((element)=>{
                            
                            //if(MismatchedColumn.length==0)
                            if(MismatchedColumn.length == 0)
                            {
                                jsonTextFromXML['DATA_DS']['G_1'].forEach((element)=>{
                                    finalObject.push({
                                        ASSET_ID:element['ASSET_ID']
                                        ,ASSET_NUMBER:element['ASSET_NUMBER']
                                        ,CURRENT_UNITS:element['CURRENT_UNITS']
                                        ,COST:element['COST']
                                        ,ADJ_COST:element['ADJ_COST']
                                        ,DEPRN_RESERVE:element['DEPRN_RESERVE']
                                        ,NBV:element['NBV']
                                        ,LOCATION:element['LOCATION']
                                        ,ITEM_NUMBER:element['ITEM_NUMBER']
                                        ,ATTRIBUTE1:element['ATTRIBUTE1']
                                        ,PRIMARY_UOM_CODEA:element['PRIMARY_UOM_CODE']
                                        ,INVENTORY_ITEM_ID:element['INVENTORY_ITEM_ID']
                                        ,ITEM_DESC:element['ITEM_DESC']
                                        ,ASSET_DESC:element['ASSET_DESC']
                                        ,SUPPLIER_ITEM_DESC:element['SUPPLIER_ITEM_DESC']
                                        ,SUPPLIER_CODE:element['SUPPLIER_ITEM_CODE']
                                        ,DEPTARTMENT_CODE:element['COA_DEPT_CODE']
                                        ,LOCATION_CODE:element['COA_LOCATION_CODE']     
                                    })
                                });
                                resolve(finalObject);
                            
                            }
                            else{
                                dataconn.errorlogger('ExcelFile', 'Get_FA_Files_API', {message:'Column Mismatch - FA' , stack:MismatchedColumn});
                                reject({message:'Column Mismatch - FA : ' + MismatchedColumn});
                                //dataconn.errorlogger('ExcelFile', 'Get_FA_Files_API', 'Column Mismatch'+MismatchedColumn);
                            }
                        }
                        else{
                            dataconn.errorlogger('ExcelFile', 'Get_FA_Files_API', {message:'No data present in xml file - FA' , stack:'No data present in xml file - FA'});
                            reject({message:'No data present in xml file - FA'});
                        }
                        
                }
                else if(Filename == 'PO')
                {
                    const xmlFile = fs.readFileSync(path.join(__dirname + '/../Upload/'+Filename+'/ESS_O_'+RequestID+'_BIP.xml'), 'utf8');
                      parseString(xmlFile, function (err, result) {
                        jsonTextFromXML = JSON.parse(JSON.stringify(result));
                        // jsonresult = JSON.stringify(result)
                        });
                    
                        if(Object.keys(jsonTextFromXML['DATA_DS'])[0] == 'G_1' && Object.keys(jsonTextFromXML['DATA_DS']['G_1']).length > 0){
                            var ColumnList = Object.keys(jsonTextFromXML['DATA_DS']['G_1'][0])
                            //console.log('xml result',borFld);
                                    ColumnList.forEach(ExcelColumnelement=>{
                                    
                                    if(PO_HeaderObject.includes(ExcelColumnelement))
                                    {
                                        console.log('PO Report Includes '+ExcelColumnelement);
                                    }
                                    else{
                                        console.log('PO Report Column Mismatched '+ExcelColumnelement);
                                        MismatchedColumn.push(ExcelColumnelement);
                                    }
                                });
                                // workSheetsFromFile[0].data.slice(0,1).forEach((element)=>{
                                // if(MismatchedColumn.length==0)
                                if(MismatchedColumn.length==0)
                                {
                                    jsonTextFromXML['DATA_DS']['G_1'].forEach((element)=>{
                                        finalObject.push({
                                            PO_HEADER_ID:element['PO_HEADER_ID'],
                                            VENDOR_NAME :element['VENDOR_NAME'],
                                            VENDOR_NUMBER :element['VENDOR_NUMBER'],
                                            VENDOR_SITE_CODE :element['VENDOR_SITE_CODE'],
                                            VENDOR_SITE_ID :element['VENDOR_SITE_ID'],
                                            VENDOR_ID :element['VENDOR_ID'],
                                            PO_NUMBER :element['PO_NUMBER'],
                                            DOCUMENT_STATUS :element['DOCUMENT_STATUS'],
                                            TYPE_LOOKUP_CODE :element['TYPE_LOOKUP_CODE'],
                                            CURRENCY_CODE :element['CURRENCY_CODE'],
                                            APPROVED_FLAG :element['APPROVED_FLAG'],
                                            COMMENTS :element['COMMENTS'],
                                            LINE_STATUS :element['LINE_STATUS'],
                                            LINE_NUM :element['LINE_NUM'],
                                            ITEM_ID :element['ITEM_ID'],
                                            ITEM_NUMBER:element['ITEM_NUMBER'],
                                            ITEM_DESCRIPTION :element['ITEM_DESCRIPTION'],
                                            UOM_CODE :element['UOM_CODE'],
                                            UNIT_PRICE :element['UNIT_PRICE'],
                                            LINE_QTY :element['LINE_QTY'],
                                            CANCEL_FLAG :element['CANCEL_FLAG'],
                                            VENDOR_PRODUCT_NUM :element['VENDOR_PRODUCT_NUM'],
                                            DESTINATION_TYPE_CODE :element['DESTINATION_TYPE_CODE'],
                                            DISTRI_STATUS :element['DISTRI_STATUS'],
                                            QUANTITY :element['QUANTITY'],
                                            QUANTITY_RECEIVED :element['QUANTITY_RECEIVED'],
                                            QUANTITY_ACCEPTED :element['QUANTITY_ACCEPTED'],
                                            QUANTITY_REJECTED :element['QUANTITY_REJECTED'],
                                            QUANTITY_BILLED :element['QUANTITY_BILLED'],
                                            QUANTITY_CANCELLED :element['QUANTITY_CANCELLED'],
                                            SHIPMENT_NUM :element['SHIPMENT_NUM'],
                                            MATCH_OPTION :element['MATCH_OPTION'],
                                            DEPT :element['DEPT'],
                                            LOCATION :element['LOCATION'],
                                            DEST_TYPE :element['DEST_TYPE'],
                                            BAL_QTY :element['BAL_QTY'],
                                            ENTITY_CODE :element['ENTITY_CODE'],
                                            ENTITY_DESC :element['ENTITY_DESC'],
                                            FIRST_PARTY_REGN_NUMBER:element['FIRST_PARTY_REGN_NUMBER'],
                                            ACC_CODE:element['ACC_CODE'],
                                            ACCOUNT_DESC:element['ACCOUNT_DESC'],
                                            BCD_PERCENT:element['BCD_PERCENT'],
                                            SWS_PERCENT:element['SWS_PERCENT'],
                                            ASN_NO:element['ASN_NO'],
                                            RCPT_LINE_NUM:element['RCPT_LINE_NUM'],
                                            ASN_QTY_SHIP:element['ASN_QTY_SHIP'],
                                            HSN_CODE:element['HSN_CODE'],
                                            SUPPLIER_ITEM_DESC:element['SUPPLIER_ITEM_DESC'],
                                            SUPPLIER_ITEM_CODE:element['SUPPLIER_ITEM_CODE'],
                                            ORGANIZATION_CODE:element['ORGANIZATION_CODE']
                                        });
                                    });
                                    resolve(finalObject);
                                }
                                else{
                                    dataconn.errorlogger('ExcelFile', 'Get_PO_Files_API', {message:'Column Mismatch - PO' , stack:MismatchedColumn});
                                    reject({message: 'Column Mismatch - PO : ' + MismatchedColumn});
                                    //dataconn.errorlogger('ExcelFile', 'Get_PO_Files_API', 'Column Mismatch'+MismatchedColumn);
                                }
                        }
                        else{
                            dataconn.errorlogger('ExcelFile', 'Get_PO_Files_API', {message:'No data present in xml file - PO' , stack:'No data present in xml file - PO'});
                            reject({message:'No data present in xml file - PO'});
                          }
                         
                        
                }
                else if(Filename == 'RMO')
                {
                    console.log('ExportExcel File reading');

                    let ExcelColumnArray = [];
                    //ExcelColumnArray = workSheetsFromFile[0].data[0];
                    const xmlFile = fs.readFileSync(path.join(__dirname + '/../Upload/'+Filename+'/ESS_O_'+RequestID+'_BIP.xml'), 'utf8');
                    parseString(xmlFile, function (err, result) {
                      jsonTextFromXML = JSON.parse(JSON.stringify(result));

                      console.log('jsonTextFromXML',jsonTextFromXML);
                      // jsonresult = JSON.stringify(result)
                      });
                    //   const workSheetsFromFile = xlsx.parse(jsonTextFromXML['DATA_DS']['G_1']);
                    //   console.log('parse to excel',workSheetsFromFile);
                      // console.log('xml result',jsonresult['DATA_DS']['G_1'].length);

                      //var data_DSPresent = Object.keys(jsonTextFromXML['DATA_DS']['G_1'][0]);
                     // console.log('dataPresent',dataPresent)

                      if(Object.keys(jsonTextFromXML['DATA_DS'])[0] == 'G_1' && Object.keys(jsonTextFromXML['DATA_DS']['G_1']).length > 0){

                        var ColumnList = Object.keys(jsonTextFromXML['DATA_DS']['G_1'][0]);

                        ColumnList.forEach(ExcelColumnelement=>{
                            if(RMO_HeaderObject.includes(ExcelColumnelement))
                            {
                                console.log('Includes '+ExcelColumnelement);
                            }
                            else{
                                console.log('Column Mismatched '+ExcelColumnelement);
                                MismatchedColumn.push(ExcelColumnelement);
                            }
                        });
                            
                        //if(MismatchedColumn.length==0)
                        if(MismatchedColumn.length == 0)
                        {
                            jsonTextFromXML['DATA_DS']['G_1'].forEach((element)=>{
                                finalObject.push({
                                    LINE_NUMBER :element['LINE_NUM'],
                                    LOCATION_NAME :element['LOCATION_NAME'],
                                    INTERNAL_LOCATION_CODE :element['INTERNAL_LOCATION_CODE'],
                                    ITEM_NUMBER :element['ITEM_NUMBER'],
                                    PRIMARY_UOM_CODE :element['PRIMARY_UOM_CODE'],
                                    INVT_ITEM_ID :element['INVT_ITEM_ID'],
                                    ITEM_DESC :element['ITEM_DESC'],
                                    SUPPLIER_ITEM_DESC :element['SUPPLIER_ITEM_DESC'],
                                    SUPPLIER_ITEM_CODE :element['SUPPLIER_ITEM_CODE'],
                                    RECEIPT_NUM :element['RECEIPT_NUM'],
                                    TRN_QTY :element['TRN_QTY'],
                                    LOT_NUMBER :element['LOT_NUMBER'],
                                    COST :element['COST'],
                                    DEPTARTMENT_CODE:element['DEPT_CODE'],
                                    LOCATION_CODE:element['LOC_CODE']
                                });
                            });
                            resolve(finalObject);
    
                        }   
                        else{
                            dataconn.errorlogger('ExcelFile', 'Get_RMO_Files_API', {message:'Column Mismatch - RMO' , stack:MismatchedColumn});
                            reject({message:'Column Mismatch - RMO : ' + MismatchedColumn});
                            //dataconn.errorlogger('ExcelFile', 'Get_RMO_Files_API', {message:'Column Mismatch - RMO' , stack:MismatchedColumn});
                        }
                      }
                      else{
                        dataconn.errorlogger('ExcelFile', 'Get_RMO_Files_API', {message:'No data present in xml file - RMO' , stack:'No data present in xml file - RMO'});
                        reject({message:'No record present in xml file - RMO'});
                      }

                     
                }
                else if(Filename == 'TDSGST'){
                    console.log("in tdsgst block");
                    const xmlFile = fs.readFileSync(path.join(__dirname + '/../Upload/'+Filename+'/ESS_O_'+RequestID+'_BIP.xml'), 'utf8');
                    // const xmlFile = fs.readFileSync(path.join(__dirname + '/../Upload/'+Filename+'/TDSGSTDemo.xml'), 'utf8');
                    parseString(xmlFile, function (err, result) {
                        jsonTextFromXML = JSON.parse(JSON.stringify(result));
                        // jsonresult = JSON.stringify(result)
                    });
                    
                        
                    console.log("above column list");
                    if(Object.keys(jsonTextFromXML['DATA_DS'])[0] == 'G_1' && Object.keys(jsonTextFromXML['DATA_DS']['G_1']).length > 0){
                        var ColumnList = Object.keys(jsonTextFromXML['DATA_DS']['G_1'][0])
                        console.log('column list result',ColumnList);
                        ColumnList.forEach(ExcelColumnelement=>{
                        
                        if(TDSGST_HeaderObject.includes(ExcelColumnelement))
                        {
                            console.log('TDSGST Report Includes '+ExcelColumnelement);
                        }
                        else{
                            console.log('TDSGST Report Column Mismatched '+ExcelColumnelement);
                            MismatchedColumn.push(ExcelColumnelement);
                        }
                        });
                        // workSheetsFromFile[0].data.slice(0,1).forEach((element)=>{
                        // if(MismatchedColumn.length==0)
                        console.log("this is below colum list")
                        if(MismatchedColumn.length==0)
                        {
                            jsonTextFromXML['DATA_DS']['G_1'].forEach((element)=>{
                                finalObject.push({
                                    PartyId :element['PartyId'],
                                    PartySiteId :element['PartySiteId'],
                                    PartyTypeCode :element['PartyTypeCode'],
                                    PartyName :element['PartyName'],
                                    PartyNumber :element['PartyNumber'],
                                    PartySiteNumber :element['PartySiteNumber'],
                                    TaxRegimeCode :element['TaxRegimeCode'],
                                    RegistrationTypeCode :element['RegistrationTypeCode'],
                                    RegistrationStatusCode :element['RegistrationStatusCode'],
                                    EffectiveFrom :element['EffectiveFrom'],
                                    RegistrationNumber :element['RegistrationNumber'],
                                    RoundingRuleCode :element['RoundingRuleCode'],
                                    ValidationType :element['ValidationType'],
                                    ValidationLevel :element['ValidationLevel'],
                                    IsUpdated : 0,
                                    CreatedBy : 1
                                });
                            });
                            // console.log(finalObject)
                            resolve(finalObject);
                            console.log("this is below final object")
                        }
                        else{
                            dataconn.errorlogger('ExcelFile', 'Get_TDSGST_Files_API', {message:'Column Mismatch - TDSGST' , stack:MismatchedColumn});
                            reject({message:'Column Mismatch - TDSGST : ' + MismatchedColumn});
                        }
                    }
                    else{
                        dataconn.errorlogger('ExcelFile', 'Get_TDSGST_Files_API', {message:'No data present in xml file - TDSGST' , stack:'No data present in xml file - TDSGST'});
                        reject({message:'No record present in xml file - TDSGST'});
                    }
                }
                
                else if(Filename == 'PO_Cost_Report'){
                    console.log("In PO cost api block");
                    const xmlFile = fs.readFileSync(path.join(__dirname + '/../Upload/'+Filename+'/ESS_O_'+RequestID+'_BIP.xml'), 'utf8');
                    parseString(xmlFile, function (err, result) {
                        jsonTextFromXML = JSON.parse(JSON.stringify(result));
                        // jsonresult = JSON.stringify(result)
                    });
                    
                        
                    console.log("above column list");
                    if(Object.keys(jsonTextFromXML['DATA_DS'])[0] == 'G_1' && Object.keys(jsonTextFromXML['DATA_DS']['G_1']).length > 0){
                        // if(Object.keys(jsonTextFromXML['DATA_DS'])[0] == 'G_1' && Object.keys(jsonTextFromXML['DATA_DS']['G_1']).length > 0){
                        var ColumnList = Object.keys(jsonTextFromXML['DATA_DS']['G_1'][0])
                        console.log('column list result',ColumnList);
                        ColumnList.forEach(ExcelColumnelement=>{
                            if(POCost_HeaderObject.includes(ExcelColumnelement))
                            {
                                console.log('POCost Report Includes '+ExcelColumnelement);
                            }
                            else{
                                console.log('POCost Report Column Mismatched '+ExcelColumnelement);
                                MismatchedColumn.push(ExcelColumnelement);
                            }
                        });
                        // workSheetsFromFile[0].data.slice(0,1).forEach((element)=>{
                        // if(MismatchedColumn.length==0)
                        console.log("this is below colum list")
                        if(MismatchedColumn.length==0)
                        {
                            jsonTextFromXML['DATA_DS']['G_1'].forEach((element)=>{
                                finalObject.push({
                                    TRANSACTION_ID :element['TRANSACTION_ID'],
                                    INVENTORY_ITEM_ID :element['INVENTORY_ITEM_ID'],
                                    INVENTORY_ORG_ID :element['INVENTORY_ORG_ID'],
                                    TXN_SOURCE_DOC_TYPE :element['TXN_SOURCE_DOC_TYPE'],
                                    GRN_NO :element['GRN_NO'],
                                    TXN_SOURCE_REF_DOC_NUMBER :element['TXN_SOURCE_REF_DOC_NUMBER'],
                                    IsActive : 1,
                                    CreatedBy : 1
                                });
                            });
                            // console.log(finalObject)
                            resolve(finalObject);
                            console.log("this is below final object")
                        }
                        else{
                            dataconn.errorlogger('ExcelFile', 'Get_PO_Cost_Report_Files_API', {message:'Column Mismatch - PO_Cost_Report' , stack:MismatchedColumn});
                            reject({message:'Column Mismatch -  : PO_Cost_Report' + MismatchedColumn});
                            //dataconn.errorlogger('ExcelFile', 'Get_PO_Files_API', 'Column Mismatch'+MismatchedColumn);
                        }
                    }
                    else{
                        dataconn.errorlogger('ExcelFile', 'Get_PO_Cost_Report_Files_API', {message:'No data present in xml file - PO_Cost_Report' , stack:'No data present in xml file - PO_Cost_Report'});
                        reject({message:'No record present in xml file - PO_Cost_Report'});
                    }
                }

            }
            else
            {
                console.log('ExportExcel File doesnt exists');
                reject({message:'ExportExcel File doesnt exists'});
            }
            // let data = {
            //     workSheetsFromFile:finalObject
            // }
            // resolve(finalObject);
        }
        catch(error){
            reject({message:error});
        }
    });
}

// module.exports.ExportExcelFile = function() {
//     return new Promise((resolve ,reject) => {
//         try{
//             let finalObject = [];
//             const excelpath = path.join(__dirname + '/../ExcelFile/FAMisc.xlsx');
//             const workSheetsFromFile = xlsx.parse(excelpath);

//             workSheetsFromFile[0].data.slice(1).forEach((element)=>{
//                     finalObject.push({
//                         INVENTORY_ITEM_ID:element[0]
//                         ATTRIBUTE1:element[1]
//                         PRIMARY_UOM_CODEA:element[2]
//                         ITEM_NUMBER:element[3]
//                         ASSET_ID:element[4]
//                         ASSET_NUMBER:element[5]
//                         CURRENT_UNITS:element[6]
//                         COST:element[7]
//                         DEPRN_RESERVE:element[8]
//                         NBV:element[9]
//                         LOCATION:element[10]
//                         ITEM_DESC:element[11]
//                         ASSET_DESC:element[12]
//                     });
//             });
            
//             let data = {
//                 workSheetsFromFile:finalObject
//             }
//             resolve(data);
//         }
//         catch(error){
//             reject(error);
//         }
//     });
// }

