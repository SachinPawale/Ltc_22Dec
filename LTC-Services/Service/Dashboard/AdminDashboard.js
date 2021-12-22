var express = require('express');
var router = express.Router();
var connect = require('../../Data/Connect');
var dataconn = require('../../Data/DataConnection');
var datamodel = require("../../Data/DataModel");
var dataaccess = require("../../Data/DataAccess");

var routes = function() {
    router.route('/GetAllPartnerDetailsAdmin')
        .get(function(req, res) {

            var querytext = 'SELECT "GetPartnerDetailsAdmin"(:p_ref); FETCH ALL IN "partnerdetailsadmin"';
            var param = {
                replacements: {
                    p_ref: 'partnerdetailsadmin'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }
            connect.sequelize
                .query(querytext, param)
                .then(function(result) {
                    result.shift();
                    res.status(200).json({
                        Success: true,
                        Message: "PartnerDetailsAdmin Request Data Access",
                        Data: result
                    });
                }, function(err) {
                    dataconn.errorlogger('AdminDashoardService', 'GetAllPartnerDetailsAdmin', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of PartnerDetailsAdmin', Data: null });
                });
        });

    router.route('/GetTopPerformingPartner')
        .get(function(req, res) {

            var querytext = 'SELECT "GetTopPerformingPartner"(:p_ref); FETCH ALL IN "TopPerformingPartner"';
            var param = {
                replacements: {
                    p_ref: 'TopPerformingPartner'
                },
                type: connect.sequelize.QueryTypes.SELECT
            }
            connect.sequelize
                .query(querytext, param)
                .then(function(result) {
                    result.shift();
                    res.status(200).json({
                        Success: true,
                        Message: "TopPerformingPartner Request Data Access",
                        Data: result
                    });
                }, function(err) {
                    dataconn.errorlogger('AdminDashoardService', 'GetTopPerformingPartner', err);
                    res.status(200).json({ Success: false, Message: 'user has no access of TopPerformingPartner', Data: null });
                });
        });

    return router;
};

module.exports = routes;