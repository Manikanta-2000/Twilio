const mongoose = require("mongoose");

const callRecordingsSchema = new mongoose.Schema({
    personName :{
        type : String
    },
    phoneNumber : {
        type : String
    },
    recording : {
        type : Buffer
    }
    
})

const recordingsModel = mongoose.model("Recordings",callRecordingsSchema)

module.exports = recordingsModel;