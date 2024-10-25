const dns = require("dns/promises");
const { ShortenedURL, Counter } = require("./models");

const isValidURL = async (url) => {
  const parsedURL = URL.parse(url);

  if (!parsedURL) {
    return false;
  }

  try {
    await dns.lookup(parsedURL.hostname);
  } catch {
    return false;
  }

  return true;
};

exports.getHome = (req, res) => res.sendFile(__dirname + "/views/index.html");

exports.createURL = async (req, res) => {
  const { url } = req.body;

  if (!(await isValidURL(url))) {
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
