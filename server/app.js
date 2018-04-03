const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const app = express();

app.use((req, res, next) => {
    // write your logging code here
    var agent = req.headers["user-agent"].replace(',', '');
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.path;
    var version = 'HTTP/' + req.httpVersion;
    var status = res.statusCode;
    var log = `${agent},${time},${method},${resource},${version},${status}\n`;

    console.log(log);

    fs.appendFile('log.csv', log, (err) => {
        if (err) throw err;
        next();
    });
});

app.get("/", function (req, res) {
    // write your code to respond "ok" here
    res.send("ok");
});

app.get("/logs", function (req, res) {
    const csvFilePath='./log.csv'
    var bufferString;
    var array = [];
    var headers;
    var jsonArray;
    var jsonObj = [];
        fs.readFile(csvFilePath, (err, data) => {
        if (err) throw err;
            bufferString = data.toString();
            array = bufferString.split("\n");
            headers = array[0].split(",");
            for (var i = 1; i < array.length - 1; i++) {
                jsonArray = array[i].split(",");
                var obj = {};
                    for (var j = 0; j < jsonArray.length; j++) {
                        obj[headers[j]] = jsonArray[j];
                    }
                jsonObj.push(obj);
            }
            res.send(jsonObj);
      });
});



module.exports = app;
