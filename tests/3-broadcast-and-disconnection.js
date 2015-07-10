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

	describe( "When I disconnect the object before broadcasting a message", function() {

		beforeEach( function() {

			this.bus.disconnect( this.agent1 );
			this.bus.send( this.agent1.uid, "hello" );

		} );

		it( "Then object1 should not receive the message", function() {

			this.agent1.log.length.should.eql( 0 );

		} );

	} );

	describe( "When I connect object 2, then object 1 sends a message", function() {

		beforeEach( function() {

			this.agent2 = new Agent();
			this.bus.connect( this.agent2 );
			this.agent1.publishNews( "Stuff happened!" );

		} );

		it( "Then object 2 should have received the message", function() {

			this.agent2.log.length.should.eql( 1 );

		} );

		describe( "But I disconnect object 1, before it sends another message", function() {

			beforeEach( function() {

				this.bus.disconnect( this.agent1 );
				this.agent1.publishNews( "Stuff happened!" );

			} );

			it( "Then object 2 should not have received the message", function() {

				this.agent2.log.length.should.eql( 1 );

			} );

			describe( "And I connect object 3 and object 2 sends a message", function() {

				beforeEach( function() {

					this.agent3 = new Agent();
					this.bus.connect( this.agent3 );
					this.agent2.publishNews( "Stuff happened!" );

				} );

				it( "Then object 3 should have received the message", function() {

					this.agent3.log.length.should.eql( 1 );

				} );

			} );

		} );

	} );

	describe( "When I add another object, but disconnect the initial object before broadcasting a message", function() {


		beforeEach( function() {

			this.agent2 = new Agent();
			this.bus.connect( this.agent2 );
			this.bus.disconnect( this.agent1 );
			this.bus.send( "news.published", "hello" );

		} );

		it( "Then object1 should not receive the message", function() {

			this.agent1.log.length.should.eql( 0 );

		} );

		it( "Then object2 should still receive the message", function() {

			this.agent2.log.length.should.eql( 1 );

		} );

	} );

} );

