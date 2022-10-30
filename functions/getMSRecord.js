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
    
    var request = {
        collection: "contacts",
        select: ["fullname", "firstname","lastname","emailaddress1","contactid","mobilephone"],
        filter: "mobilephone eq '"+ event.contact+"'",
        maxPageSize: 5,
        count: true
    };
     
    //perform a multiple records retrieve operation
    dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
        var count = response.oDataCount;
        var nextLink = response.oDataNextLink;
        var records = response.value;
        var mikecount = Object.keys(records).length;
        if (mikecount >=1){
            console.log(records[0].contactid);
            console.log(records[0].firstname);
            console.log(records[0].caseID);
            var caseID;
            var caseNumber;
            //Get caseID
            var caseContact='contact('+records[0].contactid+')';
            console.log(caseContact);
            request = {
                collection: "incidents",
                select: ["ticketnumber,incidentid"],
                filter: "_customerid_value eq "+records[0].contactid,
                maxPageSize: 1,
                count: true
            };
            //perform a multiple records retrieve operation
            dynamicsWebApi.retrieveMultipleRequest(request).then(function (response) {
                console.log('Mike2334');
                var caseRecords = response.value;
                var caseMikecount = Object.keys(caseRecords).length;
                if (caseMikecount >=1){
                    caseID = caseRecords[0].incidentid;
                    caseNumber= caseRecords[0].ticketnumber.substr(4);
                    
                    console.log(caseNumber);
                    console.log('Found case');
                    //callback(null,{ticketNumber: caseRecords[0].ticketnumber, incidentid:caseRecords[0].incidentid} );
                    callback(null, {
            			contact_id: records[0].contactid,
            			reportsto_id: '',
            			reportsto_name: '',
            			delegate: '',
            			delegate_phone: '',
            			first_name: records[0].firstname,
            			contact:records[0],
            			email: records[0].emailaddress1,
            			member_id: records[0].contactid,
            			last_name: records[0].lastname,
            			account: '',
            			phone: records[0].mobilephone,
            			points: 0,
            			join_date: records[0].createDate,
            			bill_due: 0,
            			cases: '',
            			CaseNumber: caseNumber,
            			caseID: caseID
        			});
                }
                else{
                    console.log('No case');
                    callback(null, {
            			contact_id: records[0].contactid,
            			reportsto_id: '',
            			reportsto_name: '',
            			delegate: '',
            			delegate_phone: '',
            			first_name: records[0].firstname,
            			contact:records[0],
            			email: records[0].emailaddress1,
            			member_id: records[0].contactid,
            			last_name: records[0].lastname,
            			account: '',
            			phone: records[0].mobilephone,
            			points: 0,
            			join_date: records[0].createDate,
            			bill_due: 0,
            			cases: '',
            			CaseNumber: caseNumber,
            			caseID: caseID
        			});
                }
            })
            .catch(function (error){
                //catch an error
                console.log(error);
                 console.log('Error no record');
                callback(null,error);
            });
        }
        else{
            console.log('Error no record');
            callback(null,'Error');
        }
        //do something else with a records array. Access a record: response.value[0].subject;
    })
    .catch(function (error){
        //catch an error
        console.log(error);
         console.log('Error no record');
        callback(null,'No Record');
    });
};