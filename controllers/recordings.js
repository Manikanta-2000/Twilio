const recordings = require("../Models/callRecordings");
const axios = require("axios");

exports.createRecording = async(req,res,next) => {
    try{
        const response = await axios({
            method: 'GET',
            url: req.body.RecordingUrl,
            responseType: 'stream', // Ensure response is treated as a stream
          })
          if(response.status === 200){
            const audioBuffer = Buffer.from(response.data,"Binary")
            const recordingData = await recordings.create({
              "personName" : personName,
              "phoneNumber": phoneNumber,
              "recording" : audioBuffer
            })
          }
        res.status(200).json({
            message: "successfull",
        })
    }
    catch(error){
        next(error)
    }
}