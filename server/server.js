import Express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';

// Webpack Requirements
import webpack from 'webpack';
import config from '../webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// Initialize the Express App
const app = new Express();

if (process.env.NODE_ENV !== 'production') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }));
  app.use(webpackHotMiddleware(compiler));
}

// React And Redux Setup
import { configureStore } from '../shared/redux/store/configureStore';
import { Provider } from 'react-redux';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';

// Import required modules
import routes from '../shared/routes';
import { fetchComponentData } from './util/fetchData';
import apiRoutes from './api.routes';
import serverConfig from './config';

// MongoDB Connection
mongoose.connect(serverConfig.mongoURL, (error) => {
  if (error) {
    console.error('Please make sure Mongodb is installed and running!'); // eslint-disable-line no-console
    throw error;
  }
});

// Apply body Parser and server public assets and routes
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }));
app.use(cookieParser());
app.use(Express.static(path.resolve(__dirname, '../static')));
app.use('/api', apiRoutes);

// Render Initial HTML
const renderFullPage = (html, initialState) => {
    const bootstrapPath = 'css/bootstrap.min.css';
    const cssPath = process.env.NODE_ENV === 'production' ? '/css/app.min.css' : '/css/app.css';
    const fontAwesomePath = '/font-awesome-4.6.3/css/font-awesome.min.css';
    const head = Helmet.rewind();
    const jasminePath = process.env.NODE_ENV === 'production' ? '' : `
        <script src="/js/jasmine-2.4.1/jasmine.js"></script>
        <script src="/js/jasmine-2.4.1/jasmine-html.js"></script>
        <script src="/js/jasmine-2.4.1/boot.js"></script>
        <link rel="stylesheet" href="/js/jasmine-2.4.1/jasmine.css" />`;

    return `
    <!doctype html>
    <html>
        <head>
            ${head.base.toString()}
            ${head.title.toString()}
            ${head.meta.toString()}
            ${head.link.toString()}
            ${head.script.toString()}

            <link href="https://fonts.googleapis.com/css?family=Asap:700|Roboto:700" rel="stylesheet">
            <link rel="stylesheet" href=${bootstrapPath} />
            <link rel="stylesheet" href=${cssPath} />
            <link rel="stylesheet" href=${fontAwesomePath} />
            <script src="/js/d3.min.js"></script>
            <script src="/js/jsPDF/jspdf.min.js"></script>
            <script src="/js/jsPDF/plugins/plugins.min.js"></script>
            ${false ? jasminePath : ""}
        </head>
        <body>
            <div id="root">${html}</div>
                <script>
                    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
                </script>
            <script src="/dist/bundle.js"></script>
        </body>
    </html>
    `;
};

const renderError = err => {
    const softTab = '&#32;&#32;&#32;&#32;';
    const errTrace = process.env.NODE_ENV === 'production' ? '' :
        `:<br><br><pre style="color:red">${softTab}${err.stack.replace(/\n/g, `<br>${softTab}`)}</pre>`;
    return renderFullPage(`Server Error${errTrace}`, {});
};

// Server Side Rendering based on routes matched by React-router.
app.use((req, res, next) => {
    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
        if (err) {
            return res.status(500).end(renderError(err));
        }

        if (redirectLocation) {
            return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }

        if (!renderProps) {
            return next();
        }

          // Important for initial server-side rendering
        const initialState = {
            deptLinks: [],
            barrelShipments: [],
            barrelTemplates: [],
            tankerShipments: [],
            tankerTemplates: [],
            query: req.cookies.query ? JSON.parse(req.cookies.query) : {},
        };

        const store = configureStore(initialState);

        return fetchComponentData(store, renderProps.components, renderProps.params)
          .then(() => {
            const initialView = renderToString(
              <Provider store={store}>
                <RouterContext {...renderProps} />
              </Provider>
            );
            const finalState = store.getState();

            res.status(200).end(renderFullPage(initialView, finalState));
          })
          .catch((err) => next(err));
    });
});


// start app
app.listen(serverConfig.port, (error) => {
    if (!error) {
        console.log(`MERN is running on port: ${serverConfig.port}! Build something amazing!`); // eslint-disable-line
    }
});

export default app;
