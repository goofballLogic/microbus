microbus
========

Micro bus for js

General usage pattern is as follows:

1. An object wishing to receive messages from the bus should add an attribute named "receive" to functions which should process the named messages.
2. An object wishing to send messages should use the supplied "bus" object's send method.
3. An object can receive the "bus" object in a function, rather than by having object set.

### Example - sending and receiving

````javascript

// search-widget.js

function SearchWidget() { }
SearchWidget.prototype.executeSearch( subject, searchText ) {

  xhr.get( "/search?q=" + searchText, function( err, xhrObject ) {
    
    if( !err ) {
    
      this.send( "search-widget:results", xhrObject.responseText );
      
    } else { 
    
      handleError( err, xhrObject );
      
    }
  
  } );
  
};
SearchWidget.prototype.executeSearch.receive = [ "requested:search" ];


// results-widget.js

function ResultsWidget() { }
ResultsWidget.prototype.displayResults( subject, data ) {

  console.log( "Search results: " + data ); // TODO: populate results grid
  
}
ResultsWidget.prototype.displayResults.receive = [ "search-widget:results" ];


// domain.js

function Domain() {

  var bus = new microbus.Bus();
  bus.connect( new SearchWidget() );
  bus.connect( new ResultsWidget() );
  bus.connect( this );
  
}
Domain.prototype.search( searchText ) {

  this.send( "requested:search", searchText );
  
};


// app.js

var Domain = require( "./domain" );
var domain = new Domain();
domain.search( "how to draw a bunny" );
````
