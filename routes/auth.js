const express = require("express");
const router = express.Router();

router.post("/signin", require('../controllers/auth/signin'));
router.post("/signup", require('../controllers/auth/signup'));

module.exports = router;