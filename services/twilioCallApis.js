const config = require('config')
const twilio = require('twilio')

// live credentials 
const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')
const toFrom = config.get('call_twilio.call_from_number')
const toSend = config.get('call_twilio.call_client')


// // test credentials  // twilio provides the test credentials which is not do actual call or msg
// const accountSid = config.get('twilio_credentials_test.TWILIO_ACCOUNT_SID_TEST')
// const authToken = config.get('twilio_credentials_test.TWILIO_AUTH_TOKEN_TEST')
// const toFrom = config.get('twilio_credentials_test.FROM_TEST')
// const toSend = config.get('twilio_credentials_test.TO_TEST')


const client = twilio( accountSid, authToken, {
// twilio-node supports lazy loading required modules for faster loading time. Lazy loading is enabled by default. To disable lazy loading, simply instantiate the Twilio client with the lazyLoading flag set to false
    lazyLoading: false,                 
    
// twilio-node supports automatic retry with exponential backoff when API requests receive an Error 429 response. This retry with exponential backoff feature is disabled by default. To enable this feature, instantiate the Twilio client with the autoRetry flag set to true.
    autoRetry: true,                

//  the maximum number of retries performed by this feature can be set with the maxRetries flag. The default maximum number of retries is 3
    maxRetries: 3,

    logLevel: 'debug',
})


// Twilio Voice ke TwiML responses handle karne ke liye use hota hai, but yaha iska koi use nahi hai.
const VoiceResponse = twilio.twiml.VoiceResponse      


// call send
async function sendCall() {
    const call = await client.calls.create({
      from: toFrom,
      to:  toSend,
      url: 'https://4d64-122-161-197-132.ngrok-free.app/api/call/conference',        
      statusCallback: 'https://4d64-122-161-197-132.ngrok-free.app/api/call/status',                // yeh initiate krega ki status vali api bhi hit ho 
      statusCallbackEvent: [ 'initiated', 'ringing', 'answered', 'completed' ]                        // yeh track kr payega ki kya status hai       
    });
    
    console.log( "Caller Id => ", call.sid);
    return ({ SId: call.sid , receiver: toSend})
}

// conference logic 
async function conferenceCall() {
    const response = new VoiceResponse()

    response.dial().conference('MyConferenceRoom', {
        startConferenceOnEnter: true,                                         // Jab participant join kare, tabhi conference start ho
    });

    return response;
}


module.exports = {
    sendCall,
    conferenceCall
} 