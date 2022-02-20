exports.login =  (req, res) => {
  const message = req.flash().error
    res.render("users/login", {
      title: "Login Page",
      message,
      csrfToken: req.csrfToken(),
    });
};

exports.authenticateLogin = (req, res) => {
  res.redirect("/");
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/");
}
