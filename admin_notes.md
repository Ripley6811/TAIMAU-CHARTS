# Admin Notes

## Mongo Notes

Get Mongo running on server with
```
    sudo service mongodb start
```
Stop with
```
    sudo service mongodb stop
```

Might need to delete mongod.lock
```
    sudo rm /var/lib/mongodb/mongod.lock
    mongod --repair
    sudo service mongodb start
```

Look at bottom of log file for details on problem
```
    sudo nano /var/log/mongodb/mongodb.log
```

If MongoDB will not start and deleting mongod.lock does not work then it may be a damaged journal file

```
    sudo rm -rfv /var/lib/mongodb/journal
```



### Mongo Indexes

```
db.tankerShipments.createIndex({date:-1, company:1, dept:1});  // For editing views
db.tankerShipments.createIndex({company:1, date:1, dept:1});  // For client views
db.tankerTemplates.createIndex({company:1, unit:-1});
db.tankerTemplates.createIndex({product:1, pn:1});
// "Templates" contains unique signatures used in form input suggestions.
db.tankerTemplates.createIndex({company:1, dept:1, unit:1, product:1}, {unique:1});
```

## [Generators](https://www.npmjs.com/package/mern-cli)
Generate components, routes, controllers, models using mern generator

- `merng dumb <componentname>` //Generate a dumb react component
- `merng functional <componentName>` //Generate a functional component
- `merng container <componentName>` //Generate a react component connect to redux store
- `merng route <routeName>`	//Generate a Nodejs route
- `merng model <modelName>`	//Generate a Mongoose Model
- `merng fullstack <modelName>`	// Generate a dumb component, Nodejs route, Nodejs controller, Mongoose Model


## Server commands
```
sudo tm_charts.sh
sudo npm run build
sudo NODE_ENV=production forever start index.js
sudo forever stop index.js

sudo forever list
sudo forever stopall


```
