var express = require("express");
var router = express.Router();
var connect = require("../../Data/Connect");
var dataconn = require("../../Data/DataConnection");
var datamodel = require("../../Data/DataModel");
var dataaccess = require("../../Data/DataAccess");

var routes = function() {
    router.route("/GetAllActivePartner").get(function(req, res) {
        const PartnerRegister = datamodel.PartnerRegister();
        var param = {
            where: { IsActive: true },
            attributes: ["Id", "FullName"],
        };

        dataaccess.FindAll(PartnerRegister, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Partner access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Partner",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BrokerageMapService", "GetAllActivePartner", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Partner",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetAllActivePlan").get(function(req, res) {
        const PlanMaster = datamodel.PlanMaster();
        var param = {
            where: { IsActive: true },
            attributes: ["Id", "PlanName"],
        };

        dataaccess.FindAll(PlanMaster, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({ Success: true, Message: "Plan access", Data: result });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Plan",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BrokerageMapService", "GetAllActivePlan", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of Plan",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetAllBrokerageMap").get(function(req, res) {
        const PartnerRegister = datamodel.PartnerRegister();
        const PlanMaster = datamodel.PlanMaster();
        const BrokerageMap = datamodel.BrokerageMap();
        var param = {
            attributes: ["Id", "PartnerID", "PlanID", "IsActive"],
            include: [
                { model: PartnerRegister, attributes: ["FullName"] },
                { model: PlanMaster, attributes: ["PlanName"] },
            ],
            order: [
                ["Id"]
            ],
        };

        dataaccess.FindAll(BrokerageMap, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "BrokerageMap Access",
                            Data: result,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of BrokerageMap",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BrokerageMapService", "GetAllBrokerageMap", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "user has no access of BrokerageMap",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetAllActiveBrokerageMap").get(function(req, res) {
        const BrokerageMap = datamodel.BrokerageMap();
        var param = {
            where: { IsActive: true },
            attributes: [
                "Id",
                "PartnerID",
                "PlanID",
                "IsActive",
                "CreatedBy",
                "CreatedDate",
                "ModifiedBy",
                "ModifiedDate",
            ],
        };

        dataaccess.FindAll(BrokerageMap, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "BrokerageMap access",
                            Data: result,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of BrokerageMap",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger(
                    "BrokerageMapService",
                    "GetAllActiveBrokerageMap",
                    err
                );
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of BrokerageMap",
                        Data: null,
                    });
            }
        );
    });

    router.route("/GetBrokerageMapById/:Id").get(function(req, res) {
        const PartnerRegister = datamodel.PartnerRegister();
        const PlanMaster = datamodel.PlanMaster();
        const BrokerageMap = datamodel.BrokerageMap();
        var param = {
            attributes: ["Id", "PartnerID", "PlanID", "IsActive"],
            include: [
                { model: PartnerRegister, attributes: ["FullName"] },
                { model: PlanMaster, attributes: ["PlanName"] },
            ],
            where: { Id: req.params.Id },
        };

        dataaccess.FindOne(BrokerageMap, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "BrokerageMap access",
                            Data: result,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of BrokerageMap",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger("BrokerageMapService", "GetBrokerageMapById", err);
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of BrokerageMap",
                        Data: null,
                    });
            }
        );
    });

    router
        .route("/CheckDuplicateBrokerageMap/:Value/:Id")
        .get(function(req, res) {
            const BrokerageMap = datamodel.BrokerageMap();
            var param = {
                where: {
                    PartnerID: req.params.Value,
                    Id: {
                        [connect.Op.ne]: req.params.Id,
                    },
                },
                attributes: [
                    [
                        connect.sequelize.fn("count", connect.sequelize.col("PartnerID")),
                        "Count",
                    ],
                ],
            };

            dataaccess.FindAll(BrokerageMap, param).then(
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
                                Message: "Plan already mapped to the partner",
                                Data: true,
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                Success: false,
                                Message: "Plan does not exists",
                                Data: false,
                            });
                    }
                },
                function(err) {
                    dataconn.errorlogger(
                        "BrokerageMapService",
                        "CheckDuplicateBrokerageMap",
                        err
                    );
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of Plan",
                            Data: null,
                        });
                }
            );
        });

    router.route("/CreateBrokerageMap").post(function(req, res) {
        const BrokerageMap = datamodel.BrokerageMap();
        var values = {
            PartnerID: req.body.PartnerID,
            PlanID: req.body.PlanID,
            IsActive: req.body.IsActive,
            CreatedBy: req.body.UserId,
            CreatedByRoleId: req.body.UserRoleId,
            CreatedDate: connect.sequelize.fn("NOW"),
        };
        dataaccess.Create(BrokerageMap, values).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "BrokerageMap saved successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("BrokerageMapService", "CreateBrokerageMap", {
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
                dataconn.errorlogger("BrokerageMapService", "CreateBrokerageMap", err);
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

    router.route("/UpdateBrokerageMap").post(function(req, res) {
        const BrokerageMap = datamodel.BrokerageMap();
        var values = {
            PartnerID: req.body.PartnerID,
            PlanID: req.body.PlanID,
            IsActive: req.body.IsActive,
            ModifiedBy: req.body.UserId,
            ModifiedByRoleId: req.body.UserRoleId,
            ModifiedDate: connect.sequelize.fn("NOW"),
        };
        var param = { Id: req.body.Id };
        dataaccess.Update(BrokerageMap, values, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "BrokerageMap updated successfully",
                            Data: result,
                        });
                } else {
                    dataconn.errorlogger("BrokerageMapService", "UpdateBrokerageMap", {
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
                dataconn.errorlogger("BrokerageMapService", "UpdateBrokerageMap", err);
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

    router.route("/GetAllBrokerageMapList").get(function(req, res) {
        const BrokerageMap = datamodel.BrokerageMap();
        var param = {
            attributes: ["Id", "ParterID", "PlanID", "IsActive"],
        };

        dataaccess.FindAll(BrokerageMap, param).then(
            function(result) {
                if (result != null) {
                    res
                        .status(200)
                        .json({
                            Success: true,
                            Message: "BrokerageMap access",
                            Data: result,
                        });
                } else {
                    res
                        .status(200)
                        .json({
                            Success: false,
                            Message: "User has no access of BrokerageMap",
                            Data: null,
                        });
                }
            },
            function(err) {
                dataconn.errorlogger(
                    "BrokerageMapService",
                    "GetAllBrokerageMapList",
                    err
                );
                res
                    .status(200)
                    .json({
                        Success: false,
                        Message: "User has no access of BrokerageMap",
                        Data: null,
                    });
            }
        );
    });

    return router;
};

module.exports = routes;