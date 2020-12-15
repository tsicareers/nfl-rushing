const express = require("express");

const app = express();

app.get("/data", (req, res) => {
    res.send("hi praise");
});

app.listen(5001, () => console.log("app is running"));