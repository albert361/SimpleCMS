/* mongo DB */
var mongodb = require('mongodb'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var db = new Db('admin', new Server("localhost", 27017, {
    auto_reconnect: true,
    poolSize: 1
}), {
    w: 0,
    native_parser: false
});

module.exports = {
    initial: function(callback) {
        db.open(function(err, db) {
            assert.equal(null, err);
            // Authenticate
            db.authenticate('CMSadmin', 'IPTV#hawsing232', function(err, result) {
                assert.equal(true, result);
                console.log('DB connectivity: ' + result);
                if (result == true) {
                    callback(db.db('cmsdb'));
                }
            });
        });
        // MongoClient.connect("mongodb://localhost:27017/admin?maxPoolSize=1", function(err, database) {
        //     if (err) throw err;
        //     db = database;
        //     db.authenticate('CMSadmin', 'IPTV#hawsing232', function(err, result) {
        //         assert.equal(true, result);
        //         console.log('DB connectivity: ' + result);
        //         if (result == true) {
        //             callback(db.db('cmsdb'));
        //         }
        //     });
        // });
    }
}