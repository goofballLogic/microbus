/*eslint-env node*/
"use strict";
require( "chai" ).should();
var mb = require( "../lib" );
var Agent = require( "./AltAgent" );

describe( "Given a bus and two connected objects which receive the send function as a message because they have their own business logic in a function named 'send'", function() {

	beforeEach( function() {

		this.agent1 = new Agent();
		this.agent2 = new Agent();
		this.bus = new mb.Bus( this.agent1, this.agent2 );

	} );

	describe( "When object1 sends object2 'hello'", function() {

		beforeEach( function() {

			this.agent1.dispatchMessage( this.agent2.uid, "hello" );

		} );

		it( "Then object2 should receive 'hello'", function() {

			this.agent2.log[ 0 ][ 1 ].should.equal( "hello" );

		} );

	} );

	describe( "When object1's send method is called", function() {

		beforeEach( function() {

			this.agent1.send();

		} );

		it( "Then object1's 'send' business logic should have executed", function() {

			this.agent1.mySendExecuted.should.be.true;

		} );

	} );

} );

