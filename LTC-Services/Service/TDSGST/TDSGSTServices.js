var express = require('express');
var router = express.Router();
var axios = require('axios');
const path = require('path');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var connect = require('../../Data/Connect');
const configuration = require('../../Config');
var dataconn = require('../../Data/DataConnection');


var routes = function(){

    router.route('/GetTDSGSTData')
    .get(function (req, res) {
        FetchTDSGSTAPI()
        .then((result)=>{
            TDSGSTAPI(result)
            .then((result2)=>{
                console.log("TDSGST Data Updated Successfully");
                res.status(200).json({ Success: true, Message: 'TDSGST Data Updated Successfull', Data: null });
            })
            .catch((error2)=>{
                res.status(200).json({ Success: false, Message: 'TDSGSTAPI Failed', Data: error2 });
            })
            
        })
        .catch((error1)=>{
            res.status(200).json({ Success: false, Message: 'FetchTDSGSTAPI Failed ', Data: error1 });
        })
    });

    function FetchTDSGSTAPI(){
        return new Promise(async (resolve, reject) =>  {
            const TDSGST = datamodel.TDSGST();
            var param = {
                where: { IsUpdated: 0 },
            };

            dataaccess.FindAll(TDSGST, param)
                .then(function (result) {
                    if (result != null) {
                        resolve(result);
                    }
                },
                function (err) {
                    dataconn.errorlogger('TDSGSTServices', 'FetchTDSGSTAPI', err);
                    reject(err);
                });
        });
    }
        
    function TDSGSTAPI(requestData){
        return new Promise(async (resolve, reject) => {

            console.log("TDSGSTAPI - requestData.length :",requestData.length);
            if(requestData.length != 0){
                let promises = []
                let request = requestData;
    
                let DefaultRegistrationFlag = configuration.TDSGSTAdjustmentAPIData.HardCodedData.DefaultRegistrationFlag;
                let InclusiveTaxFlag = configuration.TDSGSTAdjustmentAPIData.HardCodedData.InclusiveTaxFlag;
    
                request.forEach(element => {
                   
                    if(element.PartyTypeCode == 'THIRD_PARTY'){
                        var data = JSON.stringify({
                            "PartyTypeCode": element.PartyTypeCode,
                            "PartyName": element.PartyName,
                            "PartyNumber":  element.PartyNumber,
                            "TaxRegimeCode": element.TaxRegimeCode,
                            "RegistrationTypeCode": element.RegistrationTypeCode,
                            "RegistrationStatusCode": element.RegistrationStatusCode,
                            "EffectiveFrom": element.EffectiveFrom,
                            "RegistrationNumber": element.RegistrationNumber,
                            "DefaultRegistrationFlag": DefaultRegistrationFlag,
                            "RoundingRuleCode": element.RoundingRuleCode,
                            "InclusiveTaxFlag": InclusiveTaxFlag,
                          });
                          
                    }
                    else{
                        var data = JSON.stringify({
                            "PartyTypeCode": element.PartyTypeCode,
                            "PartyName":  element.PartyName,
                            "PartyNumber": element.PartyNumber,
                            "PartySiteNumber": element.PartySiteNumber ,
                            "TaxRegimeCode": element.TaxRegimeCode,
                            "RegistrationTypeCode": element.RegistrationTypeCode,
                            "RegistrationStatusCode": element.RegistrationStatusCode,
                            "EffectiveFrom": element.EffectiveFrom,
                            "RegistrationNumber": element.RegistrationNumber,
                            "DefaultRegistrationFlag": DefaultRegistrationFlag,
                            "RoundingRuleCode":element.RoundingRuleCode,
                            "InclusiveTaxFlag": InclusiveTaxFlag,
                            "ValidationType": element.ValidationType,
                            "ValidationLevel": element.ValidationLevel
                        });
                    }
                
                    var config = {
                        method: configuration.TDSGSTAdjustmentAPIData.configData.method,
                        url: configuration.TDSGSTAdjustmentAPIData.configData.url,
                        headers: configuration.TDSGSTAdjustmentAPIData.configData.headers,
                        data : data
                    }; 
    
                    promises.push(axios(config));
                });
    
                Promise.all(promises).then(function (results) {
                    results.forEach(function (response, index, array) {
    
                        console.log("TDSGSTAPI - Apiresponse :", response.data);
    
                        const TDSGST = datamodel.TDSGST();
    
                        var values = {
                            IsUpdated: 1,
                            RegistrationId: response.data.RegistrationId,
                            ModifiedDate: connect.sequelize.fn("NOW"),
                        };
                        
                        if(response.data.PartyTypeCode== 'THIRD_PARTY_SITE'){
                            var param = {
                                PartyTypeCode: response.data.PartyTypeCode,
                                PartySiteNumber:response.data.PartySiteNumber
                            };
                        }
                        else{
                            var param = {
                                PartyTypeCode: response.data.PartyTypeCode,
                                PartyNumber:response.data.PartyNumber
                            };
                        }
    
                        dataaccess.Update(TDSGST, values, param)
                        .then(() => {
                                if (index === array.length - 1) {
                                    console.log('TDSGSTAPI - Ends');
                                    resolve();
                                }
                            })
                        .catch((error) => {
                            dataconn.errorlogger('TDSGSTServices', 'TDSGSTAPI', error);
                            reject(error);
                            //console.log(error);
                        });
                    });
                })
                .catch(function (error) {
                        if (error.response) {
                            if (error.response.status == 400) {
                                dataconn.apiResponselogger('TDSGST API', 0 , 0, error.response.status, error.response.data, 1);
                            }
                        }
                        dataconn.errorlogger('TDSGSTServices', 'TDSGSTAPI', {message:'TDSGSTAPI Response' , stack:error.response.data});
                        reject(error.response.data);
                });
            }
            else{
                console.log("TDSGSTAPI - No data present for update");
                resolve();
            }
        });
    }

    module.exports.TDSGST_Scheduler_Function = function(){
        FetchTDSGSTAPI()
        .then((result)=>{
            TDSGSTAPI(result)
            .then((result2)=>{
                console.log("TDSGST Data Updated Successfully");
                //res.status(200).json({ Success: true, Message: 'TDSGST Data Updated Successfull', Data: null });
            })
            .catch((error2)=>{
                console.log("TDSGSTAPI Error");
                //res.status(200).json({ Success: false, Message: 'TDSGSTAPI Failed', Data: error2 });
            })
            
        })
        .catch((error1)=>{
            console.log("FetchTDSGSTAPI Error");
            //res.status(200).json({ Success: false, Message: 'FetchTDSGSTAPI Failed ', Data: error1 });
        })
    }

    return router;
};

module.exports = routes;
// module.exports.TDSGST_Scheduler_Function = TDSGST_Scheduler_Function;