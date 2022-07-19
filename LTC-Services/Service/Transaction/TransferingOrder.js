var datamodel = require("../../Data/DataModel");
var dataaccess = require("../../Data/DataAccess");
var connect = require("../../Data/Connect");
var express = require("express");
var dataconn = require("../../Data/DataConnection");
var async = require("async");
var router = express.Router();
var axios = require("axios");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var moment = require("moment");
const configuration = require("../../Config");
const emailService = require("../../Common/EmailService");
const path = require("path");
const excelService = require("../../Common/ExcelFile");
const sequelize = connect.sequelize;

var routes = function () {
  router.route("/GetTransDetailsByTransNumber").post(function (req, res) {
    let ITEM_NUMBER_obj = req.body.ITEM_NUMBER;
    const TransMaster = datamodel.TransMaster();
    var param = {
      where: { ITEM_NUMBER: ITEM_NUMBER_obj },
    };
    dataaccess.FindAll(TransMaster, param).then(
      function (result) {
        if (result != null) {
          res
            .status(200)
            .json({
              success: true,
              message: "TransMaster access",
              Data: result,
            });
        } else {
          res.status(200).json({
            success: false,
            message: "User has no access of TransMaster",
            Data: "nothing",
          });
        }
      },
      function (err) {
        dataconn.errorlogger(
          "TransactionService",
          "GetTransDetailsByTransNumber",
          err
        );
        res
          .status(200)
          .json({
            success: false,
            message: "User has no access of TransMaster",
            Data: null,
          });
      }
    );
  });

  router.route("/GetTransDetailsByTrans_Id").post(function (req, res) {
    let STNO = req.body.Id;
    const transferordermasterdetails = datamodel.transferordermasterdetails();
    var param = {
      where: { Id: STNO },
    };
    dataaccess.FindAll(transferordermasterdetails, param).then(
      function (result) {
        if (result != null) {
          res
            .status(200)
            .json({
              success: true,
              message: "transferordermasterdetails access",
              Data: result,
            });
        } else {
          res.status(200).json({
            success: false,
            message: "User has no access of transferordermasterdetails",
            Data: "nothing",
          });
        }
      },
      function (err) {
        dataconn.errorlogger(
          "TransactionService",
          "GetTransDetailsByTrans_Id",
          err
        );
        res
          .status(200)
          .json({
            success: false,
            message: "User has no access of transferordermasterdetails",
            Data: null,
          });
      }
    );
  });

  router.route("/GetAllTranstactionDetails/:INVENTORY/:LOCATOR/:LOT_NUMBER/:ITEM_NUMBER/:TAX_INVOICE_NUM/:SUPPLIER_ITEM_CODE/:SUPPLIER_NAME")
    .get(async function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();
      const T_TransferOrderItems = datamodel.T_TransferOrderItems();
      const M_TransferOrder = datamodel.M_TransferOrder();
      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
          LOT_NUMBER: req.params.LOT_NUMBER,
          ITEM_NUMBER: req.params.ITEM_NUMBER,
          TAX_INVOICE_NUM: req.params.TAX_INVOICE_NUM,
          SUPPLIER_ITEM_CODE: req.params.SUPPLIER_ITEM_CODE,
          SUPPLIER_NAME: req.params.SUPPLIER_NAME,
        },
        //'INVENTORY','ITEM_NUMBER','SUPPLIER_ITEM_CODE','DESCRIPTION','HSN_CODE','UOM','BALANACE_QTY','UNIT_PRICE','AMOUNT','SUPPLIER_NAME','TAX_INVOICE_NUM','TAX_INVOICE_DATE','BOE_NO','HAWB','BOX','RECEIVED_DATE','LOT_NUMBER','SUBINVENTORY','LOCATOR'

        attributes: [
          "STNO",
          "INVENTORY",
          "ITEM_NUMBER",
          "SUPPLIER_ITEM_CODE",
          "DESCRIPTION",
          "HSN_CODE",
          "UOM",
          "BALANACE_QTY",
          "UNIT_PRICE",
          "AMOUNT",
          "SUPPLIER_NAME",
          "TAX_INVOICE_NUM",
          "TAX_INVOICE_DATE",
          "BOE_NO",
          "HAWB",
          "BOX",
          "RECEIVED_DATE",
          "LOT_NUMBER",
          "SUBINVENTORY",
          "LOCATOR",
        ],
      };
     
      var param1 = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },
        attributes: [
          "INVENTORY",
          "ITEM_NUMBER",
          "SUPPLIER_ITEM_CODE",
          "TAX_INVOICE_NUM",
          "SUPPLIER_NAME",
          "LOT_NUMBER",
          "Locator",
          "Transfer_Qty",
          "TransferOrder_ID",
        ],
      };
      var param2 = {
        where: {
          From_INV_ORG_ID: req.params.INVENTORY,
          From_Locator: req.params.LOCATOR,
        },
        attributes: [
          "TransferOrder_ID",
          "StatusId",
          "isskip",
          ],
      };

 

      //  let ordermasterdetails =await dataaccess.FindAll(transferordermasterdetails,param)
      let ordermasterdetails = await sequelize.query(
        "call  GetTransferOrderDetails(:iINVENTORY,:iLOCATOR,:iLOT_NUMBER,:iITEM_NUMBER,:iTAX_INVOICE_NUM,:iSUPPLIER_ITEM_CODE,:iSUPPLIER_NAME)",
        {
          replacements: {
            iINVENTORY: req.params.INVENTORY,
            iLOCATOR: req.params.LOCATOR,
            iLOT_NUMBER: req.params.LOT_NUMBER,
            iITEM_NUMBER: req.params.ITEM_NUMBER,
            iTAX_INVOICE_NUM: req.params.TAX_INVOICE_NUM,
            iSUPPLIER_ITEM_CODE: req.params.SUPPLIER_ITEM_CODE,
            iSUPPLIER_NAME: req.params.SUPPLIER_NAME,
          },
        }
      );
      console.log("ordermasterdetails", ordermasterdetails);

      let transferdata = await dataaccess.FindAll(T_TransferOrderItems, param1);
      console.log("transferdata", transferdata);

      console.log("param2",param2);
      let statusdata = await dataaccess.FindAll(M_TransferOrder, param2);
      console.log("statusdata", statusdata);

      let a = [];
      for (let i = 0; i < ordermasterdetails.length; i++) {
        for (let j = 0; j < transferdata.length; j++) {
          for(let k=0; k<statusdata.length; k++){

          // console.log(
          //   "locator",
          //   ordermasterdetails[i].LOCATOR,
          //   transferdata[j].Locator
          // );

          if (
            ordermasterdetails[i].INVENTORY == transferdata[j].INVENTORY &&
            ordermasterdetails[i].LOCATOR == transferdata[j].Locator &&
            ordermasterdetails[i].ITEM_NUMBER == transferdata[j].ITEM_NUMBER &&
            ordermasterdetails[i].LOT_NUMBER == transferdata[j].LOT_NUMBER&&
            ordermasterdetails[i].TAX_INVOICE_NUM == transferdata[j].TAX_INVOICE_NUM
          ) {
            // console.log(
            //   "ordermasterdetails[i].BALANACE_QTY ",
            //   ordermasterdetails[i].BALANACE_QTY
            // );

          
            if(((statusdata[k].StatusId==0||statusdata[k].StatusId==3||statusdata[k].StatusId==2|| ((statusdata[k].StatusId==1)&&statusdata[k].isskip==false)))
             && transferdata[j].TransferOrder_ID==statusdata[k].TransferOrder_ID )
            {


            ordermasterdetails[i].BALANACE_QTY =
              Number(ordermasterdetails[i].BALANACE_QTY) -
              Number(transferdata[j].Transfer_Qty);
            // a.push(ordermasterdetails[i]);
            console.log(
              "ordermasterdetails[i].BALANACE_QTY ",
              ordermasterdetails[i].BALANACE_QTY
            );
          }
        }
        }
        }
      }

      console.log("omdetails", ordermasterdetails);
      return res.send(ordermasterdetails);

      // dataaccess.FindAll(transferordermasterdetails,ordermasterdetails)
      //     .then(function (result) {
      //        console.log("result",result);
      //         if (result != null) {
      //             res.status(200).json({ Success: true, Message: 'transferordermasterdetails access', Data: result });
      //         }
      //         else {
      //             res.status(200).json({ Success: false, Message: 'User has no access of transferordermasterdetails', Data: null });
      //         }
      //     }, function (err) {
      //         dataconn.errorlogger('transferordermasterdetails', 'GetAllTranstactionDetails', err);
      //         res.status(200).json({ Success: false, Message: 'User has no access of transferordermasterdetails' });
      //     });
    });

  router
    .route("/GetAllheaderMappingMaster/:INVENTORY/:LOCATOR")
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();
      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          [
            sequelize.fn("DISTINCT", sequelize.col("SUBINVENTORY")),
            "SUBINVENTORY",
          ],
        ],
        order: ["SUBINVENTORY"],
      };

      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          console.log("transferordermasterdetails", result);
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetAllheaderMappingMaster  Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetAllheaderMappingMaster",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetAllheaderMappingMaster",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetAllheaderMappingMaster",
              Data: null,
            });
        }
      );
    });

  /*Taking mappin details for Transfering order*/
  router.route("/GetAllMappingDetails").get(function (req, res) {
    const M_HeaderMappingMaster = datamodel.M_HeaderMappingMaster();
    var param = {
      /*  where:{ 
                      ORGANIZATION_NAME : req.body.ORGANIZATION_NAME,
                    //   LOCATOR_DESC : req.body.LOCATOR_DESC
                  },*/
      // where: { ORGANIZATION_NAME: req.params.ORGANIZATION_NAME ,LOCATOR_DESC: req.params.LOCATOR_DESC} ,
      attributes: ["ORGANIZATION_NAME", "ORGANIZATION_CODE"],
      group: ["ORGANIZATION_NAME", "ORGANIZATION_CODE"],
      order: ["ORGANIZATION_NAME", "ORGANIZATION_CODE"],
    };

    dataaccess.FindAll(M_HeaderMappingMaster, param).then(
      function (result) {
        if (result != null) {
          res
            .status(200)
            .json({
              Success: true,
              Message: "GetAllMappingDetails Access",
              Data: result,
            });
        } else {
          res
            .status(200)
            .json({
              Success: false,
              Message: "User has no access of GetAllMappingDetails",
              Data: null,
            });
        }
      },
      function (err) {
        dataconn.errorlogger("TransactionService", "GetAllMappingDetails", err);
        res
          .status(200)
          .json({
            Success: false,
            Message: "user has no access of GetAllMappingDetails",
            Data: null,
          });
      }
    );
  });

  router
    .route("/GetwarehouseDetails/:ORGANIZATION_NAME")
    .get(function (req, res) {
      const M_HeaderMappingMaster = datamodel.M_HeaderMappingMaster();
      var param = {
        //where: { LOCATOR_DESC : ''} ,
        where: {
          LOCATOR_DESC: { [Op.ne]: "" },
          ORGANIZATION_NAME: req.params.ORGANIZATION_NAME,
        },
        attributes: [
          [
            sequelize.fn("DISTINCT", sequelize.col("LOCATOR_DESC")),
            "LOCATOR_DESC",
          ],
        ],
        order: ["LOCATOR_DESC"],
      };
      dataaccess.FindAll(M_HeaderMappingMaster, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetwarehouseDetails Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetwarehouseDetails",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetwarehouseDetails",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetwarehouseDetails",
              Data: null,
            });
        }
      );
    });

  router
    .route("/GetAllLot/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          sequelize.fn("DISTINCT", sequelize.col("LOT_NUMBER")),
          "LOT_NUMBER",
        ],
        order: ["LOT_NUMBER"],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });

  router
    .route("/GetAllItemDetails/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          sequelize.fn("DISTINCT", sequelize.col("ITEM_NUMBER")),
          "ITEM_NUMBER",
        ],
        order: ["ITEM_NUMBER"],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });
  router
    .route("/GetAllsupplierInvNum/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          sequelize.fn("DISTINCT", sequelize.col("TAX_INVOICE_NUM")),
          "TAX_INVOICE_NUM",
        ],
        order: ["TAX_INVOICE_NUM"],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });
  router
    .route("/GetAllsupplierCode/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          sequelize.fn("DISTINCT", sequelize.col("SUPPLIER_ITEM_CODE")),
          "SUPPLIER_ITEM_CODE",
        ],
        order: ["SUPPLIER_ITEM_CODE"],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });
  router
    .route("/GetAllsupplierName/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          sequelize.fn("DISTINCT", sequelize.col("SUPPLIER_NAME")),
          "SUPPLIER_NAME",
        ],
        order: ["SUPPLIER_NAME"],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });

  ///:INVENTORY/:LOCATOR
  router
    .route("/GetAllLotDetails/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          "INVENTORY",
          "ITEM_NUMBER",
          "SUPPLIER_ITEM_CODE",
          "DESCRIPTION",
          "HSN_CODE",
          "UOM",
          "BALANACE_QTY",
          "UNIT_PRICE",
          "AMOUNT",
          "SUPPLIER_NAME",
          "TAX_INVOICE_NUM",
          "TAX_INVOICE_DATE",
          "BOE_NO",
          "HAWB",
          "BOX",
          "RECEIVED_DATE",
          "LOT_NUMBER",
          "SUBINVENTORY",
          "LOCATOR",
        ],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });
  router
    .route("/GetAllItem/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          "INVENTORY",
          "ITEM_NUMBER",
          "SUPPLIER_ITEM_CODE",
          "DESCRIPTION",
          "HSN_CODE",
          "UOM",
          "BALANACE_QTY",
          "UNIT_PRICE",
          "AMOUNT",
          "SUPPLIER_NAME",
          "TAX_INVOICE_NUM",
          "TAX_INVOICE_DATE",
          "BOE_NO",
          "HAWB",
          "BOX",
          "RECEIVED_DATE",
          "LOT_NUMBER",
          "SUBINVENTORY",
          "LOCATOR",
        ],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });
  router
    .route("/GetAllItem/:INVENTORY/:LOCATOR") ///:LOCATOR
    .get(function (req, res) {
      const transferordermasterdetails = datamodel.transferordermasterdetails();

      var param = {
        where: {
          INVENTORY: req.params.INVENTORY,
          LOCATOR: req.params.LOCATOR,
        },

        attributes: [
          "INVENTORY",
          "ITEM_NUMBER",
          "SUPPLIER_ITEM_CODE",
          "DESCRIPTION",
          "HSN_CODE",
          "UOM",
          "BALANACE_QTY",
          "UNIT_PRICE",
          "AMOUNT",
          "SUPPLIER_NAME",
          "TAX_INVOICE_NUM",
          "TAX_INVOICE_DATE",
          "BOE_NO",
          "HAWB",
          "BOX",
          "RECEIVED_DATE",
          "LOT_NUMBER",
          "SUBINVENTORY",
          "LOCATOR",
        ],
      };
      dataaccess.FindAll(transferordermasterdetails, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                Success: true,
                Message: "GetTransactionOrderDetailsBy Access",
                Data: result,
              });
          } else {
            res
              .status(200)
              .json({
                Success: false,
                Message: "User has no access of GetTransactionOrderDetailsBy",
                Data: null,
              });
          }
        },
        function (err) {
          dataconn.errorlogger(
            "TransactionService",
            "GetTransactionOrderDetailsBy",
            err
          );
          res
            .status(200)
            .json({
              Success: false,
              Message: "user has no access of GetTransactionOrderDetailsBy",
              Data: null,
            });
        }
      );
    });

  router.route("/GetAllOrganization").get(function (req, res) {
    const OrganizationDetails = datamodel.OrganizationDetails();
    var param = {
      attributes: ["OrganizationId", "OrganizationCode", "OrganizationName"],
      order: [["OrganizationName"]],
    };
    dataaccess.FindAll(OrganizationDetails, param).then(
      function (result) {
        if (result != null) {
          res
            .status(200)
            .json({
              Success: true,
              Message: "OrganizationDetails Access",
              Data: result,
            });
        } else {
          res
            .status(200)
            .json({
              Success: false,
              Message: "User has no access of OrganizationDetails",
              Data: null,
            });
        }
      },
      function (err) {
        dataconn.errorlogger("TransactionService", "GetAllOrganization", err);
        res
          .status(200)
          .json({
            Success: false,
            Message: "user has no access of OrganizationDetails",
            Data: null,
          });
      }
    );
  });

  router.route("/getAllLocatonIds/:LocationId").get(function (req, res) {
    const LocationDetails = datamodel.LocationDetails();
    var param = {
      //where: { LOCATOR_DESC : ''} ,
      where: {
        // LOCATOR_DESC: { [Op.ne]: '' },
        //  LocationId: req.params.LocationId
      },
      attributes: [
        [
          sequelize.fn("DISTINCT", sequelize.col("LocationName")),
          "LocationName",
        ],
      ],
      order: ["LocationName"],
    };
    dataaccess.FindAll(LocationDetails, param).then(
      function (result) {
        if (result != null) {
          res
            .status(200)
            .json({
              Success: true,
              Message: "getAllLocatonIds Access",
              Data: result,
            });
        } else {
          res
            .status(200)
            .json({
              Success: false,
              Message: "User has no access of getAllLocatonIds",
              Data: null,
            });
        }
      },
      function (err) {
        dataconn.errorlogger("TransactionService", "GetwarehouseDetails", err);
        res
          .status(200)
          .json({
            Success: false,
            Message: "user has no access of GetwarehouseDetails",
            Data: null,
          });
      }
    );
  });

  ///////////////////////""""""CreateTransaction"""""""/////////////////
  router.route("/CreateTransaction").post(function (req, res) {
    const TransferOrder = datamodel.TransferOrder();
    var values = {
      FromInvoice: req.body.FromInvoice,
      FromWarehouse: req.body.FromWarehouse,
      FromSuninventory: req.body.FromSuninventory,
      ToInvoice: req.body.ToInvoice,
      LotNo: req.body.LotNo,
      InvoiceNo: req.body.InvoiceNo,
      QtyTransferred: req.body.QtyTransferred,
      StatusId: req.body.StatusId,
      InterfaceBatchNumber:req.InterfaceBatchNumber,
    };
    dataaccess.Create(TransferOrder, values).then(
      function (result) {
        if (result != null) {
          res
            .status(200)
            .json({
              Success: true,
              Message: "TransferOrder saved successfully",
              Data: result,
            });
        } else {
          dataconn.errorlogger("TransactionService", "CreateTransferOrder", {
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
        dataconn.errorlogger("TransactionService", "CreateTransferOrder", err);
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
  //////////////////***************GET Transaction method*******************
  router
    .route("/GetAllTranstactionMappingDetails")

    .get(function (req, res) {
      const M_TransferOrder = datamodel.M_TransferOrder();
      var param = {
        attributes: [
          "TransferOrder_ID",
          "TransferOrder_Type",
          "From_INV_ORG_ID",
          "To_INV_ORG_ID",
          "FROM_ORGANIZATION_NAME",
          "TO_ORGANIZATION_NAME",
          "From_Locator",
          "To_Locator",
          "TransferOrderHeaderNumber",
          "StatusId",
          "CreatedDate",
        ],
        order: [["TransferOrder_ID", "DESC"]],
      };

      dataaccess
        .FindAll(M_TransferOrder, param)

        .then(
          function (result) {
            if (result != null) {
              res
                .status(200)
                .json({
                  Success: true,
                  Message: "TransferMappingDetails Access",
                  Data: result,
                });
            } else {
              res
                .status(200)
                .json({
                  Success: false,
                  Message: "User has no access of TransferMappingDetails",
                  Data: null,
                });
            }
          },
          function (err) {
            dataconn.errorlogger(
              "TransactionService",
              "TransferMappingDetails",
              err
            );

            res
              .status(200)
              .json({
                Success: false,
                Message: "user has no access of TransferMappingDetails",
                Data: null,
              });
          }
        );
    });

  /////////
  function createTransferOrderItemsDetails(request) {
    return new Promise(async (resolve, reject) => {
      let reqBody = request;
      let date = new Date();
      console.log("reqBody", reqBody);
      connect.sequelize.transaction().then((trans) => {
        const TransferOrderMaster = datamodel.M_TransferOrder();
        var values = {
          TransferOrder_Type: reqBody.TransferOrder_Type,
          From_INV_ORG_ID: 0,
          To_INV_ORG_ID: 0,
          From_Locator: reqBody.From_Locator,
          To_Locator: reqBody.To_Locator,
          StatusId: reqBody.StatusId,
          TO_ORGANIZATION_NAME: reqBody.TO_ORGANIZATION_NAME,
          FROM_ORGANIZATION_NAME: reqBody.FROM_ORGANIZATION_NAME,
          ModifiedBy: reqBody.userId,
          ModifiedDate: connect.sequelize.fn("NOW"),
          CreatedBy: reqBody.userId,
          CreatedDate: connect.sequelize.fn("NOW"),
          InterfaceBatchNumber : date.toISOString().slice(0, 10).split("-").join("") + Math.floor(Math.random() * 9000 + 1000)
        };
        console.log("values", values);
        dataaccess
          .CreateWithTransaction(TransferOrderMaster, values, trans)
          .then(
            function (result) {
              console.log("result", result);
              if (result != null) {
                const orderDetails = datamodel.T_TransferOrderItems();
                var mapDetails = [];
                console.log(" reqBody.orderDetails", reqBody.orderDetails);
                var promiseDetails = reqBody.orderDetails.map(function (
                  mapitem
                ) {
                  mapDetails.push({
                    TransferOrder_ID: result.TransferOrder_ID,
                    INVENTORY: mapitem.INVENTORY,
                    ITEM_NUMBER: mapitem.ITEM_NUMBER,
                    SUPPLIER_ITEM_CODE: mapitem.SUPPLIER_ITEM_CODE,
                    DESCRIPTION: mapitem.DESCRIPTION,
                    HSN_CODE: mapitem.HSN_CODE,
                    UOM: mapitem.UOM,
                    BALANACE_QTY: mapitem.BALANACE_QTY,
                    UNIT_PRICE: mapitem.UNIT_PRICE,
                    AMOUNT: mapitem.AMOUNT,
                    SUPPLIER_NAME: mapitem.SUPPLIER_NAME,
                    TAX_INVOICE_NUM: mapitem.TAX_INVOICE_NUM,
                    TAX_INVOICE_DATE: mapitem.TAX_INVOICE_DATE== '' ? null :  mapitem.TAX_INVOICE_DATE,
                    BOE_NO: mapitem.BOE_NO,
                    BOX: mapitem.BOX,
                    HAWB: mapitem.HAWB,
                    RECEIVED_DATE: mapitem.RECEIVED_DATE== '' ? null :  mapitem.RECEIVED_DATE,
                    LOT_NUMBER: mapitem.LOT_NUMBER,
                    From_SUBINVENTORY: mapitem.From_SUBINVENTORY,
                    To_SUBINVENTORY: mapitem.To_SUBINVENTORY,
                    To_LOCATION: mapitem.To_LOCATION,
                    Locator: mapitem.LOCATOR,
                    Transfer_Qty: mapitem.Transfer_Qty,
                    ModifiedBy: mapitem.userId,
                    ModifiedDate: connect.sequelize.fn("NOW"),
                    CreatedBy: mapitem.userId,
                    CreatedDate: connect.sequelize.fn("NOW"),
                  });
                  console.log("mapDetails", mapDetails);
                });

                Promise.all(promiseDetails).then(function () {
                  dataaccess
                    .BulkCreateWithTransaction(orderDetails, mapDetails, trans)
                    .then(
                      (resultfinal) => {
                        console.log("resultfinal", resultfinal);
                        trans.commit();
                        resolve(result);
                        //res.status(200).json({ Success: true, Message: 'BoE Details saved successfully', Data: result });
                      },
                      function (err) {
                        console.log("err", err);
                        trans.rollback();
                        dataconn.errorlogger(
                          "BoEDetailsService",
                          "CreateUserBoEDetails",
                          err
                        );
                        reject(err);
                        //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
                      }
                    );
                });
              }
            },
            function (err) {
              trans.rollback();
              dataconn.errorlogger(
                "BoEDetailsService",
                "CreateUserBoEDetails",
                err
              );
              reject(err);
              //res.status(200).json({ Success: false, Message: 'Error occurred while saving record', Data: null });
            }
          );
      });
    });
  }

  router.route("/OnSavebuttonAPI").post(function (req, res) {
    let requestBody = req.body;
    let shipment='';
    let objTransferOrderHeaderNumber=null;
    console.log("savereq.body",req.body);
    createTransferOrderItemsDetails(requestBody)
      .then((createResult) => {
        console.log("createResult", createResult);

        res
          .status(200)
           .json({ Success: true, Message: "Success", Data: createResult });
           if(requestBody.StatusId=="0")
           {
             console.log("emailservicestart");
             console.log("emailservicestart", createResult.InterfaceBatchNumber);
             if((req.body.FROM_ORGANIZATION_NAME).trim() == (req.body.TO_ORGANIZATION_NAME).trim())
             {
              shipment="IntraOrg";
             }
             else{
              shipment="InterOrg";
             }
           let mailtemplateData = {
            MRN:createResult.InterfaceBatchNumber,
             FROM_ORGANIZATION_NAME: req.body.FROM_ORGANIZATION_NAME,
             From_Locator: req.body.From_Locator,
             TO_ORGANIZATION_NAME: req.body.TO_ORGANIZATION_NAME,
             To_Locator: req.body.To_Locator,
             ui_url : configuration.ui_url,
             Shipmenttype:shipment
        };
        let mailData = {
            fromEmail: req.body.userEmail,
            toEmail: configuration.EmailIds.ForApproval.ToEmailIds,
            ccEmail : configuration.EmailIds.ForApproval.CcEmailIds,
            subjectEmail: req.body.TransferOrder_Type + ' - ' + createResult.InterfaceBatchNumber + " For Pending"
        };
        //const pdfTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetPDF.ejs');
        //const emailTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetResponse.ejs');
        const emailTemplatePath = path.join(__dirname + '/../../Templates/TransferingOrder/Pending.ejs');
       
        console.log("maildata",mailData);
        console.log("mailtemplateData",mailtemplateData);
        sentTransferOrderMail(req.body.Id,mailtemplateData,mailData,emailTemplatePath);
        console.log("end mail");
      }
      })
      
      .catch((createError) => {
        console.log("createError", createError);
        dataconn.errorlogger(
          "createResult",
          "Save Transaction Successfully",
          createError
        );
        res
          .status(200)
          .json({
            Success: false,
            Message: "Error occurred in create Transaction Details",
            Data: createError,
          });
      });
    
  });

  function sentTransferOrderMail(TransferIdForEmail,mailtemplateData, mailData, emailHTMLPath) {
    let fromEmail = mailData.fromEmail;
    let toEmail = mailData.toEmail;
    let ccEmail = mailData.ccEmail;
    let subjectEmail = mailData.subjectEmail;
    let templateLocation = emailHTMLPath;
    let templateData = mailtemplateData;

    emailService.notifyMail(fromEmail,toEmail,ccEmail,subjectEmail,templateLocation,templateData)
      .then((results) => {
        let mailObj = {
          TransferOrder_ID: TransferIdForEmail,
          mailTo: results.messageData.to,
          mailFrom: results.messageData.from,
          mailCc: results.messageData.cc,
          mailSubject: results.messageData.subject,
          mailBody: results.messageData.html,
          messageId: results.info.messageId,
          mailStatus: true,
        };
        console.log("maillogger",mailObj);
        dataconn.maillogger(mailObj);
        
        console.log("Email Sent");
      })
      .catch((err) => {
        console.log(err);
        let mailObj = {
          TransferOrder_ID: TransferIdForEmail,
          mailTo: err.messageData.to,
          mailFrom: err.messageData.from,
          mailCc: err.messageData.cc,
          mailSubject: err.messageData.subject,
          mailBody: err.messageData.html,
          messageId: null,
          mailStatus: false,
        };
        dataconn.maillogger(mailObj);
        console.log("Email Not Sent");
      });
  }

  //////////////////////////////////////////

  router.route("/UpdateTransferDetails").post(function (req, res) {
    let requestBody = req.body;
    let M_TransferOrder = datamodel.M_TransferOrder();
    let shipment="";

    // let newUpdateTransferDetails = requestBody.UpdateTransferDetails;
    // let TransferOrder_ID = requestBody.TransferOrder_ID;

    console.log("requestBody", requestBody);
    UpdateTransferDetails(requestBody)
      .then(async (result) => {
        console.log("Final result", result);
        if (result != null) {

          res
            .status(200)
            .json({
              Success: true,
              Message: "Update Transfer Details data successfully",
              Data: result,
              
            });
            let masterdata = await dataaccess.FindAll(
              M_TransferOrder,
              {
                where: {
                  TransferOrder_ID: requestBody.TransferOrder_ID,
                   },
              }
            );
            console.log("masterdata",masterdata);
            console.log("masterdata",masterdata[0].InterfaceBatchNumber)
            if(requestBody.StatusId=="0")
            {
              
              if(req.body.FROM_ORGANIZATION_NAME==req.body.TO_ORGANIZATION_NAME)
              {
               shipment="InterOrg";
              }
              else{
               shipment="IntraOrg";
              }
             
            let mailtemplateData = {
             MRN: masterdata[0].InterfaceBatchNumber,
              FROM_ORGANIZATION_NAME: req.body.FROM_ORGANIZATION_NAME,
              From_Locator: req.body.From_Locator,
              TO_ORGANIZATION_NAME: req.body.TO_ORGANIZATION_NAME,
              To_Locator: req.body.To_Locator,
              ui_url : configuration.ui_url,
              Shipmenttype:shipment
         };
         let mailData = {
             fromEmail: req.body.userEmail,
             toEmail: configuration.EmailIds.ForApproval.ToEmailIds,
             ccEmail : configuration.EmailIds.ForApproval.CcEmailIds,
             subjectEmail: req.body.TransferOrder_Type + ' - ' + masterdata[0].InterfaceBatchNumber + " For Pending"
         };
         //const pdfTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetPDF.ejs');
         //const emailTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetResponse.ejs');
         const emailTemplatePath = path.join(__dirname + '/../../Templates/TransferingOrder/Pending.ejs');
        
         console.log("maildata",mailData);
         sentTransferOrderMail(req.body.Id,mailtemplateData,mailData,emailTemplatePath);
         console.log("end mail");
       }
            
      //       if(requestBody.StatusId=="0")
      //       {
      //         console.log("emailservicestart");
      //         console.log("emailservicestart", req.body.UpdateDetails);
      //       let mailtemplateData = {
      //         MRN: req.body.UpdateDetails[0].Seq7,
      //         FROM_ORGANIZATION_NAME: req.body.FROM_ORGANIZATION_NAME,
      //         From_Locator: req.body.From_Locator,
      //         TO_ORGANIZATION_NAME: req.body.TO_ORGANIZATION_NAME,
      //         To_Locator: req.body.To_Locator,
      //         ui_url : configuration.ui_url
      //    };
      //    let mailData = {
      //        fromEmail: req.body.userEmail,
      //        toEmail: configuration.EmailIds.ForApproval.ToEmailIds,
      //        ccEmail : configuration.EmailIds.ForApproval.CcEmailIds,
      //        subjectEmail: req.body.TransferOrder_Type + ' - ' + req.body.UpdateDetails[0].Seq7 + " For Pending"
      //    };
      //    //const pdfTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetPDF.ejs');
      //    //const emailTemplatePath = path.join(__dirname + '/../../Templates/LTC_Response/createAssetResponse.ejs');
      //    const emailTemplatePath = path.join(__dirname + '/../../Templates/TransferingOrder/Pending.ejs');
      //    console.log("maildata",mailData);
      //    sentTransferOrderMail(req.body.Id,mailtemplateData,mailData,emailTemplatePath);
      //    console.log("end mail");
      //  }
        }
         else {
          res
            .status(200)
            .json({
              Success: false,
              Message: "User has no access of UpdateTransferDetails",
              Data: null,
            });
        }
      })

      .catch((error) => {
        console.log("error", error);
        dataconn.errorlogger(
          "TransactionService",
          "UpdateTransferDetails",
          error
        );
        res.status(200).json({ Success: false, Message: "error", Data: error });
      });
  });


  async function UpdateTransferDetails(request) {
    return new Promise(async (resolve, reject) => {
      let reqBody = request;
      let M_TransferOrder = datamodel.M_TransferOrder();
      console.log("reqBody", reqBody);
      connect.sequelize.transaction().then((trans) => {
        const TransferOrderMaster = datamodel.M_TransferOrder();
        var values = {
          TransferOrder_Type: reqBody.TransferOrder_Type,
          From_INV_ORG_ID: 0,
          To_INV_ORG_ID: 0,
          From_Locator: reqBody.From_Locator,
          To_Locator: reqBody.To_Locator,
          StatusId: reqBody.StatusId,
          TO_ORGANIZATION_NAME: reqBody.TO_ORGANIZATION_NAME,
          FROM_ORGANIZATION_NAME: reqBody.FROM_ORGANIZATION_NAME,
        };
        console.log("values", values);
        var param = {
          TransferOrder_ID: reqBody.TransferOrder_ID,
        };
        console.log("UpdateWithTransaction", param);

        dataaccess
          .UpdateWithTransaction(TransferOrderMaster, values, param, trans)

          .then(
            function (result) {
              console.log("result", result);
              if (result != null) {
                console.log("Update TransferDetails");

                const UpdateDetails = datamodel.T_TransferOrderItems();
                var mapDetails = [];
                console.log("request.UpdateDetails", request.UpdateDetails);
                var promiseDetails = request.UpdateDetails.map(function (
                  mapitem
                ) {
                  mapDetails.push({
                    TransferOrder_ID: result.TransferOrder_ID,
                    INVENTORY: mapitem.INVENTORY,
                    ITEM_NUMBER: mapitem.ITEM_NUMBER,
                    SUPPLIER_ITEM_CODE: mapitem.SUPPLIER_ITEM_CODE,
                    DESCRIPTION: mapitem.DESCRIPTION,
                    HSN_CODE: mapitem.HSN_CODE,
                    UOM: mapitem.UOM,
                    BALANACE_QTY: mapitem.BALANACE_QTY,
                    UNIT_PRICE: mapitem.UNIT_PRICE,
                    AMOUNT: mapitem.AMOUNT,
                    SUPPLIER_NAME: mapitem.SUPPLIER_NAME,
                    TAX_INVOICE_NUM: mapitem.TAX_INVOICE_NUM,

                    TAX_INVOICE_DATE: mapitem.TAX_INVOICE_DATE,
                    BOE_NO: mapitem.BOE_NO,
                    BOX: mapitem.BOX,
                    HAWB: mapitem.HAWB,
                    RECEIVED_DATE: mapitem.RECEIVED_DATE,
                    LOT_NUMBER: mapitem.LOT_NUMBER,
                    From_SUBINVENTORY: mapitem.From_SUBINVENTORY,
                    To_SUBINVENTORY: mapitem.To_SUBINVENTORY,
                    To_LOCATION: mapitem.To_LOCATION,
                    Locator: mapitem.Locator,
                    Transfer_Qty: mapitem.Transfer_Qty,
                  });
                });
                console.log("BeforePromiseAll then", promiseDetails);
                Promise.all(promiseDetails).then(function () {
                  console.log("mapDetails", mapDetails);

                  dataaccess
                    .BulkCreateWithTransaction(UpdateDetails, mapDetails, trans)
                    .then(
                      (result) => {
                        console.log(result);
                        console.log("AfterPromiseAll then", result);
                        // res.status(200).json({ Success: true, Message: 'Updatesuccessfully', Data: result });
                        trans.commit();
                        resolve(result);
                      },
                      function (err) {
                        console.log("err", err);
                        trans.rollback();
                        dataconn.errorlogger(
                          "transaction",
                          "CreatetransferDetails",
                          err
                        );
                        // res.status(200).json({ Success: true, Message: 'Update having error', Data: result });
                        reject();
                      }
                    );
                });
              }
            },
            function (err) {
              trans.rollback();
              dataconn.errorlogger("transaction", "CreatetransferDetails", err);
              reject();
            }
          );
      });
    });
  }
///////////////////////////////////////////////////////

  router.route("/UpdateAcknowledgedetails").post(function(req, res) {
    const AcknowledgeDetails = datamodel.M_TransferOrder();

     var values = {  

    COMMENTS: req.body.COMMENTS ,
     AckDate:connect.sequelize.fn("NOW") ,
    ModifiedDate: connect.sequelize.fn("NOW"),
    StatusId: req.body.StatusId,
     };  

    var param = { TransferOrder_ID: req.body.TransferOrder_ID };
    dataaccess.Update(AcknowledgeDetails, values, param).then(
     function(result) {

            if (result != null) {
                // console.log("result",result);
                res.status(200).json({Success: true,Message: "AcknowledgeDetails updated successfully",Data: result, });
            }

            else {
              dataconn.errorlogger("AcknowledgeDetails", "AcknowledgeDetails",
               {message: "No object found",stack: "",});
              res.status(200).json({Success: false,Message: "Error occurred while updating record",Data: null,});
               }

          },

          function(err) {
              dataconn.errorlogger("AcknowledgeDetails", "AcknowledgeDetails", err);
              res.status(200).json({Success: false,Message: "Error occurred while updating record",Data: null,});
                  });
              });

  //////////////////////////////////////////

  router.route("/RejectTrasaction").post(async function (req, res) {
    console.log("RejectTrasaction API Started");

    const TransferOrder = datamodel.M_TransferOrder();
    var values = {
      // Remarks: req.body.Remarks,
      StatusId: req.body.StatusId,
      ModifiedBy: req.body.ModifiedBy,
      ModifiedDate: connect.sequelize.fn("NOW"),
    };

    console.log("values", values);
    var param = { TransferOrder_ID: req.body.TransferOrder_ID };
    dataaccess.Update(TransferOrder, values, param).then(
      function (result) {
        if (result != null) {
          res
            .status(200)
            .json({
              Success: true,
              Message: "RejectTrasaction Access",
              Data: result,
            });
        } else {
          res
            .status(200)
            .json({
              Success: false,
              Message: "User has no access of RejectTrasaction",
              Data: null,
            });
        }
      },
      function (err) {
        dataconn.errorlogger("TransactionService", "RejectTrasaction", err);
        res
          .status(200)
          .json({
            Success: false,
            Message: "user has no access of RejectTrasaction",
            Data: null,
          });
      }
    );
  });

  /////////////////************GetBy Id**************////////////////

  router
    .route("/GetTransferOrderItemsDetails/:TransferOrder_ID")
    .get(function (req, res) {
      const T_TransferOrderItems = datamodel.T_TransferOrderItems();

      console.log("req.params", req.params);
      var param = {
        where: { TransferOrder_ID: req.params.TransferOrder_ID },
        include: { all: true, nested: true },
      };
      dataaccess.FindAll(T_TransferOrderItems, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                success: true,
                message: "T_TransferOrderItems access",
                Data: result,
              });
          } else {
            res.status(200).json({
              success: false,
              message: "User has no access of T_TransferOrderItems",
              Data: "nothing",
            });
          }
        },
        function (err) {
          dataconn.errorlogger("transaction", "T_TransferOrderItems", err);
          res
            .status(200)
            .json({
              success: false,
              message: "User has no access of T_TransferOrderItems",
              Data: null,
            });
        }
      );
    });

  /////////////*******************//////////////
  router
    .route("/GettransactionIdDetails/:TransferOrder_ID")
    .get(function (req, res) {
      // const T_TransferOrderItems = datamodel.T_TransferOrderItems();
      const M_TransferOrder = datamodel.M_TransferOrder();
      console.log("req.params", req.params);
      var param = {
        where: { TransferOrder_ID: req.params.TransferOrder_ID },
         include: { all: true, nested: true },
      };
      console.log("approve",param);
      dataaccess.FindAll(M_TransferOrder, param).then(
        function (result) {
          if (result != null) {
            res
              .status(200)
              .json({
                success: true,
                message: "M_TransferOrder access",
                Data: result,
              });
          } else {
            res.status(200).json({
              success: false,
              message: "User has no access of M_TransferOrder",
              Data: "nothing",
            });
          }
        },
        function (err) {
          dataconn.errorlogger("transaction", "M_TransferOrder", err);
          res
            .status(200)
            .json({
              success: false,
              message: "User has no access of M_TransferOrder",
              Data: null,
            });
        }
      );
    });

  ////////****************T_TransferOrderItems Table creation******************/////////

  router.route("/TransferOrderItemsTable").post(function (req, res) {
    const T_TransferOrderItems = datamodel.T_TransferOrderItems();
    const M_TransferOrder = datamodel.M_TransferOrder();
    var param = {
      where: { TransferOrder_ID: req.body.TransferOrder_ID },
      include: { all: true, nested: true },
    };

    var values = {
      TransferOrder_ID: req.body.TransferOrder_ID,
      INVENTORY: req.body.INVENTORY,
      ITEM_NUMBER: req.body.ITEM_NUMBER,
      SUPPLIER_ITEM_CODE: req.body.SUPPLIER_ITEM_CODE,
      DESCRIPTION: req.body.DESCRIPTION,
      HSN_CODE: req.body.HSN_CODE,
      UOM: req.body.UOM,
      BALANACE_QTY: req.body.BALANACE_QTY,
      UNIT_PRICE: req.body.UNIT_PRICE,
      AMOUNT: req.body.AMOUNT,
      SUPPLIER_NAME: req.body.SUPPLIER_NAME,
      TAX_INVOICE_NUM: req.body.TAX_INVOICE_NUM,
      TAX_INVOICE_DATE: req.body.TAX_INVOICE_DATE,
      BOE_NO: req.body.BOE_NO,
      HAWB: req.body.HAWB,
      BOX: req.body.BOX,
      RECEIVED_DATE: req.body.RECEIVED_DATE,
      LOT_NUMBER: req.body.LOT_NUMBER,
      From_SUBINVENTORY: req.body.From_SUBINVENTORY,
      To_SUBINVENTORY: req.body.To_SUBINVENTORY,
      To_LOCATION: req.body.To_LOCATION,
      Locator: req.body.Locator,
    };
    dataaccess
      .Create(T_TransferOrderItems, M_TransferOrder, values, param)
      .then(
        function (result) {
          if (result != null) {
            res.status(200).json({
              Success: true,
              Message: "T_TransferOrderItems saved successfully",
              Data: result,
            });
          } else {
            dataconn.errorlogger("T_TransferOrderItems", {
              message: "No object found",
              stack: "",
            });
            res.status(200).json({
              Success: false,
              Message: "Error occurred while saving record",
              Data: null,
            });
          }
        },
        function (err) {
          dataconn.errorlogger("T_TransferOrderItems", err);
          res.status(200).json({
            Success: false,
            Message: "Error occurred while saving record",
            Data: null,
          });
        }
      );
  });

  router.route("/addWhtoWhOraclePush").post(async (req, res) => {
    try {
      let sequencedata = await getMaxSeqIdTransferOrderItems();
      let M_TransferOrder = datamodel.M_TransferOrder();
      let T_TransferOrderItems = datamodel.T_TransferOrderItems();
      if (req.body.StatusId != 2) {
        await dataaccess.Update(
          M_TransferOrder,
          { StatusId: 2 },
          { TransferOrder_ID: req.body.Id },
           //{isskip:0}
        );
      }
      
      // hardcoded SupplyOrderReferenceNumber remove the comment
      let result = await TransferOrderMethodAPI(
        req.body,
        sequencedata,
        new Date(),
        req.body.TransferOrder_Type
      );

      if (result) 
      {
        let transOrderItemData = await dataaccess.FindAll(
          T_TransferOrderItems,
          {
            where: {
              TransferOrder_ID: req.body.Id,
              getToDetailsResponse: 400,
            },
          }
        );
      
        if (transOrderItemData.length) 
        {
          await repushFailedLineData(transOrderItemData)
        } 
        else 
        {
           //hit line items api for the fist time and update line data in transfer order items 
           let lineTrackingStatus = await updateLineItemData(result.items)
           console.log("lineTrackingStatus",lineTrackingStatus);
           if (!lineTrackingStatus) {
               return res.status(200).json({ Success: false, Message: 'Transfer Order Pending For Commit', Data: null });
           }
        }
      }
     
      let transOrderItemStatusData = await dataaccess.FindAll(
        T_TransferOrderItems,
        {
          where: {
            TransferOrder_ID: req.body.Id,
            getToDetailsResponse: 200,
          },
        }
      );
      console.log("lengthhhhhhhh" ,transOrderItemStatusData.length ,  result.items.length)
      //if all order items are successfully updated then call reservation item apis
      if (transOrderItemStatusData.length == result.items.length) {
        await createReservationAndUpdateLineItem(result.items,transOrderItemStatusData)

        let transOrderItemReservationData = await dataaccess.FindAll(
          T_TransferOrderItems,
          {
            where: {
              TransferOrder_ID: req.body.Id,
              ReservationId: null,
            },
          }
        );
       let objTransferOrderHeaderNumber=await dataaccess.FindOne(
        T_TransferOrderItems,
        {
          where: {
            TransferOrder_ID: req.body.Id,
             },
        }
      );
      console.log("objTransferOrderHeaderNumber",objTransferOrderHeaderNumber);

        if (transOrderItemReservationData.length == 0) {
          await dataaccess.Update(
            M_TransferOrder,
            { reservationResponse: 1, StatusId: 1 ,isskip:'false',TransferOrderHeaderNumber : objTransferOrderHeaderNumber.TransferOrderHeaderId},
            { TransferOrder_ID: req.body.Id }
          );
   
          let masterdata = await dataaccess.FindAll(
            M_TransferOrder,
            {
              where: {
                TransferOrder_ID: req.body.Id,
                 },
            }
          );
          console.log("masterdata",masterdata);
          console.log("masterdata",masterdata[0].InterfaceBatchNumber)
          //console.log("masterdata",masterdata.M_TransferOrder[0].InterfaceBatchNumber)
        let shipment1="";
           
            console.log("emailservicestartapporve");
            console.log("emailservicestartapprove", req.body);
            if((req.body.SourceOrganizationCode).trim() == (req.body.DestinationOrganizationCode).trim())
            {
              shipment1="IntraOrg";

             }
             else{
              shipment1="InterOrg";
             }
             console.log("shipment1",shipment1);

          let mailtemplateData = {
            MRN:masterdata[0].InterfaceBatchNumber,
            FROM_ORGANIZATION_NAME: masterdata[0].FROM_ORGANIZATION_NAME,
            From_Locator: masterdata[0].From_Locator,
            TO_ORGANIZATION_NAME: masterdata[0].TO_ORGANIZATION_NAME,
            To_Locator: masterdata[0].To_Locator,
            TransferOrderNo:masterdata[0].TransferOrderHeaderNumber,
            ui_url : configuration.ui_url,
            Shipmenttype:shipment1
       };
       let objTransferType = req.body.TransferOrder_Type == 1 ? "WH To WH" : "WH To Site";
       let mailData = {
           fromEmail: req.body.userEmail,
           toEmail: configuration.EmailIds.ForApproval.ToEmailIds,
           ccEmail : configuration.EmailIds.ForApproval.CcEmailIds,
           subjectEmail: objTransferType + ' - '  + masterdata[0].InterfaceBatchNumber + " For Approve"
       };
       const emailTemplatePath = path.join(__dirname + '/../../Templates/TransferingOrder/approve.ejs');
       console.log("maildata",mailData);
       console.log("mailtemplateData",mailtemplateData)
       sentTransferOrderMail(req.body.Id,mailtemplateData,mailData,emailTemplatePath);
       console.log("end mail");
    
        res.status(200).json({
              Success: true,
              Message: "Transfer Order Approved successfully",
              Data: null,
            });
          
          
          return;
        }
      }
      

      res
        .status(200)
        .json({
          Success: false,
          Message: "Transfer Order Pending For Commit",
          Data: null,
        });
      return;

    } catch (error) {
      console.log("error", error);
      dataconn.errorlogger("TransferingOrder", "addWhtoWhOraclePush", error);
      res
        .status(200)
        .json({
          Success: false,
          Message: "Error occure while updating records",
          Data: null,
        });
    }
  });

  async function repushFailedLineData(transOrderItemData) {
    try {

        let promiseAr = transOrderItemData.map(async e => {

            let lineData = await axiosApiCallHelper("GET", e.transferSupplyUrl, null)

            if (lineData.status == 200) {
                console.log("lineData", lineData.data.items[0]);
                let val = {
                    TransferOrderHeaderId: lineData.data.items[0].TransferOrderHeaderId,
                    TransferOrderHeaderNumber: lineData.data.items[0].TransferOrderHeaderNumber,
                    TransferOrderLineId: lineData.data.items[0].TransferOrderLineId,
                    TransferOrderLineNumber: lineData.data.items[0].TransferOrderLineNumber,
                    transferSupplyUrl: lineData.data.items[0].links.find((f) => { return f.name == "transferSupply"; }).href,
                    getToDetailsResponse: lineData.status,
                };
                //console.log('SupplyOrderReferenceLineNumber', Number(transferSupplyObj.SupplyOrderReferenceLineNumber))
                await dataaccess.Update(T_TransferOrderItems, val, {
                    Seq9: Number(e.Seq9),
                });
            } else {
                let val = {
                    transferSupplyUrl: e.transferSupplyUrl,
                    getToDetailsResponse: lineData.status,
                };
                await dataaccess.Update(T_TransferOrderItems, val, {
                    Seq9: Number(e.Seq9),
                });
            }
        })

        await Promise.all(promiseAr)
    } catch (error) {
        throw new Error(error)
    }

}

  async function getMaxSeqIdTransferOrderItems() {
    const AssetDetails = datamodel.T_TransferOrderItems();

    var param = {
      attributes: [
        [Sequelize.fn("MAX", Sequelize.col("Seq7")), "Seq4"],
        [Sequelize.fn("MAX", Sequelize.col("Seq8")), "Seq8"],
        [Sequelize.fn("MAX", Sequelize.col("Seq9")), "Seq9"],
      ],
      raw: true,
    };
    try {
      let data = await dataaccess.FindOne(AssetDetails, param);
      return data;
    } catch (error) {
      return error;
    }
  }

  async function TransferOrderMethodAPI(request,sequence,ModifiedDate,transferLocation) 
  {
    return new Promise(async (resolve, reject) => {
      try {
      console.log("TransferMethodAPI Started");
      let requestBody = request;
      console.log("requestBodyapprove",requestBody);
      let M_TransferOrder = datamodel.M_TransferOrder();
      let T_TransferOrderItems = datamodel.T_TransferOrderItems();
      let Seqeuence7;
      let Seqeuence8;
      let Seqeuence9;
      let sequencedata = sequence;
      let date = new Date();
      let tData = await dataaccess.FindOne(M_TransferOrder, {
        where: { TransferOrder_ID: requestBody.Id },
      });
      console.log('tData', tData)
      if (tData.getToDetailsResponse == 400 || tData.getToDetailsResponse == null ) 
      {
        if (tData.getToDetailsResponse == 400) 
        {
          let transferOrderItemsData = await dataaccess.FindAll(
            T_TransferOrderItems,
            { where: { TransferOrder_ID: requestBody.Id } }
          );
          Seqeuence7 = transferOrderItemsData[0].Seq7;
          Seqeuence8 = transferOrderItemsData[0].Seq8;
          Seqeuence9 = transferOrderItemsData[0].Seq9;
        } 
        else {
          Seqeuence7 = date.toISOString().slice(0, 10).split("-").join("") + Math.floor(Math.random() * 9000 + 1000);
          Seqeuence8 = sequencedata.Seq8 != null ? sequencedata.Seq8 + 1 : configuration.transferMoveOrderData.SequenceData.Seqeuence8;
          Seqeuence9 = sequencedata.Seq9 != null ? sequencedata.Seq9 : configuration.transferMoveOrderData.SequenceData.Seqeuence9;
      }
      } 
      else {
         // console.log("Sleep mode");
                    // await sleep(60000);
                    console.log("callSupplyLineApi calling!!");
                    let res = await callSupplyLineApi(tData.SupplyOrderReferenceNumber);
                    // console.log('resssssssssss', res)
                    resolve(res);
                    return;
      }

      let InterfaceSourceCode = configuration.transferMoveOrderData.HardCodedData.InterfaceSourceCode;
      let SupplyRequestStatus = configuration.transferMoveOrderData.HardCodedData.SupplyRequestStatus;
      let SupplyOrderSource = configuration.transferMoveOrderData.HardCodedData.SupplyOrderSource;
      let TransferCostCurrencyCode = configuration.transferMoveOrderData.HardCodedData.TransferCostCurrencyCode;
      let ProcessRequestFlag = configuration.transferMoveOrderData.HardCodedData.ProcessRequestFlag;
      let BackToBackFlag = configuration.transferMoveOrderData.HardCodedData.BackToBackFlag;
      let PreparerEmail = configuration.transferMoveOrderData.HardCodedData.PreparerEmail;
      let DeliverToRequesterEmail = configuration.transferMoveOrderData.HardCodedData.DeliverToRequesterEmail;
      let SupplyType = configuration.transferMoveOrderData.HardCodedData.SupplyType;
      let DestinationTypeCode;
      if (transferLocation == 1) {
        DestinationTypeCode = "INVENTORY";
      } else {
        DestinationTypeCode = "EXPENSE";
      }

      let transferOderItems = requestBody.supplyRequestLines;
      let list = [];
      transferOderItems.forEach(async (element) => {
        console.log("ModifiedDate", moment(ModifiedDate).format("YYYY-MM-DD"));
        Seqeuence9 = Seqeuence9 + 1;

        list.push({ 
          InterfaceBatchNumber: Seqeuence7, //Seq4
          SupplyOrderReferenceLineNumber: Seqeuence9, //Seq6
          SupplyOrderReferenceLineId: Seqeuence9, //HardCoded
          DestinationOrganizationCode: requestBody.DestinationOrganizationCode, 
          SourceOrganizationCode: requestBody.SourceOrganizationCode,
          DestinationSubinventoryCode: element.DestinationSubinventoryCode,
          SourceSubinventoryCode: element.SourceSubinventoryCode, 
          ItemNumber: element.ITEM_NUMBER,
          InterfaceSourceCode: InterfaceSourceCode, //HardCoded
          SupplyOrderSource: SupplyOrderSource, //HardCoded
          BackToBackFlag: BackToBackFlag, //HardCoded
          NeedByDate: moment(requestBody.SupplyRequestDate).format("YYYY-MM-DD"),
          Quantity: element.Transfer_Qty, 
          UOMCode: "EA",
          PreparerEmail: PreparerEmail, //HardCoded
          DeliverToRequesterEmail: DeliverToRequesterEmail, //HardCoded
          DestinationTypeCode: DestinationTypeCode, //HardCoded
          SupplyType: SupplyType, //HardCoded
          DestinationLocation: "MH-MUMB-LLBG-MCSN", //requestBody.DestinationOrganizationCode
        });

        console.log("Seqeuence99999999999", Seqeuence9, Seqeuence7);
        const T_TransferOrderItems = datamodel.T_TransferOrderItems();
        var values = {
          Seq7: Seqeuence7,
          Seq8: Seqeuence8,
          Seq9: Seqeuence9,
        };
        var param = {
          TransferOrderItem_ID: element.TransferOrderItem_ID,
        };
        await dataaccess.Update(T_TransferOrderItems, values, param);
      });
      var data = JSON.stringify({
        InterfaceSourceCode: InterfaceSourceCode, //HardCoded
        InterfaceBatchNumber: Seqeuence7, //Seq4
        SupplyRequestStatus: SupplyRequestStatus, //HardCoded
        SupplyRequestDate: moment(requestBody.SupplyRequestDate).format("YYYY-MM-DD"),
        SupplyOrderSource: SupplyOrderSource, //HardCoded
        SupplyOrderReferenceNumber: Seqeuence8, //Seq5
        SupplyOrderReferenceId: Seqeuence8, //HardCoded
        TransferCostCurrencyCode: TransferCostCurrencyCode, //HardCoded
        ProcessRequestFlag: ProcessRequestFlag, //HardCoded
        supplyRequestLines: list,
      });

      // var config = {
      //   method: configuration.transferMoveOrderData.configData.method,
      //   url: configuration.transferMoveOrderData.configData.url,
      //   headers: configuration.transferMoveOrderData.configData.headers,
      //   data: data,
      // };
      try {
        let response = await axiosApiCallHelper("post", configuration.transferMoveOrderData.configData.url, data);

        if (response.status == 201) 
        { 
          var values = {
            getToDetailsResponse: response.status,
            ModifiedDate: connect.sequelize.fn("NOW"),
            SupplyOrderReferenceNumber:
              response.data.SupplyOrderReferenceNumber,
          }; 

          await dataaccess.Update(M_TransferOrder, values, {
            TransferOrder_ID: requestBody.Id,
          });

          // console.log("Sleep mode");
          // await sleep(60000);
          console.log("1st Get API calling!!");
          let res = await callSupplyLineApi(response.data.SupplyOrderReferenceNumber);
          resolve(res);

          //});
        } 
        else 
        {
          console.log("Statusssssssss", response.status);
          await dataaccess.Update(M_TransferOrder, values, {TransferOrder_ID: requestBody.Id,});
          resolve(0);
        }
      } catch (error) {
        console.log("error response", error);
        dataconn.errorlogger(
          "TransactionService",
          "Transfer Move Order Promise.all Error",
          error
        );
        // console.log("error response data",error.response.data);
        if (error.response) {
          if (error.response.status == 400) {
            dataconn.apiResponselogger(
              "Transfer Move Order",
              0,
              0,
              error.response.status,
              error.response.data,
              1
            );
          }
        }
        reject(0);
      }
    } catch (err) {
      throw new Error(err)
  }
    });
  }
  async function updateLineItemData(lineItemsData) {
     
    try {
      let M_TransferOrder = datamodel.M_TransferOrder();
      let T_TransferOrderItems = datamodel.T_TransferOrderItems();
        console.log("$$$$$$$$$$$$$ Updating Line Itemsss $$$$$$$$$$$$$$",lineItemsData);
       
        let lineTrackingStatus = 1;
        
        let promiseAr = lineItemsData.map(async e => {
          console.log("Mapppppppppppppppppppp");
            let transferSupplyObj = e.links.find((f) => { return f.name == "transferSupply"; });
            console.log("transferSupplyObjjjjjj",transferSupplyObj.href)
            let lineData = await axiosApiCallHelper("GET", transferSupplyObj.href, null)
            console.log("linedataaaaaa",lineData.status);
            if (lineData.status == 200) {
                console.log("updating Line Details", lineData.data.items[0]);
                if (lineData.data.items[0].SupplyTrackingLineStatus == "NOT_STARTED") 
                {

                    lineData = await axiosApiCallHelper("GET", transferSupplyObj.href, null)
                }
                console.log("SupplyTrackingLineStatus :", lineData.data.items[0].SupplyTrackingLineStatus);
                if (lineData.status == 200 && lineData.data.items[0].SupplyTrackingLineStatus == "DOS_COMPLETE") {

                    let val1 = {
                        TransferOrderHeaderId: lineData.data.items[0].TransferOrderHeaderId,
                        TransferOrderHeaderNumber: lineData.data.items[0].TransferOrderHeaderNumber,
                        TransferOrderLineId: lineData.data.items[0].TransferOrderLineId,
                        TransferOrderLineNumber: lineData.data.items[0].TransferOrderLineNumber,
                        transferSupplyUrl: transferSupplyObj.href,
                        getToDetailsResponse: lineData.status,
                    };
                    console.log("SupplyOrderReferenceLineNumber 1", Number(e.SupplyOrderReferenceLineNumber)
                    );
                    await dataaccess.Update(T_TransferOrderItems, val1, { Seq9: Number(e.SupplyOrderReferenceLineNumber), });
                }
                else {
                    lineTrackingStatus = 0;
                }
            }
            else {
                let val = {
                    transferSupplyUrl: transferSupplyObj.href,
                    getToDetailsResponse: lineData.status,
                };
                await dataaccess.Update(T_TransferOrderItems, val, {
                    Seq9: Number(e.SupplyOrderReferenceLineNumber),
                });
            }
        })

        await Promise.all(promiseAr)
        return lineTrackingStatus;
    }
    catch (error) {
      console.log("promiseAr-err", error);
        throw new Error(error)

    }
}

  async function createReservationAndUpdateLineItem(itemsData,transOrderItemStatusData) {
    try {
        console.log("$$$$$$$$$$$$$ Calling reservation items Apis $$$$$$$$$$$$$$$$$$$")
        let T_TransferOrderItems = datamodel.T_TransferOrderItems();
     
        let promiseAr = itemsData.map(async e => {
            let transferSupplyObj = e.links.find((f) => { return f.name == "transferSupply"; });
            let lineData = await axiosApiCallHelper("GET", transferSupplyObj.href, null)
            console.log("e-Data:",e.Seq9);
            console.log("e.SupplyOrderReferenceLineNumber:",e.SupplyOrderReferenceLineNumber);
            if (lineData.status == 200) {
                //let Data = transOrderItemStatusData.find(e => { return e.Seq9 == Number(result.items[i].SupplyOrderReferenceLineNumber) })
                let Data = transOrderItemStatusData.find((g) => {
            
                    return (
                        g.Seq9 == Number(e.SupplyOrderReferenceLineNumber)
                    );
                });
                let requestBody = {
                    OrganizationCode:
                        lineData.data.items[0].SourceOrganizationCode.trim(),
                    ItemNumber: lineData.data.items[0].ItemNumber,
                    DemandSourceType: "Transfer order",
                    DemandSourceHeaderNumber:
                        lineData.data.items[0].TransferOrderHeaderNumber, // Number(Data.TransferOrderHeaderNumber),
                    DemandSourceLineNumber:
                        lineData.data.items[0].TransferOrderLineNumber, //1,//Number(Data.TransferOrderLineNumber),
                    SupplySourceTypeId: 13,
                    SupplySourceType: "On hand",
                    SubinventoryCode: Data.From_SUBINVENTORY.trim(), //"RM", //lineData.data.items[0].SourceSubinventoryCode,
                    LotNumber: Data.LOT_NUMBER.trim(), //"DL10700001",//e.LOT_NUMBER,// //,
                    Locator: Data.Locator.trim() + "...", //Data.Locator.rep,
                    ReservationQuantity: Data.Transfer_Qty,
                    ReservationUOMCode: e.UOMCode.trim(),
                    RequirementDate: new Date().toISOString().slice(0, 10),
                };

                console.log(`requestBody`, requestBody);
                let res = await axiosApiCallHelper("POST", "https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryReservations", requestBody)

                if (res.status == 201) {
                    await dataaccess.Update(
                        T_TransferOrderItems,
                        { ReservationId: res.data.ReservationId },
                        {
                            Seq9: e.SupplyOrderReferenceLineNumber,
                        }
                    );
                }
            }
        })
        await Promise.all(promiseAr)
    } catch (error) {
      console.log("Promise-err", error);
        throw new Error(error)
    }
}

  async function callSupplyLineApi(supplyOrderReferenceNumber) {
    let supplyLineUrl =   configuration.SupplyOrderLinesAPI.configData.url;
    let appendurl = supplyOrderReferenceNumber + "/child/supplyOrderLines";
    supplyLineUrl += appendurl;
    console.log(
      "supplyOrderReferenceNumberrrrrrrrrrrrrrrr",
      supplyOrderReferenceNumber
    );
    console.log("supplyLineUrl :", supplyLineUrl);

    let responseSupplyLine = await axios({
      method: configuration.SupplyOrderLinesAPI.configData.method,
      url: supplyLineUrl ,//'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/supplyRequests/80000030/child/supplyOrderLines',
      headers: configuration.SupplyOrderLinesAPI.configData.headers
    });
    //  await sleep(20000);
    console.log("supplyurl res", responseSupplyLine.data.count);
    return responseSupplyLine.data;

  }

  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  router.route('/CancelTransferAPI')
        .post(async (req, res) => {   
             try {         
                await TransferOrderCancelAPI(req.body)  
                res.status(200).json({ Success: true, Message: 'Transfer Order Cancelled Successfully', Data: null });            

            } catch (error) {
                console.log("error", error); 
                res.status(200).json({ Success: false, Message: 'Transfer Order not Cancelled Successfully', Data: null });            
            }
        })

  async function TransferOrderCancelAPI(request) {
    return new Promise((resolve, reject) => {
        console.log("TransferOrderCancelAPI Started")

        let requestBody = request;
        console.log("requestBodystart",requestBody);
        
        let transferOrderLinesItems = requestBody.transferOrderLines;
        let list = [];
        transferOrderLinesItems.forEach(async (element) => {
            list.push({
                "LineId": element.TransferOrderLineId, 
                "Action": "CANCEL",
             }); 
        });
        var data = JSON.stringify({           
            "transferOrderLines": list 
        });

        // var config = {
        //     method: configuration.CancelOrderAPI.configData.method,
        //     //'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/transferOrders/'+ requestBody.transferOrderLines.TransferOrderHeaderNumber,'
        //     url: configuration.CancelOrderAPI.configData.url+ requestBody.transferOrderLines.TransferOrderHeaderNumber,
        //     headers: configuration.CancelOrderAPI.configData.headers,
        //       data: data
        // };
        var config = {

          method: 'get',

          url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/transferOrders/'+ requestBody.transferOrderLines[0].TransferOrderHeaderNumber,

          headers: {

            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',

            'Content-Type': 'application/json'

          },

        
          data: data

      };

        console.log("Transfer Cancel Done - ", data)

        axios(config)
            .then(async function (response) {   
              console.log("response.status",response.status)

                if (response.status == 200 || response.status == 201 ) {
                   const M_TransferOrder = datamodel.M_TransferOrder();
                    var values = {
                        StatusId: 5,
                        TransferCancelStatus :response.status,
                    };                   
                    var param = {
                      TransferOrderHeaderNumber: requestBody.transferOrderLines.TransferOrderHeaderNumber, 
                    };
                    await dataaccess.Update(M_TransferOrder, values, param)

                   resolve();
                    
                }
                else {
                  const M_TransferOrder = datamodel.M_TransferOrder();
                  var values = {              
                      TransferCancelStatus :response.status,
                  };                   
                  var param = {
                    TransferOrderHeaderNumber: requestBody.transferOrderLines.TransferOrderHeaderNumber,                       
                  };
                  await dataaccess.Update(M_TransferOrder, values, param)
                  dataconn.apiResponselogger('Transfer Cancel Order', 0, 0, error.response.status, error.response.data, 1);              
                }
            }) .catch(function (error) {
              console.log("error 4", error);        
              
               dataconn.errorlogger('TransferingOrderService', 'Transfer Move Order Promise.all Error ', error);
              

              if (error.response) {
             
                dataconn.apiResponselogger('TransferingOrderService',  requestBody.transferOrderLines.TransferOrderHeaderNumber, 0, error.response.status, error.response.data, 1);
                 
              }
              reject();
          });          
    });
}
async function axiosApiCallHelper(method, url, data) {

  try {

      let res = await axios({

          method: method,

          url: url,

          data: data,

          headers: configuration.transferMoveOrderData.configData.headers

      })
      console.log("urlllllllllllllllllllllllllllllllllll",url,res.status);
     
      return res
    

  } catch (error) {

      throw new Error(error);

  }



}



  return router;
};

module.exports = routes;
