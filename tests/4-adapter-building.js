/*eslint-env node*/
"use strict";
var should = require( "chai" ).should(); //eslint-disable-line
var Microbus = require( "../lib" );

function HelloListener( bus ) {
	var I = bus.buildAdapter();
	this.messages = [];
	I.receive.hello = function( message ) {

		this.messages.push( message );

	}.bind( this );
}

describe( "Given that I explicitly build a pipe", function() {

	beforeEach( function() {

		var bus = new Microbus.Hub();
		this.listener = new HelloListener( bus );
		this.sendingPipe = bus.buildAdapter( bus );

	} );

	describe( "When I send a message", function() {

		beforeEach( function() {

			this.sendingPipe.send( "hello", "world" );

		} );

		it("Then that message should be distributed", function() {

			this.listener.messages.should.contain( "world" );

		} );

	} );

} );
