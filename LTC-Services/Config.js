var environmentConfig = {
    local: {
        service_port: 1339,
        ui_url: 'http://localhost:4200/',
        group_mail: '',
        emailConfig: {
            email_host: '',
            from_email: 'sachin.pawale@neweltechnologies.com',
        },
        dbConn: {
            dbServer: 'localhost',
            dbName: 'ltcportal',
            dbUser: 'root',
            dbPassword: 'Newel@212'
        }
    },
    sit: {
        service_port: 1337,
        ui_url: '',
        group_mail: '',
        emailConfig: {
            email_host: '10.250.6.63',
            from_email: 'sachin.pawale@neweltechnologies.com',
        },
        dbConn: {
            dbServer: '10.250.19.84',
            dbName: '',
            dbUser: '',
            dbPassword: '',
        }
    },
    uat: {
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
    live: {
        service_port: 1337,
        ui_url: '',
        group_mail: '',
        emailConfig: {
            email_host: '10.250.6.63',
            from_email: 'sachin.pawale@neweltechnologies.com',
        },
        dbConn: {
            dbServer: '',
            dbName: '',
            dbUser: '',
            dbPassword: '',
        }
    }
}

var environment = 'uat';

const finalConfig = environmentConfig[environment];

const miscRecieptData = {
    configData: {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryStagedTransactions',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            'Content-Type': 'application/json'
        }
    },
    HardCodedData: {
        TransactionTypeName: "Miscellaneous Receipt",
        TransactionMode: 1,
        UseCurrentCostFlag: false,
        CostComponentCode: "ITEM_PRICE"
    },
    SequenceData: {
        Seqeuence1: 10000001,
        Seqeuence2: 20000001,
        Seqeuence3: 30000001,
    }
}

const transferMoveOrderData = {
    configData: {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/supplyRequests',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            'Content-Type': 'application/json'
        },
    },
    HardCodedData: {
        InterfaceSourceCode: "EXT",
        SupplyRequestStatus: "NEW",
        SupplyOrderSource: "EXT",
        TransferCostCurrencyCode: "INR",
        ProcessRequestFlag: "Y",
        BackToBackFlag: "N",
        PreparerEmail: "akshay.arora@depthconsulting.in",
        DeliverToRequesterEmail: "akshay.arora@depthconsulting.in",
        SupplyType: "TRANSFER",
        DestinationTypeCode: {
            CAM: "EXPENSE",
            SRN: "INVENTORY",
            RMO: "INVENTORY"
        }
    },
    SequenceData: {
        //Seqeuence4 : 10000001,
        Seqeuence5: 50000001,
        Seqeuence6: 60000001,
    }
}

const OrganizationData = {
    configData: {
        method: 'get',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryOrganizations',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            'Cookie': 'ak_bmsc=D9EB9F9CB408E75F55D392946AB7130A~000000000000000000000000000000~YAAQBl8sMdx7+Ah9AQAAt2W2cA3lv2apxvi/XpT3UD0ErCIWsRhegqAG+ig0JkkXodB6+GPuQdRWD9O/jWIdA+0fYu2PkPXDeZbyUMxXCzq79HMCYqudTrLdvJtwiMMApUFmOuA74kpWw8xIiBFEDQirPLms8fVwP2RFXqFPCJZwpTCsItwjM67iWBjujJBFQpS7NftX95lfjMXQORHnuaRixSJKVm5VAeD3F8tiVwHlfhREzyujqqhf7+ykAq8E2kUfm8TUer/8EJJS5+jGt6pFB1ufp7FBCs8gTs94Uoc97WOOlFSNr9+dvOswfn/JXAgFgBGTJB7unSBp0bx7M5gRzFzl/gfgaKqNzi5LQvXuEzHNePwf7ED49qXf4DTty/ZHtN2qTOw='
        }
    }
}

const LocationData = {
    configData: {
        method: 'get',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/hcmRestApi/resources/11.13.18.05/locationsV2?limit=2000',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    }
}

const SubinventoryData = {
    configData: {
        method: 'get',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/subinventories?limit=2000',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            //'Cookie': 'ak_bmsc=B9244C35BF30314DA14FEF96BAC9F1F5~000000000000000000000000000000~YAAQXDZ8aBkKneV9AQAACesK/A7VBMHwoU7xE/eSLP2pwHWXYJVEqfMHDDYW0cz3ewtuQuYvzp/zsLdYpAEOQY10tFfSWyd6zM9bKOdk4BNPcnxl/vVdbowV7blvvxK9q8fRbHQplU4TOK/kv5usLJ48XeO4U+ynN3IO/ZYY78YhQ2MPB2dtVbbVVg8+3dIYSD74NV186qVPLDLABbiht9eWzB3Re69ACIIPGLBfTeAQuXQbVcPCxXSoPVGrBBfhSpIxsprwzKPaBo9IOf6iUf6JyecDlwdZHGZ5xJ6D9Dus0gNaLN/O32SVPYj4f7/uTrFhlheHgK6yU1Ghrwv2BTRoCmPcr7n8Q9sK6SOoBmH+SWJ5y5KYXmh6TonFsqW0ipkQ7BoeBY0=; bm_sv=8807AB44B2F685F1D8F918BA0150D946~58zY590GBW+mMbQyc11qG7RDj5ciHI6tZcaGMOPwha/YEej86DvT8/oFWZULKj+BgB9tbwqZ8u9dHEe2661v4pEhaujCjFapm+dpJ9COSJ83h2Gr7Dx7Lr5dYifFdnEJq5UMQm+64V0uA9FyzcfYeoChRaTms0KNxAMTV/jA4iI='
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

const BoEInvoiceData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com//fscmRestApi/resources/11.13.18.05/invoices',
        headers: { 
                'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
                'Content-Type': 'application/json'
        }
    },
    HardCodedData : {
        InvoiceType: "Prepayment",
        InvoiceCurrency: "INR",
        BusinessUnit:"LTC BU",
        Supplier: "Custom Authority",
        SupplierSite: "Custom-Delhi",
        Type: "File",
        Category: "From Supplier",
        DistributionLineType: "Item",
        LineNumber: 1,
        DistributionLineNumber: 1,
    },
}

const ReceiptAPIData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/receivingReceiptRequests',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json',
        },
    },
    HardCodedData : {
        ASNType: "ASBN",
        ReceiptSourceCode:"VENDOR",
        BusinessUnit:"LTC BU",
        EmployeeId:"300000003460557",
        Lines_ReceiptSourceCode:"VENDOR",
        SourceDocumentCode:"PO",
        TransactionType:"RECEIVE",
        AutoTransactCode:"RECEIVE",
    },
}

const StandardInvoiceAPIData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/invoices',
        headers: { 
        'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
        'Content-Type': 'application/json'
        },
    },
    HardCodedData : {
        InvoiceCurrency:"INR",
        BusinessUnit:"LTC BU",
        Supplier:"Custom Authority",
        SupplierSite:"Custom-Delhi",
        LineType:"Item",
        DistributionLineNumber:1,
        DistributionLineType:"Item"

    },
}

const CostAdjustmentAPIData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/costAdjustments',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json'
        }
    },
    HardCodedData : {
        AdjustmentTypeCode: "R",
        AdjustmentStatusCode: "S",
        Reason: "Customs Duty",
        CostElement: "Overhead",
    },
}

const Uploads_Folder = '/Uploads'
const BoE_Entry_Folder = '/BoE-Entry'



module.exports.service_port = finalConfig.service_port;
module.exports.ui_url = finalConfig.ui_url;
module.exports.group_mail = finalConfig.group_mail;
module.exports.emailConfig = finalConfig.emailConfig;
module.exports.dbConn = finalConfig.dbConn;

module.exports.OrganizationData = OrganizationData;
module.exports.LocationData = LocationData;
module.exports.SubinventoryData = SubinventoryData;

module.exports.miscRecieptData = miscRecieptData;
module.exports.transferMoveOrderData = transferMoveOrderData;

module.exports.EmailSMTPConfig = EmailSMTPConfig;

module.exports.Uploads_Folder = Uploads_Folder;
module.exports.BoE_Entry_Folder = BoE_Entry_Folder;

module.exports.BoEInvoiceData = BoEInvoiceData;
module.exports.ReceiptAPIData = ReceiptAPIData;
module.exports.StandardInvoiceAPIData = StandardInvoiceAPIData;
module.exports.CostAdjustmentAPIData = CostAdjustmentAPIData;

