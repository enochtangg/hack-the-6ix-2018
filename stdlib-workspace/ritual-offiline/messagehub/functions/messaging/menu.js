const lib = require('lib')({
  token: process.env.STDLIB_TOKEN
})
const send = require('../../helpers/send.js');
const firebase = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

let db = null;

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
  // Initialize firebase app
  if (!db) {
    await firebase.initializeApp({
      credential: firebase.credential.cert(serviceAccount),
      databaseURL: "https://hack-the-6ix-201-1535217409242.firebaseio.com/"
    });
    db = await firebase.database()
  }

  // Parse message into usable elements
  let parsedMessage = message.split(" #").map((word) => word.trim().replace("#", ""));

  if (parsedMessage.length != 2) {
    return send(
      receiver,
      sender,
      `Please enter a valid statement.`
    );
  }


  // Query Firebase
  let ref = db.ref("restaurants/" + parsedMessage[1] + "/menu");
  let snapshot = await ref.once("value");

  let dataJSON = snapshot.val();
  let menu = '';

  for (const key of Object.keys(dataJSON)) {
    menu += "\n" + key + ": $" + dataJSON[key];
  }

  console.log(menu);

  return send(
    receiver,
    sender,
    `The menu for ${parsedMessage[1]} is: \n ${menu}`
  );
}
