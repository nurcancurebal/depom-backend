const ModelInventory = require("../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const body = req.body;

        const data = {
            barcode: body.barcode,
            productname: body.productname,
            date: body.date,
            category: body.category,
            subcategory: body.subcategory,
            supplier: body.supplier,
            brand: body.brand,
            unit: body.unit,
            quantity: body.quantity,
            unitprice: body.unitprice
        };

        await ModelInventory.create(data);

        return res.send();

    } catch (error) {

        return next(error);

    };

};