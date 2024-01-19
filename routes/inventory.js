const express = require("express");
const router = express.Router();

router.get("/", require('../controllers/list-all'));
router.post("/", require('../controllers/create-one'));
router.put("/:id", require('../controllers/update-one'));
router.delete("/:id", require('../controllers/delete-one'));