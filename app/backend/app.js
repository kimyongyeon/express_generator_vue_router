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
                io.emit('server-send', JSON.stringify(games_json));
            }
            setInterval(fnGameInfo, 55000 ); // 55초

        } else if (m.msg == 'betinfo') { // 배팅정보 수시 수신
            var code = {
                code: 100,
                msg: "success"
            };
            io.emit('server-send', JSON.stringify(code));
        }
    });
});


module.exports = app;
