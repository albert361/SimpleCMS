var gridfs = require('mongodb').Grid;

module.exports = {
    // app.get('/api/imageManager/view/:category/:id', imageManager.view);
    view: function(cmsdb) {
        return function(req, res) {
            var cate = req.params.category;
            var id = req.params.id;
            var grid = new gridfs(cmsdb, cate);
            grid.get(id, function(err, data) {
                cmsdb.collection(cate + '.files').find({
                    _id: id
                }).toArray(function(err, docs) {
                    if (docs.length > 0) {
                        var headers = {};
                        headers['Cache-Control'] = 'must-revalidate, max-age=' + 86400 * 7;
                        headers['Content-Type'] = docs[0].contentType;
                        res.status(200);
                        res.set('Content-Type', headers['Content-Type']);
                        res.set('Cache-Control', headers['Cache-Control']);
                        res.end(data, 'binary');
                    } else {
                    	res.send(404);
                    	res.end();
                    }
                });
            });
        }
    }
}