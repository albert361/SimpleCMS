var app = require('../app');
var jwt = require('jsonwebtoken');
/*
 * POST authentication
 */
module.exports = {
    authenticate: function(db) {
        return function(req, res) {
            var profile;
            var retJson = {};
            /*
             * check user and pass
             * currently we just check a hard coded combination for 4/15 phase 1.
             * TODO: query database / membership system
             */
            if (!(req.body.username === 'hawsing' && req.body.password === 'qazwsx123')) {
                res.send(401, 'Wrong user or password');
                return;
            } else {
                profile = {
                    username: req.body.username,
                    role: 'unlimited'
                };
            }

            /*
             * if deviceid is set.
             * register deviceid to cmsdb.deviceIds for phase 1 - 3 months free plan.
             * TODO: remove after membership system is done.
             */
            if (req.body.deviceid) {
                profile.deviceid = req.body.deviceid;
                var collection = db.collection('deviceIds');
                var obj = {
                    deviceId: req.body.deviceid,
                    registerDate: new Date()
                }
                collection.insert(obj, {
                    w: 1
                }, function(err, docs) {
                    if (err && (err.message.indexOf('E11000 ') == -1)) {
                        retJson = {
                            state: 'error',
                            message: 'unknown error!',
                            raw: err
                        }
                        res.json(retJson);
                    } else {
                        var token = jwt.sign(profile, app.get('configCmsSecret'), {
                            expiresInMinutes: 5
                        });
                        retJson.token = token;
                        retJson.message = 'deviceId is successfully registered!';
                        if (err) {
                            retJson.message = 'deviceId is already registered!';
                        }
                        res.json(retJson);
                    }
                });
            } else {
                var token = jwt.sign(profile, app.get('configCmsSecret'), {
                    expiresInMinutes: 5
                });
                retJson.token = token;
                res.json(retJson);
            }
        }
    }
};