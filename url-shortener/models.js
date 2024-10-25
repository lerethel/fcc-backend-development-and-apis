const mongoose = require("mongoose");

const ShortenedURLSchema = new mongoose.Schema({
  original: { type: String, required: true },
  short: { type: Number, required: true, unique: true },
});

const CounterSchema = new mongoose.Schema({
  seq: { type: Number, required: true },
});

exports.ShortenedURL = mongoose.model("ShortenedURL", ShortenedURLSchema);
exports.Counter = mongoose.model("Counter", CounterSchema);
