const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const barcode = req.params.barcode;
        const body = req.body;

        const data = {
            barcode,
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

        const findOneInventory = await ModelInventory.updateOne({ barcode }, data);

        if (!findOneInventory) {
            throw new Error("Not found inventory!!!");
        };

        res.send();

    } catch (error) {

        return next(error);

    };
}