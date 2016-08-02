/**
 * Created by hzq on 16-7-13.
 */
var net = require('net');
var upload = require("./upload");
/*var loginInfo = {"uri": "0", "type": "0", "svc_link": "66b2c67d-f7ab-4355-a6f0-b52ffccc857e"};..
var sureinfo = {
    "uri": "1",
    "top_sid": "54880976",
    "sub_sid": "54880976",
    "svc_link": "66b2c67d-f7ab-4355-a6f0-b52ffccc857e"
};*/


// var socket = require('engine.io-client')('ws://tvgw.yy.com:26101/websocket');

exports.monitorRoom = function(roomid) {
    console.log(roomid);
    /*sureinfo.top_sid=roomid;
    sureinfo.sub_sid=roomid;*/
    var loginInfo = {"uri": "0", "type": "0", "svc_link": "66b2c67d-f7ab-4355-a6f0-b52ffccc857e"};
    var sureinfo = {
        "uri": "1",
        "top_sid": roomid,
        "sub_sid": roomid,
        "svc_link": "66b2c67d-f7ab-4355-a6f0-b52ffccc857e"
    };
    var cookie;
    var WebSocketClient = require('websocket').client;

    var client = new WebSocketClient();

    client.on('connectFailed', function (error) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function (connection) {

        console.log('WebSocket Client Connected');
        connection.on('error', function (error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function () {
            console.log('echo-protocol Connection Closed');
        });
        var values = [];
        connection.on('message', function (message) {
            if (message.type === 'utf8') {
                // console.log(message.utf8Data);
                var parse = JSON.parse(message.utf8Data);
                switch (parse.response) {
                    case "login":
                        cookie = parse.cookie;
                        loginInfo.svc_link = cookie;
                        setTimeout(sendData(loginInfo),1000);
                        break;
                    case "init":
                        console.log(roomid + "init");
                        sureinfo.svc_link = cookie;
                        setTimeout(sendData(sureinfo),1000);
                        // sendData(sureinfo);
                        break;
                    case "join":
                        console.log(roomid + "join");
                        break;
                    case "chat":
                        // console.log("chat");
                        // console.log(roomid + ": Received: '" + message.utf8Data + "'");
                        // var msg = JSON.parse(message.utf8Data);
                        // console.log("我是谁： " + typeof msg.chat_msg);
                        /*if(message.utf8Data.indexOf('<?xml')>=0){
                            console.log("网页解析");
                            msg.chat_msg = msg.chat_msg.substring(msg.chat_msg.indexOf('txt data') + 10,msg.chat_msg.indexOf('" />'));
                        }
                        msg.ctime = new Date().getTime();
                        values.push(msg);
                        if(values.length > 20){
                            upload.uploadServe(roomid, "yy", values);
                            values = [];
                        }*/
//
                        break;
                    case "gift_broadcast":
                        // console.log("gift_broadcast");

                        break;
                    /*case "user_count":
                        console.log("user_count");*/

                        break;
                    case "flower_broadcast":
                        // console.log("flower_broadcast");

                        break;
                    default :
                        break;
                }
                switch (parse.response){
                    case "chat":
                    case "gift_broadcast":
                    case "flower_broadcast":
                    {
                        // console.log(roomid + ": Received: '" + parse.response + "---------" + message.utf8Data + "'");
                        var msg = JSON.parse(message.utf8Data);
                        if(message.utf8Data.indexOf('<?xml')>=0){
                            // console.log("网页解析");
                            msg.chat_msg = msg.chat_msg.substring(msg.chat_msg.indexOf('txt data') + 10,msg.chat_msg.indexOf('" />'));
                        }
                        msg.ctime = new Date().getTime();
                        values.push(msg);
                        if(values.length > 100){
                            upload.uploadServe(roomid, "yy", values);
                            values = [];
                        }
                    }
                        break;
                    default :
                        break;

                }
            }
        });
        function sendData(data) {
            try {
                if (connection.connected) {
                    if(undefined==data){
                        return console.log('data undefined');
                    }
                    connection.sendUTF((JSON.stringify(data)).toString());
                }
            } catch (e) {
                console.log(e.message);
            }

        }

        setInterval(function () {
            var time = {"uri": "6", "ts": new Date().getTime(), "svc_link": cookie};
            setTimeout(sendData(time),1000);
        }, 45000);
        // function sendNumber() {
        //     if (connection.connected) {
        //         var number = Math.round(Math.random() * 0xFFFFFF);
        //         connection.sendUTF(number.toString());
        //         setTimeout(sendNumber, 1000);
        //     }
        // }
        // sendNumber();
    });

    client.connect('ws://tvgw.yy.com:26101/websocket');

}

// monitorRoom('13757650');