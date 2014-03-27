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
var main_event = require('./routes/main_event').main_event;
var sub_event = require('./routes/sub_event');
var main_event_get = require('./routes/main_event').get;
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


app.use(function (req, res, next) {
    res.header("X-powered-by", "Express app by Kishore Relangi");
    next();
});

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

app.get('/main_event/get/:offset/:limit', main_event_get(db));
app.post('/main_event/:action', main_event(db));

app.post('/mainevent/:main_event_id/form_element/new', sub_event.create_new_form_element(db));
app.get('/mainevent/:main_event_id/form_element/get', sub_event.get_form_elements(db));
app.post('/mainevent/:main_event_id/form/new', sub_event.create_new_form(db));
app.get('/mainevent/:main_event_id/form/get', sub_event.get_forms(db));
app.get('/mainevent/:main_event_id/form', sub_event.get_forms(db));
app.get('/mainevent/:main_event_id/form_element', sub_event.get_form_elements(db));
app.post('/mainevent/:main_event_id/subevents/new', sub_event.create_new_sub_event(db));
app.get('/mainevent/:main_event_id/subevents/get', sub_event.get_sub_event(db));
app.get('/mainevent/:main_event_id/subevents', sub_event.get_sub_event(db));

app.get('/mainevent/:main_event_id/subevents', sub_event.getlist(db));

mongoose.connect('mongodb://localhost');

mongoose.connection.on('open', function () {
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
});