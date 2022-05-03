/* eslint-disable no-nested-ternary */
import fixtureFetcher from '../utils/fixtureFetcher.js';
import hashtags from '../data/hashtags.js';

const fixturesController = (Fixtures) => {
  const get = (req, res) => {
    Fixtures.find().sort({ createdAt: -1 })
      .then((fixtures) => res.status(200).json(fixtures)).catch((err) => res.status(400).send(err));
  };

  const retrieve = async () => {
    try {
      fixtureFetcher(7).then((fixtures) => {
        const processedFixtures = fixtures.map((fixture) => {
          console.log(fixture);
          const { home, away } = fixture.teams;
          const hashtag = `#${hashtags[home.name]}${hashtags[away.name]}`;
          const startDate = new Date(fixture.fixture.periods.first * 1000);
          const endDate = new Date(fixture.fixture.periods.second * 1000);
          const status = fixture.fixture.status.short;
          const { goals } = fixture;
          const winner = goals.home > goals.away ? 'home' : goals.home < goals.away ? 'away' : 'draw';
          return {
            teams: {
              home: {
                name: home.name,
                logo: home.logo,
              },
              away: {
                name: away.name,
                logo: away.logo,
              },
            },
            hashtag,
            startDate,
            endDate,
            status,
            goals,
            winner,
          };
        });
        Fixtures.deleteMany({})
          .then(() => Fixtures.insertMany(processedFixtures))
          .then(() => console.log('Fixtures created')).catch((err) => console.log(err));
      });
    } catch (err) {
      console.log(err);
    }
  };

  return { get, retrieve };
};

export default fixturesController;
