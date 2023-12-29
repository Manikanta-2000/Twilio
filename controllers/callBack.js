const callBack = require("../Models/callBack");

exports.createCallback = async(req,res,next) => {
    try{
        const newCallback = await callBack.create(req.body);

        res.status(200).json({
            "status" : "successfull",
            newCallback
        })
    }catch(error){
        next(error)
    }
}

exports.getNumbers = async(req,res,next) => {
    try{
        const callBackNumberArray = await callBack.find({callBack : true})
        res.status(200).json({
            callBackNumberArray
        })
    }catch(error){
        next(error)
    }
}

exports.updatecallback = async(req,res,next) => {
    try{
        // console.log(req.params.id);
        // console.log(req.body);
        const updatedCallBack = await callBack.findByIdAndUpdate(req.params.id,req.body)
        res.status(200).json({
            updatedCallBack 
        })

    }catch(error){
        next(error)
    }
}