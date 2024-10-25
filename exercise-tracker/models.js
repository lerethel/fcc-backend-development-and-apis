const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
});

const ExerciseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: Date,
});

exports.User = mongoose.model("User", UserSchema);
exports.Exercise = mongoose.model("Exercise", ExerciseSchema);
