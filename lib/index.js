/*eslint-env node*/
"use strict";

var mb = module.exports = {};

function atoa( args ) {

	var ret = [];
	for( var i = 0; i < args.length; i++ ) { ret.push( args[ i ] ); }
	return ret;

}
function isFunc( obj ) { return typeof obj === "function"; }
function isReceiver( handler ) { return handler.hasOwnProperty( "receive" ); }
function isBusSender( subject ) { return subject === "bus.sender"; }
function valuesOf( obj ) { var ret = []; for( var x in obj ) { ret.push( obj[ x ] ); } return ret; }
function ensure( obj, key, defaultValue ) { obj[ key ] = obj[ key ] || defaultValue; return obj[ key ]; }

var registry = {};
function receivers( bus, subject ) {

	return ensure(

		ensure( registry, bus.uid, {} ),
		subject,
		[]

	);

}

mb.uid = function() {

	return Math.random().toString().substr(2) + Math.random().toString().substr(2);

};
mb.Bus = function Bus() {

	this.uid = "Bus_" + mb.uid();
	atoa( arguments ).forEach( this.connect.bind( this ) );

};
mb.Bus.prototype.sendFrom = function() {

	var args = atoa( arguments );
	var sender = args.shift();
	var subject = args[ 0 ];
	var subjectReceivers = receivers( this, subject ).slice( 0 );
	function isNotSender( receiver ) { return sender !== receiver.owner; }
	function sendToReceiver( receiver ) { receiver.handler.apply( receiver.owner, args ); }

	subjectReceivers
		.filter( isNotSender )
		.forEach( sendToReceiver );

};
mb.Bus.prototype.send = function() {

	var args = atoa( arguments );
	args.unshift( null );
	this.sendFrom.apply( this, args );

};
mb.Bus.prototype.connect = function( passenger ) {

	var isSenderRegistered = false;
	var sender = this.sendFrom.bind( this, passenger );
	function isBusSenderReceived( handler, subject ) {
		/*
		a handler receiving the "bus.sender" message is a special case
		where we hand the send function to the handler, rather than patching
		the owning object with a .send property
		*/
		if( !isBusSender( subject ) ) { return false; }
		handler.call( passenger, sender );
		isSenderRegistered = true;
		return true;

	}
	function processSubjectHandler( handler, subject ) {
		/*
		For a given handler and subject, check for special cases, and if none apply
		register a new receiver for this handler and subject
		*/
		if( isBusSenderReceived( handler, subject ) ) { return; }
		var receiver = { "handler" : handler, "owner" : passenger };
		receivers( this, subject ).push( receiver );

	}
	function processHandler( handler ) {
		/*
		For a given handler (which is known to be a receiver), iterate through
		every subject mentioned in for the handler and process
		*/
		var processSubject = processSubjectHandler.bind( this, handler );
		var subjects = handler.receive;
		subjects.forEach( processSubject );

	}
	var processHandlerForBus = processHandler.bind( this );

	valuesOf( passenger )
		.filter( isFunc )
		.filter( isReceiver )
		.forEach( processHandlerForBus );

	if( !isSenderRegistered ) { passenger.send = sender; }

};
