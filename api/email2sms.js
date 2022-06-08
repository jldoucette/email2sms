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
/* REMOVED 23-48 FOR TESTING OF FUNCTION JLD
    console.log("*****TO NAME***** "+toName);
    console.log("*****FROM NAME***** "+fromName);
    console.log("*****FROM***** "+from);
    console.log("*****TO***** "+to);
        if (toName != "14158238255") {
            var failtest=2;
            var err ="NOT VALIDATED TO MOBILE ERR";
        console.log("#######NOT VALIDATED-NOT TO MOBILE#######");
       // return;
        }
        else if (toName == "cpanel") {
            var failtest=3;
            var err ="NOT VALIDATED TO CPANEL ERR";
            console.log("#######CPANEL BLOCKED TO########");
         //   return;
        }
        else if (fromName == "cpanel") {
            var failtest=4;
            var err ="NOT VALIDATED FROM CPANEL ERR";
            console.log("#######CPANEL BLOCKED FROM########");
           // return;
        }
    else {
   console.log("###PASSED VALIDATION###");
  */  
    
    //Sending SMS with Twilio Client
    client.messages.create({
        to: `+${toName}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `ALERT: ${body}`
      
    }).then(msg => {
        console.log(msg)
        res.status(200).send(msg.sid);
    }).catch(err => {
        console.log("$$$$$Is it this one?"+err);
          });
    }
/* REMOVED 63-75 FOR TESTING FUNCTION JLD 6/8/22 
if (failtest > 1) {
     /*   console.log("***NO VALID ERROR ROUTE--END***"+err);
            client.messages.create({
        body: `ALERT: ${body}`
      
    }).then(msg => {
        console.log("NOT SENDING"+msg);
    }).catch(err => {
        console.log(err);
          });
        console.log("***NO VALID ERROR ROUTE--END 2***"+err);
    } */
};
