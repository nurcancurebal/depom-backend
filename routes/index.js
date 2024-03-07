const express = require("express");
const router = express.Router();

router.use("/inventory", require("./inventory"));
router.use("/user", require("./user"));
router.use("/auth", require("./auth"));

module.exports = router;