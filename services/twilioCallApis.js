require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = require('twilio')(accountSid, authToken)

const toFrom = process.env.FROM
const toSend = process.env.TO_SEND

const formWhatsapp = process.env.FROM_WHATSAPP
const toWhatsapp = process.env.TO_WHATSAPP
const contentSidAppointment = process.env.CONTENT_SID_APPOINTMENT
const contentSidOrderNotification = process.env.CONTENT_SID_ORDER_NOTIFICATION
const contentSidVerificationCode = process.env.CONTENT_SID_VERIFICATION_CODE

// call sent
async function sendCall() {
    const call = await client.calls.create({
      from: toFrom,
      to:  toSend,
      url: "http://demo.twilio.com/docs/voice.xml",
    });
    
    console.log( "Caller Id => ", call.sid);
    return call.sid
}
  
//sms message sent
async function sendSmsMessage() {
    const message = await client.messages.create({
        body: 'Hii this message is from Twilio your account is created',
        from: toFrom,
        to: toSend
    })
    console.log( "Message Id => " , message.sid )
    return message.sid
}

// whats app message send 
async function sendWhatsappMessage() {
    const message = await client.messages.create({
        from: formWhatsapp, 
        
        // contentSid: contentSidAppointment, 
        // contentSid: contentSidOrderNotification, 
        // contentVariables: '{"1":"12/1","2":"3pm"}',          // key value replaced by its value 

        contentSid: contentSidVerificationCode,
        contentVariables: '{"1":"409173"}',
        to: toWhatsapp      
    })

    console.log( "Message Id => " , message.sid )
    return message.sid
}

// on whatsapp reply message
async function sendWhatsappReplyMessage() {
    const message = await client.messages.create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: 'whatsapp:+14155238886',
        to: 'whatsapp:+918699298843'
    })
    console.log( "Message Id => " , message.sid )
    return message.sid
}


module.exports = {
    sendCall,
    sendSmsMessage,
    sendWhatsappMessage,
    sendWhatsappReplyMessage
}