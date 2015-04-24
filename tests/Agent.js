/*eslint-env node */
"use strict";

function agentid() {

	return "Agent_" + Math.random().toString().substr(2) + Math.random().toString().substr(2);

}

function initialise() {

	this.uid = agentid();
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
