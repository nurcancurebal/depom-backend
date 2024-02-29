const ModelInventory = require("./../models/inventory");

module.exports = async function (req, res, next) {

    try {

        let result = await ModelInventory.find();

        const newData = {};

        for (const { _doc: iterator } of result) {
            const newKey = `${iterator?.barcode}_${iterator?.unit}`;

            if (!newData?.[newKey]) {
                newData[newKey] = {
                    _id: iterator?._id,
                    data: [iterator],
                    barcode: iterator?.barcode,
                    unit: iterator?.unit,
                    productname: iterator?.productname,
                    category: iterator?.category,
                    subcategory: iterator?.subcategory,
                    supplier: iterator?.supplier,
                    brand: iterator?.brand,
                }
            } else {
                newData[newKey].data.push(iterator);
            };
        };

        for (const iterator of Object.keys(newData)) {
            const { data } = newData[iterator];

            const catchDate = data.sort((a, b) => new Date(b?.date) - new Date(a?.date))[0];

            newData[iterator].date = catchDate?.date;
        };

        let newDataArray = [];

        for (const iterator of Object.keys(newData)) {
            newDataArray.push(newData[iterator]);
        };

        newDataArray = newDataArray.map((item) => {

            let stockQuantity = 0;

            let filteredDataEntry = item?.data
                .filter((i) => i?.process === "entry");

            filteredDataEntry.forEach(element => {
                stockQuantity += element?.quantity;
            });

            let filteredDataCheckout = item?.data
                .filter((i) => i?.process === "checkout");
            filteredDataCheckout.forEach(element => {
                stockQuantity -= element?.quantity;
            });

            let totalUnitPrice = 0;
            let profitLoss = 0;

            let checkoutAverage = filteredDataCheckout.reduce((total, i) => total + i.unitprice, 0) / filteredDataCheckout.length;

            let entryAverage = filteredDataEntry.reduce((total, i) => total + i.unitprice, 0) / filteredDataEntry.length;

            totalUnitPrice = entryAverage;

            if (filteredDataCheckout.length > 0) {
                profitLoss = checkoutAverage - entryAverage;
            } else {
                profitLoss = "-";
            }


            delete item?.data;
            return { ...item, stockQuantity, totalUnitPrice, profitLoss };
        });

        newDataArray = newDataArray.sort((a, b) => new Date(b?.date) - new Date(a?.date));

        return res.send(newDataArray);

    } catch (error) {

        return next(error);

    };
}