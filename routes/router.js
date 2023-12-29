const express = require("express");
const app = express()
const usecasecontroller = require("../controllers/usecase");
const twiliocontroller = require("../Twilio_calls/twilio");
const contactscontroller = require("../controllers/contacts");
const recordingController = require("../controllers/recordings")
const callBackController = require("../controllers/callBack")
app.use(express.json())

const router = express.Router();

router.route("/createusecase").post(usecasecontroller.createUseCases);
router.route("/getAllUseCases").get(usecasecontroller.getusecases);
router.route("/updateusecases/:id").patch(usecasecontroller.updateUseCases);
router.route("/createContact").post(contactscontroller.createContact);
router.route("/getContact/:contact").get(contactscontroller.findContact);
router.route("/incomingcall").all(twiliocontroller.incomingcallhandler);
router.route("/extractName").all(twiliocontroller.extractName);
router.route("/initialgather").all(twiliocontroller.initialgather);
router.route("/repeatOptions").all(twiliocontroller.repeatOptions);
router.route("/repeat").all(twiliocontroller.repeat);
router.route("/secondgather").all(twiliocontroller.secondgather);
router.route("/thirdgather").all(twiliocontroller.thirdgather);
router.route("/twiliocalls").all(twiliocontroller.twiliocallhandler);
router.route("/gather").all(twiliocontroller.handlegather);
router.route("/typeofagent").all(twiliocontroller.typeofagent);
router.route("/finalgather").all(twiliocontroller.finalgather);
router.route("/calls").all(twiliocontroller.calls);
router.route("/results").all(twiliocontroller.results);
router.route("/callRecordings").all(twiliocontroller.callRecordings);
router.route("/createRecording").post(recordingController.createRecording)
router.route("/wait").all(twiliocontroller.waithandler);
router.route("/dequeue").all(twiliocontroller.dequeueCall);
router.route("/callBack").all(twiliocontroller.callback);
router.route("/playmusic").all(twiliocontroller.playmusic);
router.route("/confirmNumber").all(twiliocontroller.confirmNumber);
router.route("/reEnterNumber").all(twiliocontroller.reEnterNumber);
router.route("/agent").all(twiliocontroller.agentCall)
router.route("/emptyQueue").all(twiliocontroller.emptyQueue);
router.route("/callStatus").all(twiliocontroller.callStatus);

router.route("/outboundCalls/:phoneNumber").all(twiliocontroller.outboundCalls)

router.route("/addCallbackNumber").post(callBackController.createCallback)
router.route("/getCallbackNumbers").get(callBackController.getNumbers)
router.route("/updateCallbackNumber/:id").patch(callBackController.updatecallback)
module.exports = router;
