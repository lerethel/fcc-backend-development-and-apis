const cors = require("cors");
const express = require("express");

const app = express();

app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

app.get("/api", (req, res) => {
  const date = new Date();
  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

app.get("/api/:date", function (req, res) {
  const { date } = req.params;
  const parsedDate = new Date(
    // new Date() accepts a timestamp as a number or a date string.
    // Check if the provided date can be converted to a number. If so,
    // it's a timestamp; otherwise, assume it to be a date string.
    isNaN(Number(date)) ? date : Number(date)
  );
  res.json(
    // If the date is invalid, getTime() will return NaN.
    isNaN(parsedDate.getTime())
      ? { error: "Invalid Date" }
      : { unix: parsedDate.getTime(), utc: parsedDate.toUTCString() }
  );
});

const listener = app.listen(process.env.PORT || 3000, () =>
  console.log("Your app is listening on port " + listener.address().port)
);
