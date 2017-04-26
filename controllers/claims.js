var request = require('request');
var http = require('http')
  , https = require('https');


var PROCESS_SERVER_HOST = 'processes-incident-demo.apps.ocp.hucmaggie.com';
var CONTAINER_ID = "1776e960572610314f3f813a5dbb736d";



exports.createClaim = function (req, res){

    console.log("Inside createClaim");

    res.json({message: 'create claim endpoint under construction'});
};

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

    console.log("Inside loadClaimDetails from process: ", process);

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
            console.log("found claim details");
            cb(claim);
        }
        else {
            console.error("got an error: ", error);

            cb(null);
        }
    });

}