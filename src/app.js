var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// try {
//     app.use(require('connect-livereload')());
// } catch(ex) {
//     console.log('Livereload deactivated');
// }

function logger(req,res,next){
    console.log(new Date(), req.method, req.url, req.params, req.body);
    next();
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(require("method-override")(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use(logger);

app.use("/", express.static(__dirname + '/frontend'));
app.use("/notes", require('./backend/note/noteRoutes.js'));
app.use(function(req, res) {
    res.status(404).end('error');
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!');
});
