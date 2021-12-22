// var cron = require('node-cron');

// var dashboard = require('../Service/Dashboard/DashboardService')
// cron.schedule('*/10 * * * * *', () => {
//     dashboard.routes('/GetAllPartnerRevenue');
// });



// var CronJob = require('cron').CronJob;
// var runReminders = require('../Service/AssetRegister/RunReminders');

// //Running job at 8:00 am Daily
// var dailyJob = new CronJob('0 8 * * *', function() {

//     runReminders.RunPendingReminders(1, 1);
//     runReminders.RunNearExpiryReminders(2, 1);
//     runReminders.RunValidityExpiredReminders(3, 1);
// });

// dailyJob.start();

// //Running job at 8:00 am Weekly
// var weeklyJob = new CronJob('0 8 * * 1', function() {

//     runReminders.RunPendingReminders(1, 2);
//     runReminders.RunNearExpiryReminders(2, 2);
//     runReminders.RunValidityExpiredReminders(3, 2);
// });

// weeklyJob.start();

// //Running job at 8:00 am Monthly
// var monthlyJob = new CronJob('0 8 1 * *', function() {

//     runReminders.RunPendingReminders(1, 3);
//     runReminders.RunNearExpiryReminders(2, 3);
//     runReminders.RunValidityExpiredReminders(3, 3);
// });

// monthlyJob.start();