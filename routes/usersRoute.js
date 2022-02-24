const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const controller = require("../controller/usersController");
const User = require("../model/userModel");
const ExpressBrute = require("express-brute");
const MemcachedStore = require("express-brute-memcached");
const moment = require("moment");
let store;

// user authentication outsourced to passport.js
passport.use(
  new LocalStrategy({ passReqToCallback: true }, async function verify(
    req,
    username,
    password,
    done
  ) {
    const user = await User.findOne({ phone_number: username });
    if (user) {
      if (user.password === password) {
        return done(null, user); // verification successful
      }
    }
    failedLoginAttempt(req);
    return done(null,false,req.flash("error", "Invalid username or password")); // verification failed
  })
);

const failedLoginAttempt = (req) => {
  if (req.session.failedCount) {
    req.session.failedCount += 1;
  } else {
    req.session.failedCount = 1;
  }
};

const blockFailedAttempt = (req,res, next) => {
  const failedCount = req.session.failedCount;
  res.locals.access = false;
  if(failedCount > 4) {
    res.locals.access = true;
    req.flash("error", "Access denied due to several login attempts. Try again in 5 minutes");
  }
  // console.log(res.locals);
  next();
};

const checkAuthenticated = (req, res, next) => {
  res.locals.isAuthenticated = false;
  res.locals.whiteListed = false;
  res.locals.user = req.user || {};
  if (req.path === "/") {
    res.locals.whiteListed = true;
    if (req.isAuthenticated()) {
      res.locals.isAuthenticated = true;
    }
  } else {
    if (req.isAuthenticated()) {
      res.locals.isAuthenticated = true;
      res.locals.user = req.user || {};
    } else {
      return res.redirect("/login");
    }
  }
  // console.log(res.locals.user);
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
router.use(checkAuthenticated);
router.get("/logout", controller.logout);

module.exports = router;
