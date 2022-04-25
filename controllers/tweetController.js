import tweetFetcher from '../utils/tweetFetcher.js';
import dataAnalyser from '../analysis/dataAnalyser.js';

const tweetController = (Tweet) => {
  const fetcher = tweetFetcher();
  const analyser = dataAnalyser();

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

  const processTest = (req, res) => {
    const from = new Date('2022-04-24T20:00:00.000Z');
    Tweet.find({ createdAt: { $gt: from } }, { _id: 0, text: 1 })
      .then((tweets) => {
        const processedTweets = analyser.processTweets(tweets);
        res.status(200).json(processedTweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  const fetchAll = async (req, res) => {
    fetcher.getAll(req.params.query, Tweet)
      .then((tweets) => {
        res.status(200).json(tweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  return {
    push, get, fetchAll, processTest,
  };
};

export default tweetController;
