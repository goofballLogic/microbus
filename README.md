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

function Greeter() {

}
Greeter.prototype.setup = function() {

  // do set up stuff
  . . .

};
Greeter.prototype.setup.receive = [ "app.bootstrap" ];
Greeter.prototype.addMember = function( member ) {

  this.send( member.uid, "Hello " + member.name );

};
Greeter.prototype.addMember.receive = [ "member.added" ];

// app.js

var Microbus = require( "microbus" );

var bus = new Microbus.Bus();
bus.connect( new Greeter() );
bus.send( "app.bootstrap" );

var express = require('express');
var app = express();
var members = 0;

app.post( "/join/{name}", function( req, res ) {

  var newMember = { uid: ++members, name: req.params.name };
  bus.receive[ newMember.uid ] = function( message ) { console.log( message ); };
  bus.send( "member.added", newMember );
  res.send(201);

} );
````
