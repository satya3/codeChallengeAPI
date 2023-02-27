const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  guestMemberId: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  hotelName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  arrivalDate: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  departureDate: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  status: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  baseStayAmount:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  taxAmount:{
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  }
});

module.exports.Reservation = mongoose.model("Reservation", reservationSchema);