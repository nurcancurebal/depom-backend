const ModelInventory = require("../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const body = req.body;

        const data = {
            barcode: body.barcode,
            productname: body.productname,
            category: body.category,
            subcategory: body.subcategory,
            supplier: body.supplier,
            brand: body.brand,
            unit: body.unit,
            quantity: body.quantity,
            unitprice: body.unitprice,
            date: new Date(),
            process: "entry"
        };

        const result = await ModelInventory.create(data);

        return res.send(result);

    } catch (error) {

        return next(error);

    };

};