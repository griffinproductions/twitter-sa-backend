import mongoose from 'mongoose';

const { Schema } = mongoose;

const Fixtures = new Schema({
  teams: {
    home: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: true,
      },
      hashtag: {
        type: String,
        required: true,
      },
    },
    away: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
        required: true,
      },
      hashtag: {
        type: String,
        required: true,
      },
    },
  },
  hashtag: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  goals: {
    home: {
      type: Number,
      default: 0,
    },
    away: {
      type: Number,
      default: 0,
    },
  },
  winner: {
    type: String,
    enum: ['home', 'away', 'draw'],
    required: true,
  },
});

export default mongoose.model('Fixtures', Fixtures);
