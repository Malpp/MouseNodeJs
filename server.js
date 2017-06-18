var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var robot = require("robotjs");

//Sets the index of the page
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
//Serve static JS for index
app.use(express.static('public'))

//SocketIO config
io.on('connection', function (socket) {
    //Left click
    socket.on('click', function (msg) {
        robot.mouseClick();
    });
    //Right click
    socket.on('rclick', function (msg) {
        robot.mouseClick("right");
    });
    //Mouse move
    socket.on('move', function (msg) {
        let mouse = robot.getMousePos();
        robot.moveMouse(mouse.x + parseFloat(msg.x) * 3, mouse.y + parseFloat(msg.y) * 3);
    });
    //Scroll
    socket.on('scroll', function (msg) {
        msg.x = parseFloat(msg.x);
        msg.y = parseFloat(msg.y);
        let moveX = 0;
        let moveY = 0;
        if (msg.x > 1) {
            moveX = 1;
        }
        else if (msg.x < 1) {
            moveX = -1;
        }

        if (msg.y > 1) {
            moveY = 1;
        }
        else if (msg.y < 1) {
            moveY = -1;
        }
        robot.scrollMouse(moveY, moveX);
    });
});

//Start HTTP server
http.listen(80, function () {
    console.log('listening on *:80');
});