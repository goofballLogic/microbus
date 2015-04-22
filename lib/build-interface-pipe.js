/*eslint-env node*/
"use strict";

var forPipeArgs = require( "./pipe-args" );

function isFunc( x ) { return typeof x === "function"; }

module.exports = function processInterface( owner, i, messageListener ) {

	// is this pipe processing output messages?
	if( isFunc( messageListener ) ) {
		// do we have a send section on the interface?
		if( !i.hasOwnProperty( "send" ) ) {

			i.send = function() { };

		}
		// is the send member a function?
		if( isFunc( i.send ) ) {
			// patch this function to forward messages to our listener
			var patchedSender = i.send;
			i.send = function() {
				// forward the messages to the listener
				messageListener.apply( owner, arguments );
				// and re-execute the patched function
				patchedSender.apply( owner, arguments );
			};
			// shift the patched function's methods to the patch function
			for( var func in patchedSender ) {

				if( isFunc( patchedSender[ func ] ) ) {
					// attach to patch and remove from the patched function
					i.send[ func ] = patchedSender[ func ];
					delete patchedSender[ func ];

				}

			}

		}
		// even if the send member is not a function, still patch any member functions on it
		Object.keys( i.send ).forEach( function( key ) {

			var patched = i.send[ key ];
			if( !isFunc( patched ) ) { return; }
			// shim to pick up the message for the listener
			i.send[ key ] = function() {

				var args = Array.prototype.slice.apply( arguments );
				var message = args.shift();
				args.unshift( message );
				args.unshift( key ); // the subject
				// forward the messages to the listener
				messageListener.apply( owner, args );
				// and re-execute the patched function
				patched.apply( owner, arguments );

			};

		} );

	}

	if( i.receive ) {

		// via I.receive
		return function() {

			forPipeArgs( arguments, function( subj, subjS, message ) {

				if( isFunc( i.receive[ subjS ] ) ) {
					// receive via the safe-subject-format
					i.receive[ subjS ].call( owner, message );

				} else if( isFunc( i.receive[ subj ] ) ) {
					// receive via the non-safe subject format
					i.receive[ subj ].call( owner, message );

				} else if( isFunc( i.receive ) ) {
					// receive through the general receive function
					i.receive.call( owner, subj, message );

				}

			} );

		};

	}

};


