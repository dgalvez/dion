var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var dbAPI = require('../db/index.js');

router.post('/', function(req, res, next) {

    var db = dbAPI.get();
    var t  = req.body;

    console.log( 'before', db );

    db[ t.name ][ 0 ].text    = t.text;
    db[ t.name ][ 0 ].comment = t.comment;

    console.log( db );

    console.log( 'after', db );

    res.send( true );

});

module.exports = router;
