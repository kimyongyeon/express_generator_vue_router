var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var io = require('socket.io').listen(80);
var mongoose = require('mongoose');
var db;
var GameModel;
var app = express();

var dbConnectionFlag = false; // connection 유무

(function dbConnect() {
// CONNECT TO MONGODB SERVER
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://kimyongyeon:asdwsx12@ds145359.mlab.com:45359/gamehis');
    db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
// CONNECTED TO MONGODB SERVER
        console.log("Connected to mongod server");
        dbConnectionFlag = true;
    });
})();

// 데이터 스키마
(function schemaMake() {

    console.log("스키마 생성 시작");

    var Schema = mongoose.Schema;

    // 게임 히스토리
    var gameHis = new Schema({
        title: String,
        winList: Array,
        totalList: Array,
        reg_date: {type: Date, default: Date.now}
    });
    GameModel = mongoose.model('gameHis', gameHis);

    console.log("스키마 생성 끝");
})();

// 모델 저장 공통
function gameModelSave(gameModel) {
    gameModel.save(function (err, msg) {
        if (err) return console.error("err : " + err);
        console.dir("success : " + msg);
    });
}

var rooms = [];

io.on('connection', function (socket) {
    socket.join("betting");

    socket.on("client-send", function(data) { //여기가 받음.
        io.to(socket.id).emit("server-send", JSON.stringify(socket.id)); //여기가 보냄, 방전체
    });

//다음 사람 들어오면 rooms 뒤지고
    //방이 하나라도 있으면 for문 돌려서 자리가 빈 방을 찾고
    //빈방 있으면 빈방으로 들어가고
    //빈방 없으면 내 socket.id로 새로 방을 만들어서 밀어넣고
    // rooms.push(socket.id);
    // console.log("[connection][socket]", socket);
    //
    // socket.on("disconnect", function(){
    //    //사용자의 socket.id를 알 수 있으니
    //     //해당 사용자가 있던 방에서 빼줘야 하고
    //     //해당 사용자가 있던 방에 혼자 있었으면, 방자체도 없애야 함.
    // });
    //
    // socket.on("client-send", function(data){ //여기가 받음.
    //     //받은 데이터에 대한 처리 필요.
    //
    //     //io.to(roomName).emit("server-send", data); //여기가 보냄, 방전체
    //
    //     for(var i = 0; i < rooms.length; i++){
    //         if(rooms[i] !== socket.id){
    //             io.to(rooms[i]).emit("server-send", data); //여기가 보냄 트겆ㅇ사용자
    //         }
    //     }
    // });
});

module.exports = app;
