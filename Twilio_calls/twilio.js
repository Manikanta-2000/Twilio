const express = require("express");
const urlencoded = require("body-parser").urlencoded;
const app =express();
const axios = require("axios");
const fs= require("fs");
const https = require('https');
const { log } = require("console");
const nodemon = require("nodemon");
app.use(urlencoded({ extended : false}));
const VoiceResponse =  require("twilio").twiml.VoiceResponse
const MessagingResponse = require("twilio").twiml.MessagingResponse;
app.use(express.json())
const nlp = require("compromise");

let inputdata = {
  "model": "gpt-3.5-turbo-0301",
  "messages": [
     {
          "role": "user"
      },
      {
          "role" : "assistant",
          "content" : "This is Olivia, how can I help you today?"
      }
  ]
}

const url = 'http://154.53.47.247:30081/core/api/v2/chat/completions?companyId=6560f9cc9dd5104df49636c5&token=6560f9cc9dd5104df49636c4'
const certPath = fs.readFileSync('./app_usremodel_ai_combined.crt')
const agent = new https.Agent({
    ca: certPath
    // rejectUnauthorized: false
  });
  // Define the Axios configuration with the agent
  const axiosConfig = {
    httpsAgent: agent,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  };

let properties = {};
let noofusecases = 0;
let text = "";
let anotherNumber="";
let callerText;
let people;
let personName;
let count=1;
let serviceType

exports.incomingcallhandler = async (req,res) => {
  const twiml = new VoiceResponse();
  twiml.say({voice: 'Polly.Ruth-Neural'},"Thanks for calling smith roofing.")
  const gather = twiml.gather({
    input : "speech",
    speechModel : "phone_call",
    enhanced : "true",
    speechTimeout : "auto",
    language : "en-US",
    action : "/extractName"
  }).say({voice: 'Polly.Ruth-Neural'},"Whom do I have the pleasure of speaking with?");
  res.type("text/xml");
  res.send(twiml.toString());
}
exports.extractName = async(req,res,next) => {
  const twiml = new VoiceResponse();
  try{
    callerText = req.body.SpeechResult;
    console.log(req.body.SpeechResult);
    // console.log(callerText);
      doc = nlp(callerText);
     people = doc.people().out('array');
     personName = people[0];
    //  console.log(people);
     if(people.length===0){
      twiml.redirect("/incomingcall")
     }
     console.log(personName);
     const contactInfo = await axios.get(`http://54.197.76.31:3000/getContact/${req.body.From}`);
     twiml.say({
      voice: 'Polly.Ruth-Neural'
     },`Hello ${personName}`);
     if (contactInfo.data.contact.length!=0){
      let numarray = req.body.From.split("");
      twiml.say({
        voice: 'Polly.Ruth-Neural'
      },"I see you are calling from,");
      for (i=2;i<numarray.length;i++){
        twiml.say({
          voice: 'Polly.Ruth-Neural'
        },numarray[i])
      }
      twiml.pause();
      const gather = twiml.gather({
        input : "dtmf speech",
        speechModel : "numbers_and_commands",
        speechTimeout : "auto",
        language : "en-US",
        numDigits: 1,
        action:"/initialgather"
      }).say({
        voice: 'Polly.Ruth-Neural'
      },"If you are calling about this account, say yes or press 1 , If you are calling about another account say different account or press 2, if you want to repeat the options say repeat or press 3");
     }
     else{
      twiml.say({
        voice: 'Polly.Ruth-Neural'
      },`Hello ${personName}`)
      twiml.redirect("/typeofagent");
     }
     
  }catch(error){
    next(error);
  }
  res.type("text/xml");
  res.send(twiml.toString());
}

exports.repeatOptions = async(req,res,next) => {
  const twiml = new VoiceResponse();
  try{
    const gather = twiml.gather({
      input : "dtmf speech",
      speechModel : "numbers_and_commands",
      speechTimeout : "auto",
      language : "en-US",
      numDigits: 1,
      action:"/initialgather"
    }).say({
      voice: 'Polly.Ruth-Neural'
    },"If you are calling about this account, say yes or press 1 , If you are calling about another account say different account or press 2, if you want to repeat the options say repeat or press 3");

  }catch(error){
    next(error);
  }
  res.type("text/xml");
  res.send(twiml.toString());
}

exports.initialgather = async(req,res,next) => {
  const twiml = new VoiceResponse();
  console.log(req.body.SpeechResult);
  try{
    if(req.body.SpeechResult){
      if(req.body.SpeechResult.match(/yes/gi) ){
        twiml.redirect("/typeofagent");
      }
      else if (req.body.SpeechResult.match(/different account/gi)){
        const gather = twiml.gather({
          input : "speech",
          speechModel : "numbers_and_commands",
          speechTimeout : "auto",
          language : "en-US",
          action : "/secondgather"
        }).say({
          voice: 'Polly.Ruth-Neural'
        },"If you are calling for a new account say yes,if you want calling for already existing account say existing account, if you want to repeat the options say repeat");
      }
      else if (req.body.SpeechResult.match(/repeat/gi)){
        twiml.redirect("/repeatOptions");
      }
      else{
        twiml.redirect("/repeatOptions");
      }

    }
    else if (req.body.Digits){
      if(req.body.Digits === "1"){
        twiml.redirect("/typeofagent");
      }
      else if (req.body.Digits === "2"){
        const gather = twiml.gather({
          input : "speech",
          speechModel : "numbers_and_commands",
          speechTimeout : "auto",
          language : "en-US",
          action : "/secondgather"
        }).say({
          voice: 'Polly.Ruth-Neural'
        },"If you are calling for a new account say yes,if you want calling for already existing account say existing account, if you want to repeat the options say repeat");
      }
      else if (req.body.Digits === "3"){
        twiml.redirect("/repeatOptions");
      }
      else{
        twiml.redirect("/repeatOptions");
      }

    }
    else{
      twiml.redirect("/repeatOptions");
    }
  }
  catch(error){
    next(error);
  }
  res.type("text/xml");
  res.send(twiml.toString());
}

exports.repeat = async (req,res,next) => {
  const twiml = new VoiceResponse();
  try{
    const gather = twiml.gather({
      input : "speech",
      speechModel : "numbers_and_commands",
      speechTimeout : "auto",
      language : "en-US",
      action : "/secondgather"
    }).say({
      voice: 'Polly.Ruth-Neural'
    },"If you are calling for a new account say yes,if you want calling for already existing account say existing account, if you want to repeat the options say repeat");
  }catch(error){
    next(error)
  }
  res.type("text/xml");
  res.send(twiml.toString());
}

exports.secondgather = async(req,res) => {
  const twiml = new VoiceResponse();
  console.log(req.body.Digits);
  try{
    if(req.body.SpeechResult.match(/yes/gi)){
      twiml.redirect("/typeofagent");
    }
    else if(req.body.SpeechResult.match(/existing account/gi)){
      const gather = twiml.gather({
        numDigits : 10,
        action : "/thirdgather"
      }).say({voice: 'Polly.Ruth-Neural'},"Please enter the phone number associated with the account you are cakking about so we can look up");
    }
    else if (req.body.SpeechResult.match(/repeat/gi)){
      twiml.redirect("/repeat");
    }
    else{
      twiml.redirect("/repeat");
    }

  }catch(error){
    next(error)
  }
  res.type("text/xml");
  res.send(twiml.toString());
}

exports.thirdgather = async(req,res) => {
  const twiml = new VoiceResponse();
  if (req.body.Digits){
    anotherNumber = "+1"+req.body.Digits;
    const contactInfo = await axios.get(`http://54.197.76.31:3000/getContact/${anotherNumber}`);
    if(contactInfo.data.contact.length!=0){
      twiml.redirect("/typeofagent");
    }
    else{
      if(count<2){
        count = count+1;
      const gather= twiml.gather({
        numDigits : 10,
        action : "/thirdgather"
      }).say({voice: 'Polly.Ruth-Neural'},"I am sorry, I cannot find the account associated with that number, Let us try that again, Please enter the number");

      }
      else{
        twiml.say({voice: 'Polly.Ruth-Neural'},"There seems to be an issue with finding the account you are looking for, how about we try and get you to someone who can help");
        twiml.redirect("/typeofagent");
      }
      
    }
  }
  else{
    twiml.redirect("/secondgather")
  }
  res.type("text/xml");
  res.send(twiml.toString());
}

exports.twiliocallhandler = async (req, res) => {
    const twiml = new VoiceResponse();
    // console.log("Incoming call from:", req.body.From);
  
    try {
      const jsonobj = await axios.get("http://54.197.76.31:3000/getAllUseCases");
      text = jsonobj.data.text; // Access text from jsonobj.data
      properties = jsonobj.data.properties; // Access properties from jsonobj.data
      noofusecases = jsonobj.data.noofusecases;

      twiml.say({
        voice: 'Polly.Ruth-Neural'
      },"To help you direct to the right place, please choose from the following options")
      const gather = twiml.gather({
        input : "dtmf speech",
        speechModel : "numbers_and_commands",
        speechTimeout : "auto",
        language : "en-US",
        numDigits: 1,
        action: "/gather"
      });
      gather.say({
        voice: 'Polly.Ruth-Neural'
      }, text);

  
      // Rest of your code here, e.g., redirects or additional instructions.
      twiml.redirect("/twiliocalls")
  
      res.type("text/xml");
      res.send(twiml.toString());
    } catch (error) {
      console.error("Axios request error:", error);
      // Handle the error appropriately, e.g., redirect or provide an error message to the caller.
    }
};
  
exports.handlegather = async (req,res)=>{
    try{
        const twiml = new VoiceResponse();
        console.log(req.body.SpeechResult);
        console.log(req.body.Digits);
        let flag=true;
        if (req.body.SpeechResult){
          let flag = true;
          for (let i = 0; i < Object.keys(properties).length; i++) {
            const regex = new RegExp(Object.keys(properties)[i], 'gi');
            if (regex.test(req.body.SpeechResult)) {
              flag = false;
              serviceType = Object.keys(properties)[i];
              inputdata.messages[0]["content"] = properties[Object.keys(properties)[i]];
              twiml.redirect("/typeofagent");
              // twiml.say({ voice: 'Polly.Ruth-Neural' }, properties[Object.keys(properties)[i]]);
              break;
            }
          }
          if (flag) {
            twiml.redirect("/twiliocalls");
          }  
        }
        else if (req.body.Digits){
          if((req.body.Digits-1)<noofusecases){
            serviceType = Object.keys(properties)[req.body.Digits-1];
            inputdata.messages[0]["content"] = properties[Object.keys(properties)[req.body.Digits-1]];
            twiml.redirect("/typeofagent");
            // twiml.say({
            //             voice: 'Polly.Ruth-Neural'
            //         },String(properties[Object.keys(properties)[req.body.Digits-1]]));
        }
        else{
            twiml.say({
                voice: 'Polly.Ruth-Neural'
            },"Sorry I dont understand that choice");
            twiml.pause();
            twiml.redirect("/twiliocalls")
        }
        }
        else {
            // If no input was sent, redirect to the /voice route
            twiml.redirect('/twiliocalls');
          }
        
          // Render the response as XML in reply to the webhook request
          res.type('text/xml');
          res.send(twiml.toString());
    }catch(error){
        
        console.log(error.message);
    }
}

exports.typeofagent = async(req,res,next) => {
  try{
    const twiml = new VoiceResponse();
    const gather = twiml.gather({
      input : "dtmf speech",
      speechModel : "numbers_and_commands",
      speechTimeout : "auto",
      language : "en-US",
      numDigits: 1,
      action: "/finalgather"
    }).say({
      voice: 'Polly.Ruth-Neural'
  },"if you want to talk to human agent say human or press1, if you want to talk to virtual agent say virtual or press2");
  res.type('text/xml');
  res.send(twiml.toString());
  }catch(error){next(error)}
}

exports.finalgather = async(req,res,next) => {
  const twiml = new VoiceResponse();
  try{
    if(req.body.SpeechResult){
      if(req.body.SpeechResult.match(/human/gi) ){
        twiml.say({
          voice: 'Polly.Ruth-Neural'
      },"Connecting you to human agent")
        twiml.dial("+14057144199",{
          record : "record-from-answer-dual",
          callerid : `${req.body.From}`
        });
      }
      else if (req.body.SpeechResult.match(/virtual/gi)){
        twiml.say({
          voice: 'Polly.Ruth-Neural'
      },"Connecting you to virtual agent")
      twiml.redirect("/twiliocalls")
      }
      
      else{
        twiml.redirect("/typeofagent");
      }

    }
    else if (req.body.Digits){
      if(req.body.Digits === "1"){
        twiml.say({
          voice: 'Polly.Ruth-Neural'
      },"Connecting you to human agent")
        twiml.dial("+14057144199",{
          record : "record-from-answer-dual",
          callerid : `${req.body.From}`
        });
      }
      else if (req.body.Digits === "2"){
        twiml.say({
          voice: 'Polly.Ruth-Neural'
      },"Connecting you to virtual agent")
      twiml.redirect("/twiliocalls")
      }
      else{
        twiml.redirect("/typeofagent");
      }
    }
    else{
      twiml.redirect("typeofagent")
    }
    res.type('text/xml');
  res.send(twiml.toString());
  }
  catch(error){
    next(error)
  }
}

exports.calls = async(req,res,next) => {
  try{
    const twiml = new VoiceResponse();
    let output = req.query.output || ''
    res.type("xml");
    if (!output){
        twiml.say({
            voice: 'Polly.Joanna-Neural'
        }, `Welcome to ${serviceType} section, This is Olivia, how can I help you today?`);
    }
    const params = new URLSearchParams({ output:output })
    const gather = twiml.gather({
        enhanced: "true",
        speechTimeout: "auto",
        speechModel: "phonce_call",
        input: 'speech',    
        action : `/results?${params}`
    });
    gather.say({
            voice: 'Polly.Joanna-Neural'   
        },output)
    twiml.redirect({
        method : "GET"
    },"/results")
    res.send(twiml.toString());
  }catch(error){
    next(error)
  }
}

exports.results = async(req,res,next) => {
  try{
    let output = req.query.output;
    const userInput = req.body.SpeechResult
    const twiml = new VoiceResponse();
    if (!userInput){
        output = "hey are you still there ? Is there anything that I can help you with"
        let params = new URLSearchParams({ output : output })
        twiml.redirect({
            method : "POST"
        }, `/calls?${params}`)
    }
    else{
    console.log('User : ' + userInput);
    inputdata.messages.push({
        "role" : "user",
        "content" : userInput
    })
    const aiResponse = await axios.post(url, inputdata,axiosConfig);
    if (aiResponse.status === 201) {
        const jsonObj = aiResponse.data;
        console.log('Virtual Assistant: ' + jsonObj.completionResult.choices[0].message.content);
        output= jsonObj.completionResult.choices[0].message.content
        // twiml.say({
        //     voice: 'Polly.Joanna-Neural'
        // },jsonObj.completionResult.choices[0].message.content);
        inputdata.messages.push({
            "role" : "assistant",
            "content" :jsonObj.completionResult.choices[0].message.content
        })
        let params = new URLSearchParams({ output : output })
        twiml.redirect({
            method : "POST"
        }, `/calls?${params}`)
    }
    else{
        console.log(aiResponse.message);
    }
    }
    res.type('text/xml');
    res.send(twiml.toString())
  }catch(error){
    next(error)
  }
}