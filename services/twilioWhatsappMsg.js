const config = require('config')
const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')

const client = require('twilio')(accountSid, authToken)

const formWhatsapp = config.get('whatsapp_twilio.FROM_WHATSAPP')
const toWhatsapp = config.get('whatsapp_twilio.TO_WHATSAPP') 
const contentSidAppointment = config.get('whatsapp_twilio.CONTENT_SID_APPOINTMENT')
const contentSidOrderNotification = config.get('whatsapp_twilio.CONTENT_SID_ORDER_NOTIFICATION')
const contentSidVerificationCode = config.get('whatsapp_twilio.CONTENT_SID_VERIFICATION_CODE')


// whatsapp message send with content sid 
async function sendWhatsappMsgWithContentSid() {
    const message = await client.messages.create({
        from: formWhatsapp, 
        
        contentSid: contentSidAppointment, 
        // contentSid: contentSidOrderNotification, 
        contentVariables: '{"1":"12/1","2":"3pm"}',          // key value replaced by its value 

        // contentSid: contentSidVerificationCode,
        // contentVariables: '{"1":"409173"}',
        to: toWhatsapp      
    })

    console.log( "Message Id => " , message.sid )
    return message.sid
}

// on whatsapp without contentSid Appiontment reminder          // in this first user have to sent you msg then after you sent msg
async function sendWhatsappMsgWithBody() {
    const message = await client.messages.create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: formWhatsapp,
        to: toWhatsapp
    })

    console.log( "Message Id => " , message.sid )
    return message.sid
}

module.exports = {
    sendWhatsappMsgWithBody,
    sendWhatsappMsgWithContentSid
}