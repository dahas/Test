var express = require("express");
var ftp = require("ftp");

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set("views", "./public");
app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("index", {
        title: "A Test"
    })
});

var ftpClient = new ftp();

app.set("host", "");
app.set("port", "");
app.set("user", "");
app.set("pass", "");

io.on('connection', function (socket)
{
    socket.on('ftp connect', function() {
        ftpClient.connect({
            host: app.get("host"),
            port: app.get("port"),
            user: app.get("user"),
            password: app.get("pass")
        });
    });

    socket.on('ftp list', function() {
        ftpClient.listSafe("/TEST", function (err, list) {
            var data = [];
            if (!err) {
                list.forEach(function (item) {
                    if (item.type != "d" && item.name != "." && item.name != "..") {
                        data.push(item.name);
                    }
                });
                socket.emit('ftp list result', data);
            } else {
                socket.emit('ftp list result', 'An error occured.');
            }
        });
    });

    socket.on('disconnect', function() {
        ftpClient.destroy();
    });

    socket.on('ftp disconnect', function() {
        ftpClient.destroy();
    });

    ftpClient.on("greeting", function (msg) {
        socket.emit('ftp connected', msg);
    });

    ftpClient.on("ready", function () {
        socket.emit('ftp connected', "You are now connected.");
    });

    ftpClient.on("close", function () {
        socket.emit('ftp disconnected', "Bye! And have a good time!");
    });

    ftpClient.on("error", function (err) {
        console.log(err);
        if (err.code == "ECONNREFUSED") {
            console.log("Authorization failed!");
        }
    });
});

server.listen(8080, function () {
    console.log(">>> Server running on localhost:8080 <<<")
});
