/*eslint-env node*/
"use strict";
function Hub() { }
module.exports = Hub;

var pipe = require( "./pipe" );

Hub.prototype.connect = function( x ) {
	// ensure we have a collection of pipes
	this.pipes = this.pipes || [];
	var xpipe;
	// message listener function
	var messageListener = function( message, subject ) {
		this.messageListener( xpipe, message, subject );
	}.bind( this );
	// create a pipe for this participant
	xpipe = pipe( x, messageListener );
	// store this pipe so we can send messages through it
	this.pipes.push( xpipe );
};
Hub.prototype.messageListener = function( sendingPipe, message, subject ) {
	// take a copy of the current pipes
	var pipes = this.pipes.slice();
	// while we have pipes to send
	while( pipes.length ) {
		// get the next pipe off the list
		var next = pipes.pop();
		// as long as it's not the pipe this message came from, send the message through the pipe
		if( next !== sendingPipe ) { next( message, subject ); }
	}

};
