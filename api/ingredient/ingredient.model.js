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
        required: true
      },
      packageGrams: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = Ingredient = mongoose.model(
  'ingredient',
  IngredientSchema
);
