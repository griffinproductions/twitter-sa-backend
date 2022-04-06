const tweetController = (Tweet) => {
  const push = (req, res) => {
    Tweet.insertMany(req.body)
      .then(() => res.sendStatus(201)).catch((err) => res.status(400).send(err));
  };

  const get = (req, res) => {
    Tweet.find().sort({ _id: -1 })
      .then((tweets) => {
        res.status(200).json(tweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  return { push, get };
};

module.exports = tweetController;
