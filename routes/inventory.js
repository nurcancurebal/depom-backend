const express = require("express");
const router = express.Router();

router.get("/", require('../controllers/list-all'));
router.get("/current", require('../controllers/list-current'));
router.get("/count", require('../controllers/list-count'));
router.get("/:barcode", require('../controllers/list-barcode'));
router.post("/", require('../controllers/entry-one'));
router.post("/:barcode", require('../controllers/checkout-one'));

module.exports = router;