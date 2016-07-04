

## Mongo Notes

Get Mongo running on server with
```
sudo service mongodb start
```
Stop with
```
sudo service mongodb stop
```

### Mongo Indexes

```
db.shipments.createIndex({date:-1, company:1, dept:1});  // For editing views
db.shipments.createIndex({company:1, date:1, dept:1});  // For client views
// "Options" contains unique signatures used in form input suggestions.
db.shipmentTemplates.createIndex({company:1, dept:1, unit:1, product:1}, {unique:1});
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