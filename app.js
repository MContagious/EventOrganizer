/**
 * Module dependencies.
 */

var express = require('express');

var MongoStore = require('connect-mongo')(express),
    mongoose = require('mongoose');
var db = require('monk')('localhost/EventOrganizer');

var conf = {
    db: {
        db: 'sessions_db',
//        host: 'localhost',
//        port: 6646,  // optional, default: 27017
//        username: 'admin', // optional
//        password: 'secret', // optional
        collection: 'sessions' // optional, default: sessions
    },
    secret: 'a125ea872411e433b9076ee61d63aa10'
};

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var bootstrap = require('bootstrap3-stylus');
var stylus = require('stylus');

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(bootstrap());
}

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(express.favicon());

app.use(stylus.middleware({
    src: __dirname + '/resources',
    dest: __dirname + '/public',
    debug: true,
    force: true,
    compile: compile
}));

app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser(conf.secret));
app.use(express.session({
    secret: conf.secret,
    maxAge: new Date(Date.now() + 3600000),
    store: new MongoStore(conf.db)
}));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.restrict, routes.index);
app.get('/login', user.login);
app.get('/logout', user.logout);
app.post('/login', user.handle_login(db));
app.get('/signup', user.signup);
app.post('/signup', user.handle_signup(db));
app.get('/partials/:partial_page', routes.render_partial);

mongoose.connect('mongodb://localhost');

mongoose.connection.on('open', function () {
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
});