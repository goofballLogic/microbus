microbus
========

Micro bus for js

General usage pattern is as follows:

1. Each object wishing to exchange messages on the bus should build an interface through which to send and receive, or expose one called "I"
2. This interface object should contain a `send` function, and a `receive` hash
3. Each item in the `receive` hash is a function handling messages of a given name

### Example - building the interface

````javascript

// greeter.js

function Greeter( bus ) {

  var messages = bus.buildPipe();
  messages.receive[ "app.bootstrap" ] = function() {
  
    // do set up stuff
    . . .
    
  };
  messages.receive[ "member.added" ] = function( member ) {
  
    messages.send( member.uid, "Hello " + member.name );
    
  };
  
}

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
  bus.receive( newMember.uid, function( message ) { console.log( message ); } );
  bus.send( "member.added", newMember );
  res.send(201);
  
} );
````

### Example - exposing the interface

````javascript

// greeter.js

function Greeter() {

  var messages = this.I = { send: function() { }, receive: { } };
  messages.receive[ "app.bootstrap" ] = function() {
  
    // do set up stuff
    . . .
    
  };
  messages.receive[ "member.added" ] = function( member ) {
  
    messages.send( member.uid, "Hello " + member.name );
    
  };
  
}

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
  bus.receive( newMember.uid, function( message ) { console.log( message ); } );
  bus.send( "member.added", newMember );
  res.send(201);
  
} );
````
