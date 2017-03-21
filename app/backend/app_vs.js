var express = require('express');
var io = require('socket.io').listen(80);
var _date = require('date-utils');
console.log(new Date().toFormat('YYYY-MM-DD HH24:MI:SS'));

var socketRoom = {};
var rooms = [];
var currentPlayer = 0;
var cuurentGame = [];
io.sockets.on('connection', function (socket) {
    // 전체 알림
    socket.emit("connected");
    // 랜덤 요청시
    socket.on('requestRandomChat', function(data){
        // 빈방이 있는지 확인
        console.log('requestRandomChat');
        for (var key in socketRoom){
            if (key == ''){
                continue;
            }
            rooms.push(socketRoom[key]);
            // 혼자있으면 입장
            if (rooms.length == 1){
                console.log("completeMatch");
                var roomKey = key.replace('/', '');
                socket.join(roomKey);
                socketRoom[socket.id] = roomKey;
                data = {};
                data.pcode = "p2";
                io.sockets.in(socket.id).emit('completeMatch', data);
                return;
            }
        }
        // 빈방이 없으면 혼자 방만들고 기다림.
        socket.join(socket.id);
        socketRoom[socket.id] = socket.id;
        // 이때 무조건 선수 라고 알려주는 메세지가 필요한지
        data = {};
        data.pcode = "p1";
        io.sockets.in(socketRoom[socket.id]).emit('receiveMessage', data);
    });

    // 요청 취소 시
    socket.on('cancelRequest', function(data){
        console.log("disconnected");
        currentPlayer = 0;
        cuurentGame = [];
        socketRoom = {};
        rooms = [];
        io.emit('receiveMessage', 'disconnected');

    });

    socket.on("disconnect", function() {
        console.log("disconnected");
        socketRoom = {};
        rooms = [];
        currentPlayer = 0;
        cuurentGame = [];

        io.emit('receiveMessage', 'disconnected');

        // var key = socketRoom[socket.id];
        // socket.leave(key);
        // io.sockets.in(key).emit('disconnect');

        // var clients = io.sockets.clients(key);
        // for (var i = 0; i < clients.length; i++){
        //     clients[i].leave(key);
        // }
    });

    // client -> server Message전송 시
    socket.on('sendMessage', function(data){
        console.log('sendMessage! ' + JSON.stringify(data));

        if(data.p != undefined) {
            currentPlayer = data.p;
        }
        
        if(data.s != undefined) {
            cuurentGame.push(data);
        }

        console.log(cuurentGame.length);

        if(cuurentGame.length == 2) {
            console.log("0 s?" + cuurentGame[0].s);
            console.log("1 s?" + cuurentGame[1].s);
            if(cuurentGame[0].s == cuurentGame[1].s) {
                data.msg = "골키퍼가 막았습니다."
            } else {
                data.msg = "선수가 이겼습니다."
            }

            console.log(data.msg);
            io.sockets.in(socketRoom[socket.id]).emit('receiveMessage', data);
            return;

        }

        if (data.p != undefined && data.s != undefined) {
            if(data.p == 1) {
                data.name = "선수";
            }  else {
                data.name = "골키퍼";
            }

            data.msg = "ready";
        }
        io.sockets.in(socketRoom[socket.id]).emit('receiveMessage', data);

    });
});
