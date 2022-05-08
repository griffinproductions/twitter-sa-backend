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
    Tweet.find({ createdAt: { $gt: from } })
      .then((tweets) => {
        const processedTweets = analyser.processTweets(tweets);
        res.status(200).json(processedTweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  const getSentimentPerMinute = (req, res) => {
    const from = new Date('2022-04-24T20:00:00.000Z');
    Tweet.find({ createdAt: { $gt: from } })
      .then((tweets) => {
        const processedTweets = analyser.getSentimentPerMinute(tweets);
        res.status(200).json(processedTweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  const getWordScores = (req, res) => {
    const from = new Date('2022-04-24T20:00:00.000Z');
    Tweet.find({ createdAt: { $gt: from } })
      .then((tweets) => {
        const processedTweets = analyser.processTweetsPerWord(tweets);
        res.status(200).json(processedTweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  const getTweetLabelsAndPercentages = (req, res) => {
    const from = new Date('2022-04-24T20:00:00.000Z');
    Tweet.find({ createdAt: { $gt: from } })
      .then((tweets) => {
        const processedTweets = analyser.getTweetsAndPecentages(tweets);
        res.status(200).json(processedTweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  const getTweetPercentages = (req, res) => {
    const from = new Date('2022-04-24T20:00:00.000Z');
    Tweet.find({ createdAt: { $gt: from } })
      .then((tweets) => {
        const processedTweets = analyser.getPercentagesOnly(tweets);
        res.status(200).json(processedTweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  const getAllData = async (req, res) => {
    try {
      const optionals = {
        startDate: req.query.startDate,
        endDate: req.query.endDate,
      };
      const { hashtag } = req.query;
      fetcher.getAll(hashtag, optionals)
        .then((tweets) => {
          console.log(tweets.length);
          const data = analyser.getAllData(tweets);
          res.status(200).json(data);
        }).catch((err) => {
          console.log(err);
          res.status(400).send(err.message);
        });
    } catch (err) {
      res.status(400).send(err.message);
    }
  };

  const fetchAll = async (req, res) => {
    fetcher.getAll(req.params.query, req.params.optionals)
      .then((tweets) => {
        res.status(200).json(tweets);
      }).catch((err) => {
        res.status(400).send(err.message);
      });
  };

  const search = async (req, res) => {
    try {
      const optionals = {
        limit: req.query.limit,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        excludeSensitive: req.query.excludeSensitive,
      };
      const { hashtag } = req.query;
      const categories = req.query.categories.split(',');
      fetcher.getAll(hashtag, optionals)
        .then((tweets) => {
          console.log(tweets.length);
          const data = analyser.search(tweets, categories);
          res.status(200).json(data);
        }).catch((err) => {
          console.log(err);
          res.status(400).send(err.message);
        });
    } catch (err) {
      res.status(400).send(err.message);
    }
  };
  return {
    push,
    get,
    fetchAll,
    processTest,
    getSentimentPerMinute,
    getWordScores,
    getTweetLabelsAndPercentages,
    getTweetPercentages,
    getAllData,
    search,
  };
};

export default tweetController;
