exports.get = function (db) {
    return function (req, res) {
        var skip = req.params.offset || 0;
        var limit = req.params.limit || 100;
        db.get('MainEvents').find({}, {"skip": skip, "limit": limit})
            .on('success', function (doc) {
                res.json(doc);
            })
            .on('error', function (err) {
                res.json(500, {message: err.message});
            })
    };
};

function add(req, res, db) {
    var new_main_event = req.body;
    db.get('MainEvents').insert(new_main_event, function (err, doc) {
        if (err) {
            res.json(500, {message: err.message});
        } else {
            res.json(200, {message: 'Sucessfully Created Main event (' + doc.name + ')'})
        }
    });
}

function del(req, res, db) {
    res.json(501, {'message': 'Unknown action: ' + req.params.action});
}

function update(req, res, db) {
    res.json(501, {'message': 'Unknown action: ' + req.params.action});
}

function unknown(req, res) {
    res.json(501, {'message': 'Unknown action: ' + req.params.action});
}

var functions = {
    'add': add,
    'create': add,
    'remove': del,
    'delete': del,
    'update': update,
    'modify': update,
    'unknown': unknown
};

exports.main_event = function (db) {
    return function (req, res) {
        if (functions[req.params.action] !== undefined) {
            functions[req.params.action](req, res, db)
        } else {
            functions.unknown();
        }
    }
};