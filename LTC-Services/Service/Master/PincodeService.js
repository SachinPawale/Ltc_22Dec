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
    router.route("/GetAllPincode").get(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        const CityMst = datamodel.CityMst();
        const StateMst = datamodel.StateMst();

        var param = {
            attributes: ["Id", "Pincode", "Desc", "StateID", "CityID", "IsActive"],
            include: [
                { model: StateMst, attributes: ["Desc"], where: { IsActive: true } },
                { model: CityMst, attributes: ["Desc"], where: { IsActive: true } },
            ],
            order: ["Id"],
        };

        dataaccess.FindAll(PincodeMst, param).then(
            function (result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "PincodeMst Access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of PincodeMst",
                            Data: null,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("PincodeService", "GetAllPincode", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "user has no access of Pincode",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetAllActivePincode").get(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        var param = { where: { IsActive: true }, attributes: ["Id", "Pincode"] };

        dataaccess.FindAll(PincodeMst, param).then(
            function (result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Pincode access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Pincode",
                            Data: null,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("PincodeService", "GetAllActivePincode", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Pincode",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetPincodeById/:Id").get(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        const CityMst = datamodel.CityMst();
        const StateMst = datamodel.StateMst();
        var param = {
            attributes: ["Id", "Pincode", "Desc", "StateID",'CityID', "IsActive"],
            include: [
                { model: StateMst, attributes: ["Desc"] },
                { model: CityMst, attributes: ["Desc"] },
            ],
            where: { Id: req.params.Id },
        };

        dataaccess.FindOne(PincodeMst, param).then(
            function (result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Pincode access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Pincode",
                            Data: null,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("PincodeService", "GetPincodeById", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Pincode",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetPincodeByCityID/:CityID").get(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        var CityIDs = [];
        CityIDs = req.params.CityID.split(",");

        var param = {
            where: { IsActive: true,
                 CityID: { [connect.Op.in]: CityIDs },
                 },
            attributes: ["Id", "Desc","Pincode"],
        };

        dataaccess.FindAll(PincodeMst, param).then(
            function (result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Pincode access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Pincode",
                            Data: null,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("PincodeService", "GetPincodeByCityByStateID", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Pincode",
                        Data: null,
                    });
            }
        );
    });

    router.route("/CheckDuplicatePincode/:Value/:Id").get(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        var param = {
            where: {
                Pincode: req.params.Value,
                Id: { [connect.Op.ne]: req.params.Id },
            },
            attributes: [
                [
                    connect.sequelize.fn("count", connect.sequelize.col("Pincode")),
                    "Count",
                ],
            ],
        };

        dataaccess.FindAll(PincodeMst, param).then(
            function (result) {
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
                            Message: "Pincode already exists",
                            Data: true,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "Pincode does not exists",
                            Data: false,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("PincodeService", "CheckDuplicatePincode", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Pincode",
                        Data: null,
                    });
            }
        );
    });

    router.route("/CreatePincode").post(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        var values = {
            Pincode: req.body.Pincode.toString().trim(),
            Desc: req.body.Desc,
            StateID: req.body.StateID,
            CityID:req.body.CityID,
            IsActive: req.body.IsActive,
            CreatedBy: req.body.UserId,
            CreatedByRoleId: req.body.UserRoleId,
        };
        dataaccess.Create(PincodeMst, values).then(
            function (result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "Pincode saved successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("PincodeService", "CreatePincode", {
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
            function (err) {
                dataconn.errorlogger("PincodeService", "CreatePincode", err);
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

    router.route("/UpdatePincode").post(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        var values = {
            Pincode: req.body.Pincode.toString().trim(),
            Desc: req.body.Desc,
            StateID: req.body.StateID,
            CityID: req.body.CityID,
            IsActive: req.body.IsActive,
            ModifiedBy: req.body.UserId,
            ModifiedByRoleId: req.body.UserRoleId,
            ModifiedDate: connect.sequelize.fn("NOW"),
        };
        var param = { Id: req.body.Id };
        dataaccess.Update(PincodeMst, values, param).then(
            function (result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "Pincode updated successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("PincodeService", "UpdatePincode", {
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
            function (err) {
                dataconn.errorlogger("PincodeService", "UpdatePincode", err);
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

    router.route("/BulkUpload").post(function (req, res) {
        var bulkdata = req.body.data;
        var UserId = req.body.UserId;
        var UserRoleId = req.body.UserRoleId;

        if (bulkdata) {
            var bulkRequest = new Promise((resolve, reject) => {
                async.eachOfSeries(
                    bulkdata,
                    (bd, next) => {
                        const PincodeMst = datamodel.PincodeMst();

                        dataaccess.FindAll(PincodeMst).then(
                            function (result) {
                                var values = {
                                    Pincode: bd.Pincode.toString().trim(),
                                    Desc: bd.Desc,
                                    StateID: bd.StateID,
                                    CityID: bd.CityID,
                                    IsActive:
                                        bd.Status.toLowerCase().trim() == "active" ? true : false,
                                    CreatedBy: UserId,
                                    CreatedByRoleId: UserRoleId,
                                    ModifiedBy: UserId,
                                    ModifiedByRoleId: UserRoleId,
                                };

                                dataaccess.Create(PincodeMst, values).then(
                                    function (results) {
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
                                    function (err) {
                                        dataconn.errorlogger("PincodeService", "BulkUpload", err);
                                        next(err);
                                    }
                                );
                            },
                            function (err) {
                                dataconn.errorlogger("PincodeService", "BulkUpload", err);
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
                            Message: "All Pincode saved successfully",
                            Data: data,
                        });
                })
                .catch((err) => {
                    dataconn.errorlogger("PincodeService", "BulkUpload", err);
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

    router.route("/GetAllPincodeList").get(function (req, res) {
        const PincodeMst = datamodel.PincodeMst();
        var param = { attributes: ["Pincode"] };

        dataaccess.FindAll(PincodeMst, param).then(
            function (result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Pincode access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Pincode",
                            Data: null,
                        });
                }
            },
            function (err) {
                dataconn.errorlogger("PincodeService", "GetAllPincodeList", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Pincode",
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
