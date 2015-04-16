/*eslint-env node*/
"use strict";

var str = require( "./str" );

function forPipeArgs( args, sendMessage ) {

	var al = args.length;
	if( al === 2 ) {

		var subj = args[ 1 ];
		var subjS = str.camelCase( subj );
		var message = args[ 0 ];
		sendMessage( subj, subjS, message );

	}

}

function noop() { }

function isFunc( x ) { return typeof x === "function"; }

module.exports = function pipe( obj, messageListener ) {

	// no obj ? just return a noop
	if( !obj ) { return noop; }
	// do we have an interface object to work with?
	if( obj.I ) {
		// is this pipe processing output messages?
		if( isFunc( messageListener ) ) {
			// do we have a send section on the interface?
			if( obj.I.send ) {
				// is the send member a function?
				if( isFunc( obj.I.send ) ) {
					// patch this function to forward messages to our listener
					var patchedSender = obj.I.send;
					obj.I.send = function() {
						// forward the messages to the listener
						messageListener.apply( obj, arguments );
						// and re-execute the patched function
						patchedSender.apply( obj, arguments );
					};
					// shift the patched function's methods to the patch function
					for( var func in patchedSender ) {

						if( isFunc( patchedSender[ func ] ) ) {
							// attach to patch and remove from the patched function
							obj.I.send[ func ] = patchedSender[ func ];
							delete patchedSender[ func ];

						}

					}

				}
				// even if the send member is not a function, still patch any member functions on it
				Object.keys( obj.I.send ).forEach( function( key ) {

					var patched = obj.I.send[ key ];
					if( !isFunc( patched ) ) { return; }
					// shim to pick up the message for the listener
					obj.I.send[ key ] = function() {

						var args = Array.prototype.slice.apply( arguments );
						var message = args.shift();
						args.unshift( key ); // the subject
						args.unshift( message );
						// forward the messages to the listener
						messageListener.apply( obj, args );
						// and re-execute the patched function
						patched.apply( obj, arguments );

					};

				} );

			}

		}

		if( obj.I.receive ) {

			// via I.receive
			return function() {

				forPipeArgs( arguments, function( subj, subjS, message ) {

					if( isFunc( obj.I.receive[ subjS ] ) ) {
						// receive via the safe-subject-format
						obj.I.receive[ subjS ].call( obj, message );

					} else if( isFunc( obj.I.receive[ subj ] ) ) {
						// receive via the non-safe subject format
						obj.I.receive[ subj ].call( obj, message );

					} else if( isFunc( obj.I.receive ) ) {
						// receive through the general receive function
						obj.I.receive.call( obj, message, subj );

					}

				} );

			};

		}

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
