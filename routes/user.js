const express = require("express");
const router = express.Router();

router.use(require("../middlewares/auth"));

router.get("/", require("../controllers/user/list-one"));
router.put("/", require("../controllers/user/update-account"));
router.put("/update/password", require("../controllers/user/update-password"));

module.exports = router;
