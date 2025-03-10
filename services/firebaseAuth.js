const admin = require("firebase-admin");
const serviceAccountId = require('../config/social-media-3eec4-firebase-adminsdk-fbsvc-d6e52b8bc7.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountId),
})


// get user by uid
async function getUser(uid) {
    try {
        let user = await admin.auth().getUser(uid);
        return user;

    } catch (error) {
        console.log("Firebase Error ==> ", error);
        return null;
    }
}

// get user by email
async function getUserByEmail(email) {
    try {
        let user = await admin.auth().getUserByEmail(email);
        return user;

    } catch (error) {
        console.log("Firebase Error ==> ", error);
        return null;
    }
}

// create custom token
async function createCustomToken(uid) {
    try {
        let token = await admin.auth().createCustomToken(uid);
        return token;

    } catch (error) {
        console.log("Firebase Error ==> ", error);
        return null;
    }
}

// verify Id token that firebase genreate
async function verifyIdToken(token) {
    try {
        let verify = await admin.auth().verifyIdToken(token);
        return verify;

    } catch (error) {
        if (error.code === "auth/id-token-expired" ) {
            console.log("Firebase Error ==> ", error);
            return ("token-expired");
        }
        console.log("Firebase Error ==> ", error);
        return null;
    }
}

// update user
async function updateUser( uid, properties ) {
    try {
        let user = await admin.auth().updateUser(uid, properties)
        return user;

    } catch (error) {
        console.log("Firebase Error ==> ", error);
        return null;
    }
}


module.exports.admin = admin;
module.exports.getUser = getUser;
module.exports.updateUser = updateUser;
module.exports.verifyIdToken = verifyIdToken;
module.exports.getUserByEmail = getUserByEmail;
module.exports.createCustomToken = createCustomToken;