require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 81 || process.env.PORT;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.CREDENTIALS);
mongoose.connection.once('open', () => {
  console.log('Connection to MongoDB established');
});
mongoose.connection.on('error', (e) => {
  console.log(`ERROR: ${e}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on Port: ${PORT}`);
});
