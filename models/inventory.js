const mongoose = require('mongoose');

const Model = mongoose.model('Inventory',
    {
        barcode: {
            type: String,
            required: true
        },
        productname: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        subcategory: {
            type: String,
            required: true
        },
        supplier: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            required: true
        },
        unit: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        unitprice: {
            type: Number,
            required: true
        },
        date: {
            type: Date,
            required: true,
        },
        process: {
            type: String,
            required: true
        }
    }
);

module.exports = Model;