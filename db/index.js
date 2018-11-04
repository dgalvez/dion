var fs = require( 'fs' );
var db = {

    title: [{

        lang: 'en',
        text: 'Welcome to the site'

    }],

    content: [{

        lang: 'en',
        text: 'This is the content'

    }]

};

fs.writeFileSync( 'db.json', JSON.stringify( db ) );

module.exports = db;
