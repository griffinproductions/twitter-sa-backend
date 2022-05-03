import apos from 'apos-to-lex-form';
import natural from 'natural';
import SpellingCorrector from 'spelling-corrector';
import { removeStopwords } from 'stopword';

const dataAnalyser = () => {
  const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = natural;
  const spellCorrector = new SpellingCorrector();
  const analyser = new SentimentAnalyzer('English', PorterStemmer, 'afinn');
  const tokeniser = new WordTokenizer();
  spellCorrector.loadDictionary();

  const prepareText = (tweet) => {
    const { text } = tweet;
    const lexText = apos(text);
    const casedText = lexText.toLowerCase();
    // remove non-alphabetical and special characters
    const alphaOnlyText = casedText.replace(/[^a-zA-Z0-9\s]/g, '');
    // tokenise
    const tokenisedText = tokeniser.tokenize(alphaOnlyText);
    // correct spelling
    // const spellCorrected = tokenisedText.map((word) => spellCorrector.correct(word));
    // remove stop words
    return removeStopwords(tokenisedText);
  };

  const processTweets = (tweets) => {
    const processedTweets = tweets.map((tweet) => {
      const filteredText = prepareText(tweet);
      const sentiment = analyser.getSentiment(filteredText);
      return { sentiment, tweet };
    });
    return processedTweets;
  };

  const labelSentiments = (processedTweets) => {
    const values = processedTweets.map((tweet) => tweet.sentiment);
    const positiveThreshold = Math.max(...values);
    const negativeThreshold = Math.min(...values);
    const labelledTweets = processedTweets.map((tweet) => {
      const { sentiment } = tweet;
      if (sentiment > (positiveThreshold / 8)) return { tweet, label: 'positive' };
      if (sentiment < (negativeThreshold / 8)) return { tweet, label: 'negative' };
      return { tweet, label: 'neutral' };
    });
    return labelledTweets;
  };

  const getLabelPercentages = (labelled) => {
    const labels = labelled.map((tweet) => tweet.label);
    const positiveCount = labels.filter((label) => label === 'positive').length;
    const negativeCount = labels.filter((label) => label === 'negative').length;
    const neutralCount = labels.filter((label) => label === 'neutral').length;
    const totalCount = positiveCount + negativeCount + neutralCount;
    const positivePercentage = positiveCount / totalCount;
    const negativePercentage = negativeCount / totalCount;
    const neutralPercentage = neutralCount / totalCount;
    return {
      postive: positivePercentage,
      negative: negativePercentage,
      neutral: neutralPercentage,
    };
  };

  const getPercentagesOnly = (tweets) => {
    const processedTweets = processTweets(tweets);
    const labelledTweets = labelSentiments(processedTweets);
    const percentages = getLabelPercentages(labelledTweets);
    return percentages;
  };

  const getTweetsAndPecentages = (tweets) => {
    const processedTweets = processTweets(tweets);
    const labelledTweets = labelSentiments(processedTweets);
    const labelPercentages = getLabelPercentages(labelledTweets);
    return {
      labelledTweets,
      labelPercentages,
    };
  };

  const processTweetsPerWord = (tweets) => {
    const wordScores = {};
    tweets.forEach((tweet) => {
      const filteredText = prepareText(tweet);
      filteredText.forEach((word) => {
        const score = analyser.getSentiment([word]);
        if (score === 0) return;
        if (wordScores[word]) {
          wordScores[word] += score;
        } else {
          wordScores[word] = score;
        }
      });
    });
    return wordScores;
  };

  const getSentimentPerMinute = (tweets) => {
    const processedTweets = processTweets(tweets);
    const sentimentPerMinute = processedTweets.reduce((acc, tweet) => {
      const { sentiment } = tweet;
      const date = new Date(tweet.tweet.created_at);
      const dateTime = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      if (acc[dateTime]) {
        acc[dateTime].score += sentiment;
        acc[dateTime].count += 1;
      } else {
        acc[dateTime] = {
          score: sentiment,
          count: 1,
        };
      }
      return acc;
    }, {});

    const averageSentimentPerMinute = Object.keys(sentimentPerMinute).reduce((acc, key) => {
      const { score, count } = sentimentPerMinute[key];
      acc[key] = score / count;
      return acc;
    }, {});
    return averageSentimentPerMinute;
  };

  return {
    processTweets,
    getSentimentPerMinute,
    processTweetsPerWord,
    getPercentagesOnly,
    getTweetsAndPecentages,
  };
};

export default dataAnalyser;
