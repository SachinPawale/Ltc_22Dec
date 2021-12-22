var nodemailer = require('nodemailer');
var email = require('email-templates');
var datamodel = require('../Data/DataModel');
var dataaccess = require('../Data/DataAccess');
var dataconn = require('../Data/DataConnection');
var path = require('path');
var configfile = require('../Config');

module.exports = {

    ui_url: configfile.ui_url,
    _template: null,
    _transport: null,

    init: function (config) {
        var self = this;
        return new Promise(function (resolve, reject){

            self._template = new email( {

                transport: {
                    jsonTransport: true
                },
                views: {
                    root: config.emailTplsDir,
                    options: {
                        extension: 'ejs'
                    }
                }
            });
            self._transport = nodemailer.createTransport(
                {
                    host: configfile.emailConfig.email_host,
                    secure: false,
                    port: 25,
                    ignorTLS: true,
                    debug: true,
                    loger: true
                });
                resolve();
        });
    },

    send: function (from, to, cc, bcc, subject, text, html)
    {
        var self = this;
        return new Promise( function (resolve, reject){
            var params = {
                from : from,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: subject,
                text: typeof text == 'string' && (text || text.length != 0) ? text : ''
            };

            if(html){
                params.html = html;
            }

            self._transport.sendMail(params, function (err, res){

                if(err){
                    return reject(err);
                }
                else{
                    return resolve(res);
                }
            });
        });
    },

    sendMail: function (type, level = 0, msgtype = 'notification', from = '', to, cc, bcc, subject, tplName, locals){

        var self = this;
        var model = {
            FlowType: type,
            Level: level,
            MsgType : msgtype,
            FROM: configfile.emailConfig.from_email,
            TO: to,
            CC: cc,
            BCC: bcc,
            Subject: subject,
            RequestData: locals.data
        };

        return new Promise(function (resolve, reject) {
            var templateDir = path.join(__dirname, "./../Templates");
            self.init({ emailTplsDir: templateDir })
            .then(function () {
                self._template.render(tplName, locals)
                .then (function (html){

                    model.Body = html;
                    self.send(model.FROM, model.TO, model.CC, model.BCC, model.Subject, '', html)
                    .then(function (res) {
                        model.MailStatus = true;
                        dataconn.mailerrorlogger(model);                        
                    })
                    .catch(function (err) {
                        model.MailStatus = false;
                        dataconn.mailerrorlogger(model);
                        return reject(err);
                    });
                })
                .catch (function (err) {

                    model.MailStatus = false;
                    dataconn.mailerrorlogger(model);
                    return reject (err);
                });
            });
        });
    }
};