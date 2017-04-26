/**
 * Created by bvanderwalt on 4/25/17.
 */

var request = require('request');
var http = require('http');
var DECISION_SERVER_HOST = 'decisions-incident-demo.apps.ocp.hucmaggie.com';


exports.getAllQuestionnairesForIncident = function (req, res){

    console.log("Inside getAllQuestionnairesForIncident");
};

exports.createIncident = function (req, res){

    console.log("Inside createIncident");

    var msg = {
        "lookup" : "summit17-ks",
        "commands" : [ {
            "insert" : {
                "object" : {"com.redhat.vizuri.demo.domain.Incident":{
                    "id" : null,
                    "reporterUserId" : null,
                    "incidentType" : "windshield",
                    "description" : null,
                    "incidentDate" : null,
                    "buildingName" : null,
                    "stateCode" : null,
                    "zipCode" : null,
                    "severity" : null
                }},
                "disconnected" : true,
                "out-identifier" : "incident",
                "return-object" : false,
                "entry-point" : "DEFAULT"
            }
        }, {
            "set-focus" : {
                "name" : "construct-customer-questions"
            }
        }, {
            "fire-all-rules" : {
                "max" : -1,
                "out-identifier" : "construct-fired"
            }
        }, {
            "set-focus" : {
                "name" : "question-cleanup"
            }
        }, {
            "fire-all-rules" : {
                "max" : -1,
                "out-identifier" : "cleanup-fired"
            }
        }, {
            "query" : {
                "name" : "get-questionnaires",
                "arguments" : [ ],
                "out-identifier" : "questionnaires"
            }
        } ]
    };


    var options = {
        url: 'http://' + DECISION_SERVER_HOST + '/kie-server/services/rest/server/containers/instances/4c1342a8827bf46033cb95f0bdf27f0b',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Basic ZGVjaWRlcjpkZWNpZGVyIzk5'
        },
        method: 'POST',
        json: msg
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body);
        if (!error && response.statusCode == 200) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);
            return res.json(body);
        }
        else {
            console.log('Error happened: '+ error);
        }
    });






    // var options = {
    //     host: DECISION_SERVER_HOST,
    //     path: '/kie-server/services/rest/server/containers/instances/4c1342a8827bf46033cb95f0bdf27f0b',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //         'Authorization': 'Basic ZGVjaWRlcjpkZWNpZGVyIzk5'
    //         //,'Content-Length': postData.length
    //     },
    //     port: 80,
    //     method: 'POST'
    // };

    // var postData = JSON.stringify(body);
    //
    //
    //
    // //  http://services-incident-demo.apps.ocp.hucmaggie.com/
    // const request = http.request(options, function(response) {
    //
    //     console.log("STATUS: ",response.statusCode);
    //
    //     console.log("HEADERS: ", JSON.stringify(response.headers));
    //
    //
    //
    //     var data;
    //
    //     response.setEncoding('utf8');
    //
    //     response.on('data', function(chunk) {
    //         data =+ chunk;
    //         console.log("BODY: ", chunk);
    //     });
    //
    //     response.on('end', function() {
    //         console.log('No more data in response.');
    //
    //         console.log("got data: ", data);
    //
    //         return res.json(data);
    //     });
    // });
    //
    // request.on('error', function(err) {
    //     console.error("problem with request: ${e.message}");
    //
    //     console.error("got an error: ", error);
    //
    //     return res.status(500).json({error : 'DB record retreival error!'});
    // });
    //
    // // write data to request body
    // request.write(postData);
    // request.end();


};




