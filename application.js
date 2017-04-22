var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
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
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.get('/v1/api/claims', jsonParser, function(req, res) {
	res.json(claims);
});

app.post('/v1/api/claim', jsonParser, function(req, res) {
	if (req.body) {
		mbaasApi.db({
			act : 'create',
			type : 'activeClaim',
			fields : req.body
		}, function(error, data) {
			if (error) {
				res.status(500).json({
					error : 'DB record creation error!'
				});
			} else {
				res.json(data);
			}
		});
	}
});

app.put('/v1/api/claim', jsonParser, function(req, res) {
	if (req.body) {
		mbaasApi.db({
			act : 'update',
			type : 'activeClaim',
			guid : req.body.id,
			fields : req.body
		}, function(error, data) {
			if (error) {
				res.status(500).json({
					error : 'DB record update error!'
				});
			} else {
				res.json(data);
			}
		});
	}
});

app.delete('/v1/api/claim', jsonParser, function(req, res) {
	mbaasApi.db({
		act : 'deleteall',
		type : 'activeClaim'
	}, function(error, data) {
		if (error) {
			res.status(500).json({
				error : 'DB record deletion error!'
			});
		} else {
			res.json(data);
		}
	});
});

app.get('/v1/api/claim', jsonParser, function(req, res) {
	if (req.body) {
		mbaasApi.db({
			act : 'list',
			type : 'activeClaim',
			fields : req.body
		}, function(error, data) {
			if (error) {
				res.status(500).json({
					error : 'DB record retreival error!'
				});
			} else {
				res.json(data);
			}
		});
	}
});

var serviceId = 'edkitiecq635j5ioyisrb5dj'; // Manually loaded for now

app.get('/test', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/test',
		method : 'GET'
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.json(body);
		}
		res.json({message: 'Unexpected path'});
	});
});

app.get('/api/v1/bpms/', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/test',
		method : 'GET'
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.send(body);
		}
		res.json({message:'Backend: Unexpected path'});
	});
});

app.post('/api/v1/bpms/add-comments/:processInstanceId', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/bpms/add-comments/' + req.params.processInstanceId,
		method : 'POST',
		params : req.body
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.json(body);
		}
		res.json({message: 'Unexpected path'});
	});
});

app.post('/api/v1/bpms/doadjuster/:processInstanceId', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/bpms/doadjuster/' + req.params.processInstanceId,
		method : 'POST',
		params : req.body
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.json(body);
		}
		res.json({message: 'Unexpected path'});
	});
});

app.get('/api/v1/bpms/download-photo/:processInstanceId/:fileName', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/bpms/download-photo/' + req.params.processInstanceId + '/' + req.params.fileName,
		method : 'GET'
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.json(body);
		}
		res.json({message: 'Unexpected path'});
	});
});

app.post('/api/v1/bpms/customer-incident', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/bpms/customer-incident',
		method : 'POST',
		params : req.body
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.json(body);
		}
		res.json({message: 'Backend: Unexpected path'});
	});
});

app.post('/api/v1/bpms/startprocess', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/bpms/startprocess',
		method : 'POST',
		params : req.body
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.json(body);
		}
		res.json({message:'Backend: Unexpected path'});
	});
});

app.post('/api/v1/bpms/update-questions', jsonParser, function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/bpms/update-questions',
		method : 'POST',
		params : req.body
	}, function(error, body, response) {
		if(error) {
			res.json(error);
		}
		if(body) {
			res.json(body);
		}
		res.json({message: 'Unexpected path'});
	});
});

app.post('/api/v1/bpms/upload-photo/:processInstanceId/:fileName', upload.single('file'), function(req, res) {
	mbaasApi.service({
		guid : serviceId,
		path : '/api/v1/host',
		method : 'GET',
	}, function(error, body, response) {
		if (error) {
			res.json(error);
		}
		if (body) {
			var cloudUrl = body.hostUrl + '/api/v1/bpms/upload-photo/' + req.params.processInstanceId + '/' + req.params.fileName;

			var r = request.post(cloudUrl, function(err, httpResponse, body) {
				if (err) {
					res.json(err);
				}
				if (body) {
					console.log(body);
					res.send(body);
				}
				res.json({
					message : 'Backend: Unexpected path'
				});
			});

			var form = r.form();
			form.append('file', fs.createReadStream(req.file.path), {
				filename : req.file.originalname,
				contentType : req.file.mimetype,
				knownLength : req.file.size
			});

		}
	});
});

var claims = [];

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
}

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
app.listen(port, host, function() {
	console.log("App started at: " + new Date() + " on port: " + port);
});
