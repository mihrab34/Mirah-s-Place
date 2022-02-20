const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const controller = require("../controller/usersController");
const User = require("../model/userModel");

// user authentication outsourced to passport.js
passport.use(
  new LocalStrategy({ passReqToCallback: true }, 
    async function verify( req,username,password,done) {
    const user = await User.findOne({ phone_number: username });
    if (user) {
      if (user.password === password) {
        return done(null, user); // verification successful
      }
    }
    return done(null, false, req.flash("error", "Invalid username or password")); // verification failed
  })
);

const checkAuthenticated = (req, res, next) => {
  res.locals.isAuthenticated = false;
  res.locals.whiteListed = false;
  if (req.path === "/") {
    res.locals.whiteListed = true;
  }
  if (req.isAuthenticated()) {
    res.locals.isAuthenticated = true;
  } else {
    return res.redirect("/login");
  }
  next();
};

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (user, done) {
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

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

module.exports = router;
