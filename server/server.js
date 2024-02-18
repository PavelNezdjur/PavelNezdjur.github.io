const express = require("express");
const pool = require("./connectDB");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 7000;
const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// get 10 best players
app.get("/players", async (req, res) => {
  try {
    const players = await pool.query(
      "SELECT * FROM players ORDER BY scores DESC LIMIT 10"
    );
    res.json(players.rows);
  } catch (err) {
    console.log(err.message);
  }
});

// create new player
app.post("/players", async (req, res) => {
  const { userName, scores } = req.body;
  const id = getRandomInt(0, 10000);
  try {
    const newPlayer = await pool.query(
      `INSERT INTO players("id", "userName", "scores") VALUES($1, $2, $3)`,
      [id, userName, scores]
    );
    res.json(newPlayer);
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// id generator
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
