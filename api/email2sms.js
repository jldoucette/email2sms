const util = require('util');
const multer = require('multer');
const addrs = require("email-addresses");
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

module.exports = async (req, res) => { 
    const client = twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);
    await util.promisify(multer().any())(req, res);

    const from = req.body.from;
    const to = req.body.to;
    const subject = req.body.subject;
    const body = req.body.text;
    
    var failtest = 1;

    //Using email-addresses library to extract email details.
    const toAddress = addrs.parseOneAddress(to);
    const toName = toAddress.local;
    const fromAddress = addrs.parseOneAddress(from);
    const fromName = fromAddress.local;
    console.log("*****TO NAME***** "+toName);
    console.log("*****FROM NAME***** "+fromName);
    console.log("*****FROM***** "+from);
    console.log("*****TO***** "+to);
        if (toName != "14158238255") {
        console.log("#######NOT VALIDATED-NOT TO MOBILE#######");
        var failtest=2;
       // return;
        }
        else if (toName= "cpanel") {
            console.log("#######CPANEL BLOCKED TO########");
         var failtest=3;
         //   return;
        }
        else if (fromName = "cpanel") {
            console.log("#######CPANEL BLOCKED FROM########");
            var failtest=4;
           // return;
        }
    else {
   console.log("###PASSED VALIDATION###");
    
    
    //Sending SMS with Twilio Client
    client.messages.create({
        to: `+${toName}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `ALERT: ${body}`
      
    }).then(msg => {
        console.log(msg)
        res.status(200).send(msg.sid);
    }).catch(err => {
        console.log(err);
          });
    }
    if (failtest > 1) {
        console.log("***NO VALID ERROR ROUTE--END***"+err);
            client.messages.create({
        body: `ALERT: ${body}`
      
    }).then(msg => {
        console.log("NOT SENDING"+msg);
    }).catch(err => {
        console.log(err);
          });
    }
};
