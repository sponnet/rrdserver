var express = require('express');
var app = express();
var cors = require('cors');
var config = require('./config.json')
var rrd = require('node-round-robin-database')
var DB = rrd.DB;
var Layer = rrd.Layer;
var path = require('path');
var levelup = require('levelup');
var crypto = require('crypto');
var url = require('url');


var db = levelup('./mydb');

function mkdb(data) {
	var options = {
		layers: [
			new Layer('5m', '1d'), // 5m resolution for 1 day
			new Layer('1h', '1w'), // 1h resolution for 1 week
			new Layer('1d', '1y') // 1d resolution for 1 years
		]
	};
	if (data) {
		options.buffer = data;
	}
	return new DB(options);

}

function mkhash(val) {
	return crypto.createHash('md5').update(val).digest("hex");
};

app.get('/rrdinfo/:id', function(req, res) {
	var value = mkhash(req.params.id);
	return res.status(200).json({
		url: url.format({
			protocol: req.protocol,
			host: req.get('host'),
			pathname: '/rrd/' + value
		})
	});
});

app.get('/rrdpost/:id/:value', function(req, res) {
	saveValue(req.params.id, getTimeStamp(), req.params.value, res);
});

app.get('/rrdpost/:id/:time/:value', function(req, res) {
	saveValue(req.params.id, req.params.time, req.params.value, res);
});

function saveValue(id, time, value, res) {

	id = mkhash(id);

	time = parseInt(time);
	if (!time) {
		return res.status(400).json({
			message: 'invalid time ' + time
		});
	}

	value = parseFloat(value);
	if (!value) {
		return res.status(400).json({
			message: 'invalid value ' + value
		});
	}

	var rrdb;
	// Try to read the buffer from the DB
	db.get(id, {
		valueEncoding: 'binary'
	}, (err, data) => {
		// if (err) {
		// 	console.log(err);
		// 	return res.status(500).json({
		// 		message: 'database read failed: ' + err,
		// 	});
		// }
		// if value does not exist - create new buffer
		if (err || !data) {
			console.log('make new DB');
			rrdb = mkdb();
		} else {
			rrdb = mkdb(data);
		}

		// write new value into our buffer
		rrdb.write(time, value);

		// save buffer to DB
		db.put(id, rrdb.buffer, {
			valueEncoding: 'binary'
		}, function(err) {
			if (err) return console.log('Ooops!', err) // some kind of I/O error

			res.status(200).json({
				status: 'ok',
				// id: id,
				// time: time,
				// value: value
			});
		});
	});
}

function getTimeStamp() {
	return parseInt(Math.floor(Date.now() / 1000));
}


app.get('/rrd/:id/day', function(req, res) {
	runquery(req.params.id, getTimeStamp() - 60 * 60 * 24, getTimeStamp(), res);
});

app.get('/rrd/:id/week', function(req, res) {
	runquery(req.params.id, getTimeStamp() - 60 * 60 * 24 * 7, getTimeStamp() - 60 * 60 * 24, res);
});

app.get('/rrd/:id/year', function(req, res) {
	runquery(req.params.id, getTimeStamp() - 60 * 60 * 24 * 365, getTimeStamp() - 60 * 60 * 24 * 7, res);
});

app.get('/rrd/:id/:start/:end', function(req, res) {
	runquery(req.params.id, req.params.start, req.params.end, res);
});

function runquery(id, start, end, res) {
	db.get(id, {
		valueEncoding: 'binary'
	}, (err, data) => {
		if (err) {
			return res.status(500).json({
				message: 'no dataset with id ' + id
			});
		}
		rrdb = mkdb(data);
		res.status(200).json({
			id: id,
			start: start,
			end: end,
			data: rrdb.read(parseInt(start), parseInt(end))
		});
	});
}

app.use(cors());

app.listen(config.httpport, function() {
	console.log('listening on port ', config.httpport);
});