
var request = require('request');
var http = require('http');

var PROCESS_SERVER_HOST = 'processes-incident-demo.apps.ocp.hucmaggie.com';
var CONTAINER_ID = "1776e960572610314f3f813a5dbb736d";


exports.getExistingClaims = function (req, res){

    console.log("Inside getExistingClaims");

    if (req.body) {

        var options = {
            url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/queries/processes/instances?status=1',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ=='
            },
            method: 'GET'
        };

        //send request
        request(options, function (error, response, body) {

            console.log("BODY: ", body);
            if (!error && response.statusCode == 200) {
                //var data = JSON.parse(JSON.stringify(body));

                var existingClaims = [];
                var claimCount = 0;
                var processes =  JSON.parse(body)["process-instance"];
                var processCount = processes.length;


                //console.log("processes: ", processes );

                if (processes){

                    processes.forEach(function(process) {

                        loadClaimDetails(process, function(claim) {

                            console.log("found claim: ", claim);
                            claimCount++;

                            if (claim != null || claim != undefined){

                                console.log("add claim: ", claim.questionnaire.id );
                                existingClaims.push(claim);
                            }

                            if (claimCount === processCount){
                                return res.json(existingClaims);
                            }
                        });



                    });
                }
                else{
                    console.log("No claims found");
                }


            }
            else {
                console.error("got an error: ", error);

                return res.status(500).json({error : 'DB record retreival error!'});
            }
        });


        //  http://services-incident-demo.apps.ocp.hucmaggie.com/
        // http.get({
        //     host: 'services-incident-demo.apps.ocp.hucmaggie.com',
        //     path: '/email'
        // }, function(response) {
        //
        //     console.log("got data: ", response.data);
        //
        //     res.json(response.data);
        //
        // }, function(error) {
        //     console.error("got an error: ", error);
        //
        //     return res.status(500).json({error : 'DB record retreival error!'});
        // });



        // mbaasApi.db({
        //     act : 'list',
        //     type : 'activeClaim',
        //     fields : req.body
        // }, function(error, data) {
        //     if (error) {
        //         res.status(500).json({
        //             error : 'DB record retreival error!'
        //         });
        //     } else {
        //         res.json(data);
        //     }
        // });
    }
};


function loadClaimDetails(process, cb) {

    console.log("Inside loadClaimDetails);  // from process: ", process);

    var instanceId = process[["process-instance-id"]];

    console.log("found process["+instanceId+"]");

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/processes/instances/' + instanceId + '/variables',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ=='
        },
        method: 'GET'
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body);
        //console.log("response: ", response);

        if (!error && response.statusCode == 200) {

            var claim = JSON.parse(body);
            claim.processId = instanceId;
            console.log("found claim details for instanceId: " + instanceId);
            cb(claim);
        }
        else {
            console.error("got an error: ", error);

            cb(null);
        }
    });

};


exports.startProcess = function (req, res){

    console.log("Inside startProcess");

    var msg = {
        "incident" : {"com.redhat.vizuri.demo.domain.Incident":{
            "id" : null,
            "reporterUserId" : null,
            "incidentType" : "windshield",
            "description" : "Programatically creating incident",
            "incidentDate" : null,
            "buildingName" : "building-a",
            "stateCode" : "VA",
            "zipCode" : null,
            "severity" : null
        }
        },
        "questionnaire": {
            "com.redhat.vizuri.demo.domain.Questionnaire": {
                "id": 1,
                "name": "Cracked Windshield Report",
                "questions": [{
                    "questionId": "win-1",
                    "questionnaireId": 1,
                    "groupId": null,
                    "description": "Is the crack larger than a quarter?",
                    "answerType": "YES_NO",
                    "required": false,
                    "enabled": true,
                    "order": 1,
                    "options": []
                },
                    {
                        "questionId": "win-2",
                        "questionnaireId": 1,
                        "groupId": null,
                        "description": "Is the crack larger than a dollar bill?",
                        "answerType": "YES_NO",
                        "required": false,
                        "enabled": false,
                        "order": 2,
                        "options": []
                    },
                    {
                        "questionId": "win-3",
                        "questionnaireId": 1,
                        "groupId": null,
                        "description": "Was the car in motion at the time?",
                        "answerType": "YES_NO",
                        "required": false,
                        "enabled": true,
                        "order": 3,
                        "options": []
                    },
                    {
                        "questionId": "win-4",
                        "questionnaireId": 1,
                        "groupId": null,
                        "description": "Does the damage impair the drivers vision?",
                        "answerType": "YES_NO",
                        "required": false,
                        "enabled": true,
                        "order": 4,
                        "options": []
                    }
                ],
                "answers": [],
                "completedBy": null,
                "completedDate": null
            }
        }
    };


    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/processes/processes.report-incident/instances',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ=='
        },
        method: 'POST',
        json: msg
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body);
        console.log("response.statusCode: ", response.statusCode);
        if (!error && response.statusCode == 201) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);
            return res.json(body);
        }
        else {
            console.error('Error happened: '+ error);
            res.json(error);
        }
    });

    // mbaasApi.service({
    //     guid : serviceId,
    //     path : '/api/v1/bpms/startprocess',
    //     method : 'POST',
    //     params : req.body
    // }, function(error, body, response) {
    //     if(error) {
    //         res.json(error);
    //     }
    //     if(body) {
    //         res.json(body);
    //     }
    //     res.json({message:'Backend: Unexpected path'});
    // });
};

exports.addPhoto = function (instanceId, fileName, source, cb){

    console.log("Inside addPhoto");

    var updateInfo = {"photoId" : fileName,
                      "updateSource" : source};


    console.log("for instanceId[" + instanceId + "], updateInfo: ", updateInfo);

    signalHumanTask(instanceId, function(error){

        if (!error){

            listReadyTasks (instanceId, "Update Information", function(error, taskId){

                if (!error){

                    console.log("calling updateInformation");
                    updateInformation (taskId, updateInfo, function(error){

                        if (!error){
                            console.log("Claim updated successful");
                            cb(null, "SUCCESS");

                        }
                        else{
                            var msg = "Unable to add photo, error: " + error;
                            console.error(msg);
                            cb(msg);
                        }
                    });

                }
                else{
                    var msg = "Unable to list ready tasks, error: " + error;
                    console.error(msg);
                    cb(msg);
                }

            });
        }
        else{
            var msg = "Unable to signal for human task, error: " + error;
            console.error(msg);
            cb(msg);
        }

    });

};

exports.addComment = function (req, res){

    console.log("Inside addComment");

    var body = req.body;

    //console.log("body: ", body);

    var instanceId = req.params.instanceId;

    var updateInfo = {"comment" : body.claimComments,
                      "updateSource" : body.messageSource};


    console.log("for instanceId[" + instanceId + "], updateInfo: ", updateInfo);

    signalHumanTask(instanceId, "Update%20Information", function(error){

        if (!error){

            listReadyTasks (instanceId, "Update Information", function(error, taskId){

                if (!error){

                    console.log("calling updateInformation");
                    updateInformation (taskId, updateInfo, function(error){

                        if (!error){
                            console.log("Claim updated successful");
                            res.json("SUCCESS");

                        }
                        else{
                            var msg = "Unable to add comment, error: " + error;
                            console.error(msg);
                            res.json(msg);
                        }
                    });

                }
                else{
                    var msg = "Unable to list ready tasks, error: " + error;
                    console.error(msg);
                    res.json();
                }

            });
        }
        else{
            var msg = "Unable to signal for human task, error: " + error;
            console.error(msg);
            res.json("Unable to signal for human task, error: " + error);
        }

    });

    // mbaasApi.service({
    //     guid : serviceId,
    //     path : '/api/v1/bpms/add-comments/' + req.params.processInstanceId,
    //     method : 'POST',
    //     params : req.body
    // }, function(error, body, response) {
    //     if(error) {
    //         res.json(error);
    //     }
    //     if(body) {
    //         res.json(body);
    //     }
    //     res.json({message: 'Unexpected path'});
    // });
};

//Perform Remediation
exports.performRemediation = function (req, res){

    console.log("Inside performRemediation");

    var body = req.body;

    //console.log("body: ", body);

    var instanceId = req.params.instanceId;

    var updateInfo = {"completed" : true};


    console.log("for instanceId[" + instanceId + "], updateInfo: ", updateInfo);

    signalHumanTask(instanceId, "Perform%20Remediation", function(error){

        if (!error){

            listReadyTasks (instanceId, "Perform Remediation", function(error, taskId){

                if (!error){

                    console.log("calling updateInformation");
                    updateInformation (taskId, updateInfo, function(error){

                        if (!error){
                            console.log("Claim updated successful");
                            res.json("SUCCESS");

                        }
                        else{
                            var msg = "Unable to add comment, error: " + error;
                            console.error(msg);
                            res.json(msg);
                        }
                    });

                }
                else{
                    var msg = "Unable to list ready tasks, error: " + error;
                    console.error(msg);
                    res.json();
                }

            });
        }
        else{
            var msg = "Unable to signal for human task, error: " + error;
            console.error(msg);
            res.json("Unable to signal for human task, error: " + error);
        }

    });
};

function signalHumanTask (instanceId, type, cb){

    console.log("Inside signalHumanTask, instanceId: " + instanceId + " type["+type+"]");

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/processes/instances/signal/' + type + '?instanceId=' + instanceId,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ=='
        },
        method: 'POST'
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body);
        console.log("response.statusCode: ", response.statusCode);
        if (!error && response.statusCode == 200) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);
            //return res.json(body);
            cb(null);
        }
        else {
            console.log('Error happened: '+ error);
            //res.json(error);
            cb(error);
        }
    });


}

//List Ready Tasks
function listReadyTasks (instanceId, type, cb){

    console.log("Inside listReadyTasks for type["+type+"], instanceId: ", instanceId);

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/queries/tasks/instances/process/' + instanceId + '?status=Ready',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ=='
        },
        method: 'GET'
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body, typeof body);
        //console.log("response: ", response);

        if (!error && response.statusCode == 200) {

            var data = JSON.parse(body);
            var tasks = data["task-summary"];

            console.log("found tasks");

            if (tasks != undefined){

                // go through the list of tasks and find the 'Update Information task
                for(var i = 0; i < tasks.length; i++){

                    //task[i]["task-id"] === instanceId &&

                    if (tasks[i]["task-name"] === type && tasks[i]["task-status"] === "Ready"){
                        console.log("found task: " + tasks[i]["task-id"] + " for type["+type+"]");
                        return cb(null, tasks[i]["task-id"]);

                    }
                }

            }
            else{
                cb(null);
            }

        }
        else {
            console.error("got an error: ", error);

            cb(error);

        }
    });

}

function updateInformation (taskId, updateInfo, cb){

    console.log("Inside updateInformation, taskId["+taskId+"], updateInfo: ", updateInfo);

    // sample updateInfo:
    // {
    //     "comment" : "hello from postman2",
    //     "photoId" : "incident.png",
    //     "updateSource" : "responder"
    // }

    var options = {
        url: 'http://' + PROCESS_SERVER_HOST + '/kie-server/services/rest/server/containers/' + CONTAINER_ID + '/tasks/' + taskId + '/states/completed?auto-progress=true',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic cHJvY2Vzc29yOnByb2Nlc3NvciM5OQ=='
        },
        method: 'PUT',
        json: updateInfo
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body, typeof body);
        console.log("response.statusCode: ", response.statusCode);
        if (!error && response.statusCode == 201) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);
            //return res.json(body);
            cb(null);
        }
        else {
            console.log('Error happened: '+ error);
            //res.json(error);
            cb(error);
        }
    });

    // mbaasApi.service({
    //     guid : serviceId,
    //     path : '/api/v1/bpms/startprocess',
    //     method : 'POST',
    //     params : req.body
    // }, function(error, body, response) {
    //     if(error) {
    //         res.json(error);
    //     }
    //     if(body) {
    //         res.json(body);
    //     }
    //     res.json({message:'Backend: Unexpected path'});
    // });
};