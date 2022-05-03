import fetch from 'node-fetch';
import { format, subDays } from 'date-fns';

const fixtureFetcher = async (daysToRetreive) => {
  const today = new Date();
  const toDate = format(today, 'yyyy-MM-dd');
  const fromDate = format(subDays(today, daysToRetreive), 'yyyy-MM-dd');
  const res = await fetch(`https://v3.football.api-sports.io/fixtures?from=${fromDate}&to=${toDate}&league=39&season=2021`, {
    method: 'GET',
    headers: {
      'x-apisports-key': 'eab0a79b7bd416e2921298cd1b56bc44',
    },
  })
    .catch((err) => {
      console.log(err);
      return err;
    });
  const data = await res.json();
  return data.response;
};

export default fixtureFetcher;
