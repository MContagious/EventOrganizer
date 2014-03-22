/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', { title: 'Express' });
};

exports.render_partial = function (req, res) {
    var partials_html_name = req.params.partial_page;
    res.render('partials/' + partials_html_name, {});
};

exports.restrict = function (req, res, next) {
    if (req.session.user == undefined) {
        req.session.requested_url = req.url;
        console.log(req.url + ' requested a restricted url');
        res.render('login', {error_message: 'Session was expired. Please sign in..'});
    }
    else {
        next();
    }
};