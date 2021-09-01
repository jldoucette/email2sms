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

    //Using email-addresses library to extract email details.
    const toAddress = addrs.parseOneAddress(to);
    const toName = toAddress.local;
    const fromAddress = addrs.parseOneAddress(from);
    const fromName = fromAddress.local;
    console.log('*****TO ADDRESS*****' toAddress);
    console.log('*****TO NAME***** toName);
    console.log('*****FROM ADDRESS*****' fromAddress);
    console.log('*****FROM NAME*****' fromName);
    console.log('*****FROM*****' from);
    console.log('*****TO*****' to);
    
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
};
