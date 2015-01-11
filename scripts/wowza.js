var app = require('../app');
var querystring = require('querystring');
var http = require('http');
var _ = require("underscore");

module.exports = {
    getLiveStreams: function(req, res) {
        console.log(req.headers);
        var request_data = querystring.stringify({});
        var request_options = {
            host: app.get('configWowzaOriginAddr'),
            port: app.get('configWowzaOriginPort'),
            path: '/iptv/getlivestreams',
            method: 'GET',
            headers: {}
        };

        var wowza_req = http.request(request_options, function(response) {
            response.setEncoding('utf8');
            response.on('data', function(text) {
                /*
                 * TODO:
                 *   text: {
                 *       isopen: num,
                 *       name: string,
                 *       url: string
                 *   }
                 *   1. add thumbnails (database)
                 *   2. add descriptions (database)
                 *   3. add title (database)
                 */
                var retJson = [];
                var docs = JSON.parse(text);
                _.each(docs, function(doc, i) {
                    if (doc.isopen == 1) {
                        retJson.push({
                            name: doc.name
                        });
                    }
                });

                res.json(retJson);
            });
        });
        wowza_req.on('error', function(err) {
            console.log(err);
            res.send(408);
            res.end();
        });
        wowza_req.on('socket', function(socket) {
            socket.setTimeout(3000);
            socket.on('timeout', function() {
                wowza_req.abort();
                res.send(408);
                res.end();
            });
        })
        wowza_req.write(request_data);
        wowza_req.end();
    }
};