var DynamicsWebApi = require('dynamics-web-api');
exports.handler = function(context, event, callback) {
    var DynamicsWebApi = require('dynamics-web-api');
    var AuthenticationContext = require('adal-node').AuthenticationContext;
    //OAuth Token Endpoint
    var authorityUrl = 'https://login.microsoftonline.com/5ec24ac7-e561-4232-99e3-0450e60444d5/oauth2/token';
    //CRM Organization URL
    var resource = 'https://twilioaus.crm6.dynamics.com';
    var adalContext = new AuthenticationContext(authorityUrl);
    function acquireToken(dynamicsWebApiCallback){
        dynamicsWebApiCallback(event.token);
    }    
    //create DynamicsWebApi object
    var dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: 'https://twilioaus.api.crm6.dynamics.com/api/data/v9.0/',
        onTokenRefresh: acquireToken
    });
    var contact = {   "firstname":event.first_name,
                    "lastname": event.last_name,
                    "fullname": event.first_name + ' ' + event.last_name,
                    "emailaddress1":event.email,
                    // "parentcustomerid_account@odata.bind":"/accounts(754d46e6-e20d-ea11-a811-000d3ad20571)", //Twilio Magic Account in Dynamics
                    "parentcustomerid_account@odata.bind":"/accounts(8dec6081-5e4c-ea11-a812-000d3ad20571)", //Microsoft ignite Conf Account in Dynamics
                    "telephone1":event.contact,
                    "mobilephone":event.contact,
                    "jobtitle":"Demo Assistant"
                };
    dynamicsWebApi.create(contact, "contacts").then(function (id) {
        //do something with id here
        console.log(id);
        callback(null,id);
    
    }).catch(function (error) {
        //catch error here
        console.log('error ' +error);
        callback(null);
    });
};