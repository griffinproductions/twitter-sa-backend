require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Tweet = require('./models/tweet.model');
const tweetRoutes = require('./routes/tweet.router')(Tweet);

const app = express();
const PORT = 81 || process.env.PORT;

app.use(cors());
app.use(express.json({ limit: '5000mb' }));

mongoose.connect(process.env.CREDENTIALS);
mongoose.connection.once('open', () => {
  console.log('Connection to MongoDB established');
});
mongoose.connection.on('error', (e) => {
  console.log(`ERROR: ${e}`);
});

app.use('/tweets', tweetRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
