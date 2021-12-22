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

var routes = function() {
    router.route("/GetAllBank").get(function(req, res) {
        const BankMst = datamodel.BankMst();
        const CityMst = datamodel.CityMst();
        const StateMst = datamodel.StateMst();

        var param = {
            attributes: [
                "Id", "Code", "Name", "ContactPerson",
                "ContactNumber", "Address1", "Address2",
                "Address3", "StateID", "CityID", "IsActive"
            ],
            include: [
                { model: StateMst, attributes: ["Desc"], where: { IsActive: true } },
                { model: CityMst, attributes: ["Desc"], where: { IsActive: true } },
            ],
            order: ["Id"],
        };

        dataaccess.FindAll(BankMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Bank Access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Bank",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BankService", "GetAllBank", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "user has no access of Bank",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetAllActiveBank").get(function(req, res) {
        const BankMst = datamodel.BankMst();
        var param = { where: { IsActive: true }, attributes: ["Id", "Code", "Name"] };

        dataaccess.FindAll(BankMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Bank access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Bank",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BankService", "GetAllActiveBank", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Bank",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetBankById/:Id").get(function(req, res) {
        const BankMst = datamodel.BankMst();
        const CityMst = datamodel.CityMst();
        const StateMst = datamodel.StateMst();
        var param = {
            attributes: [
                "Id", "Code", "Name", "ContactPerson",
                "ContactNumber", "Address1", "Address2",
                "Address3", "StateID", "CityID", "IsActive"
            ],
            include: [
                { model: StateMst, attributes: ["Desc"] },
                { model: CityMst, attributes: ["Desc"] },
            ],
            where: { Id: req.params.Id },
        };

        dataaccess.FindOne(BankMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Bank access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Bank",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BankService", "GetBankById", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Bank",
                        Data: null,
                    });
            }
        );
    });

    router.route("/CheckDuplicateBank/:Value/:Id").get(function(req, res) {
        const BankMst = datamodel.BankMst();
        var param = {
            where: {
                Code: req.params.Value,
                Id: {
                    [connect.Op.ne]: req.params.Id
                },
            },
            attributes: [
                [
                    connect.sequelize.fn("count", connect.sequelize.col("Code")),
                    "Count",
                ],
            ],
        };

        dataaccess.FindAll(BankMst, param).then(
            function(result) {
                if (
                    result != null &&
                    result.length > 0 &&
                    result[0].dataValues.Count != null &&
                    result[0].dataValues.Count > 0
                ) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "Bank already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Bank does not exists",
                            Data: false,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BankService", "CheckDuplicateBank", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Bank",
                        Data: null,
                    });
            }
        );
    });

    router.route("/CreateBank").post(function(req, res) {
        const BankMst = datamodel.BankMst();
        var values = {
            Code: req.body.Code.toString().trim(),
            Name: req.body.Name,
            ContactPerson: req.body.ContactPerson,
            ContactNumber: req.body.ContactNumber,
            Address1: req.body.Address1,
            Address2: req.body.Address2,
            Address3: req.body.Address3,
            StateID: req.body.StateID,
            CityID: req.body.CityID,
            IsActive: req.body.IsActive,
            CreatedBy: req.body.UserId,
            CreatedByRoleId: req.body.UserRoleId,
        };
        dataaccess.Create(BankMst, values).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "Bank saved successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("BankService", "CreateBank", {
                        message: "No object found",
                        stack: "",
                    });
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Error occurred while saving record",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BankService", "CreateBank", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "Error occurred while saving record",
                        Data: null,
                    });
            }
        );
    });

    router.route("/UpdateBank").post(function(req, res) {
        const BankMst = datamodel.BankMst();
        var values = {
            Code: req.body.Code.toString().trim(),
            Name: req.body.Name,
            ContactPerson: req.body.ContactPerson,
            ContactNumber: req.body.ContactNumber,
            Address1: req.body.Address1,
            Address2: req.body.Address2,
            Address3: req.body.Address3,
            StateID: req.body.StateID,
            CityID: req.body.CityID,
            IsActive: req.body.IsActive,
            ModifiedBy: req.body.UserId,
            ModifiedByRoleId: req.body.UserRoleId,
            ModifiedDate: connect.sequelize.fn("NOW"),
        };
        var param = { Id: req.body.Id };
        dataaccess.Update(BankMst, values, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "Bank updated successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("BankService", "UpdateBank", {
                        message: "No object found",
                        stack: "",
                    });
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Error occurred while updating record",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BankService", "UpdateBank", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "Error occurred while updating record",
                        Data: null,
                    });
            }
        );
    });

    router.route("/BulkUpload").post(function(req, res) {
        var bulkdata = req.body.data;
        var UserId = req.body.UserId;
        var UserRoleId = req.body.UserRoleId;

        if (bulkdata) {
            var bulkRequest = new Promise((resolve, reject) => {
                async.eachOfSeries(
                    bulkdata,
                    (bd, next) => {
                        const BankMst = datamodel.BankMst();

                        dataaccess.FindAll(BankMst).then(
                            function(result) {
                                var values = {
                                    Code: bd.Code.toString().trim(),
                                    Name: bd.Name,
                                    ContactPerson: bd.ContactPerson,
                                    ContactNumber: bd.ContactNumber,
                                    Address1: bd.Address1,
                                    Address2: bd.Address2,
                                    Address3: bd.Address3,
                                    StateID: bd.StateID,
                                    CityID: bd.CityID,
                                    IsActive: bd.Status.toLowerCase().trim() == "active" ? true : false,
                                    CreatedBy: UserId,
                                    CreatedByRoleId: UserRoleId,
                                    ModifiedBy: UserId,
                                    ModifiedByRoleId: UserRoleId,
                                };

                                dataaccess.Create(BankMst, values).then(
                                    function(results) {
                                        if (results != null) {
                                            next();
                                        } else {
                                            next({
                                                Success: false,
                                                Message: "Error occurred while saving records",
                                                Data: null,
                                            });
                                        }
                                    },
                                    function(err) {
                                        dataconn.errorlogger("BankService", "BulkUpload", err);
                                        next(err);
                                    }
                                );
                            },
                            function(err) {
                                dataconn.errorlogger("BankService", "BulkUpload", err);
                                next(err);
                            }
                        );
                    },
                    (err) => {
                        if (err) reject(err);
                        else resolve(bulkdata);
                    }
                );
            });

            bulkRequest
                .then((data) => {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "All Bank saved successfully",
                            Data: data,
                        });
                })
                .catch((err) => {
                    dataconn.errorlogger("BankService", "BulkUpload", err);
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Error occurred while updating record",
                            Data: null,
                        });
                });
        } else {
            res
                .status(200)
                .json({
                    Success: false,
                    Message: "Error occurred while updating record",
                    Data: null,
                });
        }
    });

    router.route("/GetAllBankList").get(function(req, res) {
        const BankMst = datamodel.BankMst();
        var param = { attributes: ["Code"] };

        dataaccess.FindAll(BankMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Bank access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Bank",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BankService", "GetAllBankList", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Bank",
                        Data: null,
                    });
            }
        );
    });

    // router.route("/GetPincodeByCityByStateID/:StateID").get(function (req, res) {
    //     const PincodeMst = datamodel.PincodeMst();
    //     var StateIDs = []


    //     ;
    //     var CityIDs = [];
    //     StateIDs = req.params.StateID.split(",");
    //     CityIDs = req.params.CityID.split(",");

    //     var param = {
    //         where: { IsActive: true,
    //              StateID: { [connect.Op.in]: StateIDs },
    //              CityID: { [connect.Op.in]: CityIDs },
    //              },
    //         attributes: ["Id", "Desc"],
    //     };

    //     dataaccess.FindAll(PincodeMst, param).then(
    //         function (result) {
    //             if (result != null) {
    //                 res
    //                     .status(200)
    //                     .json({ Success: true, Message: "Pincode access", Data: result });
    //             } else {
    //                 res
    //                     .status(200)
    //                     .json({
    //                         Success: false,
    //                         Message: "User has no access of Pincode",
    //                         Data: null,
    //                     });
    //             }
    //         },
    //         function (err) {
    //             dataconn.errorlogger("PincodeService", "GetPincodeByCityByStateID", err);
    //             res
    //                 .status(200)
    //                 .json({
    //                     Success: false,
    //                     Message: "User has no access of Pincode",
    //                     Data: null,
    //                 });
    //         }
    //     );
    // });



    // router.route('/CheckActiveCity/:Id')
    //     .get(function (req, res) {

    //         const UserCityMap = datamodel.UserCityMap();

    //         var param = { where: { CityId: req.params.Id } };

    //         Promise.all([
    //             dataaccess.FindAndCountAll(UserCityMap, param)
    //         ]).then(function (Users) {
    //             if (Users != null && Users.count > 0) {
    //                 res.status(200).json({ Success: true, Message: 'Can not deactivate this City, its already used in user master', Data: true });
    //             }
    //             else {
    //                 res.status(200).json({ Success: false, Message: 'Can deactivate, City is not used', Data: false });
    //             }
    //         }).catch(err => {
    //             dataconn.errorlogger('CityService', 'CheckActiveCity', err);
    //             res.status(200).json({ Success: false, Message: 'User has no access of City', Data: null });
    //         });
    //     });

    return router;
};

module.exports = routes;