var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io').listen(80);
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var movies = require('./routes/movies');
var games_json = require('./games');
var db;
var GameModel;
var app = express();

function dbConnect() {
// CONNECT TO MONGODB SERVER
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://kimyongyeon:asdwsx12@ds145359.mlab.com:45359/gamehis');
    db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
// CONNECTED TO MONGODB SERVER
        console.log("Connected to mongod server");
    });
}

// 데이터 스키마
function schemaMake() {
    var Schema = mongoose.Schema;
    var gameHisSchema = new Schema({
        title: String,
        winList: [],
        totalList: [],
        reg_date: {type: Date, default: Date.now}
    });
    GameModel = mongoose.model('gameHis', gameHisSchema);
}

// 게임 데이터 저장
function gameDataSave(winList, totalList) {
    var gameModel = new GameModel({
        title: "gamehis",
        winList: winList,
        totalList: totalList,
        reg_date: new Date()
    });
    gameModel.save(function (err, msg) {
        if (err) return console.error("err : " + err);
        console.dir("success : " + msg);
    });
}

// 해당 열에대한 배열의 전체 나올 확률 통계
function gameDataStat() {

}

dbConnect();
schemaMake();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/movies', movies);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// io.set( 'origins', '*localhost:8000' );
io.on('connection', function (socket) {
// 소켓 받기
    socket.on('client-rev', function (msg) {
        console.log(msg);
        var m = JSON.parse(msg);
// 게임 시작시 최초 한번
        if (m.msg == 'req') {
            console.log(`data => ${m}`)
        } else if (m.msg == 'betinfo') { // 배팅정보 수시 수신
            var code = {
                code: 100,
                msg: "success"
            };
            io.emit('server-send', JSON.stringify(code));
        }
    });
});

var fnArrayList = function () {
    var winArray = [
        [9.7, 9.7, 10, 10.3, 10, 10, 9.7, 10, 10.3, 10.3],
        [9.8, 10.4, 9.8, 10.4, 9.1, 9.5, 9.8, 10.1, 10.4, 10.7],
        [9.6, 9.9, 10.2, 9.9, 9.6, 9.9, 10.2, 10, 10.3, 10.4],
        [9.6, 9.9, 10.2, 10.5, 10.5, 9.1, 9.3, 9.9, 10.5, 10.5],
        [9.7, 10, 10.3, 9.9, 9.6, 10.2, 9.9, 10.2, 10, 10.2],
        [9.8, 10.1, 10.2, 10, 9.7, 9.1, 9.7, 10.3, 10.4, 10.7],
        [9.6, 9.9, 10.2, 9.9, 9.6, 9.9, 10.2, 9.9, 10.2, 10.6],
        [10.2, 10.6, 9.3, 9.4, 10.2, 10.6, 9.4, 9.5, 10.2, 10.6]
    ];

    var failArray = [
        [9.6, 9.6, 9.1, 9.3, 9.9, 9.3, 9.6, 9.1, 9.9, 10.1],
        [9.6, 9.2, 9.9, 9.6, 9.3, 9.1, 9.9, 9.9, 9.6, 10.2],
        [9.6, 9.6, 9.4, 10.2, 9.9, 9.1, 9.3, 9.9, 9.9, 10.2],
        [9.6, 9.6, 9.9, 10.2, 9.9, 9.9, 9.6, 9.9, 9.4, 10.2],
        [9.8, 9.2, 9.8, 9.3, 9.1, 9.5, 9.8, 9.2, 9.2, 10.7],
        [9.8, 9.2, 9.8, 9.5, 9.1, 9.5, 9.7, 9.2, 9.9, 10.7],
        [9.8, 9.2, 9.8, 9.3, 9.9, 9.8, 9.8, 9.2, 9.7, 10.7],
        [9.8, 9.1, 9.7, 9.5, 9.2, 9.5, 9.8, 10.7, 10.4, 10.7],
        [9.6, 9.9, 9.1, 9.9, 9.6, 9.1, 9.4, 9.6, 9.6, 9.9],
        [9.6, 9.8, 9.2, 9.9, 9.4, 9.6, 9.6, 9.3, 9.6, 10.5],
        [9.6, 9.7, 9.1, 9.9, 9.6, 9.9, 9.9, 9.6, 9.6, 10.4],
        [9.6, 9.9, 10.1, 10.1, 9.2, 9.3, 9.7, 10, 10.3, 10.4],
        [9.6, 9.4, 9.7, 9.3, 9.5, 9.2, 9.4, 9.9, 9.3, 10.5],
        [9.6, 9.9, 9.1, 9.3, 9.6, 9.1, 9.3, 9.9, 10.2, 10.6],
        [9.6, 9.9, 9.2, 9.3, 9.6, 9.6, 9.7, 9.9, 10.1, 10.5],
        [9.6, 9.9, 10.2, 10.3, 9.9, 9.1, 9.3, 9.9, 10.5, 10.1],
        [9.7, 9.7, 9.6, 9.3, 9.3, 9.6, 9.3, 9.6, 9.6, 10.2],
        [9.7, 10, 10, 9.4, 9.7, 9.4, 9.5, 9.4, 9.5, 10.1],
        [9.7, 9.6, 10.3, 9.6, 9.3, 9.6, 9.9, 9.3, 10, 10.2],
        [9.7, 10, 9.5, 9.8, 9.6, 10.1, 9.9, 10.2, 10, 10.2],
        [9.8, 9.5, 9.5, 9.9, 9.7, 9.1, 9.7, 9.3, 9.6, 9.9],
        [9.8, 9.6, 9.6, 9.6, 9.2, 9.6, 9.3, 9.7, 9.8, 10.6],
        [9.8, 10.1, 9.6, 9.8, 9.7, 9.1, 9.7, 9.8, 9.7, 10.3],
        [9.8, 10.1, 10.2, 10, 9.7, 9.1, 9.7, 10.3, 10.3, 10],
        [9.6, 9.9, 9.4, 9.7, 9.3, 9.3, 9.6, 9.9, 9.6, 9.8],
        [9.6, 9.9, 9.6, 9.9, 9.6, 9.2, 9.1, 9.5, 10.2, 10.3],
        [9.6, 9.9, 9.8, 9.9, 9.6, 9.9, 9.6, 9.9, 9.6, 10],
        [9.6, 9.9, 9.9, 9.9, 9.6, 9.9, 10.2, 9.9, 9.9, 10.6],
        [10.2, 9.6, 9.3, 9.4, 9.6, 9.6, 9.4, 9.5, 9.6, 10],
        [10.2, 9.5, 9.6, 9.6, 9.3, 9.4, 9.4, 9.5, 9.9, 10.6],
        [10.2, 10.6, 9.3, 9.4, 9.6, 10.4, 9.4, 9.5, 9.6, 10],
        [10.2, 10.6, 9.3, 9.4, 10, 10.4, 9.4, 9.5, 10.2, 10.6]
    ];

    var arrayList = [];
    var winner = {
        items: winArray, // array
        f1: 0,
        f2: 7
    };

    var winArray = randomItem(winner);

    arrayList.push(winArray);

    var failer = {
        items: failArray, // array
        f1: 0,
        f2: 31
    };
    arrayList.push(randomItem(failer));
    arrayList.push(randomItem(failer));
    arrayList.push(randomItem(failer));
    arrayList.push(randomItem(failer));
    arrayList.push(randomItem(failer));
    arrayList.push(randomItem(failer));
    arrayList.push(randomItem(failer));

    console.log(`==> ${winArray}`);
    gameDataSave(winArray, arrayList);

    shuffle(arrayList);

// // Sets
// var s = new Set();
// s.add("hello").add("goodbye").add("hello");
// console.log(s.size === 2);
// console.log(s.has("hello") === true);
//
// // Maps -hello
// var m = new Map();
// m.set("hello", 42);
// console.log(m.set(s, 34));
// console.log(m.get(s) == 34);
//
// // Weak Maps
// var wm = new WeakMap();
// console.log(wm.set(s, { extra: 42 }));
//
// // Weak Sets
// var ws = new WeakSet();
// console.log(ws.add({ data: 42 }));

    return arrayList;
}

var fnSigma = function () {
// 응답코드 전송 5초마다 한번씩 전송
    var code = {
        code: 0,
        time: new Date()
    };
    io.emit('server-send', JSON.stringify(code));
};

setInterval(fnSigma, 3000); // 5초
// 3분 말료 5초전 gameresult, gameinfo
var fnGameInfo = function () {
//shuffle(games_json.data.gameresult.result);
    console.log("+++++++++++++++++++++++");

    games_json.data.gameresult.starttime = new Date();
    games_json.data.gameresult.endtime = new Date().addMinutes(1);

    games_json.data.gameresult.result = fnArrayList();
    console.log(games_json.data.gameresult.result);
    console.log(games_json.data.gameresult.starttime);
    console.log(games_json.data.gameresult.endtime);

    console.log("+++++++++++++++++++++++");
    io.emit('server-send', JSON.stringify(games_json));
}
setInterval(fnGameInfo, 60000); // 55초
// setInterval(fnGameInfo, 1000 ); // 55초

Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};

Date.prototype.addSeconds = function(seconds) {
    this.setSeconds(this.getSeconds() + seconds);
    return this;
};

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function randomItem(_randItem) {
    var r = randomRange(_randItem.f1, _randItem.f2);
    return _randItem.items[r];
}

function randomRange(n1, n2) {
    return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
}


module.exports = app;
