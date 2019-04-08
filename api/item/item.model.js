const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Compound Index
// itemSchema.index({ list: 1, name: 1 }, { unique: true });

// export const Item = mongoose.model('item', itemSchema);

// Old way of doing export default Item = mongoose.model('item', itemSchema)
module.exports = Item = mongoose.model('item', itemSchema);
