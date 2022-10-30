exports.handler = function(context, event, callback) {
    var DynamicsWebApi = require('dynamics-web-api');
    var resource = 'https://twilioaus.crm6.dynamics.com';
    function acquireToken(dynamicsWebApiCallback){
        dynamicsWebApiCallback(event.token);
    }    
    //create DynamicsWebApi object
    var dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: 'https://twilioaus.api.crm6.dynamics.com/api/data/v9.0/',
        onTokenRefresh: acquireToken
    });
    console.log(event.contactID);
    var contact='contact('+event.contactID+')';
     var request = {
        collection: "incidents",
        select: ["ticketnumber,incidentid"],
        filter: "_customerid_value eq "+event.contactID,
        maxPageSize: 1,
        count: true
    };
    //perform a multiple records retrieve operation
    dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
        var records = response.value;
        var mikecount = Object.keys(records).length;
        if (mikecount >=1){
            console.log(records[0].ticketnumber);
            callback(null,{ticketNumber: records[0].ticketnumber, incidentid:records[0].incidentid} );
        }
    })
    .catch(function (error){
        //catch an error
        console.log(error);
         console.log('Error no record');
        callback(null,error);
    });
};