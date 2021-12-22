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
class Asset extends Model { }
class AssetDetails extends Model { }
class OrganizationDetails extends Model { }
class LocationDetails extends Model { }
//class EntityMaster extends Model { }
//class CurrencyMaster extends Model { }
class ApiResponseDetail extends Model { }

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
        Id: { type: Sequelize.INTEGER , primaryKey:true , autoIncrement:true },
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
        DFFS: { type: Sequelize.STRING(200), allowNull: true },
        EntityCode:{type:Sequelize.STRING(100),allowNull:true},
        CurrencyCode:{type:Sequelize.STRING(100),allowNull:true},
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

        Seq1 : { type: Sequelize.BIGINT, allowNull: true },
        Seq2 : { type: Sequelize.BIGINT, allowNull: true },
        Seq3 : { type: Sequelize.BIGINT, allowNull: true },
        Seq4 : { type: Sequelize.BIGINT, allowNull: true },
        Seq5 : { type: Sequelize.BIGINT, allowNull: true },
        Seq6 : { type: Sequelize.BIGINT, allowNull: true },

        TransactionTypeName : { type: Sequelize.STRING(100), allowNull: true },
        TransactionMode : { type: Sequelize.INTEGER, allowNull: true },
        UseCurrentCostFlag : { type: Sequelize.STRING(100), allowNull: true },
        CostComponentCode : { type: Sequelize.STRING(100), allowNull: true },
        miscResponseStatus: { type: Sequelize.INTEGER, allowNull: true },
        transferResponseStatus: { type: Sequelize.INTEGER, allowNull: true },
        TransactionHeaderId : { type: Sequelize.BIGINT, allowNull: true },
        TransactionInterfaceId : { type: Sequelize.BIGINT, allowNull: true },

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
        ApiName : { type: Sequelize.STRING(100), allowNull: true } ,
        AsssetId: { type: Sequelize.INTEGER, allowNull: true },
        AssetNumber: { type: Sequelize.INTEGER, allowNull: true },
        API_ResponseStatusCode: { type: Sequelize.INTEGER, allowNull: true },
        API_ResponseData: { type: Sequelize.STRING(2000), allowNull: true  },
        CreatedBy: { type: Sequelize.BIGINT, allowNull: true },
        CreatedDate: { type: Sequelize.DATE,allowNull: true,defaultValue: Sequelize.NOW},
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
        INVENTORY_ITEM_ID: { type: Sequelize.DOUBLE, allowNull: true }
    }, {
        sequelize,
        modelName: "famiscmaster",
        tableName: "famiscmaster",
    });
    return famiscmaster;
};

module.exports.MailLog = function () {
    MailLog.init({
        Id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        assetId : { type: Sequelize.BIGINT, allowNull: true },
        mailTo: { type: Sequelize.STRING(1000), allowNull: true },
        mailFrom: { type: Sequelize.STRING(200), allowNull: true },
        mailSubject: { type: Sequelize.STRING(1000), allowNull: true },
        mailBody: { type: Sequelize.TEXT, allowNull: true },
        messageId: { type: Sequelize.STRING(100), allowNull: true },
        mailStatus: { type: Sequelize.BOOLEAN, allowNull: true },
        CreatedDate: { type: Sequelize.DATE, allowNull: true, defaultValue: Sequelize.NOW},
    }, {
        sequelize,
        modelName: "MailLog",
        tableName: "MailLog",
    });
    return MailLog;
};


////#endregion