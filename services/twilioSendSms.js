const config = require('config')
const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')

const client = require('twilio')(accountSid, authToken)

const toFrom = config.get('smsc_twilio.sms_from_number')
const toSend = config.get('smsc_twilio.sms_client')


// sms message send
async function sendSmsMessage() {
    const message = await client.messages.create({
        body: 'Hii this message is from Twilio your account is created',
        from: toFrom,
        to: toSend
    })
    console.log( "Message Id => " , message.sid )
    return message.sid
}

module.exports = sendSmsMessage;