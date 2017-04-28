var request = require('request');
var http = require('http')
  , https = require('https')
  //,rest = require('restler')
  , fs = require('fs');

var process_server = require('./process_server');


var SERVICES_SERVER_HOST = 'services-incident-demo.apps.ocp.hucmaggie.com';


exports.addPhoto = function (req, res){

    console.log("Inside addPhoto: ", req.file);

    var fileName = req.file.originalname;

    console.log("originalname: " + fileName);

    var instanceId = req.params.instanceId;

    console.log("instanceId : " + instanceId);

    //fileName = req.params.fileName;

    console.log("fileName passes by client: " + req.params.fileName);

    // rest.post('http://' + SERVICES_SERVER_HOST + '/photos/' + instanceId, {
    //     multipart: true,
    //     data: {
    //         'file': rest.file(req.file.path, fileName, req.file.size, null, req.file.mimetype)
    //     }
    // }).on('complete', function(data, response) {
    //     console.log("DATA: ", data);
    //
    //     console.log("response.statusCode: ", response.statusCode);
    //
    //         if (response.statusCode == 200) {
    //
    //             // sample response
    //             // {
    //             //     "message": "successful file upload",
    //             //     "details": "1-iden_new.png",
    //             //     "result": true
    //             // }
    //
    //
    //         }
    //         else {
    //             console.error('Error happened: ' + data);
    //         }
    //
    //     return res.json(data);
    // });


    var options = {
        url: 'http://' + SERVICES_SERVER_HOST + '/photos/' + instanceId,
        headers: {
            'Accept': 'application/json'
            //,'Content-Type': 'multipart/form-data'
        },
        method: 'POST'
    };

    //var filePost = request.post('http://' + SERVICES_SERVER_HOST + '/photos/' + instanceId,
    var filePost = request(options, function (error, response, body) {

        console.log("BODY: ", body, typeof body);
        console.log("response.statusCode: ", response.statusCode);

        if (!error && response.statusCode == 200) {

            // sample response
            // {
            //     "message": "successful file upload",
            //     "details": "1-iden_new.png",
            //     "result": true
            // }

            var data = JSON.parse(body);
            console.log("DATA: ", data);

            process_server.addPhoto(instanceId, fileName, "reporter", function(){

                console.log("Done adding photo: " + fileName);
                return res.json({link: "http://services-incident-demo.apps.ocp.hucmaggie.com/photos/" + instanceId + "/" + fileName});
            });

        }
        else if (error){
            console.error('Error happened: '+ error);

            res.json(error);
        }
        else{
            res.json(body);
        }
    });

    var form = filePost.form();
    form.append('file', fs.createReadStream(req.file.path), {
        filename: fileName,
        contentType: req.file.mimetype
    });




};

exports.createClaim = function (req, res) {

    console.log("Inside createClaim, not implemented yet");
};

