var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    config = require('getconfig');


/* 启动服务器 */
server.listen(config.server.port);
console.log("Server is listening on port " + config.server.port);

app.use('/', express.static(__dirname + '/app'));
app.use('/app/scripts', express.static(__dirname + '/app'));
app.use('/app/styles', express.static(__dirname + '/app'));
app.use('/music', express.static(__dirname + '/music'));

app.use(require('connect-livereload')({
    port: 35729
}));
var logFile = require('fs').createWriteStream('./myLogFile.log', {flags: 'a'});
app.use(express.logger({stream: logFile}));

app.get('/test', function(req, res) {
    res.send('hello world');
});
