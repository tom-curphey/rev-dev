const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VenueSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    displayName: {
      type: String,
      required: true
    },
    urlName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    website: {
      type: String
    },
    address: {
      type: String,
      required: true
    },
    costs: {
      chefPayPerHour: {
        type: Number,
        default: 0
      },
      rentPerMonth: {
        type: Number,
        default: 0
      },
      waterPerMonth: {
        type: Number,
        default: 0
      },
      powerPerMonth: {
        type: Number,
        default: 0
      },
      insurancePerYear: {
        type: Number,
        default: 0
      }
    }
  },
  { timestamps: true }
);

module.exports = Venue = mongoose.model('venue', VenueSchema);
