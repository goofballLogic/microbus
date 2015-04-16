/*eslint-env node*/
"use strict";

var str = require( "./str" );

module.exports = function forPipeArgs( args, sendMessage ) {

	var al = args.length;
	if( al === 2 ) {

		var subj = args[ 0 ];
		var subjS = str.camelCase( subj );
		var message = args[ 1 ];
		sendMessage( subj, subjS, message );

	}

};
