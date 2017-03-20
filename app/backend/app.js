var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io').listen(80);
var mongoose = require('mongoose');
require('date-utils');
console.log(new Date().toFormat('YYYY-MM-DD HH24:MI:SS'));

var index = require('./routes/index');
var users = require('./routes/users');
var movies = require('./routes/movies');
var games_json = require('./games');
var db;
var GameModel, GameModel2, GameModel3;
var memberVO = {};
memberVO.bettingInfo = [];
var gameResultVO = {};
var app = express();

var dbConnectionFlag = false; // connection 유무
var gameSeq = 1; // gameSeq

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

    // 게임 회원
    var gameMember = new Schema({
        userId: String,
        gamePrice : Number,
        roundId: String, // 라운드 아이디
        //bettingInfo: String, // 배팅정보
        lms: String, // 대중소
        lowHigh: String, // 로우 하이
        evenHole: String, // 짝 홀
        intervalSum: String, // 구간합
        powerBallSum: String, // 파워볼 구간합
        bettingInfo: Array,
        reg_date: {type: Date, default: Date.now}
    });
    GameModel2 = mongoose.model('gameMember', gameMember);

    // 게임 결과
    var gameResult = new Schema({
        gameSeq: Number,
        gameId: String,  // 게임 아이디
        roundId: String, // 라운드 아이디
        bettingRank: Array, // 배팅 순위
        bettingSum: Number, // 배팅 합
        lms: String, // 대중소
        lowHigh: String, // 로우 하이
        evenHole: String, // 짝 홀
        intervalSum: String, // 구간합
        powerBallSum: String, // 파워볼 구간합
        gameList: Array,
        reg_date: {type: Date, default: Date.now}
    });

    GameModel3 = mongoose.model('gameResult', gameResult);

    // console.log(GameModel, GameModel2, GameModel3);

    console.log("스키마 생성 끝");
})();

// 모델 저장 공통
function gameModelSave(gameModel) {
    gameModel.save(function (err, msg) {
        if (err) return console.error("err : " + err);
        console.dir("success : " + msg);
    });
}

// 배팅 정보 수정 및 저장
function gameBettingInfoUpate(bettingInfo) {
    if(bettingInfo.length === 0) {
        console.log("배팅 정보가 없습니다.");
        return;
    }
    console.log("gameBettingInfoUpate update start");
    var query = { userId: memberVO.userId };
    for(var i=0; i<bettingInfo.length; i++) {
        memberVO.bettingInfo.push(bettingInfo[i]);
    }
    GameModel2.findOneAndUpdate(query, memberVO, {upsert:true}, function(err, doc){
        if (err) return console.log(err);
        return;// console.log(doc);
    });
}
// 현재 금액 업데이트
function gamePriceUpdate(price) {
    console.log("gamePriceUpdate update start");
    var query = { userId: memberVO.userId };
    memberVO.gamePrice = price;
    memberVO.bettingInfo = [];
    GameModel2.findOneAndUpdate(query, memberVO, {upsert:true}, function(err, doc){
        if (err) return console.log(err);
        return;
        // return console.log(doc);
    });
}

// 아이디 저장
function gameIdSave (userId) {
    var gameModel = new GameModel2({
        userId: userId,
        gamePrice: 3000000,
        bettingInfo: []
    });
    gameModelSave(gameModel);
}

// 게임 데이터 저장
function gameHisDataSave(winList, totalList) {
    var gameModel = new GameModel({
        title: "gamehis",
        winList: winList,
        totalList: totalList,
        reg_date: new Date()
    });
    gameModelSave(gameModel);
}


// userId 조회
function isIdRead(userId) {
    GameModel2.find({userId: userId}, function(err, msg) {
        if (err) return console.error("err : " + msg);
        if(msg.length == 0) {
            memberVO = {};
            return console.log("isIdRead :: 데이터가 존재하지 않습니다.");
        } else {
            memberVO = msg[0];
            return console.log("isIdRead :: 데이터 읽기 성공");
        }
    });
}


// 게임 결과 리드
function gameResultDataRead(gameSeq) {
    var r = GameModel3.find({gameSeq: gameSeq}, function(err, msg) {
        if (err) return console.error("err : " + msg);
        if(msg.length == 0) {
            console.log("gameResultDataRead :: 데이터가 존재하지 않습니다.");
            gameResultVO = {};
        } else {
            console.log("gameResultDataRead :: 데이터 읽기 성공");
            gameResultVO = msg[0];
            // console.log(gameResultVO);
            gameResultDataSet(gameResultVO);
        }
    });
    return r;
}

function gameResultDataSet(list) {



    if(userIds.size === 0) {
        console.log("userIds 길이가 0 입니다.");
        return;
    }

    if(list.length === 0) {
        console.log("list 길이가 0 입니다.");
        return;
    }

    if(memberVO == null) {
        console.log("memberVO 가 null 입니다.");
        return;
    }

    for(let userId of userIds) {

        if(userId) {
            // 게임 현재 결과
            var lms = gameResultVO.lms;
            var evenHole = gameResultVO.evenHole;
            var intervalSum = gameResultVO.intervalSum;
            var powerBallSum = gameResultVO.powerBallSum;

            // 1. 사용자 아이디를 이용해서 현재 돈 price 을 구한다.
            isIdRead(userId);
            var currentPrice = Math.floor(memberVO.gamePrice);

            if(currentPrice > 0) {
                // 2. 얻은돈 = 현재 돈 + (배팅금액 + (배팅금액 * 배당율))
                if (memberVO.bettingInfo) {
                    for(var i=0; i<memberVO.bettingInfo.length; i++){
                        if(memberVO.bettingInfo[i].lms === lms) { // 2.85
                            currentPrice = currentPrice + (Math.floor(memberVO.bettingInfo[i].price) * 2.85);
                        }
                        else if(memberVO.bettingInfo[i].evenHole === evenHole) { // 1.95
                            currentPrice = currentPrice + (Math.floor(memberVO.bettingInfo[i].price) * 1.95);
                        }
                        else if(memberVO.bettingInfo[i].intervalSum === intervalSum) { // 3.75
                            currentPrice = currentPrice + (Math.floor(memberVO.bettingInfo[i].price) * 3.75);
                        }
                        else if(memberVO.bettingInfo[i].powerBallSum === powerBallSum) { // 3.95
                            currentPrice = currentPrice + (Math.floor(memberVO.bettingInfo[i].price) * 3.95);
                        }
                    }
                    // 3. 잃은돈 = 현재 돈 - (배팅금액)
                    for(var i=0; i<memberVO.bettingInfo.length; i++){
                        if(memberVO.bettingInfo[i].lms !== lms) { // 2.85
                            currentPrice = currentPrice - Math.floor(memberVO.bettingInfo[i].price);
                        }
                        else if(memberVO.bettingInfo[i].evenHole !== evenHole) { // 1.95
                            currentPrice = currentPrice - Math.floor(memberVO.bettingInfo[i].price);
                        }
                        else if(memberVO.bettingInfo[i].intervalSum !== intervalSum) { // 3.75
                            currentPrice = currentPrice - Math.floor(memberVO.bettingInfo[i].price);
                        }
                        else if(memberVO.bettingInfo[i].powerBallSum !== powerBallSum) { // 3.95
                            currentPrice = currentPrice - Math.floor(memberVO.bettingInfo[i].price);
                        }
                    }
                    // 4. 현재돈을 userid 를 찾아서 price에 업데이트 한다.
                    gamePriceUpdate(currentPrice);

                    // 5. 게임결과 + userid + 현재돈을 클라이언트로 전송한다.
                    games_json.data.gameresult.price = currentPrice;
                    games_json.data.gameresult.gameBettingResult = gameResultVO;

                    games_json.data.gameresult.starttime = new Date().toFormat('YYYY-MM-DD HH24:MI:SS');
                    var now = new Date();
                    games_json.data.gameresult.servertime = new Date ( Date.UTC(now.getUTCFullYear()
                        , now.getUTCMonth()
                        , now.getUTCDay()
                        , now.getUTCHours()
                        , now.getUTCMinutes()
                        , now.getUTCSeconds()) ).toFormat('YYYY-MM-DD HH24:MI:SS');

                    games_json.data.gameresult.endtime = new Date().addMinutes(1).toFormat('YYYY-MM-DD HH24:MI:SS');
                    games_json.data.gameresult.result = fnOldArrayList();
                    games_json.data.gameresult.gameList = list;
                    games_json.data.gameresult.roundId = list.roundId.split("-")[3];
                    games_json.data.gameresult.userId = userId;

                    console.log(JSON.stringify(games_json));

                    for (let item of rooms) {
                        var resultData = JSON.parse(item);
                        if(resultData.userId === userId) {
                            var resultMsg = {
                                code: 900,
                                games_json: games_json,
                                msg: "게임 결과 전송 성공"
                            };
                            io.to(resultData.socketId).emit("server-send", JSON.stringify(resultMsg)); //여기가 보냄, 방전체
                        }
                    }
                }
            }
        }
    }
}

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

/**
 * client 개개인 전송 메세지 보내기
 * @param _socket
 * @param _resultMsg
 */
function clientSendMsg(_socket, _resultMsg) {
    io.to(_socket.id).emit("server-send", JSON.stringify(_resultMsg)); //여기가 보냄, 방전체
}

/**
 * 전체 전송
 * @param _resultMsg
 */
function noticeSendMsg(_resultMsg) {
    io.emit("server-send", JSON.stringify(_resultMsg));
}

/**
 * 응답코드 전송
 */
var timeCount = 0;
var fnSigma = function () {
    // 응답코드 전송 5초마다 한번씩 전송
    timeCount++;
    var resultMsg = {
        code: 0,
        currenttime: new Date().toFormat('YYYY-MM-DD HH24:MI:SS')
    };
    //console.log(resultMsg);
    noticeSendMsg(resultMsg);
};

/**
 * 3분 말료 5초전 gameresult, gameinfo
 */
var fnGameInfo = function () {
    if(dbConnectionFlag) {
        gameResultDataRead(gameSeq++);
        // dbConnectionFlag = false;
        timeCount = 0;
    }
};

setInterval(fnSigma, 1000); // 5초
setInterval(fnGameInfo, 1000); // 1분 테스트
// setInterval(fnGameInfo, 120000); // 실제 2분

var rooms = new Set(); // 개인 방
var userIds = new Set(); // 아이디

// ***********************************************************
// 시그마 무의미한 데이터 전송 끊겼는지 체크
// ***********************************************************
io.on('connection', function (socket) {
    console.log(socket.id + "님이 접속하였습니다.");
    // 소켓 받기
    socket.on('client-rev', function (msg) {
        var m = JSON.parse(msg);

        if (!m.userId) {
            var resultMsg = {
                code: -1,
                msg: "아이디가 없습니다."
            };
            clientSendMsg(socket, resultMsg);
            return;
        }
        userIds.add(m.userId);

        // 게임 시작시 최초 한번
        if (m.msg == 'req') {
            var now = new Date();
            games_json.data.gameresult.servertime = new Date ( Date.UTC(now.getUTCFullYear()
                , now.getUTCMonth()
                , now.getUTCDay()
                , now.getUTCHours()
                , now.getUTCMinutes()
                , now.getUTCSeconds()) ).toFormat('YYYY-MM-DD HH24:MI:SS');

            var resultMsg = {
                code: 0,
                time: new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
                servertime: games_json.data.gameresult.servertime,
                starttime: games_json.data.gameresult.starttime,
                endtime: new Date().addMinutes(2).toFormat('YYYY-MM-DD HH24:MI:SS')
            };
            clientSendMsg(socket, resultMsg);

        } else if (m.msg == 'bettingInfo') { // 배팅정보 수시 수신
            var query = GameModel2.find({userId: m.userId});

            query.exec(function(err,jedis){
                if(err) return console.log(err);
                if(jedis.length === 0) {
                    var resultMsg = {
                        code: -1,
                        msg: "fail"
                    };
                    clientSendMsg(socket, resultMsg);
                    return;
                }

                jedis.forEach(function(jedi){
                    memberVO = jedi;
                    if(jedi.userId) {
                        gameBettingInfoUpate(m.bettingInfo);
                        var resultMsg = {
                            code: 100,
                            msg: "success"
                        };
                        clientSendMsg(socket, resultMsg);
                        return;
                    }

                });
            });
        } else if (m.msg == "userCreate") {

            for(let item of rooms) {
                console.log(item);
                var r = JSON.parse(item);
                if (r.socketId === socket.id) {
                    console.log("이미 아이디를 생성하셨습니다.");
                    var resultMsg = {
                        code: 0,
                        msg: "이미 아이디를 생성하셨습니다.. [" + socket.id +"]"
                    };
                    clientSendMsg(socket, resultMsg);
                    return;
                }
            }

            var tempRooms = {
                userId: m.userId,
                socketId: socket.id
            };
            rooms.add(JSON.stringify(tempRooms)); // 문자열로 넣지 않으면 Set이 적용되지 않는다.

            var query = GameModel2.find({userId: m.userId});

            query.exec(function(err,jedis){
                if(err) return console.log(err);
                if(jedis.length === 0) {
                    gameIdSave(m.userId);
                    var resultMsg = {
                        code: 0,
                        msg: "아이디가 정상 등록 되었습니다. [" + m.userId +"]"
                    };
                    clientSendMsg(socket, resultMsg);
                    return;
                }
            });

            var now = new Date();
            games_json.data.gameresult.servertime = new Date ( Date.UTC(now.getUTCFullYear()
                , now.getUTCMonth()
                , now.getUTCDay()
                , now.getUTCHours()
                , now.getUTCMinutes()
                , now.getUTCSeconds()) ).toFormat('YYYY-MM-DD HH24:MI:SS');

            var resultMsg = {
                code: 0,
                time: new Date().toFormat('YYYY-MM-DD HH24:MI:SS'),
                servertime: games_json.data.gameresult.servertime,
                starttime: games_json.data.gameresult.starttime,
                endtime: new Date().addMinutes(2).toFormat('YYYY-MM-DD HH24:MI:SS')
            };
        }
    });
});



// ***********************************************************
// 가상 가공 데이터
// ***********************************************************
var fnOldArrayList = function () {
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

    // gameHisDataSave(winArray, arrayList); // 게임 히스토리 저장 통계를 위해서 사용
    shuffle(arrayList); // 섞는다.

    return arrayList;
}

Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes() + minutes);
    return this;
};

Date.prototype.addSeconds = function(second) {
    this.setSeconds(this.getSeconds() + second);
    return this;
};

// 랜덤함수
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

// 랜덤 아이템
function randomItem(_randItem) {
    var randomRange = function (n1, n2) {
        return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
    };
    var r = randomRange(_randItem.f1, _randItem.f2);
    return _randItem.items[r];
}

module.exports = app;
