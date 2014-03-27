/**
 * Created by kishore.relangi on 3/23/14.
 */

exports.getlist = function (db) {
    return function (req, res) {
        var main_event_id = req.params.main_event_id;
        if (main_event_id) {
            db.get('SubEvents').find({'main_event_id': main_event_id})
                .on('success', function (doc) {
                    console.dir(doc);
                    res.json(200, doc);
                })
                .on('error', function (err) {
                    req.json(501, {message: err.message})
                })
        } else {
            req.json(501, {message: 'Main event id is required.'})
        }
    };
};

exports.create_new_sub_event = function (db) {
    return function (req, res) {
        var main_event_id = req.params.main_event_id;
        var new_sub_event = req.body;
        db.get('SubEvents').insert(new_sub_event, function (err, doc) {
            if (err) {
                res.json(500, {message: err.message});
            } else {
                res.json(200, doc);
            }
        });
    };
};

exports.create_new_form_element = function (db) {
    return function (req, res) {
        var main_event_id = req.params.main_event_id;
        var new_sub_event = req.body;
        if (new_sub_event.scope == 'Global') {
            new_sub_event.main_event_id = new_sub_event.scope;
        }
        delete(new_sub_event.scope);
        db.get('FormElements').insert(new_sub_event, function (err, doc) {
            if (err) {
                res.json(500, {message: err.message});
            } else {
                res.json(200, doc);
            }
        });
    };
};

exports.get_form_elements = function (db) {
    return function (req, res) {
        var main_event_id = req.params.main_event_id;
        if (main_event_id) {
            db.get('FormElements').find({'main_event_id': {$in: [main_event_id, 'Global']}})
                .on('success', function (doc) {
                    console.dir(doc);
                    res.json(200, doc);
                })
                .on('error', function (err) {
                    req.json(501, {message: err.message})
                })
        } else {
            req.json(501, {message: 'Main event id is required.'})
        }
    };
};

exports.get_sub_event = function (db) {
    return function (req, res) {
        var main_event_id = req.params.main_event_id;
        if (main_event_id) {
            db.get('SubEvents').find({'main_event_id': {$in: [main_event_id, 'Global']}})
                .on('success', function (doc) {
                    console.dir(doc);
                    res.json(200, doc);
                })
                .on('error', function (err) {
                    req.json(501, {message: err.message})
                })
        } else {
            req.json(501, {message: 'Main event id is required.'})
        }
    };
};

exports.get_forms = function (db) {
    return function (req, res) {
        var main_event_id = req.params.main_event_id;
        if (main_event_id) {
            db.get('Forms').find({'main_event_id': {$in: [main_event_id, 'Global']}})
                .on('success', function (doc) {
                    console.dir(doc);
                    res.json(200, doc);
                })
                .on('error', function (err) {
                    req.json(501, {message: err.message})
                })
        } else {
            req.json(501, {message: 'Main event id is required.'})
        }
    };
};

exports.create_new_form = function (db) {
    return function (req, res) {
        var main_event_id = req.params.main_event_id;
        var new_sub_event = req.body;
        if (new_sub_event.scope == 'Global') {
            new_sub_event.main_event_id = new_sub_event.scope;
        }
        delete(new_sub_event.scope);
        db.get('Forms').insert(new_sub_event, function (err, doc) {
            if (err) {
                res.json(500, {message: err.message});
            } else {
                res.json(200, doc);
            }
        });
    };
};
