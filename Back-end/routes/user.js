const express = require("express");
const router = express.Router();

const userctrl = require("../controllers/user");
const email= require("../middleware/email");
const password= require("../middleware/password");

router.post("/signup",email, password,userctrl.signup);
router.post("/login",userctrl.login);

module.exports = router;
