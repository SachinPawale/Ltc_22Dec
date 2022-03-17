var dataconn = require('./Data/DataConnection');
var express = require('express');
var path = require('path');
var fs = require('fs');
var app = express();
var config = require('./Config');
//const mail = require('./Common/EmailService');
var cron = require('./CronScheduler/RunScheduler');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

// CORS Middleware node.js package for connect express
app.use(function (req, res, next) {
    var menthods = "GET, POST";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", menthods);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType, Content-Type, Accept, Authorization");
    if (!menthods.includes(req.method.toUpperCase())) {
        return res.status(200).json({});
    };
    next();
});

const staticImageRootLocal = path.join(__dirname + '/public/');
app.use(express.static(staticImageRootLocal));

// Service checking method
app.get("/api/sample", function (req, res) {
    res.status(200).json({ Success: true, Message: "Welcome Hello ", Data: null });
});

// Connection checking method
app.get("/api/CheckConnection", function (req, res) {
    dataconn.CheckConnection(res);
});

//Table creation Method
app.get("/api/CreateTable", function (reg, res) {
    dataconn.CreateTable(res);
});

var loginService = require('./Service/Login/LoginService')();
app.use("/api/login", loginService);

var menuService = require('./Service/Login/MenuService')();
app.use("/api/menu", menuService);

var maillogService = require('./Service/Master/MailLogService')();
app.use("/api/maillog", maillogService);

var errorlogService = require('./Service/Master/ErrorLogService')();
app.use("/api/errorlog", errorlogService);

////#region User Management

var userService = require('./Service/UserManagement/UserService')();
app.use("/api/user", userService);

var roleService = require('./Service/UserManagement/RoleService')();
app.use("/api/role", roleService);

var uiroleService = require('./Service/UserManagement/UIRoleService')();
app.use("/api/uirolemap", uiroleService);

////#region Master Service

// var StateService = require('./Service/Master/StateService')();
// app.use("/state", StateService);

// var CityService = require('./Service/Master/CityService')();
// app.use("/city", CityService);

// var PincodeService = require('./Service/Master/PincodeService')();
// app.use("/pincode", PincodeService);

// var bankService = require('./Service/Master/BankService')();
// app.use("/bank", bankService);

// var branchService = require('./Service/Master/BranchService')();
// app.use("/branch", branchService);

var transactionService = require('./Service/Transaction/transaction')();
app.use("/api/transaction", transactionService);

var BoEService = require('./Service/BoE/BoEService')();
app.use("/api/BoE", BoEService);

var BoEDetailsService = require('./Service/BoE/BoEDetailsService')();
app.use("/api/BoEDetails", BoEDetailsService);

var UserJourneyService = require('./Service/UserJourneyTracking/UserTrackingJourney')();
app.use("/api/UserJourney", UserJourneyService);

var schedulerService = require('./Service/Scheduler/SchedulerFunction')();
app.use("/api/scheduler", schedulerService);

var BankAccountService = require('./Service/Banking/BankAccountService')();
app.use("/api/AcNo", BankAccountService)

var BankingIntigrationService = require('./Service/Banking/BankingIntigrationService')()
app.use("/api/BankIn", BankingIntigrationService)

var TDSGSTServices = require ('./Service/TDSGST/TDSGSTServices')();
app.use("/api/TDSGST", TDSGSTServices)

////#region Reports

// var reportService = require('./Service/Report/ReportService')();
// app.use("/report", reportService);

////#endregion

// Catch all other routes and return the index file
// app.get('*', (req, res) => {
//     res.sendFile(path.join(staticRoot, 'index.html'));
// });

//BoE-Entry Folder Creation Start

//console.log(path.join(__dirname + config.Uploads_Folder + config.BoE_Entry_Folder));

var BoE_Entry = path.join(__dirname + config.Uploads_Folder + config.BoE_Entry_Folder);
if (!fs.existsSync(BoE_Entry)) {
    fs.mkdirSync(BoE_Entry, { recursive: true });
}
//BoE-Entry Folder Creation End

// Start server and listen on http://localhost:1339/
var server = app.listen(config.service_port, function () {
    var host = server.address().address;
    var port = server.address().port;
    var datetime = new Date();
    var message = "Server :- " + host + " running on Port : - " + port + " Started at :- " + datetime;
    console.log(message);
});