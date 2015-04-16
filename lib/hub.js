/*eslint-env node*/
"use strict";
function Hub() { }
module.exports = Hub;

var pipe = require( "./pipe" );
var buildInterfacePipe = require( "./build-interface-pipe" );

Hub.prototype.storePipe = function( storee ) {
	// ensure pipe collection
	this.pipes = this.pipes || [];
	// store
	this.pipes.push( storee );
};
Hub.prototype.connect = function( x ) {

	// create and store a pipe for this participant
	var xpipe = pipe( x, this.messageListener.bind( this, xpipe ) );
	this.storePipe(xpipe);

};
Hub.prototype.messageListener = function( sendingPipe, subject, message ) {
	// take a copy of the current pipes
	var pipes = this.pipes.slice();
	// while we have pipes to send
	while( pipes.length ) {
		// get the next pipe off the list
		var next = pipes.pop();
		// as long as it's not the pipe this message came from, send the message through the pipe
		if( next !== sendingPipe ) { next( subject, message ); }
	}

};
Hub.prototype.buildAdapter = function( participant ) {
	// adapter to return
	var adapter = { send: function() { }, receive: { } };
	// create a pipe for this participant
	var xpipe = buildInterfacePipe( participant, adapter, this.messageListener.bind( this, xpipe ) );
	// store pipe
	this.storePipe(xpipe);
	// return the adapter
	return adapter;

};
