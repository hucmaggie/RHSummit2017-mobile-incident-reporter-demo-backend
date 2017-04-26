
var claimHandler = require('../controllers/claims');
var process_server = require('../controllers/process_server');
var decision_server = require('../controllers/decision_server');



//This file is for your rest endpoints and will be used to link the url
module.exports = function (app, jsonParser, upload) {


    console.log("Loading routes");

    // PROCESS SERVER ROUTES

    app.post('/api/v1/bpms/startprocess', process_server.startProcess);



    // DECISION SERVER ROUTES

    app.get('/api/decision_server/get_questions', decision_server.getAllQuestionnairesForIncident);

    app.post('/api/v1/bpms/customer-incident', decision_server.createIncident);



    app.post('/api/v1/bpms/update-questions', jsonParser, function(req, res) {
        res.json({message: 'update-questions endpoint under construction'});
    });

    app.post('/api/v1/bpms/upload-photo/:processInstanceId/:fileName', upload.single('file'), function(req, res) {
        res.json({message: 'upload-photo endpoint under construction'});
    });




    // CLAIM  ROUTES
    // get list of existing claims
    app.get('/v1/api/claim', jsonParser, claimHandler.getExistingClaims);


    app.get('/v1/api/claims', jsonParser, function(req, res) {
        res.json(claims);
    });

    // create
    app.post('/v1/api/claim', jsonParser, claimHandler.createClaim);

    // update
    app.put('/v1/api/claim', jsonParser, function(req, res) {
        res.json({message: 'claim endpoint under construction'});
    });

    // delete
    app.delete('/v1/api/claim', jsonParser, function(req, res) {
        res.json({message: 'claim endpoint under construction'});
    });



};