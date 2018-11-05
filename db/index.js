var fs = require( 'fs' );
var path = require( 'path' );
var dbPath = path.normalize( __dirname + '/../db.json' );
var db = {

    title: [{

        lang: 'en',
        text: 'Welcome to the site',
        comment: 'El comentario de turno'

    }],

    content: [{

        lang: 'en',
        text: 'This is the content',
        comment: 'El comentario de turno II'

    }]

};

if ( fs.existsSync( dbPath ) ) {

    db = JSON.parse( fs.readFileSync( dbPath ) );

} else {

    fs.writeFileSync( dbPath, JSON.stringify( db ) );

}

module.exports = {

    get: function() {
        return db;
    },

    set: function( newDb ) {

        db = newDb;
        fs.writeFileSync( dbPath, JSON.stringify( newDb ) );

    }

};
