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


## API

## Simple usage

## Step 1 : post time related data
### ```GET /rrdpost/<your dataset key>/<value>```

Posts <value> in the database at the current unix timestamp.
- your dataset key: String
- value: Float

Your dataset key is your secret. Anyone who knows this key can write in your database.

#### Example

```GET /rrdpost/myname.myproject.mydataset.myvalue/3.141592```

```GET /rrdpost/mydataset/3.141592```


## Step 2: find our the read-only URL for your dataset
###  ```GET /rrdinfo/<your dataset key>/day```

Will return a JSON object with the hash your read-only URL for your dataset.
the key is the MD5 hash of your dataset key.
You can use this URL on a public website since you cannot write your dataset with this URL.

#### Example

```GET /rrdinfo/myname.myproject.mydataset.myvalue```

Returns

```
{
 "hash": "797b814e1efd70476787238b1641e852",
 "url": "http://localhost:4000/rrd/797b814e1efd70476787238b1641e852"
}
```

## Step 3: read the data from your dataset

We have 3 presets to get the data of the last day, week and year.

###  ```GET /rrd/<your dataset key hash>/day```

Returns a dataset with all values of the last day ( now -> now-24h)

### ```GET /rrd/<your dataset key hash>/week```

#### Example

```GET /rrd/797e2518-2ca7-11e6-b67b-9e71128cae77/day```

Returns a dataset with all values of the last week ( now-1d -> now-7d)

### ```GET /rrd/<your dataset key hash>/year```

Returns a dataset with all values of the last year ( now-365d -> now-7d)


## Advanced usage

You can post data on a given unix timestamp.
To post a new time/value pair to your database use this syntax:

### ```GET /rrdpost/<your dataset key hash>/<time>/<value>```

You can also query any interval of data

### ```GET /rrd/<your dataset key hash>/<start>/<end>```

Returns an array of values for the given interval where 
- start : unix timestamp (Number)
- end : unix timestamp (Number)



