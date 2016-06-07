# timeseries round robin database
Creates a time/value round robin database for everyday use
Defaults to these rollups:
	new Layer('5m', '1d'), //
- 5m resolution for 1 day
- 1h resolution for 1 week
- 1d resolution for 1 year

#install
```npm install```
Change settings in config.json
```node index.js```

And use the API at
```http://localhost:4000/```


##API

### ```GET /rrdpost/<your dataset key>/<time>/<value>```

Posts a new time/value pair to your database

### ```GET /rrd/<your dataset key>/<start>/<end>```

Returns an array of values for the given interval


