/*eslint-env node */
"use strict";

require( "chai" ).should();
var bus = require( "../lib" );

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

	this.I.send( "hello", "world" );

};

describe( "Given two hubs, each with an attached object", function() {

	beforeEach( function() {

		this.hub1 = new bus.Hub();
		this.hub2 = new bus.Hub();
		this.obj1 = new Agent();
		this.obj2 = new Agent();
		this.hub1.connect( this.obj1 );
		this.hub2.connect( this.obj2 );

	} );

	describe( "And an adapter between the two hubs", function() {

		beforeEach( function() {

			this.adp = new bus.Adapter( this.hub1, this.hub2 );

		} );

		describe( "When object 1 sends a hello:world message", function() {

			beforeEach( function() {

				this.obj1.sayHelloWorld();

			} );

			it( "Then object 2 should receive the message", function() {

				this.obj2.inbox.length.should.equal( 1 );
				this.obj2.inbox[ 0 ].should.eql( [ "hello", "world" ] );

			} );

		} );

	} );

} );
