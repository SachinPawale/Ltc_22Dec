var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var datamodel = require('../../Data/DataModel');
var dataaccess = require('../../Data/DataAccess');
var dataconn = require('../../Data/DataConnection');
var async = require('async');
var moment = require('moment');

var routes = function () {

    router.route('/GetSLAReport/:UserId/:LOBId/:SubLobId/:fromDate/:toDate')
        .get(function (req, res) {

            var querytext = 'SELECT "GetSLAReport"(:p_userid,:p_lobid, :p_sublobid, :p_fromdate, :p_todate, :p_ref); FETCH ALL IN "SLA";';
           
            if(JSON.parse(req.params.fromDate)){
                var fromDate = moment(JSON.parse(req.params.fromDate)).format('YYYY-MM-DD');
                var toDate = moment(JSON.parse(req.params.toDate)).format('YYYY-MM-DD');
            }
            else
            {
                var fromDate = moment(new Date(19000101)).format('YYYY-MM-DD');
                var toDate = moment(new Date(19000101)).format('YYYY-MM-DD');
            }
            var param = {
                replacements: {
                    p_userid: req.params.UserId, p_lobid: req.params.LOBId,
                    p_sublobid: req.params.SubLobId,
                    p_fromdate: fromDate,
                    p_todate: toDate,
                    p_ref: 'SLA'
                }, type: connect.sequelize.QueryTypes.SELECT
            }
            connect.sequelize
                .query(querytext, param)
                .then(function (result) {
                    result.shift();
                    res.status(200).json({ Success: true, Message: 'SLA Report access', Data: result });
                },
                    function (err) {
                        dataconn.errorlogger('ReportService', 'GetSLAReport', err);
                        res.status(200).json({ Success: false, Message: "User has no access of SLA report", Data: null });
                    }); 
        }); 

        return router;
};

module.exports = routes;