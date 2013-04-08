var express = require( "express" ),
    nunjucks = require( "nunjucks" ),
    path = require( "path" );

var app = express();

app.use( express.logger( "dev" ) );
app.use( express.static( path.join( __dirname, "public" ) ) );
app.use( express.compress() );

var env = new nunjucks.Environment(new nunjucks.FileSystemLoader( 'views' ) );
env.express( app );

app.get( "/", function( req, res ) {
    res.render( "firehose.html" );
} );

app.listen( process.env.PORT || 3000 );
