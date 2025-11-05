const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema(
  {
    home: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Home',
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', ListingSchema);


