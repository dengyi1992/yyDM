var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config');
var request = require('request');
var yy = require('./models/yy');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
var rule1 = new schedule.RecurrenceRule();
var HashMap = require("hashmap").HashMap;
map=new HashMap();
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var rooms = [];
var times = [];
var time = [];
for (var i = 0; i < 60; i += 15) {
    time.push(i);
}
rule1.minute = time;
schedule.scheduleJob(rule1, function () {
    request('http://120.27.94.166:2999/getRooms?platform=yy&topn=' + config.topn, function (error, response, body) {
        if (error) {
            return console.log(error)
        }
        var parse = JSON.parse(body);
        for (var i = 0; i < parse.data.length; i++) {
            rooms.push(parseInt(parse.data[i].room_id));
        }

        rule.second = times;
        for (var i = 0; i < 60; i++) {
            times.push(i);
        }
        myEvents.on('danmu', function (room_id) {
            yy.monitorRoom(room_id);
            // sendroomid.getChatInfo(room_id);
        });
        var count = 0;
        schedule.scheduleJob(rule, function () {
            if (count >= rooms.length) {
                this.cancel();
                return;
            }
            if(map.get(rooms[count])==undefined||!map.get(rooms[count])){
                myEvents.emit("danmu", rooms[count++]);
            }
        });

    });
});


/*var rooms = ["54880976", "78692132", "98728087"];
 myEvents.on('danmu',function (room_id) {
 // console.log("超神很屌！！！");
 yy.monitorRoom(room_id);
 // sendroomid.getChatInfo(room_id);

 });

 rooms.forEach(function (room) {
 myEvents.emit("danmu", room);
 });*/


module.exports = app;
