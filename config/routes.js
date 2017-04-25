
var claimHandler = require('../controllers/claims');
var process_server = require('../controllers/process_server');
var decision_server = require('../controllers/decision_server');



//This file is for your rest endpoints and will be used to link the url
module.exports = function (app, jsonParser) {


    console.log("Loading routes");

    // PROCESS SERVER ROUTES

    app.get('/api/process_server/start_process', process_server.startProcess);




    // DECISION SERVER ROUTES

    app.get('/api/decision_server/get_questions', decision_server.getAllQuestionnairesForIncident);



    // CLAIM  ROUTES

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

    // get
    app.get('/v1/api/claim', jsonParser, function(req, res) {
        res.json({message: 'claim endpoint under construction'});
    });

};