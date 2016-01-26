'use strict';

var express = require('express');
var router = express.Router();

var stepAPI = 0;
var stepPage = 0;
var title= "FedUp";
var brand= "Empowering Citizens in Police Interactions";

// requesting root directory
router.get('/', function(request, response) {
	var projects = [{"name":"Traffic Stop","id":"1"}];
	response.render('index.html', {projects: projects, title: title, brand: brand});
});

module.exports = router;
