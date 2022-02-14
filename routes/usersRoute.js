const router = require("express").Router();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const controller = require("../controller/usersController");

passport.use(
  new LocalStrategy(function verify(username, password, done) {
    const user = {};
    return done(null, user);
  })
);

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
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  controller.authenticateLogin
);

module.exports = router;
