const express = require('express');
const bodyParser = require('body-parser');
const session = require('./config/session');
const middlewareAuthenticate = require('./middleware/authenticate.middleware');
require('./config/mongodb');
const mainRouter = require("./routes/main.route");


const app = express();
//importance middleware
app.use(session.config);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//custom middleware
app.use(middlewareAuthenticate.middleware);

//route
app.use('', mainRouter);

app.listen(3000, function(){
    console.log('Express is running on port 3000');
});