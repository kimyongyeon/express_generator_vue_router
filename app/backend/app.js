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
    var winArray = [
        [6,12,26,7,-7,8,8,16,8,16],
        [8,16,30,0,0,8,-16,8,16,30],
        [5,10,0,6,12,0,6,13,24,24],
        [8,30,30,-30,8,16,16,-30,24,28],
        [6,16,20,-10,8,16,-10,8,16,30],
        [6,12,8,-20,8,16,16,8,16,30],
        [6,10,6,11,7,12,7,13,8,20],
        [16,16,-22,8,16,16,-26,16,30,30]
    ];

    var failArray = [
        [6,10,20,6,-8,6,6,-8,7,10],
            [6,10,20,0,0,6,-16,0,10,20],
            [5,10,0,6,0,6,0,10,0,20],
            [7,20,20,-30,8,11,12,-30,20,20],
            [6,10,20,-16,6,10,-15,8,10,20],
            [6,10,6,-24,6,10,10,6,10,20],
            [6,6,6,6,6,6,6,6,6,7],
            [10,10,-20,6,11,11,-21,14,20,21],
            [6,10,20,8,-8,8,8,-8,8,11],
            [6,10,20,0,0,6,-14,6,10,20],
            [5,10,0,6,7,7,0,0,10,20],
            [8,20,20,-30,8,10,10,-30,20,30],
            [6,16,24,-16,6,10,-17,7,11,20],
            [6,12,6,-20,6,12,10,6,10,20],
            [6,10,6,6,6,6,6,7,6,10],
            [12,14,-22,7,16,16,-23,10,20,20],
            [8,30,25,-30,8,10,10,-30,20,20],
            [7,10,20,0,0,8,-16,6,14,23],
            [5,10,0,0,6,0,6,11,12,23],
            [6,10,20,6,-8,8,6,10,6,10],
            [12,14,-24,8,14,14,-25,15,20,27],
            [7,14,7,-22,8,16,10,6,10,20],
            [6,10,6,6,10,10,6,7,6,11],
            [6,11,21,7,-7,7,6,10,8,11],
            [5,10,0,6,0,0,6,14,20,21],
            [8,16,30,0,0,8,-27,7,15,27],
            [8,21,23,-23,8,11,13,-21,22,24],
            [7,16,26,-16,6,16,-19,6,16,30],
            [8,16,27,-16,6,16,-19,6,16,30],
            [8,16,6,-26,6,16,16,6,16,28],
            [6,10,6,10,10,6,10,10,6,20],
            [16,16,-26,16,16,16,-30,12,30,30]
    ];

    var arrayList = [];
    var winner = {
        items: winArray, // array
        f1: 0,
        f2: 7
    };
    arrayList.push(randomItem(winner));
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

    shuffle(arrayList);

    // Sets
    var s = new Set();
    s.add("hello").add("goodbye").add("hello");
    console.log(s.size === 2);
    console.log(s.has("hello") === true);

    // Maps -hello
    var m = new Map();
    m.set("hello", 42);
    console.log(m.set(s, 34));
    console.log(m.get(s) == 34);

    // Weak Maps
    var wm = new WeakMap();
    console.log(wm.set(s, { extra: 42 }));

    // Weak Sets
    var ws = new WeakSet();
    console.log(ws.add({ data: 42 }));

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
