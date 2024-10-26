const cors = require("cors");
const express = require("express");
const multer = require("multer");

const app = express();
const port = process.env.PORT || 3000;
const upload = multer();

app.use(cors());
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  const { originalname: name, mimetype: type, size } = req.file;
  res.json({ name, type, size });
});

app.listen(port, () => console.log("Your app is listening on port " + port));
