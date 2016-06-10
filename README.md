# Timeseries Round Robin Database
REST API to store and query time/value pairs in a round robin database for everyday use.

Data rolls from the most recent entry to -1 year with 3 rollups:

- 5m resolution for 1 day ( 576 values )
- 1h resolution for 1 week ( 168 values )
- 1d resolution for 1 year ( 365 values )

#install

```npm install```

Then optionally change the settings in config.json - and then run

```node index.js```

And use the API at
http://localhost:4000/


## API

## Step 1 : post time related data
### ```GET /rrdpost/<your dataset key>/<value>```

Posts <value> in the database at the current unix timestamp.
- your dataset key: String
- value: Float

Your dataset key is your secret. Anyone who knows this key can write in your database.

#### Example

```GET /rrdpost/myname.myproject.mydataset.myvalue/3.141592```

```GET /rrdpost/sponnet.home.livingroom.temp/23```

```GET /rrdpost/sponnet.home.livingroom.hum/60```


## Step 2: find our the read-only URL for your dataset

Since the dataset key is used to write to your dataset, we provide a read-only URL that you can use on a public website or share with other people.
**The read only URL never changes - so this call only needs to be executed once per dataset.**

###  ```GET /rrdinfo/<your dataset key>/day```

Will return a JSON object with the hash your read-only URL for your dataset.
the key is the MD5 hash of your dataset key.
You can use this URL on a public website since you cannot write your dataset with this URL.

#### Example

```GET /rrdinfo/sponnet.home.livingroom.temp```

Returns

```
{
  "hash": "959adea93e6a518da3944594e5f7674e",
  "url": "http://localhost:4000/rrd/959adea93e6a518da3944594e5f7674e"
}
```

## Step 3: read the data from your dataset

We have 3 presets to get the data of the last day, week and year.

###  ```GET /rrd/<your dataset key hash>/day```

Returns a dataset with all values of the last day ( now -> now-24h)

#### Example

```GET /rrd/959adea93e6a518da3944594e5f7674e/day```


### ```GET /rrd/<your dataset key hash>/week```

Returns a dataset with all values of the last week ( now-1d -> now-7d)

### ```GET /rrd/<your dataset key hash>/year```

Returns a dataset with all values of the last year ( now-365d -> now-7d)


## Advanced usage

### Post on random times

You can post data on a given unix timestamp.
To post a new time/value pair to your database use this syntax:

### ```GET /rrdpost/<your dataset key hash>/<time>/<value>```

- start : unix timestamp (Number)
- end : unix timestamp (Number)

### Query a random interval

You can also query any interval of data

### ```GET /rrd/<your dataset key hash>/<start>/<end>```

Returns an array of values for the given interval where 

- start : unix timestamp (Number)
- end : unix timestamp (Number)



