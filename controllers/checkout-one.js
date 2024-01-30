const ModelInventory = require("../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const barcode = req.params.barcode;
        const body = req.body;

        const data = {
            barcode,
            productname: body.productname,
            category: body.category,
            subcategory: body.subcategory,
            supplier: body.supplier,
            brand: body.brand,
            unit: body.unit,
            quantity: body.quantity,
            unitprice: body.unitprice,
            date: new Date(),
            process: "checkout"
        };

        await ModelInventory.create(data);

        return res.send();

    } catch (error) {

        return next(error);

    };

};