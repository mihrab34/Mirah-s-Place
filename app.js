const express = require("express");
require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const PORT = process.env.PORT;

const app = express();

// view template engine
app.set("view engine", "ejs");
app.set("layout", "./layout/main");

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 5 * 60 * 1000, secure: false },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(csrfProtection);

// log in user route
const usersRoute = require("./routes/usersRoute");
app.use("/", usersRoute);

// homepage router mount
const homeRoute = require("./routes/pagesRoute");
app.use("/", homeRoute);

// bookings router mount
const bookingsRoute = require("./routes/bookingsRoute");
app.use("/bookings", bookingsRoute);

// slots router mount
const slotsRoute = require("./routes/slotsRoute");
app.use("/slots", slotsRoute);

// failedBookings router Mount
const failedBookingsRoute = require("./routes/failedBookingRoutes");
app.use("/failed-bookings", failedBookingsRoute);

// Handling Errors
app.use((req, res, next) => {
  res.status(400);
  res.render("layout/404_page", { title: "Page Not Found" });
});
app.use((error, req, res, next) => {
  // res.status(500)
  res.render("layout/500_page", {
    title: "500: Internal Server Error",
    status: error.status || 500,
    error: error,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
