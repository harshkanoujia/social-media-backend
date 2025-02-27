const express = require('express');
const sendCall = require('../services/twilioCallApis')
const sendSmsMessage = require('../services/twilioSendSms')
const { sendWhatsappMsgWithContentSid, sendWhatsappMsgWithBody } = require('../services/twilioWhatsappMsg');
const createRoom = require('../services/twilioRoom');
const generateToken = require('../services/twilioRoom');
const { User } = require('../models/User')
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

// send message on whatsapp with contentSid
router.post('/whatsapp/contentsid', async ( req , res ) => {                                                       
    
    const messageSid = await sendWhatsappMsgWithContentSid()
    
    res.status(200).json({ statusCode: 200, message: 'Success', data: { msg: 'Whatsapp Message sent on number', 'MessageSid ': messageSid } })
})

// send message on whatsapp with body without contentSid  
router.post('/whatsapp/body', async ( req , res ) => {                                                       
    
    const messageSid = await sendWhatsappMsgWithBody()
    
    res.status(200).json({ statusCode: 200, message: 'Success', data: { msg: 'Whatsapp Message thorugh body sent on number', 'MessageSid ': messageSid } })
})

// create Room for video call
router.post('/createRoom', async ( req , res ) => {                                                       
    const user = await User.findOne({ username: 'Kashish'});
    console.log("User found:", user, '\n');

    const identity = user.id;
    console.log('indentity ==> ', identity , '\n')

    const roomId = await createRoom("firstRoom");
    const token = await generateToken( identity, roomId); 
    console.log('roomId ==> ', roomId , '\n')
    console.log('token ==> ', token , '\n')

  
    res.status(200).json({ statusCode: 200, message: 'Success',  "token": token, "roomId": roomId })
})


module.exports = router;