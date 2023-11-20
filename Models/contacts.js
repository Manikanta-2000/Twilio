const mongoose = require("mongoose");
const validator = require("validator");

const contactsschema = mongoose.Schema({
    contact: {
        type: String,
        unique : true,
        // validate: [validator.isInteger, "Must be an integer value"]
    },
    Name : {
        type: String,
    }
});

// usecaseschema.pre("save", function (next) {
//     if (this.usecases != Object.keys(this.properties).length) {
//         const error = new Error("No of usecases must match with the length of properties");
//         error.statuscode = 500;
//         return next(error);
//     }
//     next();
// });

const Contacts = mongoose.model("Contacts", contactsschema);

module.exports = Contacts;
