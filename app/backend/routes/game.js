var express = require('express');
var router = express.Router();
var movies = require('../games.json');

router.get('/', function (req, res, next) {
    res.send(movies)
});

router.get('/:id', function (req, res, next) {
    var id = parseInt(req.params.id, 10)
    var movie = movies.filter(function (movie) {
        return movie.id === id
    });
    res.send(movie)
});

// create
router.post("/", function(req, res, next) {
    console.log(`post success!!! : ${JSON.stringify(req.body)}`);
    res.json({result:1});
});

// update
router.put("/:id", function(req, res, next) {
    console.log("put success!!!");
    res.json({result:1});
});

// delete
router.delete("/:id", function(req, res, next) {
    console.log("delete success!!!");
    res.json({result:1});
});

module.exports = router;