window.addEventListener( 'load', function() {

    if ( ! window.dion ) {
        return;
    }

    var translations = {};

    [].slice.apply( document.querySelectorAll( '[data-translation]' ) ).forEach(function( elem ) {

        var t = JSON.parse( elem.getAttribute( 'data-translation' ) );

        translations[ t.tag ] = t;

    });

    dion.init({

        context: function() {

            return {

                lang: 'en'

            };

        },

        localID: function( translation ) {
            return translation.tag;
        },

        getTranslationByLocalID: function( localID, done ) {
            done( translations[ localID ] );
        },

        totalTranslations: function( done ) {

            done( Object.keys( translations || {} ).length );

        },

        nodeTranslations: function( node, done ) {

            if ( ! node.hasAttribute( 'data-translation' ) ) {

                done( [] );

                return;

            }

            var t = JSON.parse( node.getAttribute( 'data-translation' ) );

            done( [ translations[ t.tag ] ] );

        },

        saveTranslation: function( t, done ) {

            translations[ t.tag ] = t;

            $.post( '/save', { data: JSON.stringify( translations ) } ).then( done );

        },

        evaluateTranslation: function( translation, done ) {

            done( translation.text );

        },

        translationsReady: function() {

            return typeof translations !== 'undefined';

        },

        refreshTranslations: function( done ) {

        }

    });

    dion.initEditor({

        context: function() {

            return {};

        },

        workspace: function() {

            return window.workspace;

        },

        findFile: function( domElement, findFileCallback ) {

            function partialsIncluded( contents ) {
                return ( contents.match( /\{\{\s*\&\s*([\/a-zA-Z0-9.\-_]+)\s*\}\}/mg ) || [] ).map(function( statement ) {
                    return window.workspace + '/' + ( statement.match( /([\/a-zA-Z0-9.\-_]+)/ ) || [] )[ 1 ] + '.handlebars';
                });
            }

            function findFile( domElement ) {

                function isBeginBlock( comment ) {
                    return /begin include \&/.test( comment.textContent );
                }

                function isEndBlock( comment ) {
                    return /end include \&/.test( comment.textContent );
                }

                function commentToFile( comment ) {

                    var file = ( comment.textContent.match( /include \&\s*([\/a-zA-Z0-9.\-_]+)/ ) || [ undefined, undefined ] )[ 1 ];

                    if ( !file ) {
                        return undefined;
                    }

                    file = window.workspace + '/' + file;

                    if ( ! file.endsWith( '.handlebars' ) ) {
                        file += '.handlebars';
                    }

                    return file;

                }

                var visitedChildComments = {},

                    comment = this.helper.findWrappingComment( domElement, function( comment ) {

                        if ( isBeginBlock( comment ) ) {

                            visitedChildComments[ commentToFile( comment ) ] = true;

                            return false;

                        } else if ( isEndBlock( comment ) && ! visitedChildComments[ commentToFile( comment ) ] ) {

                            return true;

                        }

                        return false;

                    }),

                    file;


                if ( comment ) {

                    file = commentToFile( comment );

                    if ( file ) {
                        return file;
                    }

                }

                return undefined;

            }

            function findMacro( domElement ) {

                function isBeginBlock( comment ) {
                    return /begin macro \#/.test( comment.textContent );
                }

                function isEndBlock( comment ) {
                    return /end macro \#/.test( comment.textContent );
                }

                function commentToMacro( comment ) {

                    var macro = ( comment.textContent.match( /macro \#\s*([\/a-zA-Z0-9.\-_]+)/ ) || [ undefined, undefined ] )[ 1 ];

                    if ( ! macro ) {
                        return undefined;
                    }

                    return macro;

                }

                var visitedChildComments = {},

                    comment = this.helper.findWrappingComment( domElement, function( comment ) {

                        if ( isBeginBlock( comment ) ) {

                            visitedChildComments[ commentToMacro( comment ) ] = true;

                            return false;

                        } else if ( isEndBlock( comment ) && ! visitedChildComments[ commentToMacro( comment ) ] ) {

                            return true;

                        }

                        return false;

                    }),

                    macro;


                if ( comment ) {

                    macro = commentToMacro( comment );

                    if ( macro ) {
                        return macro;
                    }

                }

                return undefined;

            }

            var macro = findMacro.call( this, domElement );
            var file  = findFile.call( this, domElement );

            if ( macro && file ) {

                var self = this;

                this.helper.readFile( file, function( contents ) {

                    var paths = partialsIncluded( contents );

                    self.helper.readMultipleFiles( paths, function( partialContents ) {

                        var index = partialContents.findIndex(function( contents ) {

                            var found = new RegExp( '\{\{\\s*\#\\s*def\\s' + macro + '\\s*\}\}' ).test( contents );

                            return found;

                        });

                        if ( index !== -1 ) {
                            findFileCallback( paths[ index ] );
                        } else {
                            findFileCallback( file );
                        }

                    });

                });

            } else {

                findFileCallback( file );

            }

        }

    });

});


