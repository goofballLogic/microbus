/*eslint-env node*/
"use strict";

var forPipeArgs = require( "./pipe-args" );
var buildInterfacePipe = require( "./build-interface-pipe" );

function noop() { }

function isFunc( x ) { return typeof x === "function"; }

module.exports = function pipe( obj, messageListener ) {

	// no obj ? just return a noop
	if( !obj ) { return noop; }

	// do we have an interface object to work with?
	if( obj.I ) {

		return buildInterfacePipe( obj, obj.I, messageListener );

	}

	// receive direct to method
	return function() {

		forPipeArgs( arguments, function( subj, subjS, message ) {


			if( isFunc( obj[ subjS ] ) ) {

				// receive via a direct safe-subject format function
				obj[ subjS ].call( obj, message );

			} else if( isFunc( obj[ subj ] ) ) {

				// receive via a direct non-safe subject format function
				obj[ subj ].call( obj, message );

			}

		} );

	};

};
