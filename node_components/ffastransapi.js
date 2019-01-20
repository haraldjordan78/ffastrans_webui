const assert = require('assert');
const Request = require("request");
//todo: implement queued jobs
module.exports = {
    getWorkflowDetails: (callbackSuccess,callbackError) => {
        Request({ url: buildApiUrl(global.config.STATIC_GET_WORKFLOW_DETAILS_URL), method: 'GET'}, function(error, response, body){ 
            if (error){
                callbackError(error)
            }else{
                callbackSuccess(body)
            }
        });
        return;
    },
    startJob: (job,callbackSuccess,callbackError) => {
        console.log("Starting job:");
        console.log(job);
        Request({ url: buildApiUrl(global.config.STATIC_START_JOB_URL), method: 'POST',body:job}, function(error, response, body){ 
            if (error){
                console.log(error);
                callbackError(error)
            }else{
                console.log("Success starting ffastrans api job");
                console.log(body);
                callbackSuccess(body);
            }
        });
        return;
    },
};

function buildApiUrl(what){
    return "http://" + global.config.STATIC_API_HOST + ":" +  global.config.STATIC_API_PORT + what;  
}


