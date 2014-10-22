( function( context ) {

	context.camelCase = strCamelCase;

} ( module.exports ) );

// thanks: http://stackoverflow.com/a/10425344
function strCamelCase( x ) {

	if( !x ) return x;
	x = "" + x;
	return x.toLowerCase().replace(/[- ](.)/g, function(match, group1) {

        return group1.toUpperCase();

    });

}