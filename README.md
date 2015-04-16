microbus
========

Micro bus for js

General usage pattern is as follows:

1. Each object wishing to exchange messages on the bus should build an interface through which to send and receive, or expose one called "I"
2. This interface object should contain a `send` function, and a `receive` hash
3. Each item in the `receive` hash is a function handling messages of a given name

Example

````javascript
var bus = require( "microbus" );

function Greeter() {

  var messages = bus.buildInterface();
  messages.receive[ "app.bootstrap" ] = function() {
  
    // do set up stuff
    . . .
    
  };
  messages.receive[ "member.added" ] = function( member ) {
  
    messages.send( member.uid, "Hello " + member.name );
    
  };
  
}

````
