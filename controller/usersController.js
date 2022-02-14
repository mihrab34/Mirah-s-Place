const Users = require("../model/userModel");


exports.add = async (req, res) => {
    res.render("users/login", {title: "Login Page"})
}

exports.save = async (req,res) => {}