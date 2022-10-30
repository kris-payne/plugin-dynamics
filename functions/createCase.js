exports.handler = function(context, event, callback) {
    var DynamicsWebApi = require('dynamics-web-api');
    function acquireToken(dynamicsWebApiCallback){
        dynamicsWebApiCallback(event.token);
    }    
    //create DynamicsWebApi object
    var dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: 'https://twilioaus.api.crm6.dynamics.com/api/data/v9.0/',
        onTokenRefresh: acquireToken
    });
    var incident = {   "caseorigincode":1,
                    "casetypecode": 1,
                    "title":"A Joke from Twilio",
                    "customerid_contact@odata.bind":"/contacts(" + event.contact_id + ")",
                    "description":"Joke here"
                };
    dynamicsWebApi.create(incident, "incidents").then(function (id) {
        var request = {
            collection: "incidents",
            select: ["ticketnumber",],
            filter: "incidentid eq "+id,
            maxPageSize: 1,
            count: true
        };
        //perform a multiple records retrieve operation
        dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
            var records = response.value;
            var mikecount = Object.keys(records).length;
            if (mikecount >=1){
                callback(null,{'id':id, 'Fullticketnumber':records[0].ticketnumber, 'ticketnumber':records[0].ticketnumber.slice(4, 9)});
            }
            else{
                callback(null,null);
            }
        }).catch(function (error) {
            console.log('error on Get Case ' +error);
            callback(null,null);
        });
    }).catch(function (error) {
        console.log('error ' +error);
        callback(error);
    });
};