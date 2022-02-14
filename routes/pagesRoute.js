const express = require("express");
const router = express.Router();
const controller = require("../controller/pagesController")

router.get('/', controller.index);

module.exports = router;