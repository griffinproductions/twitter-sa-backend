import Twitter from 'twitter-v2';

const tweetFetcher = () => {
  const client = new Twitter({
    consumer_key: 'E8Qk2apM2SrHLwAgKQbfpJRAa',
    consumer_secret: 'AnALVE2zfNMeuhHJBpnqMWx6tOybMI1Jnl9eqrtiIEu9KhavZ1',
  });

  const isAfterEarliestDate = (currentDateString, endDate) => {
    const currentDate = Date.parse(currentDateString);
    return currentDate > Date.parse(endDate);
  };

  const getTweetPage = async (query, config, prevData, prevMeta, counter) => {
    console.log(counter);
    const queryParams = {
      query: `${query} lang:en`, max_results: 100, ...(counter === 1 && { end_time: config.startDate }), tweet: { fields: ['created_at', 'public_metrics', 'possibly_sensitive'] }, ...(prevMeta && { next_token: prevMeta.next_token }),
    };
    const { data, meta } = await client.get('tweets/search/recent', queryParams);
    const newData = prevData.concat(data);
    if (data
      && meta.next_token
      && isAfterEarliestDate(data.at(-1).created_at, config.endDate)
      && counter < config.limit) {
      return getTweetPage(query, config, newData, meta, counter + 1);
    }
    return newData;
  };

  const getAll = async (query, optionals) => {
    const config = {
      limit: (optionals?.limit ? optionals.limit / 100 : 250),
      startDate: (optionals?.startDate) ? `${new Date(optionals.startDate).toISOString().split('.')[0]}Z` : new Date(),
      // eslint-disable-next-line max-len
      endDate: optionals?.endDate ? new Date(optionals.endDate) : new Date(new Date().getTime() - (24 * 60 * 60 * 1000)),
    };
    console.log(config);
    const data = await getTweetPage(query, config, [], null, 1);
    // if (data) {
    //   Tweet.insertMany(data);
    // }
    return data;
  };
  return { getAll };
};

export default tweetFetcher;
