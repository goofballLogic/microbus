microbus
========

Micro bus for js

General usage pattern is as follows:

1. An object wishing to receive messages from the bus should add an attribute named "receive" to functions which should process the named messages.
2. An object wishing to send messages should use the supplied "bus" object's send method.
3. An object can receive the "bus" object in a function, rather than by having object set.

### Example - sending and receiving

````javascript

// greeter.js

function Greeter() { }
Greeter.prototype.handleMemberAdded = function( member ) {

  this.send( member.uid, "Hello " + member.name );

};
Greeter.prototype.handleMemberAdded.receive = [ "member.added" ];


// domain.js

function Domain() {

  var bus = new microbus.Bus();
  bus.connect( new Greeter() );
  bus.connect( this );
  
}
Domain.prototype.createMember( name ) {

  var newMember = { uid: ++members, name: name };
  this.logger.receive.push( newMember.uid );
  this.send( "member.added", newMember );
  
};
Domain.prototype.logger = function( subject, message ) {

  console.log( message );
  
};
Domain.prototype.logger.receive = [];

// app.js

var Domain = require( "./domain" );
var domain = new Domain();
var express = require('express');
var app = express();
var members = 0;

app.post( "/join/{name}", function( req, res ) {

  domain.createMember( req.params.name );
  res.send(201);

} );
````
