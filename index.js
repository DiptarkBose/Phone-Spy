const request = require("request");
const Alexa = require("alexa-sdk");

function searchNum(number, _this)
{
	if(number.length!=10)
	{
		_this.response.speak("Its not a valid 10 digit phone number. May I know the number again?").listen("Sorry, I couldn\'t hear you!");
		_this.emit(':responseReady');
	}
	else
	{
		var url = "https://numspy.pythonanywhere.com/LocateMobile/"+number;
		var speechOutput, name, serviceProvider, state;
		request({
		    url: url,
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		        
		        //Name Extraction
		        if(body['data']['Name'] != undefined)
		        	name="This number belongs to " + body['data']['Name']+". ";
		        else
		        	name="Sorry, I couldn't find this number's owner! ";

		        //Service Provider Extraction
		        if(body['data']['Provider'] == "empty")
		       		serviceProvider="I was unable to detect the service provider. ";
		       	else
		       		serviceProvider="The service provider is " + body['data']['Provider']+". ";

		        //Registered State Extraction
		        if(body['data']['State'] == "empty")
		       		state="The state this number is registered in couldn't be identified.";
		       	else
		       		state="This phone number is registered in " + body['data']['State']+". ";

	        	//Final Speech
	        	speechOutput=name+serviceProvider+state;
		        _this.response.speak(speechOutput);
		        _this.emit(':responseReady');
		    }
		    else
		    {
		    	_this.response.speak("Pardon me for this technical snag! Please try again after some time!");
				_this.emit(':responseReady');
		    }
		})
	}
}

var handlers ={

	'LaunchRequest' : function(){
		this.response.speak("Hi there! Have a phone number you are curious about?").listen("Just tell me the phone number you want to search!");
		this.emit(':responseReady');
	},
	'SearchNumber' : function(){
		var number=this.event.request.intent.slots.PhoneNumber.value;
		searchNum(number, this);
	},
	'AMAZON.StopIntent' : function(){
		this.response.speak("Glad to be of assistance!");
		this.emit(':responseReady');
	},
	'AMAZON.CancelIntent' : function(){
		this.response.speak("Glad to be of assistance!");
		this.emit(':responseReady');
	},
	'AMAZON.HelpIntent' : function(){
		this.response.speak("You can ask me stuff like: Check this phone number for me followed by the 10-digit phone number. Or better still, just read out the phone number and I'll get to work! To exit, just say Stop. Do you want to search any phone numbers now?").listen();
		this.emit(':responseReady');
	},
	'AMAZON.FallbackIntent' : function(){
		this.response.speak("Pardon me for this technical snag! Please try after some time!");
		this.emit(':responseReady');
	},
	'Unhandled' : function(){
		this.response.speak("Pardon me for this technical snag! Please try after some time!");
		this.emit(':responseReady');
	}
}
exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.appId = "amzn1.ask.skill.2db42bde-5470-4abe-940d-0765ed926217";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
