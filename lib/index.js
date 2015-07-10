/*eslint-env node*/
"use strict";

var mb = module.exports = {};

// convert arguments object to an array
function atoa( args ) { var ret = []; for( var i = 0; i < args.length; i++ ) { ret.push( args[ i ] ); } return ret; }
// is the given object a function?
function isFunc( obj ) { return typeof obj === "function"; }
// is the given function a receiver?
function isReceiver( func ) { return func.hasOwnProperty( "receive" ); }
// is this the subject for methods receiving the sender function
function isBusSender( subject ) { return subject === "bus.sender"; }
// return the values of an object as an array
function valuesOf( obj ) { var ret = []; for( var x in obj ) { ret.push( obj[ x ] ); } return ret; }
// ensure that a property exists on an object. Initialise it with a default value as necessary
function ensure( obj, key, defaultValue ) { obj[ key ] = obj[ key ] || defaultValue; return obj[ key ]; }
// this is the registry for receivers per bus
var registry = {};
// get the registry for a particular bus
function busRegistry( bus ) { return ensure( registry, bus.uid, {} ); }
// get the subjects for a particular bus
function busSubjects( bus ) { return Object.keys( busRegistry( bus ) ); }
// get the receivers for a given subject on a given bus
function receivers( bus, subject ) { return ensure( busRegistry( bus ), subject, [] ); }
// a function to generate a unique id
function uid() { return Math.random().toString().substr(2) + Math.random().toString().substr(2); }
// expose the id generator
mb.uid = uid;
// the Bus constructor
mb.Bus = function Bus() {

	this.uid = "Bus_" + mb.uid();
	this.senders = [];
	atoa( arguments ).forEach( this.connect.bind( this ) );

};
// send a message from a particular sender
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
// broadcast a message from no particular sender
mb.Bus.prototype.send = function() {

	var args = atoa( arguments );
	args.unshift( null );
	this.sendFrom.apply( this, args );

};
// disconnect a passenger from the bus
mb.Bus.prototype.disconnect = function( passenger ) {

	function isOwnedByPassenger( x ) { return x.owner === passenger; }
	function removeReceiver( subject, receiver ) {

		var list = receivers( this, subject );
		if( ~list.indexOf( receiver ) ) { list.splice( list.indexOf( receiver ), 1 ); }

	}
	function removePassengerListeners( subject ) {

		/*
		for all the listeners to this subject on our bus, check if they
		are owned by the passenger and if so, remove them
		*/
		receivers( this, subject )
			.filter( isOwnedByPassenger )
			.forEach( removeReceiver.bind( this, subject ) );

	}
	function disableSender( sender ) {

		sender.isDisabled = true;
		this.senders.splice( this.senders.indexOf( sender ), 1 );

	}
	busSubjects( this )
		.forEach( removePassengerListeners.bind( this ) );

	this.senders
		.filter( isOwnedByPassenger )
		.forEach( disableSender.bind( this ) );

};

// connect a passenger to the bus
mb.Bus.prototype.connect = function( passenger ) {

	var isSenderRegistered = false;
	/*
	we create a sender which is capable of being disabled and store it in our list
	of senders so that we can later go through the list to disabled all senders for
	this passenger
	*/
	var sender = function() {

		if( sender.isDisabled ) { return; }
		var args = atoa( arguments );
		args.unshift( passenger );
		this.sendFrom.apply( this, args );

	}.bind( this );
	sender.owner = passenger;
	this.senders.push( sender );

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
