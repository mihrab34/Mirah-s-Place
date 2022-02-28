const Bookings = require("../model/bookingModel");
const Slots = require("../model/slotModel");
const FailedBookings = require("../model/failedBooking");
const Users = require("../model/userModel");

let feedback = {
  type: "",
  message: "",
};

exports.index = async (req, res) => {
  const bookings = await Bookings.find({}).populate("user");
  res.render("bookings/index", { title: "Bookings", bookings });
};

exports.add = async (req, res) => {
  res.render("bookings/add", {
    title: "Add Bookings",
    feedback: feedback.message,
    success: req.flash("success"),
    csrfToken: req.csrfToken(),
  });
};

exports.save = async (req, res) => {
  try {
    // getting booking date and the next date after booking date
    const booking_date = req.body.booking_date;
    const next_date = new Date(booking_date);
    next_date.setDate(next_date.getDate() + 1);

    // check booking date with available slot date
    const available_slot = await Slots.findOne()
      .where("date")
      .gte(new Date(booking_date))
      .lt(new Date(next_date));
    // getUsers with phone_number
    let phone_number = req.body.phone_number;
    let user = await Users.findOne({ phone_number: phone_number });

    if (!user) {
      let newUser = {
        name: "",
        phone_number: phone_number,
        password: "",
      };
      user = new Users(newUser);
      await user.save();
    }

    const booking = new Bookings({
      user: user._id,
      booking_date: booking_date,
      slot: available_slot._id,
      service: req.body.services,
    });

    const failed_booking = new FailedBookings({
      user: user._id,
      booking_date: booking_date,
    });
    // check for if there is available_slot
    if (available_slot) {
      let slot = available_slot;

      if (slot.quantity > 0) {
        await booking.save();
        // deduct slot by -1 after a succesful save
        let quantity = slot.quantity - 1;
        const updateQuantity = await Slots.updateOne(
          { _id: slot._id },
          { quantity: quantity }
        );

        if (!user.name) {
          res.render("bookings/user", {
            title: "Enter Name",
            phone_number,
            feedback: "please enter your name and password",
            csrfToken: req.csrfToken(),
          });
        }
      } else {
        failed_booking.save();
        res.redirect("/failed-bookings");
      }
    } else {
      failed_booking.save();
      res.redirect("/failed-bookings");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  let phone_number = req.body.phone_number;

  const user = await Users.findOne({ phone_number: phone_number });
  (user.name = req.body.name.toUpperCase()),
    (user.password = req.body.password);
  await Users.updateOne(
    { phone_number: phone_number },
    { $set: { name: user.name, password: user.password } }
  );

  req.flash("success", "THANKS FOR BOOKING " + user.name);
  res.redirect("/bookings");
};
