

## Mongo Notes

Get Mongo running on server with
```
sudo service mongodb start
```
Stop with
```
sudo service mongodb stop
```

## [Generators](https://www.npmjs.com/package/mern-cli)
Generate components, routes, controllers, models using mern generator

- `merng dumb <componentname>` //Generate a dumb react component
- `merng functional <componentName>` //Generate a functional component
- `merng container <componentName>` //Generate a react component connect to redux store
- `merng route <routeName>`	//Generate a Nodejs route
- `merng model <modelName>`	//Generate a Mongoose Model
- `merng fullstack <modelName>`	// Generate a dumb component, Nodejs route, Nodejs controller, Mongoose Model
