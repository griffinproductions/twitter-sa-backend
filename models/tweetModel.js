import mongoose from 'mongoose';

const { Schema } = mongoose;

const Tweet = new Schema({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  public_metrics: {
    retweet_count: {
      type: Number,
      required: true,
    },
    reply_count: {
      type: Number,
      required: true,
    },
    like_count: {
      type: Number,
      required: true,
    },
    quote_count: {
      type: Number,
      required: true,
    },
  },
  created_at: {
    type: Date,
    required: true,
  },
});

export default mongoose.model('Tweet', Tweet);
