var assert = require('assert');
module.exports = {
    beginTransaction: function(db, errorCallback) {
        db.command({
            beginTransaction: 1,
            isolation: 'mvcc'
        }, function(err, result) {
            if (null != err) {
                errorCallback(err);
            };
        });
    },
    commitTransaction: function(db, errorCallback) {
        db.command({
            commitTransaction: 1
        }, function(err, result) {
            if (null != err) {
                errorCallback(err);
            };
        });
    },
    rollbackTransaction: function(db, errorCallback) {
        db.command({
            rollbackTransaction: 1
        }, function(err, result) {
            if (null != err) {
                errorCallback(err);
            };
        });
    }
}