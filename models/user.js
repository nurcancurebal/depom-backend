const mongoose = require('mongoose');

const Model = mongoose.model('User',
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },
        birthdate: {
            type: Date,
            required: true
        },
        password: {
            type: String,
            trim: true,
            required: true
        }
    }
);

module.exports = Model;