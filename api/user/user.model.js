const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    // Active is if the user has paid.. I dont know
    active: {
      type: Boolean,
      default: true
    },
    admin: {
      type: Boolean,
      default: false
    },
    ingredients: [
      {
        ingredient: {
          type: Schema.ObjectId,
          ref: 'ingredient',
          required: true,
          unique: true,
          sparse: true
        },
        supplier: {
          type: Schema.ObjectId,
          ref: 'supplier',
          required: true
        },
        packageCost: {
          type: Number,
          required: true
        },
        packageGrams: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = User = mongoose.model('user', UserSchema);
