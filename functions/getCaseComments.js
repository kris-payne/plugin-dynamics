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
    var id = event.caseID;
    console.log(id);
    var request = {
        collection: "incidents",
        select: ["description",],
        filter: "incidentid eq "+id,
        maxPageSize: 1,
        count: true
    };
    //perform a multiple records retrieve operation
    dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
        var records = response.value;
        var mikecount = Object.keys(records).length;
        if (mikecount >=1){
            console.log(records[0].description);
            callback(null,records[0].description);
        }
    })
    .catch(function (error){
        //catch an error
        console.log(error);
         console.log('Error no record');
        callback(error);
    });
};