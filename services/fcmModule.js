const config = require('config')
const serverKey = require('../config/social-media-3eec4-firebase-adminsdk-fbsvc-5cdabda973.json')
var admin = require("firebase-admin")

admin.initializeApp({
    credential: admin.credential.cert(serverKey),
    databaseURL: config.get("firebase_realtime_db")
})

// basic msg
async function msg(title, body) {
    const message = {
        data: {
            title: title,
            body: body
        },
        topic: 'Global'
    }

    return await admin.messaging().send(message)
}


module.exports = msg;