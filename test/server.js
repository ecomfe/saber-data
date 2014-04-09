var express = require('express');
var app = express();

IS_SILENT = process.argv[3] == 'true';

if (!IS_SILENT) {
    app.use(express.logger());
}

var path = require('path');
app.use(express.static(path.resolve(__dirname, '../')));

app.get('/test/data/jsonp', function (req, res, next) {

    res.jsonp({
        status: 0,
        data: {
            data: []
        }
    });

});

var port = process.argv[2] || 8848;

app.listen(port, function () {
    
    if (!IS_SILENT) {
        console.log('Listening on ' + port);
    }
    
});
