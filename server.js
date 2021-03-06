var express = require('express'),
    app = express();
const port = process.env.PORT || 8090;


//Express 4

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/'));
app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization,   Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});

app.listen(port);

console.log(`Express listening on port ${port}`);
    