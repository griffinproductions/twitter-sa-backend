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

  const processTweets = (tweets) => {
    let counter = 0;
    const processedTweets = tweets.map((tweet) => {
      console.log(counter, 'Lexicon', `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      const { text } = tweet;
      const lexText = apos(text);
      console.log(counter, 'toLower', `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      const casedText = lexText.toLowerCase();
      console.log(counter, 'To alpha', `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      // remove non-alphabetical and special characters
      const alphaOnlyText = casedText.replace(/[^a-zA-Z0-9\s]/g, '');
      console.log(counter, 'Tokenise', `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      // tokenise
      const tokenisedText = tokeniser.tokenize(alphaOnlyText);
      console.log(counter, 'Spelling', `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      // correct spelling
      // const spellCorrected = tokenisedText.map((word) => spellCorrector.correct(word));
      console.log(counter, 'Stopwords', `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      // remove stop words
      const filteredText = removeStopwords(tokenisedText);
      console.log(counter, 'Sentiment', `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      const sentiment = analyser.getSentiment(filteredText);
      console.log('Finished', counter, `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()}`);
      counter += 1;
      return { sentiment, tweet };
    });
    return processedTweets;
  };
  return { processTweets };
};

export default dataAnalyser;
