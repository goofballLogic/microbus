/*eslint-env node*/
"use strict";

var mb = module.exports = {};

function atoa( args ) {

	var ret = [];
	for( var i = 0; i < args.length; i++ ) { ret.push( args[ i ] ); }
	return ret;

}
function isFunc( obj ) { return typeof obj === "function"; }

var registry = {};
function receivers( bus, subject ) {

	var busSubjects = ( registry[ bus.uid ] = registry[ bus.uid ] || {} );
	var subjectReceivers = ( busSubjects[ subject ] = busSubjects[ subject ] || [] );
	return subjectReceivers;

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
	receivers( this, subject ).slice( 0 )
		.filter( function( receiver ) { return receiver.owner !== sender; } )
		.forEach( function( receiver ) {

			receiver.handler.apply( receiver.owner, args );

		} );

};
mb.Bus.prototype.send = mb.Bus.prototype.sendFrom.bind( null );
mb.Bus.prototype.connect = function( passenger ) {

	var bus = this;
	var isSenderRegistered = false;
	var sender = this.sendFrom.bind( this, passenger );
	var keys = [];
	for( var x in passenger ) { keys.push( x ); }
	keys
		.map( function( key ) { return passenger[ key ]; } )
		.filter( function( handler) { return isFunc(handler) && handler.hasOwnProperty( "receive" ); } )
		.forEach( function( handler ) {
			handler.receive.forEach( function( subject ) {

				if( subject === "bus.sender" ) {

					handler.call( passenger, sender );
					isSenderRegistered = true;

				} else {

					receivers( bus, subject ).push( { "handler" : handler, "owner" : passenger } );

				}

			} );
		} );

		if( isSenderRegistered ) { return; }
		passenger.send = sender;

};
