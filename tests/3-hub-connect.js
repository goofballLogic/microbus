var should = require( "chai" ).should();
var bus  = require( "../lib" );

describe( "Given a hub", function() {

	beforeEach( function() { this.hub = new bus.Hub(); } );

	describe( "Given two objects exposing send and receive functions", function() {

		beforeEach( function() {

			this.obj1 = new Agent();
			this.obj2 = new Agent();

		} );

		describe( "When the objects are connected to the hub", function() {

			beforeEach( function() {

				this.hub.connect( this.obj1 );
				this.hub.connect( this.obj2 );

			} );

			describe( "And object1 sends a hello:world message", function() {

				beforeEach( function() {

					this.obj1.sayHelloWorld();

				 } );

				it( "Then the message should be received by object2", function() {

					this.obj2.inbox.length.should.equal( 1 );
					this.obj2.inbox[ 0 ].should.eql( [ "world", "hello" ] );

				} );

			} );

		} );

	} );

} );

function Agent() {

	this.I = {

		send: function() { },
		receive: function( message, subject ) {

			this.inbox.push( [ message, subject ] );

		}

	};
	this.inbox = [ ];

}
Agent.prototype.sayHelloWorld = function() {

	this.I.send( "world", "hello" );

}