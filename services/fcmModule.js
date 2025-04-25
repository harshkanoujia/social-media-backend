const { admin } = require('../services/firebaseAuth');
const deviceToken = "e1a9S7VczUGHmfgVHh0HQx:APA91bH33AR24PWoyU4Hfb8fQzpPf6zCae2lugU5xvP_Btvf_6nPAfBu4oRsZvoV-I3ZLDhy4PBCdOEQbkx6sIdftw3F7QqHnM0x4ImsZ1SPiy1e8A6xyKM";

let msg = "Discover exciting events happening near you and add a little fun to your week! Explore events now!"



const data = {
    type: "midWeek",
    title: "mid-week",
    body: msg,
    receiverId: "680b03587c04125326ba557b",
    click_action: "FLUTTER_NOTIFICATION_CLICK"
  };

const message = {
    token: deviceToken,
    data: data,
    notification: {
        title: "Test notification",
        body: formatter(msg, data)
    },
};


// send notification thorugh firebase
async function sendNotification() {
    try {
        const response = await admin.messaging().send(message);
        console.log("Notification is send on Device :  ", response);
    } catch (error) {
        console.log(error);
    }
}


// sendNotification();

module.exports.sendNotification = sendNotification;


function formatter(stringData, dataObject) {
    let keyArray = Object.keys(dataObject);
    let valueArray = Object.values(dataObject);

    let newString = stringData;
    keyArray.forEach(function (element, index) {
        let text = new RegExp("\\$" + element + "\\$", "g");
        newString = newString.replace(text, valueArray[index]);
    });
    return newString;
}