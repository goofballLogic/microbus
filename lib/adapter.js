/*eslint-env node*/
"use strict";
function Adapter( hub1, hub2 ) {

	this.adapt( hub1, hub2 );

}
module.exports = Adapter;
Adapter.prototype.adapt = function( hub1, hub2 ) {

	this.addConnection( hub1 );
	this.addConnection( hub2 );

};
Adapter.prototype.addConnection = function( hub ) {

	this.connections = this.connections || [];
	var connection = {
		I : { receive: this.receive, send: function() { } },
		adapter : this,
		blocked: [],
		block: function( subject ) { this.blocked.push( subject ); },
		unblock: function( subject ) { this.blocked.splice( this.blocked.indexOf( subject ), 1 ); },
		isBlocked: function( subject ) { return !!~this.blocked.indexOf( subject ); }
	};
	hub.connect( connection );
	this.connections.push( connection );

};

Adapter.prototype.receive = function() {

	var args = Array.prototype.slice.call( arguments, 0 );
	var connections = Array.prototype.slice.call( this.adapter.connections, 0 );
	var subject = args[ 0 ];
	this.block( subject );
	while( connections.length ) {

		var connection = connections.pop();
		if( connection.isBlocked( subject ) ) { continue; }
		connection.I.send.apply( connection, args );

	}
	this.unblock( subject );

};
