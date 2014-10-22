var should = require( "chai" ).should();
var bus  = require( "../lib" );

describe( "Given an object with an I object member", function() {

	beforeEach( function() {

		this.obj = { I : { } };

	} );

	describe( "And a send function member on the I", function() {

		beforeEach( function() {

			this.obj.I.send = function( message, subject ) {

				this.sent = this.sent || [];
				this.sent.push( subject );

			}.bind( this.obj );

		} );

		GivenAnAttachedPipe.bind( this )(

			WhenHelloMessageSentThroughSend

		);

		describe( "And a hello function on the I.send member", function() {

			beforeEach( function() {

				this.obj.I.send.hello = function( message ) {

					this.sent = this.sent || [];
					this.sent.push( "hello" );

				}.bind( this.obj );

			} );

			GivenAnAttachedPipe.bind( this ) ( function() {

				WhenHelloMessageSentThroughSend.call( this );
				WhenHelloMessageSentThroughHello.call( this );

			} );

		} );

		function GivenAnAttachedPipe( whens ) {

			describe( "And the object is attached to a pipe", function() {

				beforeEach( function() {

					var pipeOutput = [];
					function messageListener( message, subject ) {

						pipeOutput.push( { "subject" : subject, "message" : message } );

					};
					this.pipeOutput = pipeOutput;
					this.pipe = bus.pipe( this.obj, messageListener );

				} );
				whens.call( this );

			} );

		}

		function WhenHelloMessageSentThroughSend() {

			describe( "When the object sends a hello:world message via the send function", function() {

				beforeEach( function() {

					this.obj.I.send( "world", "hello" );

				} );
				Thens.call( this );

			} );

		}

		function WhenHelloMessageSentThroughHello() {


			describe( "When the object sends a hello:world message via the send member's hello function", function() {

				beforeEach( function() {

					this.obj.I.send.hello( "world" );

				} );
				Thens.call( this );

			} );

		}

		function Thens() {

			it( "Then the message should be received", function() {

				this.pipeOutput.should.have.length( 1 );
				this.pipeOutput[ 0 ].should.eql( { "subject" : "hello", "message" : "world" } );

			} );

			it( "And the local sending function should also have processed the message", function() {

				this.obj.sent.should.have.length( 1 );
				this.obj.sent[ 0 ].should.eql( "hello" );

			} );

		}

	} );

} );

