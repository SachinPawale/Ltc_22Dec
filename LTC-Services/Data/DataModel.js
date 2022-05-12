var connect = require("./Connect");

var sequelize = connect.sequelize;
var Sequelize = connect.Sequelize;
const Model = connect.Sequelize.Model;

// Log Tables
class ErrorLog extends Model { }
class MailLog extends Model { }
//class CronService extends Model { }

//User Management
class UserMst extends Model { }
class RoleMst extends Model { }
class UserRoleMap extends Model { }
class UIRoleMap extends Model { }
class UIMst extends Model { }

// class StateMst extends Model { }
// class CityMst extends Model { }
// class PincodeMst extends Model { }
// class BankMst extends Model { }
// class BranchMst extends Model { }

class famiscmaster extends Model { }
class famiscmaster1 extends Model { }
class Asset extends Model { }
class AssetDetails extends Model { }
class OrganizationDetails extends Model { }
class LocationDetails extends Model { }
class SubInventoryDetails extends Model { }
//class EntityMaster extends Model { }
//class CurrencyMaster extends Model { }
class ApiResponseDetail extends Model { }

class rmomaster extends Model { }

class AssetHistory extends Model { }
class AssetDetailsHistory extends Model { }

class BoEEntry extends Model { }
class BoEMasterDetails extends Model { }
class PortMaster extends Model { }

class UserJourney extends Model { }
class BoEDetails extends Model { }
class BoEDetailsMap extends Model { }

class HSNMaster extends Model { }

class POCostReport extends Model { }
class SchedulerLogger extends Model { }

class Masterschedulerdetails extends Model { }

class BankingInmst extends Model { }
class BankAccountMst extends Model { }

class TDSGST extends Model { }

class BoE extends Model { }
class BoEMap extends Model { }

////#region Tables
// module.exports.CurrencyMaster = function () {
//     CurrencyMaster.init({
//         Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         CurrencyCode: { type: Sequelize.INTEGER, allowNull: true },
//         CurrencyName: { type: Sequelize.NUMERIC, allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedOn: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedOn: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "CurrencyMaster",
//         tableName: "CurrencyMaster",
//     });
//     return CurrencyMaster;
// };

// module.exports.EntityMaster = function () {
//     EntityMaster.init({
//         Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         EntityCode: { type: Sequelize.INTEGER, allowNull: true },
//         EntityName: { type: Sequelize.STRING(100), allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedOn: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedOn: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "EntityMaster",
//         tableName: "EntityMaster",
//     });
//     return EntityMaster;
// };

module.exports.OrganizationDetails = function () {
    OrganizationDetails.init({
        //Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        OrganizationId: { type: Sequelize.STRING(200), primaryKey: true, autoIncrement: false, allowNull: true },
        OrganizationCode: { type: Sequelize.STRING(200), allowNull: true },
        OrganizationName: { type: Sequelize.STRING(200), allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

    }, {
        sequelize,
        modelName: 'OrganizationDetails',
        tableName: 'OrganizationDetails',
    });

    return OrganizationDetails;

}

module.exports.LocationDetails = function () {
    LocationDetails.init({
        // LocationCode: { type: Sequelize.STRING(200), primaryKey: true, autoIncrement: false, allowNull: true },
        // LocationName: { type: Sequelize.STRING(200), allowNull: true },
        // InventoryOrganizationId: { type: Sequelize.STRING(200), allowNull: true },

        LocationId: { type: Sequelize.DOUBLE, allowNull: true },
        LocationCode: { type: Sequelize.STRING(200), primaryKey: true, autoIncrement: false, allowNull: true },
        LocationName: { type: Sequelize.STRING(200), allowNull: true },
        EffectiveStartDate: { type: Sequelize.DATE, allowNull: true },
        EffectiveEndDate: { type: Sequelize.DATE, allowNull: true },
        ActiveStatus: { type: Sequelize.STRING, allowNull: true },
        ActiveStatusMeaning: { type: Sequelize.STRING, allowNull: true },
        SetId: { type: Sequelize.INTEGER, allowNull: true },
        SetCode: { type: Sequelize.STRING(200), allowNull: true },
        Description: { type: Sequelize.STRING(500), allowNull: true },
        SetName: { type: Sequelize.STRING(200), allowNull: true },
        InventoryOrganizationId: { type: Sequelize.STRING, allowNull: true },
        InventoryOrganizationName: { type: Sequelize.STRING, allowNull: true },
        ShipToSiteFlag: { type: Sequelize.BOOLEAN, allowNull: true },
        ShipToLocationId: { type: Sequelize.DOUBLE, allowNull: true },
        ShipToLocationCode: { type: Sequelize.STRING(200), allowNull: true },
        ShipToLocationName: { type: Sequelize.STRING(200), allowNull: true },
        OfficeSiteFlag: { type: Sequelize.BOOLEAN, allowNull: true },
        BillToSiteFlag: { type: Sequelize.BOOLEAN, allowNull: true },
        ReceivingSiteFlag: { type: Sequelize.BOOLEAN, allowNull: true },
        DesignatedReceiverId: { type: Sequelize.STRING, allowNull: true },
        DesignatedReceiverNumber: { type: Sequelize.STRING, allowNull: true },
        DesignatedReceiverName: { type: Sequelize.STRING, allowNull: true },
        CreatedBy: { type: Sequelize.STRING(100), allowNull: true },
        CreationDate: { type: Sequelize.DATE, allowNull: true },
        LastUpdatedBy: { type: Sequelize.STRING(100), allowNull: true },
        LastUpdatedBy: { type: Sequelize.STRING(100), allowNull: true },
        LastUpdateDate: { type: Sequelize.DATE, allowNull: true },

    }, {
        sequelize,
        modelName: 'LocationDetails',
        tableName: 'LocationDetails',
    });

    return LocationDetails;

}

module.exports.Asset = function () {
    Asset.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        SerialNumber: { type: Sequelize.STRING(10), allowNull: true },
        ReceiptNumber: { type: Sequelize.STRING(20), allowNull: true },
        AssetType: { type: Sequelize.STRING(200), allowNull: true },
        OrganizationId: { type: Sequelize.STRING(200), allowNull: true },
        LocationCode: { type: Sequelize.STRING(200), allowNull: true },
        InterfaceBatchNumber: { type: Sequelize.STRING(100), allowNull: true },
        TransactionDate: { type: Sequelize.DATE, allowNull: true },
        DesORGCode: { type: Sequelize.STRING(200), allowNull: true },
        DesTypeCode: { type: Sequelize.STRING(200), allowNull: true },
        Locator: { type: Sequelize.STRING(200), allowNull: true },
        DesSubInventoryCode: { type: Sequelize.STRING(200), allowNull: true },
        DesSubInventoryName: { type: Sequelize.STRING(200), allowNull: true },
        DFFS: { type: Sequelize.STRING(150), allowNull: true },
        EntityCode: { type: Sequelize.STRING(100), allowNull: true },
        CurrencyCode: { type: Sequelize.STRING(100), allowNull: true },
        FromLocation : { type: Sequelize.STRING(200), allowNull: true },
        ToLocationWithSiteCode : { type: Sequelize.STRING(200), allowNull: true },
        StatusId: { type: Sequelize.INTEGER, allowNull: true },
        Remarks: { type: Sequelize.STRING(200), allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'Asset',
        tableName: 'Asset',
    });

    exports.AssetDetails();
    Asset.hasMany(AssetDetails, { foreignKey: "AssetId" });

    exports.OrganizationDetails();
    Asset.belongsTo(OrganizationDetails, { foreignKey: "OrganizationId", constraints: false });

    exports.LocationDetails();
    Asset.belongsTo(LocationDetails, { foreignKey: "LocationCode", constraints: false });

    return Asset;
}

module.exports.AssetDetails = function () {
    AssetDetails.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        AssetId: { type: Sequelize.INTEGER, allowNull: true },
        AssetNumber: { type: Sequelize.INTEGER, allowNull: true },
        AssetDesc: { type: Sequelize.STRING(500), allowNull: true },
        Cost: { type: Sequelize.DOUBLE, allowNull: true },
        LTD_DEP: { type: Sequelize.DOUBLE, allowNull: true },
        NBV: { type: Sequelize.DOUBLE, allowNull: true },
        AssertQuantity: { type: Sequelize.INTEGER, allowNull: true },
        Item: { type: Sequelize.STRING(100), allowNull: true },
        ItemDesc: { type: Sequelize.STRING(500), allowNull: true },
        UnitOfMeasure: { type: Sequelize.STRING(100), allowNull: true },
        Location: { type: Sequelize.STRING(100), allowNull: true },

        LotNumber: { type: Sequelize.TEXT, allowNull: true },
        SupplierCode: { type: Sequelize.STRING(200), allowNull: true },

        Seq1: { type: Sequelize.BIGINT, allowNull: true },
        Seq2: { type: Sequelize.BIGINT, allowNull: true },
        Seq3: { type: Sequelize.BIGINT, allowNull: true },
        Seq4: { type: Sequelize.BIGINT, allowNull: true },
        Seq5: { type: Sequelize.BIGINT, allowNull: true },
        //ApiSeq5: { type: Sequelize.STRING(15), allowNull: true },
        Seq6: { type: Sequelize.BIGINT, allowNull: true },

        TransactionTypeName: { type: Sequelize.STRING(100), allowNull: true },
        TransactionMode: { type: Sequelize.INTEGER, allowNull: true },
        UseCurrentCostFlag: { type: Sequelize.STRING(100), allowNull: true },
        CostComponentCode: { type: Sequelize.STRING(100), allowNull: true },
        miscResponseStatus: { type: Sequelize.INTEGER, allowNull: true },
        transferResponseStatus: { type: Sequelize.INTEGER, allowNull: true },
        TransactionHeaderId: { type: Sequelize.BIGINT, allowNull: true },
        TransactionInterfaceId: { type: Sequelize.BIGINT, allowNull: true },
        DepartmentCode: { type: Sequelize.INTEGER, allowNull: true },
        LocationCode: { type: Sequelize.INTEGER, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'AssetDetails',
        tableName: 'AssetDetails',
    });

    // exports.Asset();
    // AssetDetails.belongsTo(Asset, { foreignKey: "AssetId" });

    return AssetDetails;
}

module.exports.ApiResponseDetail = function () {

    ApiResponseDetail.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ApiName: { type: Sequelize.STRING(100), allowNull: true },
        AsssetId: { type: Sequelize.INTEGER, allowNull: true },
        AssetNumber: { type: Sequelize.INTEGER, allowNull: true },
        API_ResponseStatusCode: { type: Sequelize.INTEGER, allowNull: true },
        API_ResponseData: { type: Sequelize.STRING(2000), allowNull: true },
        CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    }, {
        sequelize,
        modelName: "ApiResponseDetail",
        tableName: "ApiResponseDetail",
    });
    return ApiResponseDetail;
};

module.exports.ErrorLog = function () {
    ErrorLog.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        ServiceName: { type: Sequelize.STRING(100), allowNull: true },
        FunctionName: { type: Sequelize.STRING(100), allowNull: true },
        ErrorObject: { type: Sequelize.TEXT, allowNull: true },
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
    }, {
        sequelize,
        modelName: "ErrorLog",
        tableName: "ErrorLog",
    });
    return ErrorLog;
};


// module.exports.CronService = function () {
//     CronService.init({
//         Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
//         Code: { type: Sequelize.STRING(100), allowNull: true },
//         Desc: { type: Sequelize.STRING(2000), allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "CronService",
//         tableName: "CronService",
//     });
//     return CronService;
// };

module.exports.UIMst = function () {
    UIMst.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        ParentId: { type: Sequelize.INTEGER, allowNull: true },
        Title: { type: Sequelize.STRING(100), allowNull: true },
        Path: { type: Sequelize.STRING(2000), allowNull: true },
        Icon: { type: Sequelize.STRING(2000), allowNull: true },
        CssClass: { type: Sequelize.STRING(2000), allowNull: true },
        Sequence: { type: Sequelize.INTEGER, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        IsChild: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
    }, {
        sequelize,
        modelName: "UI",
        tableName: "UIMst",
    });
    exports.UIRoleMap();
    UIMst.hasMany(UIRoleMap);
    UIMst.belongsTo(UIRoleMap, { foreignKey: "Id", constraints: false });

    return UIMst;
};

module.exports.UserMst = function () {
    UserMst.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        LoginId: { type: Sequelize.STRING(100), allowNull: true },
        EmpCode: { type: Sequelize.STRING(100), allowNull: true },
        EmpName: { type: Sequelize.STRING(200), allowNull: true },
        EmailId: { type: Sequelize.STRING(100), allowNull: true },
        DefaultRoleId: { type: Sequelize.INTEGER, allowNull: true },
        Password: { type: Sequelize.STRING(100), allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        CreatedByRoleId: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedByRoleId: { type: Sequelize.BIGINT, allowNull: true },
    }, {
        sequelize,
        modelName: "User",
        tableName: "UserMst",
    });

    exports.UserRoleMap();
    UserMst.hasMany(UserRoleMap);
    UserMst.belongsTo(UserRoleMap, { foreignKey: "Id", constraints: false });

    return UserMst;
};

module.exports.UserRoleMap = function () {
    UserRoleMap.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        UserId: { type: Sequelize.INTEGER, allowNull: true },
        RoleId: { type: Sequelize.INTEGER, allowNull: true },
    }, {
        sequelize,
        modelName: "UserRole",
        tableName: "UserRoleMap",
    });

    exports.RoleMst();
    UserRoleMap.belongsTo(RoleMst, { foreignKey: "RoleId" });

    return UserRoleMap;
};

module.exports.RoleMst = function () {
    RoleMst.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        Code: { type: Sequelize.STRING(100), allowNull: true },
        Desc: { type: Sequelize.STRING(2000), allowNull: true },
        IsCentralAccess: { type: Sequelize.BOOLEAN, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        CreatedByRoleId: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedByRoleId: { type: Sequelize.BIGINT, allowNull: true },
    }, {
        sequelize,
        modelName: "Role",
        tableName: "RoleMst",
    });

    return RoleMst;
};

module.exports.UIRoleMap = function () {
    UIRoleMap.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        UIId: { type: Sequelize.INTEGER, allowNull: true },
        RoleId: { type: Sequelize.INTEGER, allowNull: true },
        Viewer: { type: Sequelize.BOOLEAN, allowNull: true },
        Maker: { type: Sequelize.BOOLEAN, allowNull: true },
        Checker: { type: Sequelize.BOOLEAN, allowNull: true },
        Edit: { type: Sequelize.BOOLEAN, allowNull: true },
        Export: { type: Sequelize.BOOLEAN, allowNull: true },
        Upload: { type: Sequelize.BOOLEAN, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
        CreatedByRoleId: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedByRoleId: { type: Sequelize.BIGINT, allowNull: true },
    }, {
        sequelize,
        modelName: "UIRole",
        tableName: "UIRoleMap",
    });
    exports.RoleMst();
    UIRoleMap.belongsTo(RoleMst, { foreignKey: "RoleId" });

    return UIRoleMap;
};

// For State Master
// module.exports.StateMst = function () {
//     StateMst.init({
//         Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//         StateCode: { type: Sequelize.STRING(100), allowNull: true },
//         Desc: { type: Sequelize.STRING(2000), allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "State",
//         tableName: "StateMst",
//     });

//     return StateMst;
// };

// // For City Master
// module.exports.CityMst = function () {
//     CityMst.init({
//         Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//         CityCode: { type: Sequelize.STRING(100), allowNull: true },
//         Desc: { type: Sequelize.STRING(2000), allowNull: true },
//         StateID: { type: Sequelize.INTEGER, allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "City",
//         tableName: "CityMst",
//     });

//     exports.StateMst();
//     CityMst.belongsTo(StateMst, { foreignKey: "StateID" });

//     return CityMst;
// };

// // For Pincode Master
// module.exports.PincodeMst = function () {
//     PincodeMst.init({
//         Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//         Pincode: { type: Sequelize.STRING(100), allowNull: true },
//         Desc: { type: Sequelize.STRING(2000), allowNull: true },
//         StateID: { type: Sequelize.INTEGER, allowNull: true },
//         CityID: { type: Sequelize.INTEGER, allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "Pincode",
//         tableName: "PincodeMst",
//     });

//     exports.StateMst();
//     PincodeMst.belongsTo(StateMst, { foreignKey: "StateID" });

//     exports.CityMst();
//     PincodeMst.belongsTo(CityMst, { foreignKey: "CityID" });

//     return PincodeMst;
// };

// // For Bank Master
// module.exports.BankMst = function () {
//     BankMst.init({
//         Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//         Code: { type: Sequelize.STRING(100), allowNull: true },
//         Name: { type: Sequelize.STRING(100), allowNull: true },
//         ContactPerson: { type: Sequelize.STRING(100), allowNull: true },
//         ContactNumber: { type: Sequelize.STRING(100), allowNull: true },
//         Address1: { type: Sequelize.STRING(2000), allowNull: true },
//         Address2: { type: Sequelize.STRING(2000), allowNull: true },
//         Address3: { type: Sequelize.STRING(2000), allowNull: true },
//         //State: { type: Sequelize.STRING(100), allowNull: true },
//         //City: { type: Sequelize.STRING(100), allowNull: true },
//         StateID: { type: Sequelize.INTEGER, allowNull: true },
//         CityID: { type: Sequelize.INTEGER, allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "Bank",
//         tableName: "BankMst",
//     });

//     exports.StateMst();
//     BankMst.belongsTo(StateMst, { foreignKey: "StateID" });

//     exports.CityMst();
//     BankMst.belongsTo(CityMst, { foreignKey: "CityID" });

//     return BankMst;
// };

// // For Pincode Master
// module.exports.BranchMst = function () {
//     BranchMst.init({
//         Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
//         Branchcode: { type: Sequelize.STRING(100), allowNull: true },
//         Desc: { type: Sequelize.STRING(2000), allowNull: true },
//         BankID: { type: Sequelize.INTEGER, allowNull: true },
//         Address: { type: Sequelize.STRING(2000), allowNull: true },
//         IFSC: { type: Sequelize.STRING(100), allowNull: true },
//         IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
//         CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
//         CreatedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//         ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
//         ModifiedDate: {
//             type: Sequelize.DATE,
//             allowNull: true,
//             defaultValue: Sequelize.NOW,
//         },
//     }, {
//         sequelize,
//         modelName: "Branch",
//         tableName: "BranchMst",
//     });

//     exports.BankMst();
//     BranchMst.belongsTo(BankMst, { foreignKey: "BankID" });

//     return BranchMst;
// };

module.exports.famiscmaster = function () {
    famiscmaster.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        ASSET_ID: { type: Sequelize.INTEGER, allowNull: true },
        ASSET_NUMBER: { type: Sequelize.INTEGER, allowNull: true },
        ASSET_DESC: { type: Sequelize.STRING(500), allowNull: true },
        CURRENT_UNITS: { type: Sequelize.INTEGER, allowNull: true },
        COST: { type: Sequelize.DOUBLE, allowNull: true },
        DEPRN_RESERVE: { type: Sequelize.DOUBLE, allowNull: true },
        NBV: { type: Sequelize.DOUBLE, allowNull: true },
        LOCATION: { type: Sequelize.STRING(100), allowNull: true },
        ITEM_NUMBER: { type: Sequelize.STRING(100), allowNull: true },
        ITEM_DESC: { type: Sequelize.STRING(500), allowNull: true },
        ATTRIBUTE1: { type: Sequelize.STRING(200), allowNull: true },
        PRIMARY_UOM_CODEA: { type: Sequelize.STRING(100), allowNull: true },
        INVENTORY_ITEM_ID: { type: Sequelize.DOUBLE, allowNull: true },
        SUPPLIER_CODE: { type: Sequelize.STRING(200), allowNull: true },
        SUPPLIER_ITEM_DESC: { type: Sequelize.STRING(200), allowNull: true },
        DEPTARTMENT_CODE: { type: Sequelize.INTEGER, allowNull: true },
        LOCATION_CODE: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

    }, {
        sequelize,
        modelName: "famiscmaster",
        tableName: "famiscmaster",
    });
    return famiscmaster;
};

module.exports.famiscmaster1 = function () {
    famiscmaster1.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        ASSET_ID: { type: Sequelize.INTEGER, allowNull: true },
        ASSET_NUMBER: { type: Sequelize.INTEGER, allowNull: true },
        ASSET_DESC: { type: Sequelize.STRING(500), allowNull: true },
        CURRENT_UNITS: { type: Sequelize.INTEGER, allowNull: true },
        COST: { type: Sequelize.DOUBLE, allowNull: true },
        DEPRN_RESERVE: { type: Sequelize.DOUBLE, allowNull: true },
        NBV: { type: Sequelize.DOUBLE, allowNull: true },
        LOCATION: { type: Sequelize.STRING(100), allowNull: true },
        ITEM_NUMBER: { type: Sequelize.STRING(100), allowNull: true },
        ITEM_DESC: { type: Sequelize.STRING(500), allowNull: true },
        ATTRIBUTE1: { type: Sequelize.STRING(200), allowNull: true },
        PRIMARY_UOM_CODEA: { type: Sequelize.STRING(100), allowNull: true },
        INVENTORY_ITEM_ID: { type: Sequelize.DOUBLE, allowNull: true }
    }, {
        sequelize,
        modelName: "famiscmaster1",
        tableName: "famiscmaster1",
    });
    return famiscmaster1;
};

module.exports.MailLog = function () {
    MailLog.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        assetId: { type: Sequelize.BIGINT, allowNull: true },
        mailTo: { type: Sequelize.TEXT, allowNull: true },
        mailFrom: { type: Sequelize.TEXT, allowNull: true },
        mailCc: { type: Sequelize.TEXT, allowNull: true },
        mailSubject: { type: Sequelize.STRING(1000), allowNull: true },
        mailBody: { type: Sequelize.TEXT, allowNull: true },
        messageId: { type: Sequelize.STRING(100), allowNull: true },
        mailStatus: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    }, {
        sequelize,
        modelName: "MailLog",
        tableName: "MailLog",
    });
    return MailLog;
};

module.exports.SubInventoryDetails = function () {
    SubInventoryDetails.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        Description: { type: Sequelize.STRING(200), allowNull: true },
        OrganizationId: { type: Sequelize.STRING(200), allowNull: true },
        SecondaryInventoryName: { type: Sequelize.STRING(200), allowNull: true },
        OrganizationCode: { type: Sequelize.STRING(200), allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: true },
        CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.BIGINT, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true }
    }, {
        sequelize,
        modelName: 'SubInventoryDetails',
        tableName: 'SubInventoryDetails',
    });

    return SubInventoryDetails;

}

module.exports.rmomaster = function () {
    rmomaster.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        LINE_NUMBER: { type: Sequelize.INTEGER, allowNull: true },
        LOCATION_NAME: { type: Sequelize.TEXT, allowNull: true },
        INTERNAL_LOCATION_CODE: { type: Sequelize.TEXT, allowNull: true },
        ITEM_NUMBER: { type: Sequelize.TEXT, allowNull: true },
        PRIMARY_UOM_CODE: { type: Sequelize.TEXT, allowNull: true },
        INVT_ITEM_ID: { type: Sequelize.DOUBLE, allowNull: true },
        ITEM_DESC: { type: Sequelize.TEXT, allowNull: true },
        SUPPLIER_ITEM_DESC: { type: Sequelize.TEXT, allowNull: true },
        SUPPLIER_ITEM_CODE: { type: Sequelize.TEXT, allowNull: true },
        RECEIPT_NUM: { type: Sequelize.INTEGER, allowNull: true },
        TRN_QTY: { type: Sequelize.INTEGER, allowNull: true },
        LOT_NUMBER: { type: Sequelize.TEXT, allowNull: true },
        COST: { type: Sequelize.INTEGER, allowNull: true },
        DEPTARTMENT_CODE: { type: Sequelize.INTEGER, allowNull: true },
        LOCATION_CODE: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },

    }, {
        sequelize,
        modelName: "rmomaster",
        tableName: "rmomaster",
    });
    return rmomaster;
};

module.exports.AssetHistory = function () {
    AssetHistory.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        AssetId: { type: Sequelize.INTEGER, allowNull: true },
        SerialNumber: { type: Sequelize.STRING(10), allowNull: true },
        ReceiptNumber: { type: Sequelize.STRING(20), allowNull: true },
        AssetType: { type: Sequelize.STRING(200), allowNull: true },
        OrganizationId: { type: Sequelize.STRING(200), allowNull: true },
        LocationCode: { type: Sequelize.STRING(200), allowNull: true },
        InterfaceBatchNumber: { type: Sequelize.STRING(100), allowNull: true },
        TransactionDate: { type: Sequelize.DATE, allowNull: true },
        DesORGCode: { type: Sequelize.STRING(200), allowNull: true },
        DesTypeCode: { type: Sequelize.STRING(200), allowNull: true },
        Locator: { type: Sequelize.STRING(200), allowNull: true },
        DesSubInventoryCode: { type: Sequelize.STRING(200), allowNull: true },
        DesSubInventoryName: { type: Sequelize.STRING(200), allowNull: true },
        DFFS: { type: Sequelize.STRING(150), allowNull: true },
        EntityCode: { type: Sequelize.STRING(100), allowNull: true },
        CurrencyCode: { type: Sequelize.STRING(100), allowNull: true },
        FromLocation : { type: Sequelize.STRING(200), allowNull: true },
        ToLocationWithSiteCode : { type: Sequelize.STRING(200), allowNull: true },
        StatusId: { type: Sequelize.INTEGER, allowNull: true },
        Remarks: { type: Sequelize.STRING(200), allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'AssetHistory',
        tableName: 'AssetHistory',
    });

    return AssetHistory;

}

module.exports.AssetDetailsHistory = function () {
    AssetDetailsHistory.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        AssetId: { type: Sequelize.INTEGER, allowNull: true },
        AssetNumber: { type: Sequelize.INTEGER, allowNull: true },
        AssetDesc: { type: Sequelize.STRING(500), allowNull: true },
        Cost: { type: Sequelize.DOUBLE, allowNull: true },
        LTD_DEP: { type: Sequelize.DOUBLE, allowNull: true },
        NBV: { type: Sequelize.DOUBLE, allowNull: true },
        AssertQuantity: { type: Sequelize.INTEGER, allowNull: true },
        Item: { type: Sequelize.STRING(100), allowNull: true },
        ItemDesc: { type: Sequelize.STRING(500), allowNull: true },
        UnitOfMeasure: { type: Sequelize.STRING(100), allowNull: true },
        Location: { type: Sequelize.STRING(100), allowNull: true },
        LotNumber: { type: Sequelize.TEXT, allowNull: true },
        SupplierCode: { type: Sequelize.STRING(200), allowNull: true },
        Seq1: { type: Sequelize.BIGINT, allowNull: true },
        Seq2: { type: Sequelize.BIGINT, allowNull: true },
        Seq3: { type: Sequelize.BIGINT, allowNull: true },
        Seq4: { type: Sequelize.BIGINT, allowNull: true },
        Seq5: { type: Sequelize.BIGINT, allowNull: true },
        //ApiSeq5: { type: Sequelize.STRING(15), allowNull: true },
        Seq6: { type: Sequelize.BIGINT, allowNull: true },
        TransactionTypeName: { type: Sequelize.STRING(100), allowNull: true },
        TransactionMode: { type: Sequelize.INTEGER, allowNull: true },
        UseCurrentCostFlag: { type: Sequelize.STRING(100), allowNull: true },
        CostComponentCode: { type: Sequelize.STRING(100), allowNull: true },
        miscResponseStatus: { type: Sequelize.INTEGER, allowNull: true },
        transferResponseStatus: { type: Sequelize.INTEGER, allowNull: true },
        TransactionHeaderId: { type: Sequelize.BIGINT, allowNull: true },
        TransactionInterfaceId: { type: Sequelize.BIGINT, allowNull: true },
        DepartmentCode: { type: Sequelize.INTEGER, allowNull: true },
        LocationCode: { type: Sequelize.INTEGER, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'AssetDetailsHistory',
        tableName: 'AssetDetailsHistory',
    });

    return AssetDetailsHistory;
}

module.exports.BoEEntry = function () {
    BoEEntry.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        BoENumber: { type: Sequelize.STRING(200), allowNull: true },
        BoEDate: { type: Sequelize.DATE, allowNull: true },
        BoEExchangeRate: { type: Sequelize.DOUBLE, allowNull: true },

        BoEBCD: { type: Sequelize.DOUBLE, allowNull: true },
        BoESWS: { type: Sequelize.DOUBLE, allowNull: true },
        BoEIGST: { type: Sequelize.DOUBLE, allowNull: true },

        BoETotalAmount: { type: Sequelize.DOUBLE, allowNull: true },

        HAWB: { type: Sequelize.STRING(200), allowNull: true },
        SupplierInvoiceNumber: { type: Sequelize.STRING(200), allowNull: true },
        //ShipmentNumber: { type: Sequelize.STRING(200), allowNull: true },
        ChallanNumber: { type: Sequelize.STRING(200), allowNull: true },
        PONumber: { type: Sequelize.STRING(200), allowNull: true },
        EntityCode : { type: Sequelize.INTEGER, allowNull: true },
        VendorID: { type: Sequelize.DOUBLE, allowNull: true },
        VendorName: { type: Sequelize.STRING(200), allowNull: true },
        VendorSiteCode: { type: Sequelize.TEXT, allowNull: true }, 
        PortCode: { type: Sequelize.STRING(200), allowNull: true },
        PortDesc: { type: Sequelize.STRING(200), allowNull: true },

        InvoiceId: { type: Sequelize.DOUBLE, allowNull: true },


        StatusId: { type: Sequelize.INTEGER, allowNull: true },
        BoEDetailsCreated: { type: Sequelize.INTEGER, allowNull: true },
        FileName: { type: Sequelize.STRING(200), allowNull: true },
        FilePath: { type: Sequelize.STRING(200), allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'BoEEntry',
        tableName: 'BoEEntry',
    });

    return BoEEntry;
}

module.exports.BoEMasterDetails = function () {
    BoEMasterDetails.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        
        PO_HEADER_ID: { type: Sequelize.BIGINT, allowNull: true },

        VENDOR_NAME: { type: Sequelize.TEXT, allowNull: true },
        VENDOR_NUMBER: { type: Sequelize.INTEGER, allowNull: true },
        VENDOR_SITE_CODE: { type: Sequelize.TEXT, allowNull: true },
        VENDOR_SITE_ID: { type: Sequelize.BIGINT, allowNull: true },
        VENDOR_ID: { type: Sequelize.BIGINT, allowNull: true },
        PO_NUMBER: { type: Sequelize.TEXT, allowNull: true },
        DOCUMENT_STATUS: { type: Sequelize.TEXT, allowNull: true },
        TYPE_LOOKUP_CODE: { type: Sequelize.TEXT, allowNull: true },
        CURRENCY_CODE: { type: Sequelize.TEXT, allowNull: true },
        APPROVED_FLAG: { type: Sequelize.TEXT, allowNull: true },
        COMMENTS: { type: Sequelize.TEXT, allowNull: true },
        LINE_STATUS: { type: Sequelize.TEXT, allowNull: true },
        LINE_NUM: { type: Sequelize.INTEGER, allowNull: true },
        ITEM_ID: { type: Sequelize.BIGINT, allowNull: true },
        ITEM_NUMBER: { type: Sequelize.TEXT, allowNull: true },
        ITEM_DESCRIPTION: { type: Sequelize.TEXT, allowNull: true },
        UOM_CODE: { type: Sequelize.TEXT, allowNull: true },
        UNIT_PRICE: { type: Sequelize.INTEGER, allowNull: true },
        LINE_QTY: { type: Sequelize.INTEGER, allowNull: true },
        CANCEL_FLAG: { type: Sequelize.TEXT, allowNull: true },
        VENDOR_PRODUCT_NUM: { type: Sequelize.TEXT, allowNull: true },
        DESTINATION_TYPE_CODE: { type: Sequelize.TEXT, allowNull: true },
        DISTRI_STATUS: { type: Sequelize.TEXT, allowNull: true },
        QUANTITY: { type: Sequelize.INTEGER, allowNull: true },
        QUANTITY_RECEIVED: { type: Sequelize.INTEGER, allowNull: true },
        QUANTITY_ACCEPTED: { type: Sequelize.INTEGER, allowNull: true },
        QUANTITY_REJECTED: { type: Sequelize.INTEGER, allowNull: true },
        QUANTITY_BILLED: { type: Sequelize.INTEGER, allowNull: true },
        QUANTITY_CANCELLED: { type: Sequelize.INTEGER, allowNull: true },
        SHIPMENT_NUM: { type: Sequelize.INTEGER, allowNull: true },
        MATCH_OPTION: { type: Sequelize.TEXT, allowNull: true },
        DEPT: { type: Sequelize.INTEGER, allowNull: true },
        LOCATION: { type: Sequelize.INTEGER, allowNull: true },
        DEST_TYPE: { type: Sequelize.TEXT, allowNull: true },
        BAL_QTY: { type: Sequelize.INTEGER, allowNull: true },
        ENTITY_CODE: { type: Sequelize.INTEGER, allowNull: true },
        ENTITY_DESC: { type: Sequelize.TEXT, allowNull: true },
        FIRST_PARTY_REGN_NUMBER: { type: Sequelize.TEXT, allowNull: true },
        ACC_CODE: { type: Sequelize.TEXT, allowNull: true },
        ACCOUNT_DESC: { type: Sequelize.TEXT, allowNull: true },
        BCD_PERCENT: { type: Sequelize.INTEGER, allowNull: true },
        SWS_PERCENT:{ type: Sequelize.INTEGER, allowNull: true },

        ASN_NO: { type: Sequelize.TEXT, allowNull: true },
        RCPT_LINE_NUM: { type: Sequelize.BIGINT, allowNull: true },
        ASN_QTY_SHIP: { type: Sequelize.BIGINT, allowNull: true },
        HSN_CODE: { type: Sequelize.BIGINT, allowNull: true },
        SUPPLIER_ITEM_DESC: { type: Sequelize.TEXT, allowNull: true },
        SUPPLIER_ITEM_CODE: { type: Sequelize.TEXT, allowNull: true },
        ORGANIZATION_CODE:{ type: Sequelize.TEXT, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },


    },
        {
            sequelize,
            modelName: 'BoEMasterDetails',
            tableName: 'BoEMasterDetails',
        });

    return BoEMasterDetails;
}

module.exports.PortMaster = function () {
    PortMaster.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        Code: { type: Sequelize.TEXT, allowNull: true },
        Desc: { type: Sequelize.TEXT, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'PortMaster',
        tableName: 'PortMaster',
    });

    return PortMaster;
}

module.exports.UserJourney = function () {
    UserJourney.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        UserId: { type: Sequelize.STRING(100), allowNull: false },
        EventName: { type: Sequelize.STRING(200), allowNull: true },
        RequestBody: { type: Sequelize.STRING(1000), allowNull: true },
        ResponseBody: { type: Sequelize.STRING(100), allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
    },
        {
            sequelize,
            modelName: "UserJourney",
            tableName: "UserJourney",
        });

    return UserJourney;
};
// BoDetails User Data start

module.exports.BoEDetails = function () {
    BoEDetails.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        BoENumber: { type: Sequelize.STRING(200), allowNull: true },
        VendorID: { type: Sequelize.DOUBLE, allowNull: true },
        VendorName: { type: Sequelize.STRING(200), allowNull: true }, 
        VendorSiteCode: { type: Sequelize.TEXT, allowNull: true }, 
        PONumber: { type: Sequelize.TEXT, allowNull: true },
        BoEShipmentNumber:{ type: Sequelize.TEXT, allowNull: true },
        BoEHAWB: { type: Sequelize.STRING(200), allowNull: true },
        BoEExchangeRate: { type: Sequelize.INTEGER, allowNull: true },
        BoETotalAmount: { type: Sequelize.DOUBLE, allowNull: true },
        TotalInvoiceAmount: { type: Sequelize.DOUBLE, allowNull: true },
        TotalGSTAmount: { type: Sequelize.DOUBLE, allowNull: true },
        TotalInvoiceAmountWithGST: { type: Sequelize.DOUBLE, allowNull: true },
        RecieptDate: { type: Sequelize.DATE, allowNull: true },
        RecieptNumber: { type: Sequelize.BIGINT, allowNull: true },
        InvoiceId: { type: Sequelize.BIGINT, allowNull: true },
        StatusId: { type: Sequelize.INTEGER, allowNull: true },
        ReceitAPIResponse: { type: Sequelize.INTEGER, allowNull: true },
        StandardInvoiceAPIResponse: { type: Sequelize.INTEGER, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'BoEDetails',
        tableName: 'BoEDetails',
    });

    exports.BoEDetailsMap();
    BoEDetails.hasMany(BoEDetailsMap, { foreignKey: "BoEDetailsId" });

    return BoEDetails;
}

module.exports.BoEDetailsMap = function () {
    BoEDetailsMap.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        BoEDetailsId: { type: Sequelize.INTEGER, allowNull: true },

        UOMCode: { type: Sequelize.TEXT, allowNull: true },
        AccountCode: { type: Sequelize.TEXT, allowNull: true },
        EntityCode: { type: Sequelize.INTEGER, allowNull: true },
        DestType: { type: Sequelize.TEXT, allowNull: true },
        LocationCode: { type: Sequelize.INTEGER, allowNull: true },
        DeptCode: { type: Sequelize.INTEGER, allowNull: true },
        OrganizationCode:{ type: Sequelize.TEXT, allowNull: true },

        HSNCode: { type: Sequelize.BIGINT, allowNull: true },
        SupplierItemCode: { type: Sequelize.TEXT, allowNull: true },

        POLineNumber: { type: Sequelize.INTEGER, allowNull: true },
        ItemNumber: { type: Sequelize.TEXT, allowNull: true },
        ItemDesc: { type: Sequelize.TEXT, allowNull: true },
        POQuantity: { type: Sequelize.INTEGER, allowNull: true },
        POPendingQuantity: { type: Sequelize.INTEGER, allowNull: true },

        ReceiptQuantity: { type: Sequelize.INTEGER, allowNull: true },
        BCD: { type: Sequelize.INTEGER, allowNull: true },
        SWS: { type: Sequelize.INTEGER, allowNull: true },

        ASNNumber: { type: Sequelize.TEXT, allowNull: true },
        ReceiptLineNumber: { type: Sequelize.BIGINT, allowNull: true },
        ASNQuantity: { type: Sequelize.BIGINT, allowNull: true },
        IGST: { type: Sequelize.TEXT, allowNull: true },
        IGSTPercent: { type: Sequelize.INTEGER, allowNull: true },

        Rate: { type: Sequelize.INTEGER, allowNull: true },   
        BCDinINR: { type: Sequelize.DOUBLE, allowNull: true },
        SWSinINR: { type: Sequelize.DOUBLE, allowNull: true },  

        NewUnitPrice: { type: Sequelize.DOUBLE, allowNull: true },         
        TotalInUSD:{ type: Sequelize.DOUBLE, allowNull: true },
        AssessableValue:{ type: Sequelize.DOUBLE, allowNull: true },
        GST:{ type: Sequelize.DOUBLE, allowNull: true },
        TotalInvoiceAmount:{ type: Sequelize.DOUBLE, allowNull: true },
        DistributionCombination:{ type: Sequelize.TEXT, allowNull: true },

        InventoryItemId: { type: Sequelize.BIGINT, allowNull: true },
        RecieptNumber: { type: Sequelize.BIGINT, allowNull: true },
        isCostUpdatedId: { type: Sequelize.INTEGER, allowNull: true },
        AdjustmentNumber: { type: Sequelize.BIGINT, allowNull: true },

        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
        sequelize,
        modelName: 'BoEDetailsMap',
        tableName: 'BoEDetailsMap',
    });

    return BoEDetailsMap;
}

//BoDetails User Data end

module.exports.HSNMaster = function () {
    HSNMaster.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        HSN: { type: Sequelize.BIGINT, allowNull: true },
        BCD: { type: Sequelize.INTEGER, allowNull: true },
        SWS: { type: Sequelize.INTEGER, allowNull: true },
        IGST: { type: Sequelize.TEXT, allowNull: true },
        IGST_PERCENT: { type: Sequelize.INTEGER, allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, {
    sequelize,
    modelName: 'HSNMaster',
    tableName: 'HSNMaster',
    });
    
    return HSNMaster;
}

module.exports.POCostReport = function () {
    POCostReport.init({
        Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        
        TRANSACTION_ID :{ type: Sequelize.BIGINT, allowNull: true },
        INVENTORY_ITEM_ID: { type: Sequelize.BIGINT, allowNull: true },
        INVENTORY_ORG_ID: { type: Sequelize.BIGINT, allowNull: true },
        TXN_SOURCE_DOC_TYPE:{ type: Sequelize.TEXT, allowNull: true },
        GRN_NO:{ type: Sequelize.BIGINT, allowNull: true },
        TXN_SOURCE_REF_DOC_NUMBER: { type: Sequelize.TEXT, allowNull: true },

        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },

    },
        {
            sequelize,
            modelName: 'POCostReport',
            tableName: 'POCostReport',
        });

    return POCostReport;
}

module.exports.SchedulerLogger = function() {
    SchedulerLogger.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SchedulerName: { type: Sequelize.STRING(200), allowNull: true },
        Start: { type: Sequelize.DATE,allowNull: true},
        End: { type: Sequelize.DATE,allowNull: true},
        CreatedDate: { type: Sequelize.DATE,allowNull: true,defaultValue: Sequelize.NOW},
    }, 
    {
        sequelize,
        modelName: "SchedulerLogger",
        tableName: "SchedulerLogger",
    });
    return SchedulerLogger;
};

module.exports.Masterschedulerdetails = function () {
    Masterschedulerdetails.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        SchedulerName: { type: Sequelize.STRING(100), allowNull: true },
        RequestId: { type: Sequelize.STRING(100), allowNull: true },
        RequestStatus: { type: Sequelize.STRING(100), allowNull: true },
        APIObject: { type: Sequelize.TEXT, allowNull: true },
        StartDate:{type:Sequelize.DATE,allowNull:true},
        EndDate:{type:Sequelize.DATE,allowNull:true},
        CreatedDate: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: Sequelize.NOW,
        },
    }, {
        sequelize,
        modelName: "Masterschedulerdetails",
        tableName: "Masterschedulerdetails",
    });
    return Masterschedulerdetails;
}

module.exports.BankingInmst = function () {
    BankingInmst.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        AcNumber: { type: Sequelize.STRING(100), allowNull: true },
        // CheckDate: { type: Sequelize.DATE, allowNull: true },
        CheckrunName: { type: Sequelize.STRING(100), allowNull: true },
        IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
        apiStatus: { type: Sequelize.INTEGER, allowNull: true },
        CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
        CreatedDate: { type: Sequelize.DATE,allowNull: true,defaultValue: Sequelize.NOW},
        ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
        ModifiedDate: { type: Sequelize.DATE, allowNull: true },
    }, 
    {
        sequelize,
        modelName: "BankingInmst",
        tableName: "BankingInmst",
    });
        return BankingInmst;
    }

    module.exports.BankAccountMst = function () {
            BankAccountMst.init({
            Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
            AccountNumber: { type: Sequelize.STRING(100), allowNull: true },
            BankName: { type: Sequelize.STRING(100), allowNull: true },
            IsActive: { type: Sequelize.BOOLEAN, allowNull: true },
            CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
            CreatedDate: { type: Sequelize.DATE,allowNull: true,defaultValue: Sequelize.NOW},
        }, 
        {
            sequelize,
            modelName: "BankAccountMst",
            tableName: "BankAccountMst",
        });
            return BankAccountMst;
    }

    module.exports.TDSGST = function () {
        TDSGST.init({
            Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            PartyId:{ type:Sequelize.BIGINT,allowNull: true},
            PartySiteId:{ type:Sequelize.BIGINT, allowNull:true },
            PartyTypeCode: { type: Sequelize.STRING(100), allowNull: true},
            PartyName: { type: Sequelize.STRING(100), allowNull: true},
            PartyNumber:{type:Sequelize.INTEGER,allowNull: true},
            PartySiteNumber: {type:Sequelize.INTEGER, allowNull:true},
            TaxRegimeCode:{ type: Sequelize.STRING(100), allowNull: true},
            RegistrationTypeCode: {  type: Sequelize.STRING(100), allowNull: true},
            RegistrationStatusCode: { type: Sequelize.STRING(100), allowNull: true},
            EffectiveFrom:{ type: Sequelize.DATE, allowNull: true},
            RegistrationNumber: { type: Sequelize.STRING(100), allowNull: true},
            RoundingRuleCode:{ type: Sequelize.STRING(100), allowNull: true},
            ValidationType:{  type: Sequelize.STRING(100), allowNull: true},
            ValidationLevel:{ type: Sequelize.STRING(100), allowNull: true},
            IsUpdated:{ type: Sequelize.INTEGER, allowNull:true},
            RegistrationId:{ type:Sequelize.BIGINT,allowNull: true},
            CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
            CreatedDate: { type: Sequelize.DATE, allowNull: true , defaultValue: Sequelize.NOW },
            ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
            ModifiedDate: { type: Sequelize.DATE, allowNull: true },
        }, {
            sequelize,
            modelName: 'TDSGST',
            tableName: 'TDSGST',
        });
    
        return TDSGST;
    
    }

    //BoEPage New CR Start

    module.exports.BoE = function () {
        BoE.init({
            Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            BoENumber: { type: Sequelize.STRING(200), allowNull: true },
            BoEDate: { type: Sequelize.DATE, allowNull: true },
            RecieptDate: { type: Sequelize.DATE, allowNull: true },
            BoEExchangeRate: { type: Sequelize.DOUBLE, allowNull: true },
            HAWB: { type: Sequelize.STRING(200), allowNull: true },
            SupplierInvoiceNumber: { type: Sequelize.STRING(200), allowNull: true },
            SupplierID: { type: Sequelize.DOUBLE, allowNull: true },
            SupplierName: { type: Sequelize.STRING(200), allowNull: true },
            SupplierSiteCode: { type: Sequelize.TEXT, allowNull: true },
            PONumber: { type: Sequelize.STRING(200), allowNull: true },
            EntityCode : { type: Sequelize.INTEGER, allowNull: true },
            PortCode: { type: Sequelize.STRING(200), allowNull: true },
            PortDesc: { type: Sequelize.STRING(200), allowNull: true },
            ASNNumber: { type: Sequelize.TEXT, allowNull: true },
            TotalCustomDuty: { type: Sequelize.DOUBLE, allowNull: true },
            TotalGSTAmount: { type: Sequelize.DOUBLE, allowNull: true },
            TotalAmountWithGST: { type: Sequelize.DOUBLE, allowNull: true },
            FileName: { type: Sequelize.STRING(200), allowNull: true },
            FilePath: { type: Sequelize.STRING(200), allowNull: true },
            StatusId: { type: Sequelize.INTEGER, allowNull: true },
            ReceitAPIResponse: { type: Sequelize.INTEGER, allowNull: true },
            RecieptNumber: { type: Sequelize.BIGINT, allowNull: true },
            isCostUpdatedId: { type: Sequelize.INTEGER, allowNull: true },
            AdjustmentNumber: { type: Sequelize.BIGINT, allowNull: true },
            CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
            CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
            ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
            ModifiedDate: { type: Sequelize.DATE, allowNull: true },
        }, {
            sequelize,
            modelName: 'BoE',
            tableName: 'BoE',
        });
    
        exports.BoEMap();
        BoE.hasMany(BoEMap, { foreignKey: "BoEId" });
    
        return BoE;
    }

    module.exports.BoEMap = function () {
        BoEMap.init({
            Id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
            BoEId: { type: Sequelize.INTEGER, allowNull: true },

            UOMCode: { type: Sequelize.TEXT, allowNull: true },
            AccountCode: { type: Sequelize.TEXT, allowNull: true },
            EntityCode: { type: Sequelize.INTEGER, allowNull: true },
            DestType: { type: Sequelize.TEXT, allowNull: true },
            LocationCode: { type: Sequelize.INTEGER, allowNull: true },
            DeptCode: { type: Sequelize.INTEGER, allowNull: true },
            OrganizationCode:{ type: Sequelize.TEXT, allowNull: true },
            HSNCode: { type: Sequelize.BIGINT, allowNull: true },
            SupplierItemCode: { type: Sequelize.TEXT, allowNull: true },
            POLineNumber: { type: Sequelize.INTEGER, allowNull: true },
            ItemNumber: { type: Sequelize.TEXT, allowNull: true },
            ItemDesc: { type: Sequelize.TEXT, allowNull: true },
            POQuantity: { type: Sequelize.INTEGER, allowNull: true },
            POPendingQuantity: { type: Sequelize.INTEGER, allowNull: true },
            ReceiptQuantity: { type: Sequelize.INTEGER, allowNull: true },
            BCD: { type: Sequelize.INTEGER, allowNull: true },
            SWS: { type: Sequelize.INTEGER, allowNull: true },
            ASNNumber: { type: Sequelize.TEXT, allowNull: true },
            ReceiptLineNumber: { type: Sequelize.BIGINT, allowNull: true },
            ASNQuantity: { type: Sequelize.BIGINT, allowNull: true },
            IGST: { type: Sequelize.TEXT, allowNull: true },
            IGSTPercent: { type: Sequelize.INTEGER, allowNull: true },
            Rate: { type: Sequelize.INTEGER, allowNull: true },   
            BCDinINR: { type: Sequelize.DOUBLE, allowNull: true },
            SWSinINR: { type: Sequelize.DOUBLE, allowNull: true }, 
            UnitPrice: { type: Sequelize.INTEGER, allowNull: true },
            AssessableValueINR: { type: Sequelize.DOUBLE, allowNull: true },
            TotalTaxableValue: { type: Sequelize.DOUBLE, allowNull: true }, 
            NewUnitPrice: { type: Sequelize.DOUBLE, allowNull: true },         
            TotalInUSD:{ type: Sequelize.DOUBLE, allowNull: true },
            AssessableValue:{ type: Sequelize.DOUBLE, allowNull: true },
            GST:{ type: Sequelize.DOUBLE, allowNull: true },
            TotalInvoiceAmount:{ type: Sequelize.DOUBLE, allowNull: true },
            InventoryItemId: { type: Sequelize.BIGINT, allowNull: true },
            DistributionCombination:{ type: Sequelize.TEXT, allowNull: true },
    
            CreatedBy: { type: Sequelize.INTEGER, allowNull: true },
            CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW },
            ModifiedBy: { type: Sequelize.INTEGER, allowNull: true },
            ModifiedDate: { type: Sequelize.DATE, allowNull: true },
        }, {
            sequelize,
            modelName: 'BoEMap',
            tableName: 'BoEMap',
        });
    
        return BoEMap;
    }

////#endregion