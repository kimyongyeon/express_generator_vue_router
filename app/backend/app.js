var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io').listen(80);
var mongoose    = require('mongoose');

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
    db.once('open', function(){
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
        reg_date: { type: Date, default: Date.now  }
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
    gameModel.save(function(err, msg){
        if(err) return console.error("err : " + err);
        console.dir("success : "  + msg);
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/api/movies', movies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// io.set( 'origins', '*localhost:8000' );
io.on('connection', function(socket){
    // 소켓 받기
    socket.on('client-rev', function(msg){
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

var fnArrayList = function() {
    var winArray = [
        [7,7,10,13,10,10,7,10,13,13],
        [8,14,8,14,1,5,8,11,14,17],
        [6,9,12,9,6,9,12,10,13,14],
        [6,9,12,15,15,1,3,9,15,15],
        [7,10,13,9,6,12,9,12,10,12],
        [8,11,12,10,7,1,7,13,14,17],
        [6,9,12,9,6,9,12,9,12,16],
        [12,16,3,4,12,16,4,5,12,16]
    ];

    var failArray = [
        [6,6,1,3,9,3,6,1,9,11],
            [8,2,8,3,1,5,8,2,2,17],
            [6,9,1,9,6,1,4,6,6,9],
            [6,4,7,3,5,2,4,9,3,15],
            [7,7,6,3,3,6,3,6,6,12],
            [8,5,5,9,7,1,7,3,6,9],
            [6,9,4,7,3,3,6,9,6,8],
            [12,6,3,4,6,6,4,5,6,10],
            [6,2,9,6,3,1,9,9,6,12],
            [8,2,8,5,1,5,7,2,9,17],
            [6,8,2,9,4,6,6,3,6,15],
            [6,9,1,3,6,1,3,9,12,16],
            [7,10,10,4,7,4,5,4,5,11],
            [8,6,6,6,2,6,3,7,8,16],
            [6,9,6,9,6,2,1,5,12,13],
            [12,5,6,6,3,4,4,5,9,16],
            [6,6,4,12,9,1,3,9,9,12],
            [8,2,8,3,9,8,8,2,7,17],
            [6,7,1,9,6,9,9,6,6,14],
            [6,9,2,3,6,6,7,9,11,15],
            [7,6,13,6,3,6,9,3,10,12],
            [8,11,6,8,7,1,7,8,7,13],
            [6,9,8,9,6,9,6,9,6,10],
            [12,16,3,4,6,14,4,5,6,10],
            [6,6,9,12,9,9,6,9,4,12],
            [8,1,7,5,2,5,8,17,14,17],
            [6,9,11,11,2,3,7,10,13,14],
            [6,9,12,13,9,1,3,9,15,11],
            [7,10,5,8,6,11,9,12,10,12],
            [8,11,12,10,7,1,7,13,13,10],
            [6,9,9,9,6,9,12,9,9,16],
            [12,16,3,4,10,14,4,5,12,16]
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

var fnSigma = function() {
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
    games_json.data.gameresult.result = fnArrayList();
    console.log(games_json.data.gameresult.result);
    console.log("+++++++++++++++++++++++");
    io.emit('server-send', JSON.stringify(games_json));
}
setInterval(fnGameInfo, 30000 ); // 55초
// setInterval(fnGameInfo, 1000 ); // 55초

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
    return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
}


module.exports = app;
