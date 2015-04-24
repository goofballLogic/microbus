/*eslint-env node*/
"use strict";
require( "chai" ).should();
var mb = require( "../lib" );
var Agent = require( "./Agent" );

describe( "Given a bus and two connected objects", function() {

	beforeEach( function() {

		this.agent1 = new Agent();
		this.agent2 = new Agent();
		this.bus = new mb.Bus( this.agent1, this.agent2 );

	} );

	describe( "When one object1 announces itself", function() {

		beforeEach( function() {

			this.agent1.announceSelf();

		} );

		it( "Then object1 should receive a hello from object 2", function() {

			this.agent1.log[ 0 ].should.eql( [ this.agent1.uid, "Hello from: " + this.agent2.uid ] );

		} );

	} );

} );

