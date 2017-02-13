var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io').listen(80);

var index = require('./routes/index');
var users = require('./routes/users');
var movies = require('./routes/movies');
var games_json = require('./games');

console.log(games_json);

var app = express();

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
    var winArray =
            [[10, 20, 10, 10, 10, 10, - 10, 20, 10, 10],
        [10, 20, 30, 0, 10, -20, 10, 30, -20, 30],
        [10, 10, 0, 10, 20, 0, 10, 20, 0, 20],
        [10, 30, -30, 10, 20, 0, 10, 20, 10, 20],
        [10, 20, 30, -20, 10, 20, -20, 10, 10, 30],
        [10, 20, 10, -30, 10, 20, 20, 10, 10, 20],
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        [20, 20, -30, 10, 10, 20, -30, 20, 30, 30]
    ];

    var failArray = [[10,20,-10,10,10,10,-10,20,10,10]
        [10,20,10,10,-10,10,10,20,-10,10],
        [10,20,-10,10,10,-10,10,20,10,10],
        [10,20,10,-10,10,-10,10,10,-10,10],
        [10,20,30,0,10,-20,10,30,-30,30],
        [10,20,30,0,10,-30,10,30,-20,30],
        [10,20,30,0,0,-20,10,30,-20,30],
        [10,20,30,0,10,-20,0,30,-20,30],
        [10,10,0,10,20,0,10,20,0,10],
        [10,10,0,10,20,0,10,20,0,0],
        [10,10,0,10,20,0,10,20,0,-20],
        [10,10,0,10,10,0,10,20,0,20],
        [10,30,-30,10,20,0,10,20,10,10],
        [10,30,-30,10,20,0,10,20,10,0],
        [10,30,-30,10,20,0,10,20,10,-30],
        [10,30,-30,10,20,0,-30,20,10,20],
        [10,20,30,-20,10,20,-20,10,10,20],
        [10,20,30,-20,10,20,-20,10,10,10],
        [10,20,30,-20,10,20,-20,10,10,-20],
        [10,20,30,-20,10,10,-20,10,10,30],
        [10,20,10,-30,10,20,20,10,-30,20],
        [10,20,10,-30,10,20,20,10,10,10],
        [10,20,10,-30,10,20,10,10,10,20],
        [10,20,10,-30,10,20,-30,10,10,20],
        [10,10,10,10,-10,10,10,10,10,10],
        [10,10,10,-30,10,10,10,10,10,10],
        [10,10,10,10,10,10,10,-30,10,10],
        [10,10,10,10,10,10,-10,10,10,10],
        [20,20,-30,10,10,20,-30,20,30,-30],
        [20,20,-30,10,-30,20,-30,20,30,30],
        [20,10,-30,10,10,20,-30,20,30,30],
        [20,20,-30,10,10,20,-30,20,10,30]
    ];

    var arrayList = [];
    var a = randomItem1(winArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
    a = randomItem2(failArray);
    arrayList.push(a);
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

setInterval(fnSigma, 5000); // 5초
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

function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

// 주어진 배열에서 요소 1개를 랜덤하게 골라 반환하는 함수
function randomItem1(a) {
    return a[randomRange(1, 8)];
}

function randomItem2(a) {
    return a[randomRange(1, 32)];
}

function randomRange(n1, n2) {
    return Math.floor( (Math.random() * (n2 - n1 + 1)) + n1 );
}


module.exports = app;
