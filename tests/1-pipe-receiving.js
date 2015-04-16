/*eslint-env node */
"use strict";
var should = require( "chai" ).should();
var bus = require( "../lib" );

function WhenThen() {

	describe( "When this object is attached to a pipe and a value-specified message is given to the pipe", function() {

		beforeEach( function() {

			this.pipe = bus.pipe( this.obj );
			this.pipe( 42, "value-specified" );

		} );

		it( "Then object should have invoked its behaviour", function() {

			should.exist( this.obj.z );
			this.obj.z.should.equal( 43 );

		} );

	} );

}

describe( "Given an object with some behaviour", function() {

	function Obj() { }

	beforeEach( function() {

		Obj.prototype = function() { };
		Obj.prototype.somebehaviour = function( y ) {

			this.z = y + 1;
			return y - 1;

		};
		this.obj = new Obj();

	} );

	describe( "And a well-known member function valueSpecified which invokes that behaviour", function() {

		beforeEach( function() {

			Obj.prototype.valueSpecified = function( y ) {

				return this.somebehaviour( y );

			};

		} );
		WhenThen.call( this );

	} );

	describe( "And an I object member containing a receive function which invokes that behaviour", function() {

		beforeEach( function() {

			this.obj.I = {

				receive: function( message, subject ) {

					if( subject === "value-specified" ) { this.somebehaviour( message ); }

				}

			};

		} );
		WhenThen.call( this );

	} );

	describe( "And an I object member containing a receive object containing a function named after the subject", function() {

		beforeEach( function() {

			this.obj.I = {

				receive: function() { throw new Error( "Shouldn't be called" ); }

			};
			this.obj.I.receive.valueSpecified = function( message ) {

				this.somebehaviour( message );

			};

		} );
		WhenThen.call( this );

	} );

	describe( "And an I object member containing a receive object containing a function named after the subject string", function() {

		beforeEach( function() {

			this.obj.I = {

				receive: function() { throw new Error( "Shouldn't be called" ); }

			};
			this.obj.I.receive[ "value-specified" ] = function( message ) {

				this.somebehaviour( message );

			};

		} );
		WhenThen.call( this );

	} );


} );
