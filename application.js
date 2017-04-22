var express = require('express');
var cors = require('cors');
var request = require('request');
var bodyParser = require('body-parser');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var fs = require('fs');

var app = express();

// list the endpoints which you want to make securable here
var securableEndpoints = [];

// Enable CORS for all requests
app.use(cors());
var jsonParser = bodyParser.json();

// Note: the order which we add middleware to Express here is important!
app.use('/sys', jsonParser, function(req, res) {
	res.json({message: 'pong'});
});

app.use('/mbaas', jsonParser, function(req, res) {
	res.json({message: 'no mbaas'});
});

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

app.get('/v1/api/claims', jsonParser, function(req, res) {
	res.json(claims);
});

app.post('/v1/api/claim', jsonParser, function(req, res) {
	res.json({message: 'claim endpoint under construction'});
});

app.put('/v1/api/claim', jsonParser, function(req, res) {
	res.json({message: 'claim endpoint under construction'});
});

app.delete('/v1/api/claim', jsonParser, function(req, res) {
	res.json({message: 'claim endpoint under construction'});
});

app.get('/v1/api/claim', jsonParser, function(req, res) {
	res.json({message: 'claim endpoint under construction'});
});

app.get('/test', jsonParser, function(req, res) {
	res.json({message: 'test endpoint under construction'});
});

app.get('/api/v1/bpms/', jsonParser, function(req, res) {
	res.json({message: 'bpms endpoint under construction'});
});

app.post('/api/v1/bpms/add-comments/:processInstanceId', jsonParser, function(req, res) {
	res.json({message: 'add-comments endpoint under construction'});
});

app.post('/api/v1/bpms/doadjuster/:processInstanceId', jsonParser, function(req, res) {
	res.json({message: 'doadjuster endpoint under construction'});
});

app.get('/api/v1/bpms/download-photo/:processInstanceId/:fileName', jsonParser, function(req, res) {
	res.json({message: 'download-photo endpoint under construction'});
});

app.post('/api/v1/bpms/customer-incident', jsonParser, function(req, res) {
	res.json({message: 'customer-incident endpoint under construction'});
});

app.post('/api/v1/bpms/startprocess', jsonParser, function(req, res) {
	res.json({message: 'startprocess endpoint under construction'});
});

app.post('/api/v1/bpms/update-questions', jsonParser, function(req, res) {
	res.json({message: 'update-questions endpoint under construction'});
});

app.post('/api/v1/bpms/upload-photo/:processInstanceId/:fileName', upload.single('file'), function(req, res) {
		res.json({message: 'upload-photo endpoint under construction'});
	});

/*var claims = [];

function saveClaim(claim) {
	var found = false;
	for (var i = 0; i < claims.length; i++) {
		if (claims[i].id === claim.id) {
			found = true;
			break;
		}
	}
	if (!found) {
		claims.push(claim);
	}
}*/

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
	console.log("App started at: " + new Date() + " on port: " + port);
});
