const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
var ejs = require('ejs');
const configFile = require('../Config');
const puppeteer = require('puppeteer');

let transporter = nodemailer.createTransport({
    host: configFile.EmailSMTPConfig.host,   //SMTP Host Address
    port: configFile.EmailSMTPConfig.port,                 //SMTP PORT
    auth: {
      user: configFile.EmailSMTPConfig.auth.user,   //Username
      pass: configFile.EmailSMTPConfig.auth.pass    //Password
    }
  });

  module.exports.notifyMail = function (fromEmail,toEmail,subjectEmail,htmlEmailTemplatePath,dataEmailTemplateBody,attachmentFilePath,attachmentFileName){

    return new Promise((resolve, reject) => {
        const templateString = fs.readFileSync(htmlEmailTemplatePath,'utf-8');
        const HTMLTemplete = ejs.render(templateString,dataEmailTemplateBody);

        let messageData = {
          from: fromEmail,
          to: toEmail,
          subject: subjectEmail,
          attachments: [{filename: attachmentFileName,path :attachmentFilePath}],
          html: HTMLTemplete
        }
        
        transporter.sendMail(messageData,(err, info) => {
          if (err) {
            let sentData = { messageData:messageData , err:err }
            reject(sentData);
          } 
          else {
            let sentData = { messageData:messageData , info:info }
            fs.unlinkSync(attachmentFilePath);
            resolve(sentData);
          }
        });
    });
  }

  module.exports.htmlToPdf =  function(templatePath,templateData){
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath,templateData)
          .then(async(html) => {
            const Upload = __dirname + '/../Uploads';
            const extend_pdf = '.pdf';
            const FileName = 'Asset_Status';
            const fileSavePath = Upload + '/' + FileName + extend_pdf;

            const browser = await puppeteer.launch();
            const page = await browser.newPage()
            await page.setContent(html)
            await page.pdf({ path: fileSavePath , format: 'A4' })
            await browser.close();
            console.log("PDF Generated")
            resolve({fileSavePath:path.join(fileSavePath),fileName:FileName + extend_pdf});
          })
          .catch((error)=>{
            reject(error);
            console.log(error)
          });
    })
  }
