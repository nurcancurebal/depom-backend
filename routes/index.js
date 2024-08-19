const express = require("express");
const router = express.Router();

router.use("/inventory", require("./inventory"));
router.use("/user", require("./user"));
router.use("/auth", require("./auth"));
router.use("/dashboard", require("./dashboard"));
router.use("/suggestion", require("./suggestion"));
router.get("/", (_req, res) => {
  res.json({
    message: "DEPOM API - 👋🌎🌍🌏👋",
  });
});
module.exports = router;
