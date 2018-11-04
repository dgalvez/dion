var express = require('express');
var db = require('../db/index.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: db.title[ 0 ].text,
        content: db.content[ 0 ].text,
        titleJson: JSON.stringify({

            tag: 'title',
            text: db.title[ 0 ].text,
            lang: db.title[ 0 ].lang

        }),
        contentJson: JSON.stringify({

            tag: 'content',
            text: db.content[ 0 ].text,
            lang: db.content[ 0 ].lang

        })
    });
});

module.exports = router;
