var express = require('express');
var fs = require('fs');
var router = express.Router();
var path = require('path');
var dbAPI = require('../db/index.js');

router.get('/:site/:lang', function(req, res, next) {

    var text = req.param( 'tag_text' );

    res.send( text );

});

module.exports = router;
