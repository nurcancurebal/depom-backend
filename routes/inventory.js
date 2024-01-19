const express = require("express");
const router = express.Router();

router.get("/", require('../controllers/list-all'));
router.post("/", require('../controllers/create-one'));

module.exports = router;