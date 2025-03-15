const { admin } = require('../services/firebaseAuth');


const deviceToken = "fGppAAvmRCG1q3mJkbNefC:APA91bEo-6qXLYmBm4rDRKz__zRsCfX_99VAKgSr64Sf--KYDU6yAN-uWSqTeZKmcNUMoqllP4p-iba85iqCuim4TmnQyWgtBipClNafcm6STftOMIkq8Bw";


// send notification thorugh firebase
async function sendNotification() {
    const message = {
        token: deviceToken,
        notification: {
            title: "Test notification",
            body: "this is test notification"
        }
    }
    try {
        const response = await admin.messaging().send(message);
        console.log("Notification is send on Device :  ", response );
    } catch (error) {
        console.log(error);
    }
}


module.exports.sendNotification = sendNotification;