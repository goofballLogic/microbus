/*eslint-env node */
"use strict";

var mb = require( "../lib" );

function initialise() {

	this.uid = "Agent_" + mb.uid();
	this.handleMyMessages = function() {

		this.log.push( Array.prototype.slice.call( arguments, 0 ) );

	}.bind( this );
	this.handleMyMessages.receive = [ this.uid ];

}

function Agent() {

	initialise.call( this );
	this.log = [];

}
Agent.prototype.handleNews = function() {

	this.log.push( Array.prototype.slice.call( arguments, 0 ) );

};
Agent.prototype.handleNews.receive = [ "news.published" ];
Agent.prototype.handleAddedAgent = function( subject, added ) {

	this.send( added.uid, "Hello from: " + this.uid );

};
Agent.prototype.handleAddedAgent.receive = [ "agent.added" ];
Agent.prototype.announceSelf = function() {

	this.send( "agent.added", { uid: this.uid } );

};


module.exports = Agent;
