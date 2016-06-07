# timeseries round robin database
Creates a time/value round robin database for everyday use
Defaults to these rollups:
	new Layer('5m', '1d'), //
- 5m resolution for 1 day
- 1h resolution for 1 week
- 1d resolution for 1 year

#install

```npm install```

Then optionally change the settings in config.json - and then run

```node index.js```

And use the API at
http://localhost:4000/


##API

## Simple usage
### ```GET /rrdpost/<your dataset key>/<value>```

Posts <value> in the database at the current unix timestamp.
- value: Float

### ```GET /rrd/<your dataset key>/day```

Returns a dataset with all values of the last day ( now -> now-24h)

### ```GET /rrd/<your dataset key>/week```

Returns a dataset with all values of the last week ( now-1d -> now-7d)

### ```GET /rrd/<your dataset key>/year```

Returns a dataset with all values of the last year ( now-365d -> now-7d)

## Advanced usage

### ```GET /rrdpost/<your dataset key>/<time>/<value>```

Posts a new time/value pair to your database

### ```GET /rrd/<your dataset key>/<start>/<end>```

Returns an array of values for the given interval


