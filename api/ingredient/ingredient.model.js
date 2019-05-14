const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const IngredientSchema = new Schema({
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
    required: true,
    unique: true
  },
  packageGrams: {
    type: Number
  },
  packageCost: {
    type: Number
  },
  metrics: {
    cup: {
      type: Number,
      required: true
    },
    tablespoon: {
      type: Number
    },
    teaspoon: {
      type: Number
    },
    whole: {
      type: Number
    }
  },
  suppliers: [
    {
      supplier: {
        type: Schema.Types.ObjectId,
        ref: 'supplier',
        required: true,
        sparse: true
      },
      packageCost: {
        type: Number,
        default: 0
      },
      packageGrams: {
        type: Number,
        default: 0
      },
      profileSaveCount: {
        type: Number,
        default: 0
      }
    }
  ]
});

module.exports = Ingredient = mongoose.model(
  'ingredient',
  IngredientSchema
);
