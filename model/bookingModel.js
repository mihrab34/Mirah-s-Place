require("./appModel");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  booking_date: { type: Date, required: true },
  slot: { type: mongoose.Types.ObjectId, ref: "Slot", required: true },
  service: { type: String, required: true}
});

module.exports = mongoose.model("Booking", BookingSchema);
