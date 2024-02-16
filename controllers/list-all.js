const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'barcode';
        const skip = (page - 1) * limit;
        
        const sortName = sort.startsWith('-') ? sort.slice(1) : sort;

        const agg = [
            { $sort: { [sortName]: sort.startsWith('-') ? -1 : 1 } },
            { $skip: skip },
            { $limit: limit }
        ];

        let result = await ModelInventory.aggregate(agg);

        return res.send(result);

    } catch (error) {

        return next(error);

    };
}