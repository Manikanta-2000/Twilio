const contactModel = require("../Models/contacts");

exports.createContact = async(req,res,next) => {
    try{
        const contact = await contactModel.create(req.body);
        res.status(200).json({
            message : "Successfull",
            contact
        });
    }catch(error){
        next(error);
    }
}

exports.findContact = async(req,res,next) => {
    try{
        const contact = await contactModel.find({contact:req.params.contact});
        res.status(200).json({
            contact
        })

    }catch(error){
        next(error);
    }
    

}