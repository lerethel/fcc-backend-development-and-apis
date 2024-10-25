const { ShortenedURL, Counter } = require("./models");

const isValidURL = (url) => !!URL.parse(url);

exports.getHome = (req, res) => res.sendFile(__dirname + "/views/index.html");

exports.createURL = async (req, res) => {
  const { url } = req.body;

  if (!isValidURL(url)) {
    return res.json({ error: "Invalid URL" });
  }

  const counter = await Counter.findOne({}, "seq").exec();

  const shortenedURL = await ShortenedURL.create({
    original: url,
    short: counter.seq,
  });

  // Update the counter.
  counter.seq++;
  await counter.save();

  res.json({
    original_url: shortenedURL.original,
    short_url: shortenedURL.short,
  });
};

exports.redirectToURL = async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.sendStatus(400);
  }

  const shortenedURL = await ShortenedURL.findOne({ short: id }, "original")
    .lean()
    .exec();

  if (!shortenedURL) {
    return res.sendStatus(404);
  }

  res.redirect(shortenedURL.original);
};
