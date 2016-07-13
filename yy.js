/**
 * Created by deng on 16-7-13.
 */


var net = require('net');
var uuid = require('node-uuid');
var md5 = require('md5');
var request = require('request');
var loginInfo={"uri":"0","type":"0","svc_link":"66b2c67d-f7ab-4355-a6f0-b52ffccc857e"};
var sureinfo={"uri":"1","top_sid":"54880976","sub_sid":"54880976","svc_link":"66b2c67d-f7ab-4355-a6f0-b52ffccc857e"};


// var socket = require('engine.io-client')('ws://tvgw.yy.com:26101/websocket');

function monitorRoom(roomid)
{
    var cookie;
    var WebSocketClient = require('websocket').client;

    var client = new WebSocketClient();

    client.on('connectFailed', function(error) {
        console.log('Connect Error: ' + error.toString());
    });

    client.on('connect', function(connection) {

        console.log('WebSocket Client Connected');
        connection.on('error', function(error) {
            console.log("Connection Error: " + error.toString());
        });
        connection.on('close', function() {
            console.log('echo-protocol Connection Closed');
        });
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                var parse = JSON.parse(message.utf8Data);
                switch(parse.response){
                    case "login":
                        cookie = parse.cookie;
                        loginInfo.svc_link=cookie;
                        sendData(loginInfo);
                        break;
                    case "init":
                        console.log("init");
                        sureinfo.svc_link=cookie;
                        sendData(sureinfo);
                        break;
                    case "join":
                        console.log("join");
                        break;
                    case "chat":
                        console.log("chat");
                        console.log("Received: '" + message.utf8Data + "'");

                        break;
                    case "gift_broadcast":
                        console.log("gift_broadcast");

                        break;
                    case "flower_broadcast":
                        console.log("flower_broadcast");

                        break;
                    default :
                        break;
                }
            }
        });
        function sendData(data) {
            try {
                if (connection.connected) {

                    connection.sendUTF((JSON.stringify(data)).toString());
                    setTimeout(sendData, 1000);
                }
            }catch (e){
                console.log(e.message);
            }

        }
        setInterval(function(){
            var time={"uri":"6","ts":new Date().getTime(),"svc_link":cookie};
            sendData(time);
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

monitorRoom('12345');
