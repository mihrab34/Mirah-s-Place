const Users = require("../model/userModel");


exports.login = async (req, res) => {
    res.render("users/login", {title: "Login Page"})
}

exports.authenticateLogin = async (req,res) => {
    res.redirect("/");
}