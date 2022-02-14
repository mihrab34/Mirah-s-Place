const express = require("express");
const router = express.Router();
// const csrf = require("csurf");
// const csrfProtection = csrf({ cookie: true });
const controller = require("../controller/slotsController");

router.get("/", controller.index);
router.get("/add",  controller.add);
router.post("/add",  controller.save)

module.exports = router;