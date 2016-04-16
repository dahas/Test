module.exports = function (app, ftpClient) {
    ftpClient.on("ready", function () {
        console.log("Ready");
        ftpClient.listSafe("/TEST/aaa bbb", function (err, list) {
            console.log("Listing directory");
            var data = [];
            list.forEach(function (item) {
                if (item.type != "d" && item.name != "." && item.name != "..") {
                    data.push(item.name);
                }
            });
            console.log(data);
        });
    });
};