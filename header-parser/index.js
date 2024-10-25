const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

app.get("/api/whoami", (req, res) => {
  const { ip, headers } = req;
  res.json({
    ipaddress: ip,
    language: headers["accept-language"],
    software: headers["user-agent"],
  });
});

const listener = app.listen(process.env.PORT || 3000, () =>
  console.log("Your app is listening on port " + listener.address().port)
);
