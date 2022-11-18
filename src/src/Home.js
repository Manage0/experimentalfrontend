import React, { useEffect, useState } from "react";
import {
  db,
  getExperimentalMatches,
  getExperimentalNews,
  getExperimentalPlayers,
} from "./firebase-config";
import axios from "axios";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

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
        background:
          "-moz-linear-gradient(98deg, rgba(0,108,255,1) 0%, rgba(236,244,248,1) 100%)",
        height: "100vh",
      }}
    >
      <div
        style={{
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
      </div>
      <div
        style={{
          padding: "5px",
          display: "flex",
          justifyContent: "center",
          background:
            "-moz-linear-gradient(98deg, rgba(0,108,255,1) 0%, rgba(236,244,248,1) 100%)",
          width: "100%",
          height: "45px",
          borderBottom: "2px solid black",
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
              <Card
                sx={{ maxWidth: "50%", marginLeft: "25%" }}
                variant="outlined"
                key={item.title}
              >
                <CardContent>
                  <h2>{item.title}</h2>
                </CardContent>
                <CardContent sx={{ textAlign: "justify" }}>
                  <h4>{item.content}</h4>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {mode === "players" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            width: "90%",
            marginLeft: "5%",
          }}
        >
          {players.map((item) => {
            return (
              <Card sx={{ margin: "5px" }} variant="outlined" key={item.name}>
                <CardContent>
                  <h2>{item.name}</h2>
                </CardContent>
                <CardContent>
                  <img
                    width={150}
                    style={{ borderRadius: "50%" }}
                    height={150}
                    src="https://cataas.com/c"
                  ></img>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      {mode === "matches" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            width: "90%",
            marginLeft: "5%",
          }}
        >
          {matches.map((item) => {
            return (
              <div key={item.home + Math.random()}>
                <Card sx={{ margin: "5px" }} variant="outlined" key={item.name}>
                  <CardContent>
                    <h2>
                      {item.home} vs. {item.guest}
                      <br />
                      {item.homePoints} - {item.guestPoints}
                    </h2>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
      {mode === "leaderboard" && (
        <div>
          {leaderboard.map((item) => {
            return (
              <div
                key={item.home + Math.random()}
                style={{ width: "20%", marginLeft: "40%" }}
              >
                <Card sx={{ margin: "5px" }} variant="outlined" key={item.name}>
                  <CardContent>
                    <h2>
                      {item.team} - {item.points} points
                    </h2>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
      {mode === "voting" && (
        <div
          style={{
            padding: "10px",
            background: "WHITE",
            width: "70%",
            marginLeft: "15%",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: "5px",
          }}
        >
          <h2>Vote to your favorite player!</h2>
          {saved && <div>Saved</div>}
          <FormControl
            sx={{
              background: "white",
              width: "200px",
            }}
          >
            <InputLabel id="demo-simple-select-label">
              Select a Match
            </InputLabel>
            <Select
              onChange={(e) => {
                setSelectedMatch(e.target.value);
              }}
              value={selectedMatch}
              label="Select a Match"
              labelId="demo-simple-select-label"
            >
              {matchesWVoting.map((item) => {
                return (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              background: "white",
              width: "200px",
            }}
          >
            <InputLabel id="demo-simple-select-label2">
              Select a Player
            </InputLabel>
            <Select
              onChange={(e) => {
                setValue4(e.target.value);
              }}
              value={value4}
              labelId="demo-simple-select-label2"
            >
              {items4.map((item) => {
                return (
                  <MenuItem key={item.label} value={item.value}>
                    {item.label}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <FormControl
            sx={{
              background: "white",
              width: "200px",
              height: "100%",
            }}
          >
            <Button
              sx={{ height: "100%" }}
              onClick={() => {
                Vote();
              }}
            >
              Vote
            </Button>
          </FormControl>
        </div>
      )}
    </div>
  );
};

export default Home;
