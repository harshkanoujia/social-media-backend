const config = require('config')
const twilio = require('twilio')

// live credentials 
const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')
const toFrom = config.get('call_twilio.call_from_number')
const toSend = config.get('call_twilio.call_client')


// // test credentials 
// const accountSid = config.get('twilio_credentials_test.TWILIO_ACCOUNT_SID_TEST')
// const authToken = config.get('twilio_credentials_test.TWILIO_AUTH_TOKEN_TEST')
// const toFrom = config.get('twilio_credentials_test.FROM_TEST')
// const toSend = config.get('twilio_credentials_test.TO_TEST')


const client = twilio(accountSid, authToken)
const VoiceResponse = twilio.twiml.VoiceResponse      // Twilio Voice ke TwiML responses handle karne ke liye use hota hai, but yaha iska koi use nahi hai.


// call send
async function sendCall() {
    const call = await client.calls.create({
      from: toFrom,
      to:  toSend,
      url: 'https://f346-122-161-197-132.ngrok-free.app/api/call/conference',        
      statusCallback: 'https://54ed-122-161-197-132.ngrok-free.app/api/call/status',
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed']                   ,
    });
    
    console.log( "Caller Id => ", call.sid);
    return ({ SId: call.sid , receiver: toSend})
}

// conference logic 
async function conferenceCall() {
    const response = new VoiceResponse()

    response.dial().conference('MyConferenceRoom', {
        startConferenceOnEnter: true,                                         // Jab participant join kare, tabhi conference start ho
        endConferenceOnExit: false                                            // Agar ek participant nikle, to conference band na ho
    });

    return response
}


module.exports = {
    sendCall,
    conferenceCall
} 