const admin = require("firebase-admin");
admin.initializeApp();

const addPlayer = require("./addPlayer");

exports.addPlayer = addPlayer;

const leaderboardAPI = require("./leaderboardAPI");

exports.leaderboardAPI = leaderboardAPI;
