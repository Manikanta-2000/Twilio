const mongoose = require("mongoose");

const callBackSchema = new mongoose.Schema({
    phoneNumber : {
        type : String
    },
    callBack : {
        type : Boolean,
        default : true
    }
});

const callBack =  mongoose.model("CallBack",callBackSchema)

module.exports = callBack