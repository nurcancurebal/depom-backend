const express = require("express");
const router = express.Router();

router.get("/", require('../controllers/list-all'));
router.get("/current", require('../controllers/list-current'));
router.get("/list/count", require('../controllers/list-count'));
router.get("/current/count", require('../controllers/current-count'));
router.get("/:barcode", require('../controllers/list-barcode'));
router.post("/", require('../controllers/entry-one'));
router.post("/:barcode", require('../controllers/checkout-one'));

module.exports = router;