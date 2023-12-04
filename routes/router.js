const express = require("express");
const app = express()
const usecasecontroller = require("../controllers/usecase");
const twiliocontroller = require("../Twilio_calls/twilio");
const contactscontroller = require("../controllers/contacts");
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
// router.route("/wrongNumber").all(twiliocontroller.wrongNumber);
// router.route("/newNumberVerification").all(twiliocontroller.newnumberverification);
router.route("/twiliocalls").all(twiliocontroller.twiliocallhandler);
router.route("/gather").all(twiliocontroller.handlegather);
router.route("/typeofagent").all(twiliocontroller.typeofagent);
router.route("/finalgather").all(twiliocontroller.finalgather);
router.route("/calls").all(twiliocontroller.calls);
router.route("/results").all(twiliocontroller.results);


module.exports = router;
