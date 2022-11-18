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
  res.send({
    status: 200,
    data: [
      {
        team: "Team1",
        points: 5,
      },
      {
        team: "Team2",
        points: 4,
      },
      {
        team: "Team3",
        points: 3,
      },
      {
        team: "Team4",
        points: 2,
      },
      {
        team: "Team5",
        points: 1,
      },
    ],
  });
}

module.exports = https.onRequest(handleDelete);
