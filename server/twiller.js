const tw = require("./config.js");
// console.log(`${tw.twilio_creds.sid},${tw.twilio_creds.auth}`);
const client = require("twilio")(tw.twilio_creds.sid, tw.twilio_creds.auth);

var sendSMS = toPhone => {
  console.log("toPhone => ", toPhone);
  client.messages
    .create({
      body:
        "Your vehicle has a recall. Please visit the following URL for further instructions",
      from: "+16263178548",
      to: `"${toPhone}"`
    })
    .then(message => console.log(message.sid));
};

module.exports = { sendSMS };
