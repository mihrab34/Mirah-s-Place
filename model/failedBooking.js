require("./appModel");

const mongoose = require("mongoose");

const FailedBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  booking_date: { type: Date, required: true },
});

module.exports = mongoose.model("FailedBooking", FailedBookingSchema);
