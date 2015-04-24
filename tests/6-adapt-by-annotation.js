/*eslint-env node*/
"use strict";
var should = require( "chai" ).should(); //eslint-disable-line
var Microbus = require( "../lib" );

function HelloListener() {

	this.messages = [];

}
HelloListener.prototype.receiveMessages = function( message ) {

	this.messages.push( message );

};
HelloListener.prototype.receiveMessages.messages = [ "hello" ];

describe( "Given that I explicitly build a pipe", function() {

	beforeEach( function() {

		var bus = new Microbus.Hub();
		this.listener = new HelloListener();
		bus.connect( this.listener );
		this.sendingPipe = bus.buildAdapter( bus );

	} );

	describe( "When I send a message", function() {

		beforeEach( function() {

			this.sendingPipe.send( "app.greeting", "world" );

		} );

		it("Then that message should be distributed"); /*, function() {


			this.listener.messages.should.contain( "world" );

		} );*/

	} );

} );
