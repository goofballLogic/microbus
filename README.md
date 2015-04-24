microbus
========

Micro bus for js

General usage pattern is as follows:

1. Each object wishing to exchange messages on the bus should build an interface through which to send and receive, or expose one called "I"
2. This interface object should contain a `receive` hash where each item in the `receive` hash is a function handling messages of a given name
3. Optionally, a `send` function can also be attached which is wrapped by the bus when you attach. If one isn't specified the bus will manufacture an empty function for you.

### Example - building the interface

````javascript

// greeter.js

function Greeter( bus ) {

  this.I = bus.buildPipe();
  this.I.receive[ "app.bootstrap" ] = this.setup;
  this.I.receive[ "member.added" ] = this.addMember;

}
Greeter.prototype.setup = function() {

  // do set up stuff
  . . .

};
Greeter.prototype.addMember = function( member ) {

  this.I.send( member.uid, "Hello " + member.name );

};

// app.js

var Microbus = require( "microbus" );

var bus = new Microbus.Hub();
var greeter = new Greeter( bus );
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

### Example - exposing the interface

````javascript

// greeter.js

function Greeter() {

  this.I = { receive: {} };
  this.I.receive[ "app.bootstrap" ] = this.setup;
  this.I.receive[ "member.added" ] = this.addMember;

}
Greeter.prototype.setup = function() {

  // do set up stuff
  . . .

};
Greeter.prototype.addMember = function( member ) {

  this.I.send( member.uid, "Hello " + member.name );

};

// app.js

var Microbus = require( "microbus" );
var bus = new Microbus.Hub();
bus.pipe( new Greeter() );
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


### Example - annotating the functions

````javascript

// greeter.js

function Greeter() {

  this.I = {};

}
Greeter.prototype.setup = function() {

  // do set up stuff
  . . .

};
Greeter.prototype.setup.messages = [ "app.boostrap" ];
Greeter.prototype.addMember = function( member ) {

  this.I.send( member.uid, "Hello " + member.name );

};
Greeter.prototype.addMember.messages = [ "member.added" ];

// app.js

var Microbus = require( "microbus" );
var bus = new Microbus.Hub();
bus.pipe( new Greeter() );
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
