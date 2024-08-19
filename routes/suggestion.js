const express = require("express");
const router = express.Router();

router.use(require("../middlewares/auth"));

router.post("/send", require("../controllers/suggestion/send"));

module.exports = router;
