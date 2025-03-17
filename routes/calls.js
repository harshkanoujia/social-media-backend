const express = require('express');
const { sendCall, conferenceCall, sendConferenceCall } = require('../services/twilioCallApis')
const sendSmsMessage = require('../services/twilioSendSms')
const { sendWhatsappMsgWithContentSid, sendWhatsappMsgWithBody } = require('../services/twilioWhatsappMsg');
const { generateToken, createRoom } = require('../services/twilioRoom');
const { User } = require('../models/User');
const router = express.Router();


// create call          // hit with start the ngrok and that link would be in the twilio
router.post('/', async ( req , res ) => {                                                 
    const phoneNumber = req.query.phoneNumber

    const callSid = await sendCall(phoneNumber);
    
    res.status(200)
        .json({ 
            statusCode: 200, 
            message: 'Success', 
            data: { msg: `Call will be ring on number ${ callSid.receiver }`, 'CallerSid': callSid.SId } 
        })
})

// call normal
router.post('/normal', (req, res) => {
    const response = new VoiceResponse();
    response.say('You are now connected to the call.');
    response.dial(toSend); 
    res.type('text/xml');
    res.send(response.toString());
});

// send message on sms
router.post('/sms', async ( req , res ) => {                                                       
    
    const messageSid = await sendSmsMessage()
    
    res.status(200)
    .json({ 
        statusCode: 200, 
        message: 'Success', 
        data: { msg: `Sms Message sent on number ${ messageSid.receiver }`, 'MessageSid': messageSid.SId } 
    })
})

// send message on whatsapp with contentSid
router.post('/whatsapp/contentsid', async ( req , res ) => {                                                       
    
    const messageSid = await sendWhatsappMsgWithContentSid()
    
    res.status(200)
    .json({ 
        statusCode: 200, 
        message: 'Success', 
        data: { msg: `Whatsapp Message sent on this ${ messageSid.receiver }`, 'MessageSid ': messageSid.SId } 
    })
})

// send message on whatsapp with body without contentSid  
router.post('/whatsapp/body', async ( req , res ) => {                                                       
    
    const messageSid = await sendWhatsappMsgWithBody()
    
    res.status(200)
    .json({ 
        statusCode: 200, 
        message: 'Success', 
        data: { msg: `Whatsapp Message sent with body of data on this ${ messageSid.receiver }`, 'MessageSid ': messageSid.SId } 
    })
})

// create Room for video call
router.post('/createRoom', async ( req , res ) => {                                                       
    const user = await User.findOne({ fullName: 'David'});
    
    const identity = user.id;
    
    const roomId = await createRoom(req.body.roomName);
    const token = await generateToken( identity, roomId.roomSID ); 
    

    console.log("User found:", user, '\n');
    console.log('indentity ==> ', identity , '\n')
    console.log('RoomId ==> ', roomId.roomSID , '\n')
    console.log("Room Details ==> ", roomId.roomDetails , '\n' );
    console.log('token ==> ', token , '\n')

    res.status(200)
    .json({ 
        statusCode: 200, 
        message: 'Success', 
        data: { 
            roomId:  roomId.roomSID, 
            roomName:  roomId.roomName,
            token: token 
        }
    })
})

// conference call reference 
router.post('/call-conference', async ( req , res ) => {

    const phoneNumber = req.params.phoneNumber;
    const callSid = await sendConferenceCall(phoneNumber);
    
    res.status(200)
    .json({ 
        statusCode: 200, 
        message: 'Success', 
        data: { msg: `Call will be ring on number ${ callSid.receiver }`, 'CallerSid ': callSid.SId } 
    })
})

// conference call reference 
router.post('/conference', async ( req , res ) => {    
    const result = await conferenceCall();
    res.type('text/xml');
    console.log("Conference XML Response: ", result.toString())
    
    res.send(result.toString());
})


// check status
router.post('/status', (req, res) => {
    const callStatus = req.body.CallStatus;                 // Twilio se call ka status milega
    console.log(" \n Twilio Call Status:", callStatus);

    if (callStatus === 'in-progress') {
        console.log(" \n  Call is pickup, ab conference me dalne ke liye webhook call hoga.   \n ");
    } else if (callStatus === 'completed') {
        console.log("  \n  Call is End now.  \n ");
    }

    res.status(200);                                        // Twilio ko batayenge ki response receive ho gaya
});


module.exports = router;