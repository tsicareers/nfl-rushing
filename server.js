const express = require("express");

const app = express();
app.use(express.static("public"));

const fs = require("fs");

var players;

fs.readFile("./rushing.json", (err, data) => {
    if (err) throw err;
    players = JSON.parse(data);
});

app.get("/data", (req, res) => {
    res.send(players);
});

app.listen(5001, () => console.log("app is running"));