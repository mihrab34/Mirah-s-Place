const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const controller = require("../controller/usersController");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

// user authentication outsourced to passport.js
passport.use(
  new LocalStrategy({ passReqToCallback: true }, async function verify(req, username, password, done) {
    const user = await User.findOne({ phone_number: username });
    if (user) {
      if(await bcrypt.compare(password, user.password)){
        return done(null, user); // verification successful
      }
    }
    failedLoginAttempt(req);
    return done(null, false, req.flash("error", "Invalid username or password")); // verification failed
  })
);

const failedLoginAttempt = (req) => {
  if (req.session.failedCount) {
    req.session.failedCount += 1;
  } else {
    req.session.failedCount = 1;
  }
};

const blockFailedAttempt = (req, res, next) => {
  const failedCount = req.session.failedCount;
  res.locals.access = false;
  if (failedCount > 4) {
    res.locals.access = true;
    req.flash(
      "error",
      "Access denied due to several login attempts. Try again in 5 minutes"
    );
  }
  next();
};

// middleware to check if the user is logged in and whiteListed page
const checkAuthenticated = (req, res, next) => {
  res.locals.isAuthenticated = false;
  res.locals.whiteListed = false;
  if (req.path === "/") {
    res.locals.whiteListed = true;
    if (req.isAuthenticated()) {
      res.locals.isAuthenticated = true;
    }
  } else {
    if (req.isAuthenticated()) {
      res.locals.isAuthenticated = true;
    } else {
      return res.redirect("/login");
    }
  }
  next();
};

// middleware to display navigations according to role
const displayNav = (req, res, next) => {
  let nav = [{ name: "Home", url: "/" }];
  if (req.user) {
    if (req.user.role === "user") {
      nav.push(
        { name: "Book A Date", url: "/bookings" }
      );
    } else {
      nav.push(
        { name: "Book A Date", url: "/bookings" },
        { name: "Slots", url: "/slots" },
        { name: "Users", url: "/users" }
      );
    }
  }
  if(req.isAuthenticated()) {
    nav.push({name: "Logout", url: "/logout"})
  }else {
    nav.push({name: "Login", url: "/login"})
  }

  res.locals.navigations = nav;
  next();
};

// initialize passport with session
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});


router.use(blockFailedAttempt);
router.get("/login", controller.login);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  controller.authenticateLogin
);
router.get("/logout", controller.logout);
router.use(checkAuthenticated);
router.use(displayNav);
// user pages route
router.get("/users", controller.index);
router.get("/users/add", controller.add);
router.post("/users/add", controller.create);
router.get("/users/edit/:id", controller.edit);
router.post("/users/edit/:id", controller.update);
module.exports = router;
