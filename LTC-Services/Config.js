var environmentConfig = {
    local: {
        service_port: 1330,
        ui_url: 'http://10.3.0.71:4200/',
        group_mail: '',
        emailConfig: {
            email_host: '',
            from_email: 'sachin.pawale@neweltechnologies.com',
        },
        dbConn: {
            dbServer: 'localhost',
            dbName: 'ltcportal',
            dbUser: 'ltcportal',
            dbPassword: 'Itcportal@2021'
        }
    },
    sit: {
        service_port: 1337,
        ui_url: 'http://edemumnewuatvm4:1337/',
        group_mail: '',
        emailConfig: {
            email_host: '10.250.6.63',
            from_email: 'sachin.pawale@neweltechnologies.com',
        },
        dbConn: {
            dbServer: '10.250.19.84',
            dbName: 'BSFL',
            dbUser: 'BSFLuser',
            dbPassword: 'BSFLuser~',
        }
    },
    uat: {
        service_port: 1338,
        ui_url: 'http://192.168.1.103:1338/',
        group_mail: '',
        emailConfig: {
            email_host: '10.250.6.63',
            from_email: 'sachin.pawale@neweltechnologies.com',
        },
        dbConn: {
            dbServer: 'localhost',
            dbName: 'BFSL',
            dbUser: 'postgres',
            dbPassword: '1234',
        }
    },
    live: {
        service_port: 1337,
        ui_url: 'http://edemumkalapp035:1337/',
        group_mail: '',
        emailConfig: {
            email_host: '10.250.6.63',
            from_email: 'sachin.pawale@neweltechnologies.com',
        },
        dbConn: {
            dbServer: '10.250.0.237',
            dbName: 'BSFL',
            dbUser: 'BSFL',
            dbPassword: 'BSFL~',
        }
    }
}

var environment = 'local';

const finalConfig = environmentConfig[environment];

const miscRecieptData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryStagedTransactions',
        headers: { 
                'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
                'Content-Type': 'application/json'
        }
    },
    HardCodedData : {
        TransactionTypeName : "Miscellaneous Receipt",
        TransactionMode : 1,
        UseCurrentCostFlag :  false,
        CostComponentCode : "ITEM_PRICE"
    },
    SequenceData : {
        Seqeuence1 : 10000001,
        Seqeuence2 : 20000001,
        Seqeuence3 : 30000001,
    }
}

const transferMoveOrderData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/supplyRequests',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json'
        },
    },
    HardCodedData : {
        InterfaceSourceCode : "EXT",
        SupplyRequestStatus : "NEW",
        SupplyOrderSource : "EXT",
        TransferCostCurrencyCode : "INR",
        ProcessRequestFlag : "Y",
        BackToBackFlag : "N",
        PreparerEmail : "akshay.arora@depthconsulting.in",
        DeliverToRequesterEmail : "akshay.arora@depthconsulting.in",
        SupplyType : "TRANSFER",
        DestinationTypeCode : {
            CAM : "EXPENSE",
            SRN : "INVENTORY",
            RMO : "INVENTORY"
        }
    },
    SequenceData : {
        //Seqeuence4 : 10000001,
        Seqeuence5 : 50000001,
        Seqeuence6 : 60000001,
    }
}

const OrganizationData = {
    configData : {
        method: 'get',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryOrganizations',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            'Cookie': 'ak_bmsc=D9EB9F9CB408E75F55D392946AB7130A~000000000000000000000000000000~YAAQBl8sMdx7+Ah9AQAAt2W2cA3lv2apxvi/XpT3UD0ErCIWsRhegqAG+ig0JkkXodB6+GPuQdRWD9O/jWIdA+0fYu2PkPXDeZbyUMxXCzq79HMCYqudTrLdvJtwiMMApUFmOuA74kpWw8xIiBFEDQirPLms8fVwP2RFXqFPCJZwpTCsItwjM67iWBjujJBFQpS7NftX95lfjMXQORHnuaRixSJKVm5VAeD3F8tiVwHlfhREzyujqqhf7+ykAq8E2kUfm8TUer/8EJJS5+jGt6pFB1ufp7FBCs8gTs94Uoc97WOOlFSNr9+dvOswfn/JXAgFgBGTJB7unSBp0bx7M5gRzFzl/gfgaKqNzi5LQvXuEzHNePwf7ED49qXf4DTty/ZHtN2qTOw='
        }
    }
}

const LocationData = {
    configData : {
        method: 'get',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/hcmRestApi/resources/11.13.18.05/locationsV2?limit=2000',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    }
}

const EmailSMTPConfig = {
    host: "smtp.office365.com",   //SMTP Host Address
    port: 587,                 //SMTP PORT
    auth: {
      user: "Notification.Centre@Lightstorm.in",   //Username
      pass: "Tatva#2022"    //Password
    }
}

module.exports.service_port = finalConfig.service_port;
module.exports.ui_url = finalConfig.ui_url;
module.exports.group_mail = finalConfig.group_mail;
module.exports.emailConfig = finalConfig.emailConfig;
module.exports.dbConn = finalConfig.dbConn;

module.exports.OrganizationData = OrganizationData;
module.exports.LocationData = LocationData;

module.exports.miscRecieptData = miscRecieptData;
module.exports.transferMoveOrderData = transferMoveOrderData;

module.exports.EmailSMTPConfig = EmailSMTPConfig;
