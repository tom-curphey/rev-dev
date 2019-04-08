const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RecipeSchema = new Schema(
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
    staffTimeInSeconds: {
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
        amount: {
          type: Number,
          required: true
        },
        metric: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = Recipe = mongoose.model('recipe', RecipeSchema);

// ingredients: [
//   {
//     ingredient: {
//       type: Schema.Types.ObjectId,
//       ref: 'ingredient'
//     },
//     amount: {
//       type: Number,
//       required: true
//     },
//     metric: {
//       type: Number,
//       required: true
//     },
//     grams: {
//       type: Number,
//       required: true
//     }
//   }
// ];
