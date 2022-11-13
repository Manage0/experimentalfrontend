const { https } = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

const corsHandler = cors({ origin: true });
const db = admin.firestore();

const handleDelete = async (req, res) => {
  corsHandler(req, res, async () => {
    validateFirebaseToken(req, res, async () => ifAuthed(req, res));
  });
};
const validateFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === "someSuperSecretToken") {
    next();
  } else {
    console.error(
      "No Firebase ID token was passed as a Bearer token in the Authorization header."
    );
    res.send({ status: 500 });
    return;
  }
};

async function ifAuthed(req, res) {
  if (!req.query) {
    console.log("Request query error: " + JSON.stringify(req.query));
    res.send({ status: 500 });
    return;
  }
  const name = req.query.name;
  console.log("Recieved URL query: ", JSON.stringify(req.query));
  try {
    await db.doc("ExperimentalPlayers/" + name).set({ name });
    res.send({ status: 200 });
  } catch (error) {
    console.log("Cannot set user data " + name + " on firestore.");
    console.log(error);
    res.send({ status: 500 });
  }
}

module.exports = https.onRequest(handleDelete);
