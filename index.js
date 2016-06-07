var express = require('express');
var app = express();
var config = require('./config.json')
var rrd = require('node-round-robin-database')
var DB = rrd.DB;
var Layer = rrd.Layer;
var path = require('path');
var levelup = require('levelup');

var db = levelup('./mydb');

function mkdb(data) {
	return new DB({
		layers: [
			new Layer('5m', '1d'), // 15s resolution for a week
			new Layer('1h', '1w'), // 1m resolution for 3 weeks
			new Layer('1d', '1y') // 1h resolution for 5 years
		],
		buffer: data
	});

}

app.get('/rrdpost/:id/:time/:value', function(req, res) {

	db.get(req.params.id, {
		valueEncoding: 'binary'
	}, (err, data) => {
		if (err) {
			console.log('make new DB');
		}
		var rrdb = mkdb(data);


		db.put(req.params.id, rrdb.buffer, {
			valueEncoding: 'binary'
		}, function(err) {
			if (err) return console.log('Ooops!', err) // some kind of I/O error

			res.status(200).json({
				req: rrdb.buffer
			});
		});
	});

});

app.get('/rrd/:id/:start/:end', function(req, res) {

	db.get(req.params.id, {
		valueEncoding: 'binary'
	}, (err, data) => {
		if (err) {
			return res.status(500).json({
				err: err
			});
		}
		console.log('got data', data);
		rrdb = mkdb(data);
		res.status(200).json(
			rrdb.read(parseInt(req.params.start), parseInt(req.params.end))
		);
	});

});

app.listen(config.httpport, function() {
	console.log('listening on port ', config.httpport);
});


// var db = new DB({
//   layers: [
//     new Layer('5m', '1d'), // 15s resolution for a week
//     new Layer('1h', '1w'),  // 1m resolution for 3 weeks
//     new Layer('1d', '1y')   // 1h resolution for 5 years
//   ],
// });

// console.log(db.getSize()); // 914880, less than 1MB!

// // ...
// for (var i=0;i<300000;i++){
// 	db.write(i, i);
// }

// console.log('L0',db.read(10,300000));