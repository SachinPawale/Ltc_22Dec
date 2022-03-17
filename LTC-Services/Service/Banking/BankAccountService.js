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




var routes = function () {

    router.route('/GetBankAccountno')
        .get(function (req, res) {
            const BankAccountMst = datamodel.BankAccountMst();
            var param = { attributes: ['AccountNumber'], order: [['Id']] };

            dataaccess.FindAll(BankAccountMst, param)

                .then(function (result) {
                    if (result != null) {
                        res.status(200).json({ Success: true, Message: 'AccountNumber Access', Data: result });
                    }
                    else {
                        res.status(200).json({ Success: false, Message: 'User has no access of AccountNumber', Data: null });
                    }
                }, function (err) {
                    res.status(200).json({ Success: false, Message: 'user has no access of AccountNumber', Data: null });
                });
        });
        
    return router;
};
module.exports = routes;