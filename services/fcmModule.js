const config = require('config')
const serviceAccountId = require('../config/social-media-3eec4-firebase-adminsdk-fbsvc-d6e52b8bc7.json')
var admin = require("firebase-admin")

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountId),
    databaseURL: config.get("firebase_realtime_db")
})


async function getUserByEmail(req) {
    
}

module.exports.admin = admin;