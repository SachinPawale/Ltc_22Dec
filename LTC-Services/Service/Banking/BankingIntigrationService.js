var express = require("express");
var router = express.Router();
var connect = require("../../Data/Connect");
var datamodel = require("../../Data/DataModel");
var dataaccess = require("../../Data/DataAccess");
var dataconn = require("../../Data/DataConnection");
var mailer = require("../../Common/Mailer");
var commonfunc = require("../../Common/CommonFunctions");
var async = require("async");
var promise = connect.Sequelize.Promise;
const configuration = require('../../Config');
var axios = require('axios');
// let Client = require('ssh2-sftp-client');
const fs = require('fs');
// const fsPromises = require("fs/promises");
const fsPromises = require('fs').promises;
const path = require('path');
var unzipper = require('unzipper');
const ftp = require('basic-ftp');

// var Client = require('ssh2').Client;
// var connection = new Client();


function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }


var routes = function () {

    router.route('/Getall')
        .get(function (req, res) {
            const BankingInmst = datamodel.BankingInmst();
            var param = { order: [['Id','DESC']] };

            dataaccess.FindAll(BankingInmst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'Bankingintigrastion Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of AccountNumber', Data: null });
                    }
                }, function (err) {
                    res.status(200).json({ Success: false, Message: 'user has no access of AccountNumber', Data: null });
                });
        });

    router.route('/GetById/:Id')
        .get(function (req, res) {

            const BankingInmst = datamodel.BankingInmst();
            var param = { where: { Id: req.params.Id } };

            dataaccess.FindOne(BankingInmst, param)
                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'data access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of data', Data: null });
                    }
                }, function (err) {
                    res.status(200).json({ Success: false, Message: 'User has no access of data', Data: null });
                });

        });

    router.route('/bankintigration')
    .post(function (req, res) {
        const BankingInmst = datamodel.BankingInmst();
        var values = {
            AcNumber: req.body.AcNumber,
            CheckDate: req.body.CheckDate,
            CheckrunName: req.body.CheckrunName,
            IsActive: true
        };
        dataaccess.Create(BankingInmst, values)
        .then(function (result) {
            if (result != null) {

                res.status(200).json({ Success: true, Message: 'BankingIntigration saved successfully', Data: result });
            }
            else {
                res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
            }
        }, 
        function (err) {
            res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
        });
    });

    router.route('/SaveDetails')
    .post(function (req, res) {
        let requestData = req.body;
        console.log("requestData",requestData);
        SavingDetails(requestData)
        .then((result)=>{
            let API1Data = result;
            // console.log("API1Data",API1Data);
            res.status(200).json({ Success: true, Message: 'Successfully Saved', Data: null });
            
            API1Call(API1Data)
            .then((result1)=>{
                let API2Data = result1;
                // console.log("API2Data",API2Data);

                    API2Call(API2Data)
                    .then((result2)=>{
                        let API3Data = result2;
                        // console.log("API3Data",API3Data);

                        API3Call(API3Data)
                        .then((result3)=>{
                            let FilesDetails = result3;
                            console.log("API 3 Successfull - FilesDetails : ",FilesDetails);
                            //res.status(200).json({ Success: true, Message: 'Successfully Saved', Data: result3 });

                            MovingFileToSFTP(FilesDetails)
                            .then((result4)=>{

                                FinalUpdateStatus(API1Data,requestData.userId)
                                .then((finalupdateresult)=>{
                                    // res.status(200).json({ Success: true, Message: 'Successfully Saved', Data: null });
                                })
                                .catch((finalupdateerror)=>{
                                    ErrorUpdateStatus(API1Data,requestData.userId)
                                    .then((finalupdateresult)=>{
                                        dataconn.errorlogger('BankingIntigrationService', 'FinalUpdateStatus', {message:'Error occurred while updating record' , stack:finalupdateerror});
                                        //res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                    })
                                    .catch((finalupdateerror)=>{
                                        dataconn.errorlogger('BankingIntigrationService', 'ErrorUpdateStatus', {message:'Error occurred while updating record' , stack:finalupdateerror});
                                       // res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                    })
                                    
                                })

                            })
                            .catch((error4)=>{
                                ErrorUpdateStatus(API1Data,requestData.userId)
                                .then((finalupdateresult)=>{
                                    dataconn.errorlogger('BankingIntigrationService', 'MovingFileToSFTP', {message:'Error occurred while moving file to sftp' , stack:error4});
                                    //res.status(200).json({ Success: false, Message: 'Error occurred while moving file to sftp', Data: null });
                                })
                                .catch((finalupdateerror)=>{
                                    dataconn.errorlogger('BankingIntigrationService', 'ErrorUpdateStatus', {message:'Error occurred while updating record' , stack:finalupdateerror});
                                    //res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                                })
                                
                            })


                        })
                        .catch((error3)=>{
                            ErrorUpdateStatus(API1Data,requestData.userId)
                            .then((finalupdateresult)=>{
                                dataconn.errorlogger('BankingIntigrationService', 'API3Call', {message:'Error occurred while calling API 3' , stack:error3});
                                //res.status(200).json({ Success: false, Message: 'Error occurred while calling API 3', Data: null });
                            })
                            .catch((finalupdateerror)=>{
                                dataconn.errorlogger('BankingIntigrationService', 'ErrorUpdateStatus', {message:'Error occurred while updating record' , stack:finalupdateerror});
                                //res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                            })
                            
                        })
                })
                .catch((error2)=>{
                    ErrorUpdateStatus(API1Data,requestData.userId)
                    .then((finalupdateresult)=>{
                        dataconn.errorlogger('BankingIntigrationService', 'API2Call', {message:'Error occurred while calling API 2' , stack:error2});
                        //res.status(200).json({ Success: false, Message: 'Error occurred while calling API 2', Data: null });
                    })
                    .catch((finalupdateerror)=>{
                        dataconn.errorlogger('BankingIntigrationService', 'ErrorUpdateStatus', {message:'Error occurred while updating record' , stack:finalupdateerror});
                        //res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                    })
                    
                })       
            })
            .catch((error1)=>{
                ErrorUpdateStatus(API1Data,requestData.userId)
                .then((finalupdateresult)=>{
                    dataconn.errorlogger('BankingIntigrationService', 'API1Call', {message:'Error occurred while calling API 1' , stack:error1});
                    //res.status(200).json({ Success: false, Message: 'Error occurred while calling API 1', Data: null });
                })
                .catch((finalupdateerror)=>{
                    dataconn.errorlogger('BankingIntigrationService', 'ErrorUpdateStatus', {message:'Error occurred while updating record' , stack:finalupdateerror});
                    //res.status(200).json({ Success: false, Message: 'Error occurred while updating record', Data: null });
                })
                
            })
        })
        .catch((error)=>{
            dataconn.errorlogger('BankingIntigrationService', 'SavingDetails', {message:'Error occurred while saving record' , stack:error});
            //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
        })
    });

    function SavingDetails(requestData){
        return new Promise(async function(resolve,reject){
            const BankingInmst = datamodel.BankingInmst();
            var values = {
                AcNumber: requestData.AcNumber,
                // CheckDate: requestData.CheckDate,
                CheckrunName: requestData.CheckrunName,
                IsActive: true,
                apiStatus: 0,
                CreatedBy: requestData.userId,
            };
            dataaccess.Create(BankingInmst, values)
            .then(function (result) {
                if (result != null) {
                    resolve(result);
                }
                else {
                    reject(null);
                }
            }, 
            function (err) {
                reject(err);
            });
        });   
    }

    function API1Call(requestData){
        return new Promise(async function(resolve,reject){

            let OperationName = configuration.BankingIntegrationAPIData.HardCodedData.OperationName;
            let JobPackageName = configuration.BankingIntegrationAPIData.HardCodedData.JobPackageName;
            let JobDefName = configuration.BankingIntegrationAPIData.HardCodedData.JobDefName;

            let ESSParameters =  "300000002750044,300000002608138," + requestData.AcNumber + ',NULL,NULL,' + requestData.CheckrunName;

            var data = JSON.stringify({
                OperationName: OperationName,
                JobPackageName: JobPackageName,
                JobDefName: JobDefName,
                ESSParameters: ESSParameters
              });
              
              var config = {
                method: configuration.BankingIntegrationAPIData.configData.method,
                url: configuration.BankingIntegrationAPIData.configData.url,
                headers: configuration.BankingIntegrationAPIData.configData.headers,
                data: data
              };
              
              axios(config)
              .then(function (response) {
                if(response.status == 201 || response.status == 200){
                    if(response.data.ReqstId > 0){
                        let finalresult = {
                            API1RequestID :response.data.ReqstId
                        };
                        resolve(finalresult)
                    }
                    else{
                        reject('Response ReqstId : '+ response.data.ReqstId);
                    }
                }
                else{
                    reject('Response status : '+ response.status);
                }
              })
              .catch(function (error) {
                reject(error);
              });
        });
    }

    function API2Call(requestData){
        return new Promise(async function(resolve,reject){
            var config = {
                method: configuration.BankingIntegrationAPIData.API2configDetails.method,
                url: configuration.BankingIntegrationAPIData.API2configDetails.url + requestData.API1RequestID,
                headers: configuration.BankingIntegrationAPIData.API2configDetails.headers,
              };
              
              const response1 = await axios(config);
                if(response1.status == 201 || response1.status == 200){
                    if(response1.data.items.length != 0){
                        var statusresponse = response1.data.items
                        var statusresponse_RequestStatus = statusresponse[0].RequestStatus 
                        var objectValue = JSON.parse(statusresponse_RequestStatus);
                        // console.log("API 2 Response - 1",response1.data.items);
                        console.log("API 2 Response Status - 1",objectValue['JOBS'].STATUS);
                       
                        if(objectValue['JOBS'].STATUS.toLowerCase().trim()=='succeeded'){
                            let finalresult = {
                                API1RequestID :requestData.API1RequestID
                            };
                            resolve(finalresult)
                        }
                        else{
                            //repeat again part
                            await sleep(100000);
                            const response2 = await axios(config)
                            if(response2.status == 201 || response2.status == 200){
                                    if(response2.data.items.length != 0){
                                        var statusresponse = response2.data.items
                                        var statusresponse_RequestStatus = statusresponse[0].RequestStatus 
                                        var objectValue = JSON.parse(statusresponse_RequestStatus);
                                        // console.log("API 2 Response - 2",response2.data.items);
                                        console.log("API 2 Response Status - 2",objectValue['JOBS'].STATUS);
                                       
                                        if(objectValue['JOBS'].STATUS.toLowerCase().trim()=='succeeded'){
                                            let finalresult = {
                                                API1RequestID :requestData.API1RequestID
                                            };
                                            resolve(finalresult)
                                        }
                                    }
                                    else{
                                        reject('Response Item Length : '+ response2.data.items.length);
                                    }
                            }
                            else{
                                reject('Response status : '+ response2.status);
                            }
                        }
                    }
                    else{
                        reject('Response Item Length : '+ response1.data.items.length);
                    }
                }
                else{
                    reject('Response status : '+ response1.status);
                }
        });
    }

    function API3Call(requestData){
        return new Promise(async function(resolve,reject){
            var config = {
                method: configuration.BankingIntegrationAPIData.API3configDetails.method,
                url: configuration.BankingIntegrationAPIData.API3configDetails.url + requestData.API1RequestID + ',fileType=out',
                headers: configuration.BankingIntegrationAPIData.API3configDetails.headers,
              };
              console.log("API3Call config",config);
              axios(config)
              .then(async function (response) {
                if(response.status == 201 || response.status == 200){
                    if(response.data.items[0].DocumentContent != '' && response.data.items[0].DocumentContent != null){
                            
                         var bitmap = new Buffer.from(response.data.items[0].DocumentContent, "base64");  
            

                        if (!fs.existsSync('./Upload')){
                                fs.mkdirSync('./Upload');
                        }

                        if (!fs.existsSync('./Upload/BankingIntegration')){
                                fs.mkdirSync('./Upload/BankingIntegration');
                        }

                        if(fs.existsSync('./Upload/BankingIntegration/BankingIntegration_'+ requestData.API1RequestID + '_master.zip')){    
                                fs.unlink('./Upload/BankingIntegration/BankingIntegration_'+ requestData.API1RequestID + '_master.zip',(err)=>{
                                    if (err) {
                                        console.log("Failed To Deleted Existing Zip File : "+err);
                                        reject('Failed To Deleted Existing Zip File : ' + err);
                                    } else {
                                        console.log('Successfully Deleted Existing Zip File');                                
                                    }
                                });
                        }

                        await fsPromises.writeFile('./Upload/BankingIntegration/BankingIntegration_'+ requestData.API1RequestID + '_master.zip',bitmap)
                        .then(async()=>{
                                fs.createReadStream('./Upload/BankingIntegration/BankingIntegration_'+ requestData.API1RequestID + '_master.zip')
                                .pipe(unzipper.Extract({ path: './Upload/BankingIntegration/' }));
                                await sleep(80000);
                                let finalresult = {
                                    FullFilePath : path.join(__dirname + './Upload/BankingIntegration/ESS_O_' + requestData.API1RequestID + '_BIP.text' ),
                                    FilePath : './Upload/BankingIntegration/ESS_O_' + requestData.API1RequestID + '_BIP.text',
                                    Filename : 'ESS_O_' + requestData.API1RequestID + '_BIP.text',
                                    FilePathXML : './Upload/BankingIntegration/ESS_O_' + requestData.API1RequestID + '_BIP.xml',
                                    FilenameXML : 'ESS_O_' + requestData.API1RequestID + '_BIP.xml',
                                    API1RequestID: requestData.API1RequestID
                                }
                                resolve(finalresult);
                        })
                        .catch((error)=>{
                                console.log('Error in fsPromises.writeFile');
                                reject(error)         
                        })
                    }
                    else{
                        reject('Response DocumentContent : '+ response.data.items[0].DocumentContent);
                    }
                }
                else{
                    reject('Response status : '+ response.status);
                }
              })
              .catch(function (error) {
                reject(error);
              });
        });
    }

    function MovingFileToSFTP(requestData){
        return new Promise(async function(resolve,reject){

            const client = new ftp.Client();
            client.ftp.verbose = true
            let localfilePath = requestData.FilePath;
            let localfilePathXML = requestData.FilePathXML;
            let config = {
                host: configuration.BankingIntegrationAPIData.SFTPDetails.host,
                user: configuration.BankingIntegrationAPIData.SFTPDetails.username,
                password: configuration.BankingIntegrationAPIData.SFTPDetails.password,
                secure: false
            }

            let remoteFilePath = '/BankingIntegration/' + requestData.Filename ;

            await client.access(config).then(async()=>{
                console.log("Connection established");
                await client.uploadFrom(localfilePath, remoteFilePath)
                .then((uploadresult)=>{
                    if(fs.existsSync('./Upload/BankingIntegration/BankingIntegration_'+ requestData.API1RequestID + '_master.zip')){    
                        fs.unlink('./Upload/BankingIntegration/BankingIntegration_'+ requestData.API1RequestID + '_master.zip',(err)=>{
                            if (err) {
                                console.log("Failed To Deleted Existing Zip File : "+err);
                                reject('Failed To Deleted Existing Zip File : ' + err);
                            } else {
                                console.log('Successfully Deleted Existing Zip File');                                
                            }
                        });
                    }
                    if(fs.existsSync(localfilePath)){    
                        fs.unlink(localfilePath,(err)=>{
                            if (err) {
                                console.log("Failed To Deleted Existing text File : "+err);
                                reject('Failed To Deleted Existing text File : ' + err);
                            } else {
                                console.log('Successfully Deleted Existing text File');                                
                            }
                        });
                    }
                    if(fs.existsSync(localfilePathXML)){    
                        fs.unlink(localfilePathXML,(err)=>{
                            if (err) {
                                console.log("Failed To Deleted Existing xml File : "+err);
                                reject('Failed To Deleted Existing xml File : ' + err);
                            } else {
                                console.log('Successfully Deleted Existing xml File');                                
                            }
                        });
                    }
                    resolve();
                })
                .catch((error)=>{
                    reject('Upload to FTP error : '+error)
                    //console.log("Upload error",error);
                })
            }).catch((error)=>{
                reject('Connection to FTP error : '+error)
                // console.log("error",error);
            })

        });
    }

    function FinalUpdateStatus(requestData,userId){
        return new Promise(async function(resolve,reject){

            const BankingInmst = datamodel.BankingInmst();
            var values = {
                apiStatus: 1,
                ModifiedBy: userId,
                ModifiedDate: connect.sequelize.fn("NOW"),
            };
            var param = { Id: requestData.Id };
            dataaccess.Update(BankingInmst, values, param)
            .then(function(result) {
                if (result != null){
                    console.log('Updated BankingInmst Id - ' + requestData.Id + ' apiStatus to 1');
                    resolve();
                } 
                else{
                    reject(null);
                }
            },
            function(err) {
                reject(err);
            });

        });
    }

    function ErrorUpdateStatus(requestData,userId){
        return new Promise(async function(resolve,reject){

            const BankingInmst = datamodel.BankingInmst();
            var values = {
                apiStatus: 2,
                ModifiedBy: userId,
                ModifiedDate: connect.sequelize.fn("NOW"),
            };
            var param = { Id: requestData.Id };
            dataaccess.Update(BankingInmst, values, param)
            .then(function(result) {
                if (result != null){
                    console.log('Updated BankingInmst Id - ' + requestData.Id + ' apiStatus to 2');
                    resolve();
                } 
                else{
                    reject(null);
                }
            },
            function(err) {
                reject(err);
            });

        });
    }

    return router

};
module.exports = routes;