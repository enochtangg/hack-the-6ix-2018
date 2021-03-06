const lib = require('lib')({ token: process.env.STDLIB_TOKEN })
const send = require('../../helpers/send.js')
const firebase = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

/**
* MORE handler, responds if user texts "more"
*  (or any uppercase variation like "MORE")
* @param {string} sender The phone number that sent the text to be handled
* @param {string} receiver The StdLib phone number that received the SMS
* @param {string} message The contents of the SMS
* @param {string} createdDatetime Datetime when the SMS was sent
* @returns {any}
*/
module.exports = async (sender = '', receiver = '', message = '', createdDatetime = '', context) => {
  let parsedMessage = message.split(" #").map((word) => word.trim().replace("#", ""));

  let db = firebase.database()
  let newMessage = '';
  let ref = db.ref("restaurants/Pho Metro");
  await ref.once("value", (snapshot) => {
    console.log(snapshot.val());
    newMessage = snapshot.val();
  });

  return send(
    receiver,
    sender,
    `This is the RESTAURANT handler for your MessageBird SMS handler on StdLib` +
      `\n\n` +
      `You can customize its behavior in /functions/messaging/more.js ${newMessage}`
  )
}
