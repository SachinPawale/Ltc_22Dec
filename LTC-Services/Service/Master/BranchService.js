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
    router.route("/GetAllBranch").get(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        const BankMst = datamodel.BankMst();

        var param = {
            attributes: [
                "Id",
                "Branchcode",
                "Desc",
                "BankID",
                "Address",
                "IFSC",
                "IsActive",
            ],
            include: [
                { model: BankMst, attributes: ["Name"], where: { IsActive: true } },
            ],
            order: ["Id"],
        };

        dataaccess.FindAll(BranchMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Branch Access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Branch",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BranchService", "GetAllBranch", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "user has no access of Branch",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetAllActiveBranch").get(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        var param = {
            where: { IsActive: true },
            attributes: ["Id", "Branchcode", "Desc"],
        };

        dataaccess.FindAll(BranchMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Branch access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Branch",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BranchService", "GetAllActiveBranch", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Branch",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetBranchById/:Id").get(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        const BankMst = datamodel.BankMst();
        var param = {
            attributes: ["Id", "Branchcode", "Desc", "BankID", "Address", "IFSC", "IsActive"],
            include: [{ model: BankMst, attributes: ["Name"] }],
            where: { Id: req.params.Id },
        };

        dataaccess.FindOne(BranchMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Branch access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Branch",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BranchService", "GetBranchById", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Branch",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetBranchByBankID/:BankID").get(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        var BankIDs = [];
        BankIDs = req.params.BankID.split(",");

        var param = {
            where: {
                IsActive: true,
                BankID: {
                    [connect.Op.in]: BankIDs,
                },
            },
            attributes: ["Id", "Desc","IFSC"],
        };

        dataaccess.FindAll(BranchMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Branch access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Branch",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BranchService", "GetBranchByBankID", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Banch",
                        Data: null,
                    });
            }
        );
    });

    router.route("/CheckDuplicateBranch/:Value/:Id").get(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        var param = {
            where: {
                Branchcode: req.params.Value,
                Id: {
                    [connect.Op.ne]: req.params.Id,
                },
            },
            attributes: [
                [
                    connect.sequelize.fn("count", connect.sequelize.col("Branchcode")),
                    "Count",
                ],
            ],
        };

        dataaccess.FindAll(BranchMst, param).then(
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
                            Message: "Branch already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Branch does not exists",
                            Data: false,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BranchService", "CheckDuplicateBranch", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Branch",
                        Data: null,
                    });
            }
        );
    });

    router.route("/CreateBranch").post(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        var values = {
            Branchcode: req.body.Branchcode.toString().trim(),
            Desc: req.body.Desc,
            BankID: req.body.BankID,
            Address: req.body.Address,
            IFSC: req.body.IFSC,
            IsActive: req.body.IsActive,
            CreatedBy: req.body.UserId,
            CreatedByRoleId: req.body.UserRoleId,
        };
        dataaccess.Create(BranchMst, values).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "Branch saved successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("BranchService", "CreateBranch", {
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
                dataconn.errorlogger("BranchService", "CreateBranch", err);
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

    router.route("/UpdateBranch").post(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        var values = {
            Branchcode: req.body.Branchcode.toString().trim(),
            Desc: req.body.Desc,
            BankID: req.body.BankID,
            Address: req.body.Address,
            IFSC: req.body.IFSC,
            IsActive: req.body.IsActive,
            ModifiedBy: req.body.UserId,
            ModifiedByRoleId: req.body.UserRoleId,
            ModifiedDate: connect.sequelize.fn("NOW"),
        };
        var param = { Id: req.body.Id };
        dataaccess.Update(BranchMst, values, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "Branch updated successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("BranchService", "UpdateBranch", {
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
                dataconn.errorlogger("BranchService", "UpdateBranch", err);
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
                        const BranchMst = datamodel.BranchMst();

                        dataaccess.FindAll(BranchMst).then(
                            function(result) {
                                var values = {
                                    Branchcode: bd.Branchcode.toString().trim(),
                                    Desc: bd.Desc,
                                    StateID: bd.StateID,
                                    Address: bd.Address,
                                    IFSC: bd.IFSC,
                                    IsActive: bd.Status.toLowerCase().trim() == "active" ? true : false,
                                    CreatedBy: UserId,
                                    CreatedByRoleId: UserRoleId,
                                    ModifiedBy: UserId,
                                    ModifiedByRoleId: UserRoleId,
                                };

                                dataaccess.Create(BranchMst, values).then(
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
                                        dataconn.errorlogger("BranchService", "BulkUpload", err);
                                        next(err);
                                    }
                                );
                            },
                            function(err) {
                                dataconn.errorlogger("BranchService", "BulkUpload", err);
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
                            Message: "All Branch saved successfully",
                            Data: data,
                        });
                })
                .catch((err) => {
                    dataconn.errorlogger("BranchService", "BulkUpload", err);
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

    router.route("/GetAllBranchList").get(function(req, res) {
        const BranchMst = datamodel.BranchMst();
        var param = { attributes: ["Branchcode"] };

        dataaccess.FindAll(BranchMst, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Branch access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Branch",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BranchService", "GetAllBranchList", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Branch",
                        Data: null,
                    });
            }
        );
    });

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