/*
 * GET users listing.
 */

exports.list = function (req, res) {
    res.send("respond with a resource");
};

exports.login = function (req, res) {
    if (req.session.user == undefined) {
        res.render('login', {});
    } else {
        res.redirect(req.session.requested_url || '/');
    }
};

exports.handle_login = function (db) {
    return function (req, res) {
        var user = db.get('users');
        user.findOne({name: req.body.username, pass: req.body.password})
            .on('success', function (doc) {
                console.log(doc);
                req.session.user = doc;
                res.redirect(req.session.requested_url || '/');
            })
            .on('error', function (err) {
                res.render('login', {error_message: err.message});
            });
    }

};

exports.signup = function (req, res) {
    res.render('signup', {});
};

exports.handle_signup = function (db) {
    return function (req, res) {
        console.dir(req.body);
        var user = db.get('users');
        var new_rec = {name: req.body.username, pass: req.body.password, email: req.body.email, confirmed: 0};
        var st = 0;
        for (var k in new_rec) {
            console.log([k, new_rec[k]].join('   '));
            if (new_rec[k] == undefined) {
                st = 1;
            }
        }
        if (st == 0) {
            user.insert(new_rec)
                .on('success', function (doc) {
                    console.log(doc);
                    res.render('login', {message: 'You have been registered. To complete the registration please check your inbox'});
                })
                .on('error', function (err) {
                    res.render('signup', {error_message: err.message});
                });
        } else {
            res.render('signup', {error_message: 'All fields are required'});
        }
    }
};

exports.logout = function (req, res) {
    delete (req.session.user);
    res.render('login', {message: 'You have been successfully signed out'});
};