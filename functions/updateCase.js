exports.handler = function(context, event, callback) {
    //console.log(event.caseID);
    var DynamicsWebApi = require('dynamics-web-api');
    function acquireToken(dynamicsWebApiCallback){
        dynamicsWebApiCallback(event.token);
    }    
    //create DynamicsWebApi object
    var dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: 'https://twilioaus.api.crm6.dynamics.com/api/data/v9.0/',
        onTokenRefresh: acquireToken
    });
    
    var incidentID=event.caseID;
     
    var PostData = {
        subject: event.FromComment,
        description: event.comment,
        'regardingobjectid_incident_task@odata.bind': 'incidents('+incidentID+')',
    }; 
    console.log(PostData);
    dynamicsWebApi.create(PostData, "tasks").then(function (taskid) {
        //do something with id here
        callback(null,taskid);
    }).catch(function (error) {
        //catch error here
         callback(null,error);
    });

};