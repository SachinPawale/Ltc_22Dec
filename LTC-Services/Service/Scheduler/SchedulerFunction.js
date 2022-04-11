var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var connect = require('../../Data/Connect');
var express = require('express');
var dataconn = require('../../Data/DataConnection');
var router = express.Router();
const Sequelize = require('sequelize');
const excelService = require('../../Common/ExcelFile');
const APIDump = require('./APIDump');
const fs = require('fs')
const path = require('path');
const mailer = require('./../../Common/Mailer')
const transaction = require('./../../Service/Transaction/transaction')
const emailservice = require('./../../Common/EmailService')
const SchedulerEmailConfig = require('./../../Config')
var moment = require('moment');
const Enumerable = require('linq');





var routes = function () {

router.route('/Get_PO_Files_API')
.get(function (req, res) {
    APIDump.GetFiles_API('PO')
    .then((result)=>
    {
        console.log('GetFiles_API result',result);
        if(result!='')
        {
            excelService.ExportExcelFile('PO',result.RequestID)
            .then((finalObject)=>{
                console.log('after ExportExcelFile ',finalObject);
                const BoEMasterDetails = datamodel.BoEMasterDetails();
                BoEMasterDetails.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    BoEMasterDetails.bulkCreate(bulkdata).then(() => {
                        return BoEMasterDetails.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/PO/ESS_O_'+result.RequestID+'_BIP.xml');
                        if(fs.existsSync(filepath))
                        {    
                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                                console.log(err);
                                let mailObj = {
                                    assetId:'',
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

                          res.status(200).json({ Success: true, Message: "All records saved successfully for BoEMasterDetails", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Files_API', error);
                        res.status(200).json({ Success: false, Message: "Error while saving details for BoEMasterDetails", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_PO_Files_API', error);
                    res.status(200).json({ Success: false, Message: "Error while truncate for BoEMasterDetails", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            }) 
           
        }
        else{
            res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('PO')", Data: error });  
        }
        // console.log('Into then of GetFiles_API',result);
        // res.status(200).json({ Success: true, Message: "All records saved successfully for PO Master", Data: null });
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Files_API', {message:'Error while getting files - GetFiles_API(PO)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('PO')", Data: error });  
    })
})

router.route('/Get_FA_Files_API')
.get(function (req, res) {
    APIDump.GetFiles_API('FA')
    .then((result)=>
    {
        console.log('Get_FA_Files_API result',result);
        if(result!='')
        {
            excelService.ExportExcelFile('FA',result.RequestID)
            .then((finalObject)=>{
                //console.log('after ExportExcelFile ',finalObject);
                const famiscmaster = datamodel.famiscmaster();
                famiscmaster.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    famiscmaster.bulkCreate(bulkdata).then(() => {
                        return famiscmaster.findAll();
                    })
                    .then((result1) => {
                        
                        var filepath = path.join(__dirname + '/../../Upload/FA/ESS_O_'+result.RequestID+'_BIP.xml');
                        if(fs.existsSync(filepath))
                        {    
                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'FA Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'FA Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          res.status(200).json({ Success: true, Message: "All records saved successfully for famiscmaster", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_FA_Files_API', error);
                        res.status(200).json({ Success: false, Message: "Error while saving details for famiscmaster", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_FA_Files_API', error);
                    res.status(200).json({ Success: false, Message: "Error while truncate for famiscmaster", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'FA Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'FA Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            }) 
           
        }
        else{
            res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('FA')", Data: error });  
        }
        // console.log('Into then of GetFiles_API',result);
        // res.status(200).json({ Success: true, Message: "All records saved successfully for PO Master", Data: null });
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_FA_Files_API', {message:'Error while getting files - GetFiles_API(FA)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'FA Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'FA Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('FA')", Data: error });  
    })
})

router.route('/Get_RMO_Files_API')
.get(function (req, res) {
    APIDump.GetFiles_API('RMO')
    .then((result)=>{
        console.log('Get_RMO_Files_API result',result);
        if(result!=''){
            excelService.ExportExcelFile('RMO',result.RequestID)
            .then((finalObject)=>{
                console.log('after ExportExcelFile ',finalObject);
                const rmomaster = datamodel.rmomaster();
                rmomaster.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    rmomaster.bulkCreate(bulkdata).then(() => {
                        return rmomaster.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/RMO/ESS_O_'+result.RequestID+'_BIP.xml');
                        console.log('filepath',filepath);
                        if(fs.existsSync(filepath))
                        {    
                            console.log('into filepath');

                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'RMO Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'RMO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          res.status(200).json({ Success: true, Message: "All records saved successfully for RMO_master", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                        res.status(200).json({ Success: false, Message: "Error while saving details for RMO_master", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                    res.status(200).json({ Success: false, Message: "Error while truncate for RMO_master", Data: error });
                });
            })
            .catch((error)=>{

                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'RMO Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'RMO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            })         
        }
        else{
            res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('RMO')", Data: error });  
        }
        // console.log('Into then of GetFiles_API',result);
        // res.status(200).json({ Success: true, Message: "All records saved successfully for PO Master", Data: null });
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', {message:'Error while getting files - GetFiles_API(RMO)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'RMO Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'RMO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('RMO')", Data: error });  
    })
})

router.route('/Get_TDSGST_Files_API')
.get(function (req, res) {
    APIDump.GetFiles_API('TDSGST')
    .then((result)=>{
        console.log('Get_TDSGST_Files_API result',result);
        if(result!=''){
            excelService.ExportExcelFile('TDSGST',result.RequestID)
            .then((finalObject)=>{
                // console.log('after ExportExcelFile ',finalObject);
                const TDSGST = datamodel.TDSGST();
                var param = {};
                dataaccess.FindAll(TDSGST, param)
                .then((existingresult) => {
                
                    let xmlData = finalObject;
                    let existingData = existingresult;
                    let filteredData = [];

                    xmlData.forEach((element1) => {
                        var Row = Enumerable.from(existingData)
                        .where((element2) => {
                            if(element1.PartyTypeCode[0] == 'THIRD_PARTY' && element2.PartyTypeCode == 'THIRD_PARTY'){
                                if(
                                    parseInt(element1.PartyId[0]) == element2.PartyId && 
                                    parseInt(element1.PartyNumber[0]) == element2.PartyNumber && 
                                    element1.RegistrationNumber[0] == element2.RegistrationNumber &&
                                    element1.PartyTypeCode[0] == 'THIRD_PARTY' && 
                                    element2.PartyTypeCode == 'THIRD_PARTY'
                                ){
                                    filteredData.push(element1);
                                }  
                            }
                            else if(element1.PartyTypeCode[0] == 'THIRD_PARTY_SITE' && element2.PartyTypeCode == 'THIRD_PARTY_SITE'){
                                if(
                                    parseInt(element1.PartySiteId[0]) == element2.PartySiteId 
                                    && parseInt(element1.PartySiteNumber[0]) == element2.PartySiteNumber 
                                    && element1.RegistrationNumber[0] == element2.RegistrationNumber
                                    && element1.PartyTypeCode[0] == 'THIRD_PARTY_SITE' 
                                    && element2.PartyTypeCode == 'THIRD_PARTY_SITE'
                                ){
                                    filteredData.push(element1);
                                }
                            }
                        })
                        .toArray();
                    });

                    filteredData = xmlData.filter(val => !filteredData.includes(val));

                    console.log('filteredData',filteredData)
                    var bulkdata = filteredData;
                    TDSGST.bulkCreate(bulkdata).then(() => {
                        return TDSGST.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/TDSGST/ESS_O_'+result.RequestID+'_BIP.xml');
                        console.log('filepath',filepath);
                        if(fs.existsSync(filepath))
                        {    
                            console.log('into filepath');

                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'TDSGST Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'TDSGST Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          res.status(200).json({ Success: true, Message: "All records saved successfully for TDSGST_master", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', error);
                        res.status(200).json({ Success: false, Message: "Error while saving details for TDSGST_master", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', error);
                    res.status(200).json({ Success: false, Message: "Error while fetching existing records from TDSGST_master", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'TDSGST Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'TDSGST Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                //   console.log(mailObj);
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            })         
        }
        else{
            res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('TDSGST')", Data: error });  
        }
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', {message:'Error while getting files - GetFiles_API(TDSGST)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'TDSGST Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'TDSGST Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('TDSGST')", Data: error });  
    })
})

router.route('/Get_PO_Cost_Report_Files_API')
.get(function (req, res) {
    APIDump.GetFiles_API('PO_Cost_Report')
    .then((result)=>{
        console.log('Get_PO_Cost_Report_Files_API result',result);
        if(result!=''){
            excelService.ExportExcelFile('PO_Cost_Report',result.RequestID)
            .then((finalObject)=>{
                console.log('after ExportExcelFile ',finalObject);
                const POCostReport = datamodel.POCostReport();
                POCostReport.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    POCostReport.bulkCreate(bulkdata).then(() => {
                        return POCostReport.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/PO_Cost_Report/ESS_O_'+result.RequestID+'_BIP.xml');
                        console.log('filepath',filepath);
                        if(fs.existsSync(filepath))
                        {    
                            console.log('into filepath');

                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO_Cost_Report Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Cost Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          res.status(200).json({ Success: true, Message: "All records saved successfully for PO_Cost_Report", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Cost_Report_Files_API', error);
                        res.status(200).json({ Success: false, Message: "Error while saving details for PO_Cost_Report", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_PO_Cost_Report_Files_API', error);
                    res.status(200).json({ Success: false, Message: "Error while truncate for POCost_master", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO_Cost_Report Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Cost Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                //   console.log(mailObj);
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            })         
        }
        else{
            res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('POCost')", Data: error });  
        }
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Cost_Report_Files_API', {message:'Error while getting files - GetFiles_API(POCost)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO_Cost_Report Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Cost Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('POCost')", Data: error });  
    })
})

router.route('/Test_TDSGST')
.get(function (req, res) {
    excelService.ExportExcelFile('TDSGST',1027212)
            .then((finalObject)=>{
                // console.log('after ExportExcelFile ',finalObject);
                const TDSGST = datamodel.TDSGST();
                var param = {};
                dataaccess.FindAll(TDSGST, param)
                .then((existingresult) => {
                    let xmlData = finalObject;
                    let existingData = existingresult;
                    let filteredData = [];

                    xmlData.forEach((element1,index1) => {
                        var Row = Enumerable.from(existingData)
                        .where((element2) => {
                            if(element1.PartyTypeCode[0] == 'THIRD_PARTY' && element2.PartyTypeCode == 'THIRD_PARTY'){
                                if(
                                    parseInt(element1.PartyId[0]) == element2.PartyId && 
                                    parseInt(element1.PartyNumber[0]) == element2.PartyNumber && 
                                    element1.RegistrationNumber[0] == element2.RegistrationNumber &&
                                    element1.PartyTypeCode[0] == 'THIRD_PARTY' && 
                                    element2.PartyTypeCode == 'THIRD_PARTY'
                                ){
                                    filteredData.push(element1);
                                }  
                            }
                            else if(element1.PartyTypeCode[0] == 'THIRD_PARTY_SITE' && element2.PartyTypeCode == 'THIRD_PARTY_SITE'){
                                if(
                                    parseInt(element1.PartySiteId[0]) == element2.PartySiteId 
                                    && parseInt(element1.PartySiteNumber[0]) == element2.PartySiteNumber 
                                    && element1.RegistrationNumber[0] == element2.RegistrationNumber
                                    && element1.PartyTypeCode[0] == 'THIRD_PARTY_SITE' 
                                    && element2.PartyTypeCode == 'THIRD_PARTY_SITE'
                                ){
                                    filteredData.push(element1);
                                }
                            }
                        })
                        .toArray();
                    });

                    filteredData = xmlData.filter(val => !filteredData.includes(val));

                    console.log('filteredData',filteredData)
                    var bulkdata = filteredData;
                    TDSGST.bulkCreate(bulkdata).then(() => {
                        return TDSGST.findAll();
                    })
                    .then((result1) => {
                          res.status(200).json({ Success: true, Message: "All records saved successfully for TDSGST_master", Data: null });
                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', error);
                        res.status(200).json({ Success: false, Message: "Error while saving details for TDSGST_master", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', error);
                    res.status(200).json({ Success: false, Message: "Error while fetching existing records from TDSGST_master", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'TDSGST Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'TDSGST Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                //   console.log(mailObj);
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            })
});

return router;
};


var Get_PO_Files_APIFunction = function(){
    APIDump.GetFiles_API('PO')
    .then((result)=>
    {
        console.log('GetFiles_API result',result);
        if(result!='')
        {
            excelService.ExportExcelFile('PO',result.RequestID)
            .then((finalObject)=>{
                console.log('after ExportExcelFile ',finalObject);
                const BoEMasterDetails = datamodel.BoEMasterDetails();
                BoEMasterDetails.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    BoEMasterDetails.bulkCreate(bulkdata).then(() => {
                        return BoEMasterDetails.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/PO/ESS_O_'+result.RequestID+'_BIP.xml');
                        if(fs.existsSync(filepath))
                        {    
                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                                console.log(err);
                                let mailObj = {
                                    assetId:'',
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

                          //res.status(200).json({ Success: true, Message: "All records saved successfully for BoEMasterDetails", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Files_API', error);
                        //res.status(200).json({ Success: false, Message: "Error while saving details for BoEMasterDetails", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_PO_Files_API', error);
                    //res.status(200).json({ Success: false, Message: "Error while truncate for BoEMasterDetails", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                //res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            }) 
           
        }
        else{
            //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('PO')", Data: error });  
        }
        // console.log('Into then of GetFiles_API',result);
        // res.status(200).json({ Success: true, Message: "All records saved successfully for PO Master", Data: null });
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Files_API', {message:'Error while getting files - GetFiles_API(PO)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('PO')", Data: error });  
    })
}

var Get_FA_Files_APIFunction = function(){
    APIDump.GetFiles_API('FA')
    .then((result)=>
    {
        console.log('Get_FA_Files_API result',result);
        if(result!='')
        {
            excelService.ExportExcelFile('FA',result.RequestID)
            .then((finalObject)=>{
                //console.log('after ExportExcelFile ',finalObject);
                const famiscmaster = datamodel.famiscmaster();
                famiscmaster.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    famiscmaster.bulkCreate(bulkdata).then(() => {
                        return famiscmaster.findAll();
                    })
                    .then((result1) => {
                        
                        var filepath = path.join(__dirname + '/../../Upload/FA/ESS_O_'+result.RequestID+'_BIP.xml');
                        if(fs.existsSync(filepath))
                        {    
                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'FA Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'FA Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          //res.status(200).json({ Success: true, Message: "All records saved successfully for famiscmaster", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_FA_Files_API', error);
                        //res.status(200).json({ Success: false, Message: "Error while saving details for famiscmaster", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_FA_Files_API', error);
                    //res.status(200).json({ Success: false, Message: "Error while truncate for famiscmaster", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'FA Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'FA Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                //res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            }) 
           
        }
        else{
            //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('FA')", Data: error });  
        }
        // console.log('Into then of GetFiles_API',result);
        // res.status(200).json({ Success: true, Message: "All records saved successfully for PO Master", Data: null });
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_FA_Files_API', {message:'Error while getting files - GetFiles_API(FA)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'FA Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'FA Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('FA')", Data: error });  
    })
}

var Get_RMO_Files_APIFunction = function(){
    APIDump.GetFiles_API('RMO')
    .then((result)=>{
        console.log('Get_RMO_Files_API result',result);
        if(result!=''){
            excelService.ExportExcelFile('RMO',result.RequestID)
            .then((finalObject)=>{
                console.log('after ExportExcelFile ',finalObject);
                const rmomaster = datamodel.rmomaster();
                rmomaster.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    rmomaster.bulkCreate(bulkdata).then(() => {
                        return rmomaster.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/RMO/ESS_O_'+result.RequestID+'_BIP.xml');
                        console.log('filepath',filepath);
                        if(fs.existsSync(filepath))
                        {    
                            console.log('into filepath');

                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'RMO Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'RMO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          //res.status(200).json({ Success: true, Message: "All records saved successfully for RMO_master", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                        //res.status(200).json({ Success: false, Message: "Error while saving details for RMO_master", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                    //res.status(200).json({ Success: false, Message: "Error while truncate for RMO_master", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'RMO Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'RMO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', error);
                //res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            })         
        }
        else{
            //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('RMO')", Data: error });  
        }
        // console.log('Into then of GetFiles_API',result);
        // res.status(200).json({ Success: true, Message: "All records saved successfully for PO Master", Data: null });
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_RMO_Files_API', {message:'Error while getting files - GetFiles_API(RMO)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'RMO Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'RMO Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('RMO')", Data: error });  
    })
}

var Get_TDSGST_Files_APIFunction= function(){
    APIDump.GetFiles_API('TDSGST')
    .then((result)=>{
        console.log('Get_TDSGST_Files_API result',result);
        if(result!=''){
            excelService.ExportExcelFile('TDSGST',result.RequestID)
            .then((finalObject)=>{
                console.log('after ExportExcelFile ',finalObject);
                const TDSGST = datamodel.TDSGST();
                var param = {};
                dataaccess.FindAll(TDSGST, param)
                .then((existingresult) => {
                    let xmlData = finalObject;
                    let existingData = existingresult;
                    let filteredData = [];

                    xmlData.forEach((element1) => {
                        var Row = Enumerable.from(existingData)
                        .where((element2) => {
                            if(element1.PartyTypeCode[0] == 'THIRD_PARTY' && element2.PartyTypeCode == 'THIRD_PARTY'){
                                if(
                                    parseInt(element1.PartyId[0]) == element2.PartyId && 
                                    parseInt(element1.PartyNumber[0]) == element2.PartyNumber && 
                                    element1.RegistrationNumber[0] == element2.RegistrationNumber &&
                                    element1.PartyTypeCode[0] == 'THIRD_PARTY' && 
                                    element2.PartyTypeCode == 'THIRD_PARTY'
                                ){
                                    filteredData.push(element1);
                                }  
                            }
                            else if(element1.PartyTypeCode[0] == 'THIRD_PARTY_SITE' && element2.PartyTypeCode == 'THIRD_PARTY_SITE'){
                                if(
                                    parseInt(element1.PartySiteId[0]) == element2.PartySiteId 
                                    && parseInt(element1.PartySiteNumber[0]) == element2.PartySiteNumber 
                                    && element1.RegistrationNumber[0] == element2.RegistrationNumber
                                    && element1.PartyTypeCode[0] == 'THIRD_PARTY_SITE' 
                                    && element2.PartyTypeCode == 'THIRD_PARTY_SITE'
                                ){
                                    filteredData.push(element1);
                                }
                            }
                        })
                        .toArray();
                    });

                    filteredData = xmlData.filter(val => !filteredData.includes(val));

                    console.log('filteredData',filteredData)
                    var bulkdata = filteredData;
                    TDSGST.bulkCreate(bulkdata).then(() => {
                        return TDSGST.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/TDSGST/ESS_O_'+result.RequestID+'_BIP.xml');
                        console.log('filepath',filepath);
                        if(fs.existsSync(filepath))
                        {    
                            console.log('into filepath');

                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'TDSGST Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'TDSGST Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          //res.status(200).json({ Success: true, Message: "All records saved successfully for TDSGST_master", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', error);
                        //res.status(200).json({ Success: false, Message: "Error while saving details for TDSGST_master", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', error);
                    //res.status(200).json({ Success: false, Message: "Error while truncate for TDSGST_master", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'TDSGST Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'TDSGST Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                //   console.log(mailObj);
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            })         
        }
        else{
            //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('TDSGST')", Data: error });  
        }
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_TDSGST_Files_API', {message:'Error while getting files - GetFiles_API(TDSGST)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'TDSGST Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'TDSGST Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('TDSGST')", Data: error });  
    })
}

var Get_PO_Cost_Report_Files_APIFunction= function(){
    APIDump.GetFiles_API('PO_Cost_Report')
    .then((result)=>{
        console.log('Get_PO_Cost_Report_Files_API result',result);
        if(result!=''){
            excelService.ExportExcelFile('PO_Cost_Report',result.RequestID)
            .then((finalObject)=>{
                console.log('after ExportExcelFile ',finalObject);
                const POCostReport = datamodel.POCostReport();
                POCostReport.destroy({
                        where: {},
                        truncate: true
                })
                .then(() => {
                    //console.log('Bulk data',result);
                    var bulkdata = finalObject;
                    POCostReport.bulkCreate(bulkdata).then(() => {
                        return POCostReport.findAll();
                    })
                    .then((result1) => {
                        var filepath = path.join(__dirname + '/../../Upload/PO_Cost_Report/ESS_O_'+result.RequestID+'_BIP.xml');
                        console.log('filepath',filepath);
                        if(fs.existsSync(filepath))
                        {    
                            console.log('into filepath');

                            fs.unlink(filepath,(err)=>{
                                if (err) {
                                    console.log("failed to delete local file:"+err);
                                } else {
                                    console.log('successfully deleted local file');                                
                                }
                            });
                        }   
                        var updatevalues={
                            RequestStatus: 'Final Success',
                            APIObject: 'Data saved and files deleted',
                            EndDate:connect.sequelize.fn("NOW")
                            };
                          var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                          
                          dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);

                          var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO_Cost_Report Scheduler',
                             Status: 'Success',
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Cost Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('into notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                          //res.status(200).json({ Success: true, Message: "All records saved successfully for PO_Cost_Report", Data: null });

                    })
                    .catch(function (error) {
                        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Cost_Report_Files_API', error);
                        //res.status(200).json({ Success: false, Message: "Error while saving details for PO_Cost_Report", Data: error });
                    });
                })
                .catch(function (error) {
                    dataconn.errorlogger('SchedulerFunction', 'Get_PO_Cost_Report_Files_API', error);
                    //res.status(200).json({ Success: false, Message: "Error while truncate for POCost_master", Data: error });
                });
            })
            .catch((error)=>{
                console.log('Excel error' , error)
                var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO_Cost_Report Scheduler',
                             Status: 'Failed . ' + error.message,
                             RequestID: result.RequestID,
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Cost Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                //   console.log(mailObj);
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

                //res.status(200).json({ Success: false, Message: "Error while extracting data from xml", Data: error });  
            })         
        }
        else{
           // res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('POCost')", Data: error });  
        }
    })
    .catch((error)=>{
        dataconn.errorlogger('SchedulerFunction', 'Get_PO_Cost_Report_Files_API', {message:'Error while getting files - GetFiles_API(POCost)' , stack:error});

        var templateLocation = path.join(__dirname + '/../../Templates/Scheduler/SchedulerMail.ejs');
                          let mailtemplateData = {
                             Schedulernaame: 'PO_Cost_Report Scheduler',
                             Status: 'Failed',
                             RequestID: 'NA',
                             Date: moment(new Date()).format('DD-MM-YYYY h:mm:ss a')
                         }; 
                         emailservice.notifyMail(SchedulerEmailConfig.SchedulerEmailConfig.fromEmail,SchedulerEmailConfig.SchedulerEmailConfig.toEmail,SchedulerEmailConfig.SchedulerEmailConfig.ccEmail,'PO Cost Master Scheduler Details',templateLocation,mailtemplateData)
                            .then((mailresults) => {
                                console.log('failed mail notify');
                                let mailObj = {
                                    mailTo:mailresults.messageData.to,
                                    mailFrom: mailresults.messageData.from,
                                    mailCc: mailresults.messageData.cc,
                                    mailSubject: mailresults.messageData.subject,
                                    mailBody: mailresults.messageData.html,
                                    messageId: mailresults.info.messageId,
                                    mailStatus: true,
                                  };
                                  dataconn.maillogger(mailObj);
                            })
                            .catch((err) => {
                              console.log(err);
                              let mailObj = {
                                assetId:'',
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

        //res.status(200).json({ Success: false, Message: "Error while getting files - GetFiles_API('POCost')", Data: error });  
    })
}

module.exports = routes;
module.exports.Get_PO_Files_APIFunction = Get_PO_Files_APIFunction;
module.exports.Get_FA_Files_APIFunction = Get_FA_Files_APIFunction;
module.exports.Get_RMO_Files_APIFunction = Get_RMO_Files_APIFunction;
module.exports.Get_TDSGST_Files_APIFunction = Get_TDSGST_Files_APIFunction;
module.exports.Get_PO_Cost_Report_Files_APIFunction = Get_PO_Cost_Report_Files_APIFunction;