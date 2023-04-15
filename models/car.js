const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  license_number: {
    type: String,
    require: true,
  },

  stock_number: {
    type: Number,
    require: true,
  },

  passenger_capacity: {
    type: Number,
    require: true,
  },

  has_sunroof: {
    type: Boolean,
    require: true,
  },

  model: {
    type: String,
    require: true,
  },

  brand: {
    type: String,
    require: true,
  },

  manufacturing_year: {
    type: Number,
    require: true,
  },

  mileage: {
    type: Number,
    require: true,
  },

  total_run: {
    type: Number,
    require: true,
  },

  transmission_type: {
    type: String,
    require: true,
  },

  isFeatured: {
    type: Boolean,
    require: true,
  },

  fuelType: {
    type: String,
    require: true,
  },

  about_car: {
    type: String,
    require: true
  },

  responsiblities: {
    type: String,
    require: true
  },

  image1: {
    type: String,
    default: "fake-url"
  },

   image2: {
    type: String,
    default: "fake-url"
  },

  image3: {
    type: String,
  default: "fake-url"
  },

   image4: {
    type: String,
    default: "fake-url"
 },
});

exports.Car = mongoose.model('Car', carSchema);
exports.carSchema = carSchema;
