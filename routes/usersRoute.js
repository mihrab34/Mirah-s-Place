const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const controller = require("../controller/usersController");
const User = require("../model/userModel");

// user authentication outsourced to passport.js
passport.use(
  new LocalStrategy(async function verify(username, password, done) {
    const user = await User.findOne({phone_number: username})
    console.log(user);
    if(user) {
      if (user.password === password) {
        return done(null, user); // verification successful
      }
    }
    return done(null, false); // verification failed
  })
);

const checkAuthenticated = (req,res,next) => {
  res.locals.isAuthenticated = false;
  if (req.isAuthenticated()) {
    res.locals.isAuthenticated = true;
    next();
  }else {
    res.redirect("/login");
  }
}


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
  passport.authenticate("local", { failureRedirect: "/login" }),
  controller.authenticateLogin
);

router.use(checkAuthenticated);

module.exports = router;
