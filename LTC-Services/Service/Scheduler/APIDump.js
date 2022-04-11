// const ftp = require('basic-ftp');
const fs = require("fs");
const path = require('path');
const configuration = require('../../Config');
var axios = require('axios');
const XLSX  = require('node-xlsx')
var unzipper = require('unzipper');
const parseString = require('xml2js').parseString;
var dataconn = require('../../Data/DataConnection');
// const fsPromises1 = require("fs/promises");
const stream = require('stream');
const fsp = fs.promises;
const fsPromises = require('fs').promises;
var dataaccess = require('../../Data/DataAccess');
var datamodel = require('../../Data/DataModel');
const Sequelize = require('sequelize');
var connect = require("../../Data/Connect");




function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
module.exports.GetFiles_API = async function(Filename){
  return new Promise(async(resolve, reject) => {
    var Obj_Schedulerresults = {};
    try{
        if(Filename=='PO')
        {
          var Harddata = JSON.stringify({
            "OperationName": configuration.PO_ReportData.Body.OperationName, 
            "JobPackageName": configuration.PO_ReportData.Body.JobPackageName, 
            "JobDefName": configuration.PO_ReportData.Body.JobDefName, 
            "ESSParameters": configuration.PO_ReportData.Body.ESSParameters,
          });

          var config = {
              method : configuration.PO_ReportData.configData.method,
              url : configuration.PO_ReportData.configData.url,
              headers : configuration.PO_ReportData.configData.headers,
              keepAlive: true,
              data:Harddata
          };

        }
        else if(Filename=='FA')
        {
          var Harddata = JSON.stringify({
            "OperationName": configuration.FA_ReportData.Body.OperationName, 
            "JobPackageName": configuration.FA_ReportData.Body.JobPackageName, 
            "JobDefName": configuration.FA_ReportData.Body.JobDefName, 
            "ESSParameters": configuration.FA_ReportData.Body.ESSParameters,
          });

          var config = {
              method : configuration.FA_ReportData.configData.method,
              url : configuration.FA_ReportData.configData.url,
              headers : configuration.FA_ReportData.configData.headers,
              keepAlive: true,
              data:Harddata
          };
        }
        else if(Filename=='RMO')
        {
          var Harddata = JSON.stringify({
            "OperationName": configuration.RMO_ReportData.Body.OperationName, 
            "JobPackageName": configuration.RMO_ReportData.Body.JobPackageName, 
            "JobDefName": configuration.RMO_ReportData.Body.JobDefName, 
            "ESSParameters": configuration.RMO_ReportData.Body.ESSParameters,
          });

          var config = {
              method : configuration.RMO_ReportData.configData.method,
              url : configuration.RMO_ReportData.configData.url,
              headers : configuration.RMO_ReportData.configData.headers,
              keepAlive: true,
              data:Harddata
          };
        }

        else if(Filename=='TDSGST')
        {
          var Harddata = JSON.stringify({
            "OperationName": configuration.TDSGST_ReportData.Body.OperationName, 
            "JobPackageName": configuration.TDSGST_ReportData.Body.JobPackageName, 
            "JobDefName": configuration.TDSGST_ReportData.Body.JobDefName, 
            "ESSParameters": configuration.TDSGST_ReportData.Body.ESSParameters,
          });

          var config = {
              method : configuration.TDSGST_ReportData.configData.method,
              url : configuration.TDSGST_ReportData.configData.url,
              headers : configuration.TDSGST_ReportData.configData.headers,
              keepAlive: true,
              data:Harddata
          };
        }

        else if(Filename=='PO_Cost_Report'){
          var Harddata = JSON.stringify({
            "OperationName": configuration.PO_Cost_Report_ReportData.Body.OperationName, 
            "JobPackageName": configuration.PO_Cost_Report_ReportData.Body.JobPackageName, 
            "JobDefName": configuration.PO_Cost_Report_ReportData.Body.JobDefName, 
            "ESSParameters": configuration.PO_Cost_Report_ReportData.Body.ESSParameters,
          });

          var config = {
              method : configuration.PO_Cost_Report_ReportData.configData.method,
              url : configuration.PO_Cost_Report_ReportData.configData.url,
              headers : configuration.PO_Cost_Report_ReportData.configData.headers,
              keepAlive: true,
              data:Harddata
          };
        }

        const response = await axios(config);
        console.log('Actual response from 1st API',response.data.ReqstId);

        if(response.status == 201 || response.status == 200){
          if(response.data.ReqstId > 0){
                var values = {
                  SchedulerName: Filename+'Master ',
                  RequestId: response.data.ReqstId,
                  RequestStatus: 'Success',
                  APIObject: '1st API called',
                  StartDate : connect.sequelize.fn("NOW")
                  };
                    dataaccess.Create(datamodel.Masterschedulerdetails(), values)
                    .then(function (schedulerresult) {
                        console.log('scheduler result',schedulerresult.dataValues.Id);
                        Obj_Schedulerresults = schedulerresult.dataValues
                        console.log('Obj_Schedulerresults' ,Obj_Schedulerresults );
                    }, function (err) {
                        console.log('Error: ' + JSON.stringify(err));
                        dataconn.errorlogger('Scheduler call ','GetFiles_API',err);
                    });
                
                //added in order to wait for 10 minutes for 2nd api's status change
                // await sleep(600000);
                await sleep(20000);
                  var config_status = {}
                  if(Filename=='PO')
                  {
                    config_status = {
                      method : configuration.PO_ReportData.configData_Status.method,
                      url : configuration.PO_ReportData.configData_Status.url+ response.data.ReqstId,
                      headers : configuration.PO_ReportData.configData_Status.headers,
                  }
                  }
                  else  if(Filename=='FA')
                  {
                    config_status = {
                      method : configuration.FA_ReportData.configData_Status.method,
                      url : configuration.FA_ReportData.configData_Status.url+ response.data.ReqstId,
                      headers : configuration.FA_ReportData.configData_Status.headers,
                    }
                  }
                  else  if(Filename=='RMO')
                  {
                    config_status = {
                      method : configuration.RMO_ReportData.configData_Status.method,
                      url : configuration.RMO_ReportData.configData_Status.url+ response.data.ReqstId,
                      headers : configuration.RMO_ReportData.configData_Status.headers,
                  }
                  }
                  else  if(Filename=='TDSGST')
                  {
                    config_status = {
                      method : configuration.TDSGST_ReportData.configData_Status.method,
                      url : configuration.TDSGST_ReportData.configData_Status.url+ response.data.ReqstId,
                      headers : configuration.TDSGST_ReportData.configData_Status.headers,
                    }
                  }

                  else  if(Filename=='PO_Cost_Report'){
                    config_status = {
                      method : configuration.PO_Cost_Report_ReportData.configData_Status.method,
                      url : configuration.PO_Cost_Report_ReportData.configData_Status.url+ response.data.ReqstId,
                      headers : configuration.PO_Cost_Report_ReportData.configData_Status.headers,
                    }
                  }
  
                  const response1 = await axios(config_status)

                  if(response1.status == 200 || response1.status == 201){
                    if(response1.data.items.length != 0){
                      var statusresponse = response1.data.items
                      var statusresponse_RequestStatus = statusresponse[0].RequestStatus 
                      var objectValue = JSON.parse(statusresponse_RequestStatus);
                      //console.log('json object value',objectValue);
                      console.log("Status",objectValue['JOBS'].STATUS);
                      var updatevalues={
                        RequestStatus: objectValue['JOBS'].STATUS,
                        APIObject: '2nd  API called',
                        //startdate:Sequelize.DATE
                        };
                      var param = { RequestId: response.data.ReqstId , Id: Obj_Schedulerresults.Id };
                      
                      dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param)
    
                      if(objectValue['JOBS'].STATUS.toLowerCase().trim()=='succeeded'){
    
                        CallAPI3(response.data.ReqstId,Filename)
                        .then((api3res)=>{
                          if(api3res=='success')
                          {
                            var responsedata ={
                              RequestID:response.data.ReqstId,
                              MasterschedulerdetailsID:Obj_Schedulerresults.Id
                            }
                            resolve(responsedata);
                          }
                        })
                        .catch((err)=>{
                          reject()
                        })
                      }
                      else{
                        await sleep(100000);
                        const response2 = await axios(config_status)

                        if(response1.status == 200 || response1.status == 201){
                          if(response1.data.items.length != 0){
                            var statusresponse = response2.data.items
                            var statusresponse_RequestStatus = statusresponse[0].RequestStatus 
                            var objectValue = JSON.parse(statusresponse_RequestStatus);
                            console.log("else part Status",objectValue['JOBS'].STATUS);
                            //dataconn.APItoXMLLogger(Filename+' Master API',response.data.ReqstId,objectValue['JOBS'].STATUS,'2nd API called 2nd time');
                            var updatevalues={
                              RequestStatus: objectValue['JOBS'].STATUS,
                              APIObject: '2nd  API called 2 time',
                              //startdate:Sequelize.DATE
                              };
                            var param = { RequestId: response.data.ReqstId , Id: Obj_Schedulerresults.Id };
                            
                            dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);
                            if(objectValue['JOBS'].STATUS.toLowerCase().trim()=='succeeded')
                            {
                              CallAPI3(response.data.ReqstId,Filename)
                              .then((api3res)=>{
                                if(api3res=='success')
                                {
                                  var responsedata ={
                                    RequestID:response.data.ReqstId,
                                    MasterschedulerdetailsID:Obj_Schedulerresults.Id
                                  }
                                  resolve(responsedata);
                                }
                              })
                              .catch((err)=>{
                                reject()
                              })
                            }
                            else{
                              var updatevalues={
                                RequestStatus: objectValue['JOBS'].STATUS,
                                APIObject: '2nd  API called 2 time',
                                EndDate:connect.sequelize.fn("NOW")
                                };
                              var param = { RequestId: result.RequestID , Id: result.MasterschedulerdetailsID };
                              dataaccess.Update(datamodel.Masterschedulerdetails(),updatevalues,param);
                            }
                          }
                          else{
                            reject();
                          }
                        }
                        else{
                          reject();
                        }
                      }
                    }
                    else{
                      reject();
                    }
                  }
                  else{
                    reject();
                  }

                  
          }
          else{
            reject();
          }
        }
        else{
          reject();
        } 
      //resolve(finalObject);
    }
    catch(error){
        console.log("GetFiles_API - APIDumps",error);
        reject();
    }
  })
}

function CallAPI3(RequestID,Filename)
    {
      return new Promise(async function(resolve,reject){
        var Fileoutput ={}
        if(Filename=='PO'){
          Fileoutput =
          {
          method:configuration.PO_ReportData.Fileoutput.method,
          url:configuration.PO_ReportData.Fileoutput.url + RequestID+',fileType=out',
          headers:configuration.PO_ReportData.Fileoutput.headers
          }
        }
        else if(Filename=='FA')
        {
          Fileoutput =
          {
          method:configuration.FA_ReportData.Fileoutput.method,
          url:configuration.FA_ReportData.Fileoutput.url + RequestID+',fileType=out',
          headers:configuration.FA_ReportData.Fileoutput.headers
          }
        }
        else if(Filename=='RMO')
        {
          Fileoutput =
          {
          method:configuration.RMO_ReportData.Fileoutput.method,
          url:configuration.RMO_ReportData.Fileoutput.url + RequestID+',fileType=out',
          headers:configuration.RMO_ReportData.Fileoutput.headers
          }
        }

        else if(Filename=='TDSGST')
        {
          Fileoutput =
          {
          method:configuration.TDSGST_ReportData.Fileoutput.method,
          url:configuration.TDSGST_ReportData.Fileoutput.url + RequestID+',fileType=out',
          headers:configuration.TDSGST_ReportData.Fileoutput.headers
          }
        }

        else if(Filename=='PO_Cost_Report'){
          Fileoutput =
          {
          method:configuration.PO_Cost_Report_ReportData.Fileoutput.method,
          url:configuration.PO_Cost_Report_ReportData.Fileoutput.url + RequestID+',fileType=out',
          headers:configuration.PO_Cost_Report_ReportData.Fileoutput.headers
          }
        }

        var FinalOutputfile = await axios(Fileoutput)

        if(FinalOutputfile.status == 200 || FinalOutputfile.status == 201){
          if(FinalOutputfile.data.items[0].DocumentContent!=''){
            //dataconn.APItoXMLLogger(Filename+' Master API',FinalOutputfile.data.items[0].ReqstId,'success','3rd API called');
            var bitmap = new Buffer.from(FinalOutputfile.data.items[0].DocumentContent, "base64");  
            
            if (!fs.existsSync('./Upload'))
            {
              fs.mkdirSync('./Upload');
            }

            if (!fs.existsSync('./Upload/'+Filename+'/'))
            {
              fs.mkdirSync('./Upload/'+Filename+'/');
            }
            if(fs.existsSync('./Upload/'+Filename+'/'+Filename+'_master.zip'))
            {    
                fs.unlink('./Upload/'+Filename+'/'+Filename+'_master.zip',(err)=>{
                    if (err) {
                        console.log("failed to delete zip file:"+err);
                        reject();
                    } else {
                        console.log('successfully deleted zip file');                                
                    }
                });
            }
            await fsPromises.writeFile('./Upload/'+Filename+'/'+Filename+'_master.zip',bitmap)
            .then(async()=>{
              
                    fs.createReadStream('./Upload/'+Filename+'/'+Filename+'_master.zip')
                    .pipe(unzipper.Extract({ path: './Upload/'+Filename+'/'})); 
                    //sleep in order to create zip
                    await sleep(80000);
                    resolve('success');
            })
            .catch((error)=>{
              console.log('into fsPromises.writeFile error',error);
              // dataconn.errorlogger()
              reject()         
            })
            
            // var responsedata ={
            //   RequestID:RequestID,
            //   MasterschedulerdetailsID:Obj_Schedulerresults.Id
            // }
            
          }
          else{
            reject();
          }
        }
        else{
          reject();
        }
      })
    }