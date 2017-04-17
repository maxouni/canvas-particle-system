'use strict';

var applicationModuleName = 'core';
var applicationModuleVendorDependencies = [];
angular.module(applicationModuleName, applicationModuleVendorDependencies || []);

var app = angular
	.module(applicationModuleName);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Then init the app
	angular.bootstrap(document, [applicationModuleName]);
});

