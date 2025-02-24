const express = require('express');
const { sendCall, sendSmsMessage, sendWhatsappMessage, sendWhatsappReplyMessage } = require('../services/twilioCallApis')
const router = express.Router();

// create call
router.post('/', async ( req , res ) => {                                                 
    const callSid = await sendCall()
    
    res.status(200).json({ statusCode: 200, message: 'Success', data: { msg: 'Call will be ring on number', 'CallerSid ': callSid } })
})

// send message on sms
router.post('/sms', async ( req , res ) => {                                                       
    
    const messageSid = await sendSmsMessage()
    
    res.status(200).json({ statusCode: 200, message: 'Success', data: { msg: 'Sms Message sent on number', 'MessageSid ': messageSid } })
})

// send message on whatsapp
router.post('/whatsapp', async ( req , res ) => {                                                       
    
    const messageSid = await sendWhatsappMessage()
    
    res.status(200).json({ statusCode: 200, message: 'Success', data: { msg: 'Whatsapp Message sent on number', 'MessageSid ': messageSid } })
})

// send reply message on whatsapp  
router.post('/whatsapp/reply', async ( req , res ) => {                                                       
    
    const messageSid = await sendWhatsappReplyMessage()
    
    res.status(200).json({ statusCode: 200, message: 'Success', data: { msg: 'Whatsapp reply Message sent on number', 'MessageSid ': messageSid } })
})

module.exports = router;