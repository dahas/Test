module.exports = function (app, ftpClient) {
    ftpClient.connect({
        host: app.get("host"),
        port: app.get("port"),
        user: app.get("user"),
        password: app.get("pass")
    });
    ftpClient.on("greeting", function (msg) {
        console.log(msg);
    });
    ftpClient.on("close", function (msg) {
        console.log("Goodbye!");
    });
    ftpClient.on("error", function (err) {
        if (err.code == "ECONNREFUSED") {
            console.log("Authorization failed!");
        }
    });
};