const express = require("express");
const router = express.Router();

router.use(require("../middlewares/auth"));

router.get(
  "/daily/transaction",
  require("../controllers/dashboard/daily-transaction")
);
router.get(
  "/total/profitloss",
  require("../controllers/dashboard/total-profitloss")
);
router.get("/total/stock", require("../controllers/dashboard/total-stock"));
router.get(
  "/entered/product/quantity",
  require("../controllers/dashboard/entered-product-quantity")
);

module.exports = router;
