const express = require("express");
const router = express.Router();
const controller = require('../controller/bookingsController')

router.get('/', controller.index);
router.get("/add", controller.add);
router.post('/add', controller.save);
router.post('/update-user', controller.updateUser);

module.exports = router