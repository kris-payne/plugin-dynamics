exports.handler = function(context, event, callback) {
    var DynamicsWebApi = require('dynamics-web-api');
    var clientId = 'CLIENT-ID';
    var AuthenticationContext = require('adal-node').AuthenticationContext;
    //OAuth Token Endpoint
    var authorityUrl = 'https://login.microsoftonline.com/5ec24ac7-e561-4232-99e3-0450e60444d5/oauth2/token';
    //CRM Organization URL
    var resource = 'https://twilioaus.crm6.dynamics.com';
    var username = 'USERNAME';
    var password = 'PASSWORD';
    var adalContext = new AuthenticationContext(authorityUrl);
    var tokenTemp='';
    //add a callback as a parameter for your function
    function acquireToken(dynamicsWebApiCallback){
        //a callback for adal-node
        function adalCallback(error, token) {
            if (!error){
                //call DynamicsWebApi callback only when a token has been retrieved
                tokenTemp=token.accessToken;
                dynamicsWebApiCallback(token);
                callback(null,tokenTemp);
            }
            else{
                console.log('Token has not been retrieved. Error: ' + error.stack);
                callback(null,null);
            }
        }
        //call a necessary function in adal-node object to get a token
        adalContext.acquireTokenWithUsernamePassword(resource, username, password, clientId, adalCallback);
    }
    var dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: 'https://twilioaus.api.crm6.dynamics.com/api/data/v9.0/',
        onTokenRefresh: acquireToken
    });
    //call any function
    dynamicsWebApi.executeUnboundFunction("WhoAmI").then(function (response) {
        callback(null,tokenTemp);
    }).catch(function(error){
        callback(null,null);
    });
};