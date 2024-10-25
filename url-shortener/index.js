const controller = require("./controller");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { Counter } = require("./models");

const app = express();
mongoose.connect(process.env.MONGO_URI);

const port = process.env.PORT || 3000;

// Keep only one counter document for all URLs.
Counter.countDocuments()
  .exec()
  .then(async (count) => {
    if (!count) {
      await Counter.create({ seq: 1 });
    }
  });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

app.get("/", controller.getHome);
app.post("/api/shorturl", controller.createURL);
app.get("/api/shorturl/:id", controller.redirectToURL);

app.listen(port, () => console.log(`Listening on port ${port}`));
