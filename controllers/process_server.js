
var request = require('request');
var http = require('http');

var PROCESS_SERVER_HOST = 'processes-incident-demo.apps.ocp.hucmaggie.com';
var CONTAINER_ID = "1776e960572610314f3f813a5dbb736d";


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
            console.log('Error happened: '+ error);
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