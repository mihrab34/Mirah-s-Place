const Slots = require("../model/slotModel");

exports.index = async (req, res) => {
  const slots = await Slots.find({ quantity: { $gte: 1 } });
  res.render("slots/index", {
    title: "Slots",
    slots,
    success: req.flash("success"),
  });
};

exports.add = async (req, res) => {
  res.render("slots/add", { title: "Add slots", csrfToken: req.csrfToken() });
};

exports.save = async (req, res) => {
  const currentDate = new Date(req.body.date).toDateString();
  // console.log(currentDate);

  new_slots = new Slots({
    date: currentDate,
    quantity: req.body.quantity,
  });

  const slot = await Slots.findOne({ date: currentDate });
  // console.log(slot);
  if (slot) {
    const updateQuantity = await Slots.updateOne(
      { _id: slot._id },
      { $inc: { quantity: req.body.quantity } }
    );
    req.flash("success", "Slots created successfully");
    res.redirect("/slots");
  } else {
    await new_slots.save();
    req.flash("success", "Slots created successfully");
    res.redirect("/slots");
  }
};
