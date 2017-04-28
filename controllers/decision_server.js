/**
 * Created by bvanderwalt on 4/25/17.
 */

var request = require('request');
var http = require('http');


var DECISION_SERVER_HOST = 'decisions-incident-demo.apps.ocp.hucmaggie.com';
var CONTAINER_ID = "4c1342a8827bf46033cb95f0bdf27f0b";
var REQUEST_AUTHORIZATION = 'Basic ZGVjaWRlcjpkZWNpZGVyIzk5';


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
        url: 'http://' + DECISION_SERVER_HOST + '/kie-server/services/rest/server/containers/instances/' + CONTAINER_ID,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': REQUEST_AUTHORIZATION
        },
        method: 'POST',
        json: msg
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body, typeof body);
        if (!error && response.statusCode == 200) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);

            //var data = JSON.parse(body);

            //console.log("data: ", data, typeof data);

            var questionnaire = body.result["execution-results"].results[0].value["org.drools.core.runtime.rule.impl.FlatQueryResults"].idFactHandleMaps.element[0].element[0].value["org.drools.core.common.DisconnectedFactHandle"].object["com.redhat.vizuri.demo.domain.Questionnaire"];
            return res.json(questionnaire);
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

exports.updateQuestions = function (req, res){

    console.log("Inside updateQuestions");

    var questionnaire = req.body;

    console.log("questionnaire questions: ", questionnaire.questions);
    console.log("questionnaire answers: ", questionnaire.answers);

    var questionTemplate = {
        "insert" : {
            "object" : {"com.redhat.vizuri.demo.domain.Question":{
                "questionId" : "win-1",
                "questionnaireId" : 1,
                "groupId" : null,
                "description" : "Is the crack larger than a quarter?",
                "answerType" : "YES_NO",
                "required" : false,
                "enabled" : true,
                "order" : 1,
                "options" : [ ]
            }},
            "disconnected" : false,
            "out-identifier" : "question-1",
            "return-object" : true,
            "entry-point" : "DEFAULT"
        }
    };

    var answerTemplate = {
        "insert" : {
            "object" : {"com.redhat.vizuri.demo.domain.Answer":{
                "questionId" : "win-1",
                "groupId" : null,
                "strValue" : "Yes",
               // "updatedValue" : false,
               // "lastUpdated" : 1493093649773,
                "delete" : false
            }},
            "disconnected" : false,
            "out-identifier" : "answer",
            "return-object" : true,
            "entry-point" : "DEFAULT"
        }
    };

    var ruleCommands = [{
        "set-focus" : {
            "name" : "sync-answers"
        }
    }, {
        "fire-all-rules" : {
            "max" : 100,
            "out-identifier" : "sync-answers-fired"
        }
    } ];

    var msg = {
        "lookup" : "summit17-ks",
        "commands" : []
    };

    var commands = [];
    var question;
    var answer;
    // now create new instances of questions
    questionnaire.questions.forEach(function(q, i){

        question = JSON.parse(JSON.stringify(questionTemplate));
        var obj = question.insert.object["com.redhat.vizuri.demo.domain.Question"];
        obj.questionId = q.questionId;
        obj.description = q.description;
        obj.enabled = q.enabled;
        obj.order = q.order;

        question.insert["out-identifier"] = "question-" + (i+1);

        console.log("add question["+ obj.questionId+"], enabled["+obj.enabled+"]");  // compact log
        //console.log("add question: " + JSON.stringify(question, null, 2) );
        commands.push(question);

    });

    questionnaire.answers.forEach(function(a, i){


        answer = JSON.parse(JSON.stringify(answerTemplate));

        answer.insert["out-identifier"] = "answer-" + (i+1);

        var obj = answer.insert.object["com.redhat.vizuri.demo.domain.Answer"];
        obj.questionId = a.questionId;
        obj.strValue = a.strValue;

        console.log("add answer["+ obj.questionId+"], value["+obj.strValue+"]");  // compact log
        //console.log("add answer: " + JSON.stringify(answer, null, 2));    // detail log
        commands.push(answer);

    });


    msg.commands = commands.concat(ruleCommands);

    //console.log("msg: ", msg);
    //console.log("msg: " +  JSON.stringify(msg, null, 2));

    var options = {
        url: 'http://' + DECISION_SERVER_HOST + '/kie-server/services/rest/server/containers/instances/' + CONTAINER_ID,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': REQUEST_AUTHORIZATION
        },
        method: 'POST',
        json: msg
    };

    //send request
    request(options, function (error, response, body) {

        console.log("BODY: ", body, typeof body);

        //console.log("results: " +  JSON.stringify(body, null, 2));


        console.log("response.statusCode: ", response.statusCode);

        //type: 'SUCCESS'
        if (!error && response.statusCode == 200) {
            //var data = JSON.parse(JSON.stringify(body));
            //console.log("DATA: ", data);

            //var data = JSON.stringify(body);

            var facts = body.result["execution-results"].results;

            //console.log("facts: " +  JSON.stringify(facts, null, 2));

            facts.forEach(function(fact){


                if (fact.key.startsWith("answer") === true){

                    var obj = fact.value["com.redhat.vizuri.demo.domain.Answer"];

                    //console.log("found answer: ", fact.value);
                    console.log("found answer["+ obj.questionId+"], value["+obj.strValue+"]");  // compact log

                    questionnaire.answers.forEach(function(a){

                        if (obj.updatedValue === true && a.questionId === obj.questionId){

                            console.log("update answer["+a.questionId+"]: ");
                        }
                    });
                }
                else if (fact.key.startsWith('question') === true){

                    var obj = fact.value["com.redhat.vizuri.demo.domain.Question"];

                    console.log("found question["+ obj.questionId+"], enabled["+obj.enabled+"]");  // compact log
                    //console.log("check question: ", obj);

                    questionnaire.questions.forEach(function(q){

                        if (q.questionId === obj.questionId){

                            console.log("update question["+q.questionId+"], enabled["+obj.enabled+"]");
                            q.enabled = obj.enabled;

                        }
                    });

                }
                else if (fact.key.startsWith('sync-answers') === true){
                    console.log("rules fired " + fact.value + " times");
                }

            });

            return res.json(questionnaire);
        }
        else {
            console.error('Error happened: '+ error);
            res.json(error);
        }
    });


};






