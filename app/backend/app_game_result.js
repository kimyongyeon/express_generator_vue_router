var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var movies = require('./routes/movies');
var db;
var GameModel;
var app = express();

function AppInit() {
    dbConnect();
    schemaMake();
    gameResultDataRead();
    // 게임 2880 회 저장
    for(var i=0; i<2880; i++) {
        fnArrayList();
    }
}


function dbConnect() {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://kimyongyeon:asdwsx12@ds145359.mlab.com:45359/gamehis');
    db = mongoose.connection;
    db.on('error', console.error);
    db.once('open', function () {
        console.log("Connected to mongod server");
    });
}

// 데이터 스키마
function schemaMake() {

    var Schema = mongoose.Schema;

    // 게임 결과
    /*
     * 게임아이디 - 말달리기
     * 라운드아이디 - 회차
     * 배팅순위 - 배팅 1위~3위 말번호
     * 배팅합 - 1~3위 말번호 순위 합
     * 로우/하이 - 말번호
     * 짝/홀 - 말번호
     * 구간합 - A,B,C,D중 하나
     * 파워볼 구간합 - A,B,C,D중 하나
     * */
    var gameResult = new Schema({
        gameSeq: Number,
        gameId: String,  // 게임 아이디
        roundId: String, // 라운드 아이디
        bettingRank: Array, // 배팅 순위
        bettingSum: Number, // 배팅 합
        lms: String,
        lowHigh: String, // 로우 하이
        evenHole: String, // 짝 홀
        intervalSum: String, // 구간합
        powerBallSum: String, // 파워볼 구간합
        gameList: Array,
        reg_date: {type: Date, default: Date.now}
    });

    GameModel = mongoose.model('gameResult', gameResult);
}


// 로우하이 (1.95)
// 로우:6,7,8,9, 10,11,12,13, 하이:14,15,16,17, 18,19,20,21
// 홀 / 짝 (1.95)
// ABCD (3.75)
// A             B           C            D
// 6,7,8,9, 10,11,12,13, 14,15,16,17, 18,19,20,21
// 대중소(2.85)
// 대              중               소
// 6,7,8,9,10, 11,12,13,14,15,16, 17,18,19,20,21
// 파워볼(3.75)
// 8등이 A:1,2 B:3,4 C:5,6 D:7,8
// parlay(89.95) = 1/2 * 1/3 * 1/4 * 1/4
var roundNum = 1;
function gameResultCreate(bettingArrayTotalData) {

    var dataList = []; // 말번호 및 프레임 배열 저장
    seqIndex=1;
    for(var i=0; i<bettingArrayTotalData.length; i++) {
        dataList.push({
            seq: seqIndex,
            array: bettingArrayTotalData[i]
        });
        seqIndex++;
    }

    // 프레임 이동 거리 합
    var frameSum = function(d) {
        var s = d.reduce(function(a, b) {
            return a + b;
        });
        // console.log(`화면 이동 거리 합계 : ${s}`);
        return s;
    };
    // 순위 정하기 : 내림차순 정렬
    var fnDescList = function(dataList) {
        // console.log(`수정전 1번말 => ${dataList[0].seq}`);
        // console.log(`수정전 2번말 => ${dataList[1].seq}`);
        // console.log(`수정전 3번말 => ${dataList[2].seq}`);
        dataList.sort((a, b) => {
            return frameSum(b.array) - frameSum(a.array); // 내림차순
        })
        // console.log("===============================================");
        // console.log(`수정후 1번말 => ${dataList[0].seq}`); // 1등
        // console.log(`수정후 2번말 => ${dataList[1].seq}`); // 2등
        // console.log(`수정후 3번말 => ${dataList[2].seq}`); // 2등

        return dataList;
    };
    // console.log(dataList);
    var descList = fnDescList(dataList);
    // console.log(descList);

    // 말 등번호 순위 합계
    var bettingRankSum = descList[0].seq + descList[1].seq + descList[2].seq;

    // console.log(descList[0].seq,descList[1].seq,descList[2].seq);
    // console.log("말등번호 합 : " + bettingRankSum);

    var fnFilter = function(array) {
        var r = array.filter((d) => {
            return d == bettingRankSum;
        });

        if(r.length == 0) {
            return false;
        } else {
            return true;
        }
    };

    var leadingZeros = function (n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (var i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    }

    var date = new Date();
    var year = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var today = year + "-" + mm + "-" + dd;

    var gameModelParam = {
        gameSeq: roundNum, // 게임결과 시컨스
        gameId: "1",
        roundId: today + "-" + leadingZeros(roundNum++, 3),
        bettingRank: (function(descList) { // 1,2,3등의 말등번을 넘긴다.
            return [descList[0].seq,descList[1].seq,descList[2].seq];
        })(descList), // 배팅 순위
        lms: (function(bettingRankSum) { // 배팅 말 합
            // 6,7,8,9,10, 11,12,13,14,15,16, 17,18,19,20,21
            var large = [6,7,8,9,10];
            var medium = [11,12,13,14,15,16];
            var small = [17,18,19,20,21];
            var lflag = fnFilter(large);
            var mflag = fnFilter(medium);
            var sflag = fnFilter(small);
            if(lflag) { // 대
                return "large";
            } else if (mflag) { // 중
                return "medium";
            } else { // 소
                return "small";
            }
        })(bettingRankSum), // 대중소
        lowHigh: (function(bettingRankSum) { // 배팅 말 합
            var lowArray = [6,7,8,9,10,11,12,13];
            // var highArray = [14,15,16,17,18,19,20,21];
            var result = fnFilter(lowArray);
            // 로우
            if(result) {
                return "low";
            } else { // 하이
                return "high";
            }
        })(bettingRankSum), // 로우 하이
        evenHole: (function(bettingRankSum) { // 배팅 말 합
            if(bettingRankSum % 2 == 0) {
                return "even";
            } else {
                return "Hole";
            }

        })(bettingRankSum), // 짝 홀
        intervalSum: (function (bettingRankSum) { // 배팅 말 합
            // 6,7,8,9, 10,11,12,13, 14,15,16,17, 18,19,20,21
            var A = [6,7,8,9];
            var B = [10,11,12,13];
            var C = [14,15,16,17];
            var D = [18,19,20,21];
            var aflag = fnFilter(A);
            var bflag = fnFilter(B);
            var cflag = fnFilter(C);
            var dflag = fnFilter(D);
            if(aflag) {
                return "A";
            } else if(bflag) {
                return "B";
            } else if(cflag) {
                return "C";
            } else {
                return "D";
            }
        })(bettingRankSum), // 구간합
        powerBallSum: (function(descList) {
            // A:1,2 B:3,4 C:5,6 D:7,8
            var rank8 = descList[7].seq; // 8등말
            if (rank8 === 1 || rank8 == 2) {
                return "A";
            } else if (rank8 === 3 || rank8 === 4) {
                return "B";
            } else if (rank8 === 5 || rank8 === 6) {
                return "C";
            } else if (rank8 === 7 || rank8 === 8) {
                return "D";
            }
        })(descList), // 파워볼 구간합
        gameList: descList,
        reg_date: Date.now()
    };

    console.log(gameModelParam);
    gameResultDataSave(gameModelParam);
}

// 게임 결과 데이터 저장
function gameResultDataSave(gameModel) {
    var gameModel = new GameModel(gameModel);

    gameModel.save(function (err, msg) {
        if (err) return console.error("err : " + err);
        console.dir("success : " + msg);
    });
}

function gameResultDataRead() {
    GameModel.remove({}, (e) => console.log(e));
    GameModel.find({gameSeq: 2}, function(err, msg) {
        if (err) return console.error("err : " + msg);
        if(msg.length == 0) {
            return {};
        } else {
            console.log(msg);
            return msg;
        }
    });
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

    //gameHisDataSave(winArray, arrayList); // 게임 히스토리 저장
    shuffle(arrayList); // 섞는다.

    gameResultCreate(arrayList);

    return arrayList;
}

// setInterval(fnArrayList, 1000);

// 게임 2880 회 저장
// for(var i=0; i<2880; i++) {
//     fnArrayList();
// }

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


new AppInit();

module.exports = app;
