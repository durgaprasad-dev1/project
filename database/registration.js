var mongoose = require("mongoose");

var RegistrationSchema = new mongoose.Schema({

    name: String,

    email: {
        type: String,
        unique: true
    },

    password: String

});

module.exports = mongoose.model(
    "registrations",
    RegistrationSchema
);