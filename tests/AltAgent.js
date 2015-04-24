/*eslint-env node */
"use strict";

var Base = require( "./Agent" );
function AltAgent() {

	Base.call( this );

}
AltAgent.prototype = new Base();
AltAgent.prototype.send = function() {

	this.mySendExecuted = true;

};
AltAgent.prototype.receiveSender = function( sendFunc ) {

	this.busSendFunc = sendFunc;

};
AltAgent.prototype.receiveSender.receive = [ "bus.sender" ];
AltAgent.prototype.dispatchMessage = function() {

	this.busSendFunc.apply( this, arguments );

};

module.exports = AltAgent;
