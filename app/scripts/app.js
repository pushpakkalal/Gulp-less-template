(function ($) {
	"use strict";

	var App = function () {
		var o = this; // Create reference to this instance
		$(document).ready(function () {
			o.initialize();
		}); // Initialize app when document is ready

	};
	var p = App.prototype;

	// =========================================================================
	// INIT
	// =========================================================================

	p.initialize = function () {
		// Init events
		this._initFirstFunc();
	};

	

	
	// =========================================================================
	// First Function
	// =========================================================================

	p._initFirstFunc = function () {
		
	};
	// =========================================================================
	// DEFINE NAMESPACE
	// =========================================================================

	window.myApp = window.myApp || {};
	window.myApp.App = new App;
}(jQuery)); // pass in (jQuery):
