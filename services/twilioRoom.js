const config = require('config')
const twilio = require('twilio')

// live credentials
const accountSid = config.get('twilio_credentials.TWILIO_ACCOUNT_SID')
const authToken = config.get('twilio_credentials.TWILIO_AUTH_TOKEN')

// test credentials 
// const accountSid = config.get('twilio_credentials_test.TWILIO_ACCOUNT_SID_TEST')
// const authToken = config.get('twilio_credentials_test.TWILIO_AUTH_TOKEN_TEST')

const client = twilio(accountSid, authToken)

const apiKey = config.get("twilio_credentials.TWILIO_API_KEY");
const apiSecret = config.get("twilio_credentials.TWILIO_API_SECRET");

const AccessToken = require("twilio").jwt.AccessToken;              // Twilio ke JWT (JSON Web Token) ka module hai jo authentication ke liye use hota hai.
const VideoGrant = AccessToken.VideoGrant;                          // Twilio Video service ka access dene ke liye required hai.
const VoiceGrant = AccessToken.VoiceGrant;                          // Twilio Voice calls ke access ke liye hota hai, lekin is function me use nahi ho raha.


// token generate for joining the room 
async function generateToken(identity, room) {
    // Token Initialization (Corrected Order)
    const token = new AccessToken(accountSid, apiKey, apiSecret, { identity });
    token.identity = identity;
  
    // Grant the access token Twilio Video capabilities
    const grant = new VideoGrant();
    grant.room = room;
    token.addGrant(grant);
    
    console.log("TOKEN Grant  ==> ", token, '\n');

    // Serialize the token to a JWT string
    return token.toJwt();
}

// create room 
async function createRoom(roomName) {
    const room = await client.video.v1.rooms.create({
      type: "group",
      uniqueName: roomName,
    });

    return ({ roomSID: room.sid, roomName: roomName , roomDetails: room })
}


module.exports = {
    generateToken,
    createRoom
}