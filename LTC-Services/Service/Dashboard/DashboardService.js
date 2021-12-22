var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var dataconn = require('../../Data/DataConnection');
var datamodel = require("../../Data/DataModel");
var dataaccess = require("../../Data/DataAccess");

var routes = function() {

    router.route('/GetAllPartnerRevenueYear')
        .get(function(req, res) {

            var querytext = 'SELECT "GetRevenueYear"(:p_ref); FETCH ALL IN "partnerrevenueyear"';
            var param = {
                replacements: {
                    p_ref: 'partnerrevenueyear'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function(result) {
                    result.shift();
                    res.status(200).json({
                        Success: true,
                        Message: "PartnerRevenueYear Request Data Access",
                        Data: result
                    });
                }, function(err) {
                    dataconn.errorlogger('DashoardService', 'GetAllPartnerRevenueYear', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PartnerRevenueYear', Data: null });
                });
        });

    router.route('/GetAllPartnerRevenue/:YearID/:EMPCODE')
        .get(function(req, res) {

            var querytext = 'SELECT "GetRevenue"(:p_yearid,:p_emp_code,:p_ref); FETCH ALL IN "partnerrevenue"';
            var param = {
                replacements: {
                    p_yearid: req.params.YearID,
                    p_emp_code: req.params.EMPCODE,
                    p_ref: 'partnerrevenue'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function(result) {
                    result.shift();
                    res.status(200).json({
                        Success: true,
                        Message: "PartnerRevenue Request Data Access",
                        Data: result
                    });
                }, function(err) {
                    dataconn.errorlogger('DashoardService', 'GetAllPartnerRevenue', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PartnerRevenue', Data: null });
                });
        });

    router.route('/GetAllPartnerPayoutYear')
        .get(function(req, res) {

            var querytext = 'SELECT "GetPayoutYear"(:p_ref); FETCH ALL IN "partnerpayoutyear"';
            var param = {
                replacements: {
                    p_ref: 'partnerpayoutyear'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function(result) {
                    result.shift();
                    res.status(200).json({
                        Success: true,
                        Message: "PartnerPayoutYear Request Data Access",
                        Data: result
                    });
                }, function(err) {
                    dataconn.errorlogger('DashoardService', 'GetAllPartnerPayoutYear', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PartnerPayoutYear', Data: null });
                });
        });

    router.route('/GetAllPartnerPayout/:YearID/:EmpCode')
        .get(function(req, res) {

            var querytext = 'SELECT "GetPayout"(:p_yearid,:p_empcode,:p_ref); FETCH ALL IN "partnerpayout"';
            var param = {
                replacements: {
                    p_yearid: req.params.YearID,
                    p_empcode: req.params.EmpCode,
                    p_ref: 'partnerpayout'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }

            connect.sequelize
                .query(querytext, param)
                .then(function(result) {
                    result.shift();
                    res.status(200).json({
                        Success: true,
                        Message: "PartnerPayout Request Data Access",
                        Data: result
                    });
                }, function(err) {
                    dataconn.errorlogger('DashoardService', 'GetAllPartnerPayout', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PartnerPayout', Data: null });
                });
        });

    return router;
};

module.exports = routes;