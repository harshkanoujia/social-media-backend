const config = require('config')
const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')

const client = require('twilio')(accountSid, authToken)

const toFrom = config.get('call_twilio.call_from_number')
const toSend = config.get('call_twilio.call_client')


// call send
async function sendCall() {
    const call = await client.calls.create({
      from: toFrom,
      to:  toSend,
      url: "http://demo.twilio.com/docs/voice.xml",
    });
    
    console.log( "Caller Id => ", call.sid);
    return call.sid
}


module.exports = sendCall;