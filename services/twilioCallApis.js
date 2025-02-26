const config = require('config')
const twilio = require('twilio')

// live credentials 
// const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
// const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')
// const toFrom = config.get('call_twilio.call_from_number')
// const toSend = config.get('call_twilio.call_client')


// test credentials 
const accountSid = config.get('twilio_credentials_test.TWILIO_ACCOUNT_SID_TEST')
const authToken = config.get('twilio_credentials_test.TWILIO_AUTH_TOKEN_TEST')
const toFrom = config.get('twilio_credentials_test.FROM_TEST')
const toSend = config.get('twilio_credentials_test.TO_TEST')


const client = twilio(accountSid, authToken)


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