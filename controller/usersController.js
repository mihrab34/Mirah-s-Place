exports.login =  (req, res) => {
  res.render("users/login", {
    title: "Login Page",
    csrfToken: req.csrfToken(),
  });
};

exports.authenticateLogin = (req, res) => {
  // console.log(res);
  res.redirect("/");
};

exports.logout = (req, res) => {
  // req.logout();
}
