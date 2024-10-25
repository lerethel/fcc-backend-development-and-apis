const controller = require("./controller");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", controller.getHome);
app.route("/api/users").post(controller.createUser).get(controller.getAllUsers);
app.post("/api/users/:_id/exercises", controller.createExercise);
app.get("/api/users/:_id/logs", controller.getExerciseLogs);

const listener = app.listen(process.env.PORT || 3000, () =>
  console.log("Your app is listening on port " + listener.address().port)
);
