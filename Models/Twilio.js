const mongoose = require("mongoose");
const validator = require("validator");

const usecaseschema = mongoose.Schema({
    usecases: {
        type: Number,
        // validate: [validator.isInteger, "Must be an integer value"]
    },
    properties: mongoose.Schema.Types.Mixed
});

usecaseschema.pre("save", function (next) {
    if (this.usecases != Object.keys(this.properties).length) {
        const error = new Error("No of usecases must match with the length of properties");
        error.statuscode = 500;
        return next(error);
    }
    next();
});

const useCases = mongoose.model("Usecases", usecaseschema);

module.exports = useCases;
