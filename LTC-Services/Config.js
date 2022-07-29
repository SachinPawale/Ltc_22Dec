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
            dbServer: 'localhost', // '10.3.0.71',
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
        Seqeuence5: 50003000,
        Seqeuence6: 60003000,
        Seqeuence8: 80003000,
        Seqeuence9: 90003000,
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
        pass: "B?>yets@kdi84303wmxos8363ghdkwe92"   // "C@re@123!#"    //Password
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
const BoE_Folder = '/BoE'

const BoEReceiptAPIData = {
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
        DatatypeCode: "FILE",
        Description: "REST Invoice related attachment"
    },
}

const EmailIds = {
    ForApproval:{
        ToEmailIds:'maneesh.chaudhary@lightstormtelecom.com',
        CcEmailIds: 'Dibya.Prakash@Lightstormtelecom.com; Harish.Bajirao@Lightstormtelecom.com' 
       //ToEmailIds:'ramyashree.c@neweltechnologies.com',
       //CcEmailIds: 'ashwini.k@neweltechnologies.com;sachin.pawale@neweltechnologies.com'
       
   },
   Approved:{
        ToEmailIds:'Dibya.Prakash@Lightstormtelecom.com; Harish.Bajirao@Lightstormtelecom.com;',
        CcEmailIds: 'maneesh.chaudhary@lightstormtelecom.com'
       //ToEmailIds:'ramyashree.c@neweltechnologies.com',
       //CcEmailIds: 'ashwini.k@neweltechnologies.com;sachin.pawale@neweltechnologies.com;'
        
    },
    Rejected:{
        //ToEmailIds:'',
        // CcEmailIds: 'Jayawant.Gilbile@Lightstormtelecom.com; Dibya.Prakash@Lightstormtelecom.com; Harish.Bajirao@Lightstormtelecom.com'
        ToEmailIds:'rahul.g@neweltechnologies.com;technologiesnewel@gmail.com',
        CcEmailIds: 'rahul.g@neweltechnologies.com; rugved.c@neweltechnologies.com;'
        
    },
}


const PO_ReportData = {
    configData : {
        method: 'POST',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
            //'Cookie': 'ak_bmsc=B9244C35BF30314DA14FEF96BAC9F1F5~000000000000000000000000000000~YAAQXDZ8aBkKneV9AQAACesK/A7VBMHwoU7xE/eSLP2pwHWXYJVEqfMHDDYW0cz3ewtuQuYvzp/zsLdYpAEOQY10tFfSWyd6zM9bKOdk4BNPcnxl/vVdbowV7blvvxK9q8fRbHQplU4TOK/kv5usLJ48XeO4U+ynN3IO/ZYY78YhQ2MPB2dtVbbVVg8+3dIYSD74NV186qVPLDLABbiht9eWzB3Re69ACIIPGLBfTeAQuXQbVcPCxXSoPVGrBBfhSpIxsprwzKPaBo9IOf6iUf6JyecDlwdZHGZ5xJ6D9Dus0gNaLN/O32SVPYj4f7/uTrFhlheHgK6yU1Ghrwv2BTRoCmPcr7n8Q9sK6SOoBmH+SWJ5y5KYXmh6TonFsqW0ipkQ7BoeBY0=; bm_sv=8807AB44B2F685F1D8F918BA0150D946~58zY590GBW+mMbQyc11qG7RDj5ciHI6tZcaGMOPwha/YEej86DvT8/oFWZULKj+BgB9tbwqZ8u9dHEe2661v4pEhaujCjFapm+dpJ9COSJ83h2Gr7Dx7Lr5dYifFdnEJq5UMQm+64V0uA9FyzcfYeoChRaTms0KNxAMTV/jA4iI='
        }
    },
    Body:{
        OperationName:'submitESSJobRequest',
        JobPackageName:'/oracle/apps/ess/custom/Financials/A_LTC/LTC PO Extract Report for CusApp/',
        JobDefName:'XLTC_PO_EXTRACT_FOR_CUSAPP_DM',
        ESSParameters:'NULL'
    },
    configData_Status:{
        method:'Get',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
            //'Cookie': 'ak_bmsc=B9244C35BF30314DA14FEF96BAC9F1F5~000000000000000000000000000000~YAAQXDZ8aBkKneV9AQAACesK/A7VBMHwoU7xE/eSLP2pwHWXYJVEqfMHDDYW0cz3ewtuQuYvzp/zsLdYpAEOQY10tFfSWyd6zM9bKOdk4BNPcnxl/vVdbowV7blvvxK9q8fRbHQplU4TOK/kv5usLJ48XeO4U+ynN3IO/ZYY78YhQ2MPB2dtVbbVVg8+3dIYSD74NV186qVPLDLABbiht9eWzB3Re69ACIIPGLBfTeAQuXQbVcPCxXSoPVGrBBfhSpIxsprwzKPaBo9IOf6iUf6JyecDlwdZHGZ5xJ6D9Dus0gNaLN/O32SVPYj4f7/uTrFhlheHgK6yU1Ghrwv2BTRoCmPcr7n8Q9sK6SOoBmH+SWJ5y5KYXmh6TonFsqW0ipkQ7BoeBY0=; bm_sv=8807AB44B2F685F1D8F918BA0150D946~58zY590GBW+mMbQyc11qG7RDj5ciHI6tZcaGMOPwha/YEej86DvT8/oFWZULKj+BgB9tbwqZ8u9dHEe2661v4pEhaujCjFapm+dpJ9COSJ83h2Gr7Dx7Lr5dYifFdnEJq5UMQm+64V0uA9FyzcfYeoChRaTms0KNxAMTV/jA4iI='
        }
    },
    Fileoutput:{
        method:'Get',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    }
}

const FA_ReportData = {
    configData : {
        method: 'POST',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        //url: 'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
    },
    Body:{
        OperationName:'submitESSJobRequest',
        JobPackageName:'/oracle/apps/ess/custom/Financials/A_LTC/LTC FA Extract Report for CusApp/',
        JobDefName:'XXLTC_FA_DM',
        ESSParameters:'NULL'
    },
    configData_Status:{
        method:'Get',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        //url:'https://fa-test-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    },
    Fileoutput:{
        method:'Get',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        //url:'https://fa-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
            //'Cookie': 'ak_bmsc=B9244C35BF30314DA14FEF96BAC9F1F5~000000000000000000000000000000~YAAQXDZ8aBkKneV9AQAACesK/A7VBMHwoU7xE/eSLP2pwHWXYJVEqfMHDDYW0cz3ewtuQuYvzp/zsLdYpAEOQY10tFfSWyd6zM9bKOdk4BNPcnxl/vVdbowV7blvvxK9q8fRbHQplU4TOK/kv5usLJ48XeO4U+ynN3IO/ZYY78YhQ2MPB2dtVbbVVg8+3dIYSD74NV186qVPLDLABbiht9eWzB3Re69ACIIPGLBfTeAQuXQbVcPCxXSoPVGrBBfhSpIxsprwzKPaBo9IOf6iUf6JyecDlwdZHGZ5xJ6D9Dus0gNaLN/O32SVPYj4f7/uTrFhlheHgK6yU1Ghrwv2BTRoCmPcr7n8Q9sK6SOoBmH+SWJ5y5KYXmh6TonFsqW0ipkQ7BoeBY0=; bm_sv=8807AB44B2F685F1D8F918BA0150D946~58zY590GBW+mMbQyc11qG7RDj5ciHI6tZcaGMOPwha/YEej86DvT8/oFWZULKj+BgB9tbwqZ8u9dHEe2661v4pEhaujCjFapm+dpJ9COSJ83h2Gr7Dx7Lr5dYifFdnEJq5UMQm+64V0uA9FyzcfYeoChRaTms0KNxAMTV/jA4iI='
        }
    }
}

const RMO_ReportData = {
    configData : {
        method: 'POST',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        //url: 'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
    },
    Body:{
        OperationName:'submitESSJobRequest',
        JobPackageName:'/oracle/apps/ess/custom/Financials/A_LTC/LTC RMO Extract Report for CusApp/',
        JobDefName:'XLTC_RMO_DM',
        ESSParameters:'NULL'
    },
    configData_Status:{
        method:'Get',
        //url:'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    },
    Fileoutput:{
        method:'Get',
        //url:'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    }
}

const TDSGST_ReportData = {
    configData : {
        method: 'POST',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        //url: 'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
    },
    Body:{
        "OperationName":"submitESSJobRequest",
        "JobPackageName":"/oracle/apps/ess/custom/Financials/A_LTC/LTC GST TDS details for CusApp/",
        "JobDefName":"LTC_GST_TDS_DET_DM", 
        "ESSParameters": "NULL"
     },
    configData_Status:{
        method:'Get',
        //url:'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    },
    Fileoutput:{
        method:'Get',
        //url:'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    }
}

const SchedulerEmailConfig={
    fromEmail:'',
    toEmail:'rahul.g@neweltechnologies.com',
    ccEmail:'sachin.pawale@neweltechnologies.com;Omkar.G@neweltechnologies.com',

}

const BankingIntegrationAPIData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json'
        }
    },
    HardCodedData : {
        // OperationName: "submitESSJobRequest",
        // JobPackageName: "/Custom/Financials/A_LTC/LTC HSBC Payment File - Text/",
        // JobDefName: "LTC_HSBC_Payment_DM_TXT",
        OperationName:"submitESSJobRequest",
        JobPackageName:"/oracle/apps/ess/custom/Financials/A_LTC/LTC HSBC Payment File Revise/",
        JobDefName:"LTC_HSBC_Payment_DM_1", 
    },
    API2configDetails:{
        method: 'get',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    },
    API3configDetails:{
        method: 'get',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        },
    },
    SFTPDetails:{
        host: '10.3.0.71',
        port: '21',
        username: 'ftpuser',
        password: 'ftpuser'
    }

}

const TDSGSTAdjustmentAPIData = {
    configData : {
        method: 'post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/taxRegistrations',
        headers: {
          'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
          'Content-Type': 'application/json'
        }
    },
    HardCodedData : {
        "DefaultRegistrationFlag": false,
        "InclusiveTaxFlag": false,
    },
}
const cancelOrderAPI = {
    configData:{
        method: 'get',
         url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/transferOrders/',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            'Content-Type': 'application/json'
        },
    }
}

const PO_Cost_Report_ReportData = {
    configData : {
        method: 'POST',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        //url: 'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz', 
            'Content-Type': 'application/json',
            'Connection': 'keep-alive'
        }
    },
    Body:{
        "OperationName":"submitESSJobRequest",
        "JobPackageName":"/oracle/apps/ess/custom/Financials/A_LTC/LTC Cost Update Report for CusApp/", 
        "JobDefName":"LTC_Cost_Update_DM", 
        "ESSParameters":"NULL" 
        },
    configData_Status:{
        method:'Get',
        //url:'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/financialCommonApi/resources/11.13.18.05/erpintegrations?finder=ESSExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    },
    Fileoutput:{
        method:'Get',
        //url:'https://fa-etcj-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        url:'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/erpintegrations?finder=ESSJobExecutionDetailsRF;requestId=',
        headers: { 
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz'
        }
    }
   }


   const ReservationAPI = {
    configData: {
        method: 'Post',
        url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com/fscmRestApi/resources/11.13.18.05/inventoryReservations',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            'Content-Type': 'application/json'
        },
    }
}


const SupplyOrderLinesAPI = {
    configData: {
        method: 'GET',
         url: 'https://fa-etcj-test-saasfaprod1.fa.ocs.oraclecloud.com:443/fscmRestApi/resources/11.13.18.05/supplyRequests/',
        headers: {
            'Authorization': 'Basic bHRjLmltcGw6RGVwdGhAMTIz',
            'Content-Type': 'application/json'
        },
    }
}





module.exports.service_port = finalConfig.service_port;
module.exports.ui_url = finalConfig.ui_url;
module.exports.group_mail = finalConfig.group_mail;
module.exports.emailConfig = finalConfig.emailConfig;
module.exports.dbConn = finalConfig.dbConn;

module.exports.OrganizationData = OrganizationData;
module.exports.LocationData = LocationData;
module.exports.SubinventoryData = SubinventoryData;
module.exports.cancelAPI = finalConfig.cancelAPI;

module.exports.miscRecieptData = miscRecieptData;
module.exports.transferMoveOrderData = transferMoveOrderData;

module.exports.ReservationAPI = ReservationAPI;
module.exports.SupplyOrderLinesAPI = SupplyOrderLinesAPI;

module.exports.EmailSMTPConfig = EmailSMTPConfig;

module.exports.Uploads_Folder = Uploads_Folder;
module.exports.BoE_Entry_Folder = BoE_Entry_Folder;
module.exports.BoE_Folder = BoE_Folder;

module.exports.BoEInvoiceData = BoEInvoiceData;
module.exports.ReceiptAPIData = ReceiptAPIData;
module.exports.BoEReceiptAPIData = BoEReceiptAPIData;
module.exports.StandardInvoiceAPIData = StandardInvoiceAPIData;
module.exports.CostAdjustmentAPIData = CostAdjustmentAPIData;

module.exports.EmailIds = EmailIds;

module.exports.PO_ReportData = PO_ReportData;
module.exports.FA_ReportData = FA_ReportData;
module.exports.RMO_ReportData = RMO_ReportData;
module.exports.TDSGST_ReportData = TDSGST_ReportData;
module.exports.SchedulerEmailConfig = SchedulerEmailConfig;
module.exports.BankingIntegrationAPIData = BankingIntegrationAPIData;
module.exports.TDSGSTAdjustmentAPIData = TDSGSTAdjustmentAPIData;
module.exports.PO_Cost_Report_ReportData = PO_Cost_Report_ReportData;
module.exports.cancelOrderAPI=cancelOrderAPI;