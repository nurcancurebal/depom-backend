const express = require("express");
const router = express.Router();

router.use("/inventory", require("./inventory"));
router.use("/user", require("./user"));
router.use("/auth", require("./auth"));
router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏👋",
  });
});
module.exports = router;
