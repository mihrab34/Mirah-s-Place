const FailedBookings = require("../model/failedBooking");

exports.index = async(req, res)=> {
    const failedBookings = await FailedBookings.find({}).populate('user');
    res.render('failedBookings/index', {title: "Failed Bookings", failedBookings})
}