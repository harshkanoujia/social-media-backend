const config = require('config')
const twilio = require('twilio')

// // Live credentials
// const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
// const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')

// const toFrom = config.get('smsc_twilio.sms_from_number')
// const toSend = config.get('smsc_twilio.sms_client')


// test credentials 
const accountSid = config.get('twilio_credentials_test.TWILIO_ACCOUNT_SID_TEST')
const authToken = config.get('twilio_credentials_test.TWILIO_AUTH_TOKEN_TEST')
const toFrom = config.get('twilio_credentials_test.FROM_TEST')
const toSend = config.get('twilio_credentials_test.TO_TEST')


const client = twilio(accountSid, authToken)

// sms message send
async function sendSmsMessage() {
    const message = await client.messages.create({
        body: 'Hii this message is from Twilio your account is created',
        from: toFrom,
        to: toSend
    })

    console.log( "Message Id => " , message.sid )
    return ({ SId: message.sid, receiver: toSend })

}


module.exports = sendSmsMessage;