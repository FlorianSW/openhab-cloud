var openhabRoutes = {},
    form = require('express-form'),
    field = form.field;

openhabRoutes.openhabget = function(req, res) {
    req.user.findOpenhabs(function(error, openhabs) {
        res.render('openhab', { title: "openHAB settings", user: req.user, openhabs: openhabs,
            errormessages:req.flash('error'), infomessages:req.flash('info') });
    });
};


openhabRoutes.openhabpostvalidate = form(
    field("openhabuuid", "openHAB UUID").trim().required(),
    field("openhabsecret", "openHAB secret").trim().required()
);

openhabRoutes.openhabpost = function(req, res) {
    if (!req.form.isValid) {
        req.user.openhab(function(error, openhab) {
            res.redirect('/account');
        });
    } else {
        req.user.openhab(function(error, openhab) {
            if (!error && openhab) {
                openhab.uuid = req.body.openhabuuid;
                openhab.secret = req.body.openhabsecret;
                openhab.save();
                req.flash('info', 'openHAB settings successfully updated');
                res.redirect('/openhab');
            }
        });
    }
};

module.exports = openhabRoutes;