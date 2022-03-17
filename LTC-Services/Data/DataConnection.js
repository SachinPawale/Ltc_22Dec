var connect = require('./Connect');
var datamodel = require('./DataModel');
var dataaccess = require('./DataAccess');

/// CheckConnection function used to check a database connection using API
module.exports.CheckConnection = function (res) {
    connect.sequelize
        .authenticate()
        .then(function (result) {
            res.status(200).json({ Success: true, Message: 'Connection has been establised successfully', Data: null });
        }, function (err) {
            res.status(200).json({ Success: false, Message: 'Unable to connect to the database : ' + err, Data: null });
        });
}

/// CreateTable function used to create Database tables using API
module.exports.CreateTable = function (res) {

    datamodel.ErrorLog();
    datamodel.MailLog();
    //datamodel.CronService();

    datamodel.UIMst();
    //datamodel.NotifyconfigMst();
    //datamodel.NotifyRoleMap();

    datamodel.UserMst();
    datamodel.UserRoleMap();
    datamodel.RoleMst();
    datamodel.UIRoleMap();

    datamodel.famiscmaster();
    //datamodel.famiscmaster1();
    datamodel.OrganizationDetails();
    datamodel.LocationDetails();
    datamodel.AssetDetails();
    datamodel.Asset();
    datamodel.ApiResponseDetail();
    datamodel.SubInventoryDetails();
    datamodel.rmomaster();

    datamodel.AssetHistory();
    datamodel.AssetDetailsHistory();

    datamodel.BoEEntry();
    datamodel.BoEMasterDetails();
    datamodel.PortMaster();
    datamodel.UserJourney();

    datamodel.BoEDetails();
    datamodel.BoEDetailsMap();

    datamodel.HSNMaster();
    datamodel.POCostReport();
    datamodel.SchedulerLogger();
    datamodel.Masterschedulerdetails();
    datamodel.BankingInmst();
    datamodel.BankAccountMst();
    datamodel.TDSGST();
    //datamodel.EntityMaster();
    //datamodel.CurrencyMaster();

    // datamodel.StateMst();
    // datamodel.CityMst();
    // datamodel.PincodeMst();
    // datamodel.BankMst();
    // datamodel.BranchMst();

    connect.sequelize.sync()
        .then(() => {
            res.status(200).json({ Success: true, Message: 'Tables updated', Data: null });
        })
}

/// errorlogger function used to insert error logs into Error log table
module.exports.errorlogger = function (servicename, functionname, errorobj) {

    var err = 'Message : ' + errorobj.message + '\n' + 'Stack : ' + errorobj.stack;

    var values = {
        ServiceName: servicename,
        FunctionName: functionname,
        ErrorObject: err
    };

    dataaccess.Create(datamodel.ErrorLog(), values)
        .then(function (result) {
            console.log(JSON.stringify(result));
        }, function (err) {
            console.log('Error: ' + JSON.stringify(err));
        });
}

/// mailerrorlogger function used to insert mail error logs into Maillog table
module.exports.maillogger = function (mailobj) {

    const MailLog = datamodel.MailLog();

    var values = {
        assetId: mailobj.assetId,
        mailTo: mailobj.mailTo,
        mailFrom: mailobj.mailFrom,
        mailCc: mailobj.mailCc,
        mailSubject: mailobj.mailSubject,
        mailBody: mailobj.mailBody,
        messageId: mailobj.messageId,
        mailStatus: mailobj.mailStatus,
    };

    dataaccess.Create(MailLog, values)
        .then(function (result) {
            if (result == null)
                module.exports.errorlogger('Mailer', 'Mailerrorlogger', { message: 'No object found', stack: '' });
        }, function (err) {
            module.exports.errorlogger('Mailer', 'Mailerrorlogger', err);
        });
}

//
module.exports.apiResponselogger = function (ApiName, AsssetId, AssetNumber,
    API_ResponseStatusCode, API_ResponseData, CreatedBy) {

    var values = {
        ApiName: ApiName,
        AsssetId: AsssetId,
        AssetNumber: AssetNumber,
        API_ResponseStatusCode: API_ResponseStatusCode,
        API_ResponseData: API_ResponseData,
        CreatedBy: CreatedBy
    };

    dataaccess.Create(datamodel.ApiResponseDetail(), values)
        .then(function (result) {
            console.log(JSON.stringify(result));
        }, function (err) {
            console.log('Error: ' + JSON.stringify(err));
        });
}

/// GetAllCronService function used to fetch all cron job entries avaiable for scheduler  
module.exports.GetAllCronService = function () {
    const CronService = datamodel.CronService();
    var param = { attributes: ['Code', 'IsActive'] };
    return dataaccess.FindAll(CronService, param);
}

/// Schedulerlog function used to insert Scheduler logs into SchedulerLogger table
module.exports.Schedulerlog = function(Schedulerdata) {
    const SchedulerLogger = datamodel.SchedulerLogger();

    var values = {
        SchedulerName:Schedulerdata.SchedulerName,
        Start: Schedulerdata.Start,
        End: Schedulerdata.End,
        CreatedDate: connect.sequelize.fn('NOW')
    };

    dataaccess.Create(SchedulerLogger, values)
        .then(function(result) {
            if (result == null)
                module.exports.errorlogger('SchedulerLogger', 'SchedulerLogger', { message: 'No object found', stack: '' });
        }, function(err) {
            module.exports.errorlogger('SchedulerLogger', 'SchedulerLogger', err);
        });
}