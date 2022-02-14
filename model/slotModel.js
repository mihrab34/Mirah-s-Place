require("./appModel");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SlotSchema = new Schema({
    date : {type: Date, required: true},
    quantity : {type: Number, max:5, required: true}
})

module.exports = mongoose.model("Slot", SlotSchema);