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

	describe( "When a logging callback is registered, and then one object1 announces itself", function() {

		beforeEach( function() {

			this.log = [];
			this.bus.log( function( ) {

				this.log.push( arguments );

			}.bind( this ) );
			this.agent1.announceSelf();

		} );

		it( "Then object1 should receive a hello from object 2", function() {

			this.agent1.log[ 0 ].should.eql( [ this.agent1.uid, "Hello from: " + this.agent2.uid ] );

		} );

		it( "Then the messages should have been logged", function() {

			this.log.length.should.equal( 4 );
			this.log[ 0 ][ 0 ].should.equal( "send" );
			this.log[ 0 ][ 1 ].should.equal( this.agent1 );
			this.log[ 0 ][ 2 ][ 0 ].should.equal( "agent.added" );
			this.log[ 0 ][ 2 ][ 1 ].uid.should.equal( this.agent1.uid );
			this.log[ 1 ][ 0 ].should.equal( "receive" );
			this.log[ 1 ][ 1 ].should.equal( this.agent2 );
			this.log[ 1 ][ 2 ].should.equal( this.agent1 );
			this.log[ 1 ][ 3 ][ 0 ].should.equal( "agent.added" );
			this.log[ 1 ][ 3 ][ 1 ].uid.should.equal( this.agent1.uid );

		} );

	} );

} );

