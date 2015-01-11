/**
 * Module dependencies.
 */
var express = require('express'),
    app = module.exports = express(),
    routes = require('./routes'),
    user = require('./routes/user'),
    gridfs = require('mongodb').Grid,
    fs = require('fs'),
    cms = require('./routes/cms'),
    auth = require('./routes/authenticate'),
    imageManager = require('./routes/image-manager'),
    http = require('http'),
    assert = require('assert'),
    path = require('path'),
    mongoHelper = require('./scripts/mongoLib'),
    authenticator = require('./scripts/authenticator'),
    wowza = require('./scripts/wowza');

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

/*
 * Config init
 */
require('./config').init(app);

/*
 * Mongo DB init
 */
require('./scripts/cms').initial(onDbLoaded);

function onDbLoaded(cmsdb) {
    //app.post('/api/registerDevice', cms.registerDevice(cmsdb));
    app.post('/authenticate', auth.authenticate(cmsdb));
    app.get('/api/queryDevice/:id', cms.queryDevice(cmsdb));

    app.get('/api/getLiveUrl/:channel', cms.getLiveUrl(cmsdb));
    app.get('/api/getVodUrl/:vod', cms.getVodUrl(cmsdb));
    app.post('/api/verifyToken', cms.verifyToken(cmsdb));

    app.get('/api/getLiveStreams', wowza.getLiveStreams);

    app.get('/api/imageManager/view/:category/:id', imageManager.view(cmsdb));

    // (function saveImages() {
    //     var grid = new gridfs(cmsdb, 'channelThumbnails');
    //     var mime = require('mime');
    //     var mime_type = mime.lookup('~/Downloads/channel2.png');
    //     var data = fs.readFileSync('/Users/albert/Downloads/channel2.png');
    //     var buffer = new Buffer(data);
    //     grid.put(buffer, {
    //         _id: 'channel2',
    //         metadata: {
    //             category: 'image'
    //         },
    //         content_type: mime_type
    //     }, function(err, fileInfo) {
    //         if (!err) {
    //             console.log("Finished writing file to Mongo");
    //         } else {
    //             console.log(err);
    //         }
    //     });
    //     grid.get('channel2', function(err, data) {
    //         if (!err) {
    //             console.log("Retrieved data length: " + data.length);
    //             //grid.delete(fileInfo._id, function(err, result) {});
    //         } else {
    //             console.log(err);
    //         }
    //     });
    // })();
    /*
     * Query and List result
     */
    // cmsdb.collection('deviceIds').find().toArray(function(err, docs) {
    //     if (err) return console.dir(err)
    //     console.log(JSON.stringify(docs));
    // });

    /*
     * Insert, commit, and rollback
     */
    // mongoHelper.beginTransaction(cmsdb, function (err) {
    //   console.log(err);
    // });
    // cmsdb.collection('deviceIds').insert({
    //     test: '123'
    // });
    // mongoHelper.rollbackTransaction(cmsdb, function (err) {
    //   console.log(err);
    // });
    // mongoHelper.beginTransaction(cmsdb, function (err) {
    //   console.log(err);
    // });
    // cmsdb.collection('deviceIds').insert({
    //     test: '456'
    // });
    // mongoHelper.commitTransaction(cmsdb, function (err) {
    //   console.log(err);
    // });
}

app.configure(function() {
    app.use(allowCrossDomain);
    app.use('/api', authenticator({
        secret: app.get('configCmsSecret')
    }));
    app.set('port', process.env.PORT || app.get('configPort'));
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.json()); // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function() {
    app.use(express.errorHandler());
});

//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function() {
    console.log("Express server listening on port " + app.get('port'));
});