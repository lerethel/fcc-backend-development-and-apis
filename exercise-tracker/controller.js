const { User, Exercise } = require("./models");

exports.getHome = (req, res) => res.sendFile(__dirname + "/views/index.html");

exports.createUser = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.sendStatus(400);
  }

  const user = await User.create({ username });
  res.json({ _id: user._id, username: user.username });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find({}, "-__v").lean().exec();
  res.json(users);
};

exports.createExercise = async (req, res) => {
  const user = await User.findById(req.params._id).lean().exec();

  if (!user) {
    return res.sendStatus(404);
  }

  const { _id, username } = user;
  const { description, duration } = req.body;
  const date = new Date(req.body.date || Date.now());

  await Exercise.create({ user: _id, description, duration, date });

  res.json({
    username,
    description,
    duration: Number(duration),
    date: date.toDateString(),
    _id,
  });
};

exports.getExerciseLogs = async (req, res) => {
  const user = await User.findById(req.params._id).lean().exec();

  if (!user) {
    return res.sendStatus(404);
  }

  const { from, to, limit } = req.query;
  const exerciseSelection = Exercise.find({ user: user._id });

  if (from) {
    exerciseSelection.gte("date", Date.parse(from));
  }

  if (to) {
    exerciseSelection.lte("date", Date.parse(to));
  }

  if (limit) {
    exerciseSelection.limit(Number(limit));
  }

  const log = await exerciseSelection
    .select("description duration date -_id")
    .lean()
    .exec();

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log: log.map((exercise) => ({
      ...exercise,
      date: exercise.date.toDateString(),
    })),
  });
};
