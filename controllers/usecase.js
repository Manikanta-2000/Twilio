const useCase = require("../Models/Twilio");

exports.createUseCases = async (req,res,next) => {
try{
    const useCases = await useCase.create(req.body)

    res.status(200).json({
        message : "Successfull",
        useCases
    });
}catch(error){
    next(error);
} 
}

exports.getusecases = async (req,res,next) => {
    try{
        const allUseCases = await useCase.find();
        let text = "If you want";
        let count = 1;
        let properties = {}
        let noofusecases = 0;

        if (allUseCases.length > 0) {
            properties = allUseCases[0].properties;
            noofusecases = allUseCases[0].usecases;

            Object.keys(properties).forEach(usecase => {
                text = text + " " + `${usecase} press ${count} or say ${usecase}.`;
                count = count + 1;
            });
        } else {
            text = "No use cases found.";
        }

        res.status(200).json({
            noofusecases,
            text,
            properties});
        // res.status(200).json({
        //     allUseCases
        // })

    }catch(error){
        next(error);
    }
}

exports.updateUseCases = async (req, res, next) => {
    try {
        const updateddocument = await useCase.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            "message": "Successfully updated",
            updateddocument
        });
    } catch (error) {
        next(error);
    }
}
