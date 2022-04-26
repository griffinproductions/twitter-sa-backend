import Twitter from 'twitter-v2';

const tweetFetcher = () => {
  const client = new Twitter({
    consumer_key: 'E8Qk2apM2SrHLwAgKQbfpJRAa',
    consumer_secret: 'AnALVE2zfNMeuhHJBpnqMWx6tOybMI1Jnl9eqrtiIEu9KhavZ1',
  });

  const getTweetEndDate = () => {
    const today = new Date();
    return new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
  };

  const isAfterEarliestDate = (currentDateString) => {
    const currentDate = Date.parse(currentDateString);
    return currentDate > getTweetEndDate();
  };

  const getTweetPage = async (query, prevData, prevMeta, counter) => {
    const { data, meta } = await client.get('tweets/search/recent', {
      query: `${query} lang:en`, max_results: 100, tweet: { fields: ['created_at', 'public_metrics'] }, ...(prevMeta && { next_token: prevMeta.next_token }),
    });
    const newData = prevData.concat(data);
    console.log(counter);

    if (meta.next_token && isAfterEarliestDate(data.at(-1).created_at) && counter < 400) {
      return getTweetPage(query, newData, meta, counter + 1);
    }
    return newData;
  };

  const getAll = async (query, Tweet) => {
    const data = await getTweetPage(query, [], null, 1);
    if (data) {
      Tweet.insertMany(data);
    }
    return data;
  };
  return { getAll };
};

export default tweetFetcher;
