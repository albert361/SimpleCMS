var app = require('../app');
var jwt = require('jsonwebtoken');

module.exports = {
    // app.get('/api/queryDevice/:id', cms.queryDevice(cmsdb));
    queryDevice: function(db) {
        return function(req, res) {
            var collection = db.collection('deviceIds');
            collection.find({
                deviceId: req.params.id
            }).toArray(function(err, docs) {
                res.json(docs);
            });
        }
    },
    // app.get('/api/getLiveUrl/:channel', cms.getLiveUrl(cmsdb));
    getLiveUrl: function(db) {
        return function(req, res) {
            var info = {
                channel: req.params.channel,
                profile: req.profile
            };

            var jwt = require('jsonwebtoken');
            var token = jwt.sign(info, app.get('configPlaybackSecret'), {
                expiresInMinutes: 3
            });

            /*
             * TODO:
             * ask Wowza for the "free" edge server.
             */
            var url = 'rtsp://xxx.xxx.xxx.xxx:1935/live/' + req.params.channel;
            res.json({
                url: url + '?token=' + token
            });
        }
    },
    // app.get('/api/getVodUrl/:vod', cms.getVodUrl(cmsdb));
    getVodUrl: function(db) {
        return function(req, res) {
            var info = {
                vod: req.params.vod,
                profile: req.profile
            };

            var token = jwt.sign(info, app.get('configPlaybackSecret'), {
                expiresInMinutes: 3
            });

            /*
             * TODO:
             * ask Wowza for the "free" edge server.
             */
            var url = 'rtsp://xxx.xxx.xxx.xxx:1935/vod/' + req.params.vod;
            res.json({
                url: url + '?token=' + token
            });
        }
    },
    // app.post('/api/verifyToken', cms.verifyToken(cmsdb));
    verifyToken: function(db) {
        return function(req, res) {
            var token = req.body.token;
            jwt.verify(token, app.get('configPlaybackSecret'), null, function(err, decoded) {
                if (err) {
                    res.json({
                        state: 'error',
                        message: 'token invalid!',
                        raw: err
                    });
                    return;
                }
                /*
                 * decoded info
                 * {
                 *     channel/vod: string,
                 *     profile: {
                 *         username: string,
                 *         role: string,
                 *         (optional)deviceid: string
                 *     }
                 * }
                 */
                var info = decoded;
                //console.log(info);
                /*
                 * now we just grant access to everyone for phase 1.
                 * TODO: use info to check whether profile could access this stream!
                 */
                res.json({
                    state: 'ok'
                });
            });
        }
    }
};