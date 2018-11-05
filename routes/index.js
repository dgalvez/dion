var express = require('express');
var fs = require('fs');
var dbAPI = require('../db/index.js');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {

    var db = dbAPI.get();

    res.render('index', {
        workspace: path.normalize( __dirname + '/../views' ),
        title: db.title[ 0 ].text,
        content: db.content[ 0 ].text,
        titleJson: JSON.stringify({

            tag: 'title',
            text: db.title[ 0 ].text,
            lang: db.title[ 0 ].lang,
            comment: db.title[ 0 ].comment,
            pageID: 'title',
            siteID: 1

        }),
        contentJson: JSON.stringify({

            tag: 'content',
            text: db.content[ 0 ].text,
            lang: db.content[ 0 ].lang,
            comment: db.content[ 0 ].comment,
            pageID: 'content',
            siteID: 1

        })
    });
});

module.exports = router;
