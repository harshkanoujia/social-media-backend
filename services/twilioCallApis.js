const config = require('config');
const twilio = require('twilio');

// live credentials 
const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID');
const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN');
const toFrom = config.get('call_twilio.call_from_number');
const toSend = config.get('call_twilio.call_client');

const ngrokServer = config.get('ngrok_server');

// // test credentials  // twilio provides the test credentials which is not do actual call or msg
// const accountSid = config.get('twilio_credentials_test.TWILIO_ACCOUNT_SID_TEST');
// const authToken = config.get('twilio_credentials_test.TWILIO_AUTH_TOKEN_TEST');
// const toFrom = config.get('twilio_credentials_test.FROM_TEST');
// const toSend = config.get('twilio_credentials_test.TO_TEST');


const client = twilio( accountSid, authToken, {
    lazyLoading: false,         // twilio-node supports lazy loading required modules for faster loading time. Lazy loading is enabled by default. To disable lazy loading, simply instantiate the Twilio client with the lazyLoading flag set to false      
    autoRetry: true,            // twilio-node supports automatic retry with exponential backoff when API requests receive an Error 429 response. This retry with exponential backoff feature is disabled by default. To enable this feature, instantiate the Twilio client with the autoRetry flag set to true.
    maxRetries: 3,              //  the maximum number of retries performed by this feature can be set with the maxRetries flag. The default maximum number of retries is 3
    logLevel: 'debug',
})


// Twilio Voice ke TwiML responses handle karne ke liye use hota hai
const VoiceResponse = twilio.twiml.VoiceResponse     


// simple call
async function initiateCall(phoneNumber) {
    const call = await client.calls.create({
        from: toFrom,
        to:  phoneNumber,     //|| toSend
        // twiml: "<Response><Say>Ahoy there!</Say></Response>",
        url: `${ngrokServer}/api/call/conference`,
        statusCallback: `${ngrokServer}/api/call/status`,                                                 // yeh initiate krega ki status vali api bhi hit ho 
        statusCallbackEvent: [ 'initiated', 'ringing', 'answered', 'completed' ]                          // yeh track kr payega ki kya status hai       
    });
    
    console.log( "Caller Id => ", call.sid);
    return ({ SId: call.sid , receiver: toSend});
} 

// conference call          
async function conferenceCall() {
    const response = new VoiceResponse();
    
    response.say('You are now connected to the call.');
    response.dial().conference('MyConferenceRoom', {
        startConferenceOnEnter: true,                                         // Jab participant join kare, tabhi conference start ho
    });

    return response;
}

// add participant call
async function addParticipantInCall(phoneNumber) {
    const participant = await client.conferences('MyConferenceRoom').participants.create({
        from: toFrom,
        to: phoneNumber, 
        startConferenceOnEnter: true,
        earlyMedia: true,
        endConferenceOnExit: false                              
    });
    
    console.log( "Caller Id => ", participant.sid);
    return ({ SId: participant.sid , receiver: toSend});
} 


module.exports = {
    initiateCall,
    conferenceCall,
    addParticipantInCall
} 