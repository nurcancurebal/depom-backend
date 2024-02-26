const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        let result = await ModelInventory.find();

        let groupedResult = result.reduce((acc, current) => {
            if (!acc[current.barcode]) {
                acc[current.barcode] = [];
            }
            acc[current.barcode].push(current);
            return acc;
        }, {});

        return res.send(groupedResult);

    } catch (error) {

        return next(error);

    };
}