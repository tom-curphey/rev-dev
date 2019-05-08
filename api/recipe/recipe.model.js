const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecipeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user'
    },
    venue: {
      type: Schema.Types.ObjectId,
      ref: 'venue'
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
    serves: {
      type: Number,
      required: true
    },
    salePricePerServe: {
      type: Number
    },
    staffTime: {
      type: Number
    },
    totalCookingTime: {
      type: Number
    },
    expectedSalesPerDay: {
      type: Number
    },
    internalRecipe: {
      type: Boolean,
      default: false
    },
    ingredients: [
      {
        ingredient: {
          type: Schema.Types.ObjectId,
          ref: 'ingredient',
          required: true
        },
        quantity: {
          type: Number,
          required: true
        },
        metric: {
          type: String,
          required: true
        },
        grams: {
          type: Number,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = Recipe = mongoose.model('recipe', RecipeSchema);
