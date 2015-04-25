/*eslint-env node*/
"use strict";
require( "chai" ).should();
var mb = require( "../lib" );
var Agent = require( "./Agent" );

describe( "Given a bus and a connected object", function() {

	beforeEach( function() {

		this.agent1 = new Agent();
		this.bus = new mb.Bus( this.agent1 );

	} );

	describe( "When I broadcast a hello message", function() {

		beforeEach( function() {

			this.bus.send( this.agent1.uid, "hello" );

		} );

		it( "Then object1 should receive a hello", function() {

			this.agent1.log[ 0 ].should.eql( [ this.agent1.uid, "hello" ] );

		} );

	} );

} );

