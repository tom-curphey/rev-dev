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
        type: Number
      },
      rentPerMonth: {
        type: Number
      },
      waterPerMonth: {
        type: Number
      },
      powerPerMonth: {
        type: Number
      },
      insurancePerYear: {
        type: Number
      }
    }
  },
  { timestamps: true }
);

module.exports = Venue = mongoose.model('venue', VenueSchema);
