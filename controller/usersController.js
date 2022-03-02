const User = require("../model/userModel");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  const message = req.flash().error;
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
};

exports.index = async(req, res) => {
  const users = await User.find({})
  res.render("users/index", { title: "Users", users });
};

exports.add = (req, res) => {
  res.render("users/add", { title: "Add User", csrfToken: req.csrfToken() });
};

exports.create = async (req, res) => {  
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User ({
      name: req.body.name,
      phone_number: req.body.username,
      password: hashedPassword,
      role: "admin"
    })

    await newUser.save();
    res.redirect("/users");
  } catch (error) {
    console.log(error);
  }
};

exports.edit = async (req, res) => {
  res.render("users/edit", { title: "Edit User" });
};

exports.update = async (req, res) => {
  try {
    res.redirect("/users");
  } catch (error) {
    console.log(error);
  }
};
