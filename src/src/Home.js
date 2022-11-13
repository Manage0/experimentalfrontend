import React, { useEffect, useState } from "react";
import {
  db,
  getExperimentalMatches,
  getExperimentalNews,
  getExperimentalPlayers,
} from "./firebase-config";
import axios from "axios";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { Button, ButtonGroup, Card, CardContent } from "@mui/material";

const Home = () => {
  const [mode, setMode] = useState("news");
  const [news, setNews] = useState([{ title: "some title" }]);
  const [players, setPlayers] = useState([{ name: "Loading..." }]);
  const [matches, setMatches] = useState();
  const [newPlayer, setNewPlayer] = useState();
  const [leaderboard, setLeaderboard] = useState();

  async function getData() {
    const tempNews = await getExperimentalNews();
    setNews(tempNews);
    const tempPlayers = await getExperimentalPlayers();
    setPlayers(tempPlayers);
    const tempMatches = await getExperimentalMatches();
    setMatches(tempMatches);
    axios.defaults.headers.get["authorization"] = "someSuperSecretToken";
    const { data } = await axios.get(
      "https://us-central1-siofok-kc-prod.cloudfunctions.net/leaderboardAPI"
    );
    setLeaderboard(data.data);
  }

  async function addPlayer() {
    axios.defaults.headers.get["authorization"] = "someSuperSecretToken";
    await axios.get(
      "https://us-central1-siofok-kc-prod.cloudfunctions.net/addPlayer",
      {
        params: {
          name: newPlayer,
        },
      }
    );
    await getData();
    alert("Saved");
  }

  useEffect(() => {
    getData();
  }, [mode]);

  const listStyle = {
    border: "1px solid rgb(10,132,255)",
    width: "100%",
    padding: "5px",
    borderRadius: "5px",
    marginBottom: "5px",
  };
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [voting, setVoting] = useState({});
  const [items2, setItems2] = useState([]);
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [value4, setValue4] = useState(null);
  const [items4, setItems4] = useState([]);
  const [matchesWVoting, setMatchesWVoting] = useState();

  useEffect(() => {
    async function getData() {
      const tempPlayers = await getExperimentalPlayers();
      setPlayers(tempPlayers);
      async function getExperimentalVoting() {
        const citiesCol = collection(db, "ExperimentalVoting");
        const citySnapshot = await getDocs(query(citiesCol));
        const cityList = citySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        return cityList;
      }
      const tempVotings = await getExperimentalVoting();
      const tempVotings2 = [];
      tempVotings.forEach((voting) => {
        if (voting.on) {
          tempVotings2.push(voting.match);
        }
      });
      const tempMatches = await getExperimentalMatches();
      const tempItems2 = [];
      tempMatches.forEach((match) => {
        tempItems2.push({
          label: match.home + " vs. " + match.guest,
          value: match.id,
        });
      });
      setItems2(tempItems2);
      const tempMatchesWVoting = [];
      tempMatches.forEach((match) => {
        if (tempVotings2.includes(match.id)) {
          tempMatchesWVoting.push({
            label: match.home + " vs. " + match.guest,
            value: match.id,
          });
        }
      });
      setMatchesWVoting(tempMatchesWVoting);
    }
    getData();
  });

  useEffect(() => {
    async function getData() {
      async function getExperimentalVoting() {
        const citiesCol = collection(db, "ExperimentalVoting");
        const citySnapshot = await getDocs(query(citiesCol));
        const cityList = citySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        return cityList;
      }
      const tempVotings = await getExperimentalVoting();

      tempVotings.forEach((voting) => {
        if (voting.match === selectedMatch) {
          setVoting(voting);
          const tempPlayers = [];
          voting.players.forEach((player) => {
            tempPlayers.push({ label: player.name, value: player.name });
          });
          const tempVotingResultPlayers = [];
          voting.players.forEach((player) => {
            tempVotingResultPlayers.push({
              name: player.name,
              points: player.points,
            });
          });
          setItems4(tempPlayers);
        }
      });
    }
    getData();
  }, [selectedMatch]);

  const [saved, setSaved] = useState(false);

  async function Vote() {
    const tempPlayers = [];
    voting.players.forEach((player) => {
      if (player.name === value4) {
        player.points = player.points + 1;
      }
      tempPlayers.push(player);
    });
    console.log(tempPlayers);
    await updateDoc(doc(db, "ExperimentalVoting/" + voting.id), {
      players: tempPlayers,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div
      style={{
        padding: "5px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img
        src="https://w7.pngwing.com/pngs/261/803/png-transparent-african-mens-handball-championship-ihf-world-mens-handball-championship-international-handball-federation-sport-handball-pic-hand-team-association.png"
        alt="logo"
        style={{
          position: "absolute",
          left: 10,
          top: 10,
          width: "40px",
          height: "40px",
          borderRadius: "40%",
        }}
      />
      <div
        style={{
          padding: "5px",
          display: "flex",
          justifyContent: "center",
          background:
            "-moz-linear-gradient(98deg, rgba(0,108,255,1) 0%, rgba(236,244,248,1) 100%)",
          width: "100%",
        }}
      >
        <ButtonGroup sx={{ background: "white" }}>
          <Button
            sx={mode === "news" ? { background: "lightgray" } : {}}
            onClick={() => setMode("news")}
          >
            News
          </Button>
          <Button
            sx={mode === "players" ? { background: "lightgray" } : {}}
            onClick={() => setMode("players")}
          >
            Players
          </Button>
          <Button
            sx={mode === "matches" ? { background: "lightgray" } : {}}
            onClick={() => setMode("matches")}
          >
            Matches
          </Button>
          <Button
            sx={mode === "leaderboard" ? { background: "lightgray" } : {}}
            onClick={() => setMode("leaderboard")}
          >
            Leaderboard
          </Button>
          <Button
            sx={mode === "voting" ? { background: "lightgray" } : {}}
            onClick={() => setMode("voting")}
          >
            Voting
          </Button>
        </ButtonGroup>
      </div>
      {mode === "news" && (
        <div style={{ paddingTop: "5px" }}>
          {news.map((item) => {
            return (
              <Card variant="outlined" key={item.title}>
                <CardContent>
                  <h2>{item.title}</h2>
                </CardContent>
                <CardContent>
                  <h4>{item.content}</h4>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {mode === "players" && (
        <div>
          {players.map((item) => {
            return (
              <div style={listStyle} key={item.name}>
                <p style={{ color: "blue" }}>{item.name}</p>
              </div>
            );
          })}
          <input
            type="text"
            placeholder="new player name"
            onChange={(e) => setNewPlayer(e.target.value)}
          ></input>
          {/*<button style={btnStyle} onClick={() => addPlayer()}>
            Add player
        </button>*/}
        </div>
      )}
      {mode === "matches" && (
        <div>
          {matches.map((item) => {
            return (
              <div style={listStyle} key={item.home + Math.random()}>
                <p style={{ color: "blue" }}>
                  {item.home} vs. {item.guest}
                  <br />
                  {item.homePoints} - {item.guestPoints}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {mode === "leaderboard" && (
        <div>
          {leaderboard.map((item) => {
            return (
              <div style={listStyle} key={item.home + Math.random()}>
                <p style={{ color: "blue" }}>
                  {item.team} - {item.points}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {mode === "voting" && (
        <div>
          {saved && <div>Saved</div>}
          <select
            onClick={(e) => {
              setSelectedMatch(e.target.value);
            }}
          >
            {matchesWVoting.map((item) => {
              return (
                <option key={item.label} value={item.value}>
                  {item.label}
                </option>
              );
            })}
          </select>
          <select
            onClick={(e) => {
              setValue4(e.target.value);
            }}
          >
            {items4.map((item) => {
              return (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              );
            })}
          </select>
          <button
            onClick={() => {
              Vote();
            }}
          >
            Vote
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
