'use strict';

var express = require('express');
var router = express.Router();

var stepAPI = 0;
var stepPage = 0;
var title= "FedUp";
var brand= "Empowering Citizens in Police Interactions";

// requesting root directory
router.get('/', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');
	var userName;

	var featuredCases = [{	"caseName":"Police Shooting of Laquan McDonald",
								"caseShortDescription":"Officer 1st Degree Murder", 
								"caseCity":"Chicago, IL", 
								"caseURL":"/case", 
								"caseImgURL":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/LAQUAN_McDonald_Chicago_memorial_from_protestors.jpg/480px-LAQUAN_McDonald_Chicago_memorial_from_protestors.jpg" 
							},
							{
								"caseName":"Unlawful Conviction of Steven Avery",
								"caseShortDescription":"Acquited after 18 years served", 
								"caseCity":"Manitowoc, WI", 
								"caseURL":"/case", 
								"caseImgURL":"http://pixel.nymag.com/imgs/daily/vulture/2015/12/30/30-making-a-murderer-netflix-steven-avery.w529.h529.2x.jpg" 
							},
							{
								"caseName":"Battery of Journalist by Mizzou Professor",
								"caseShortDescription":"Journalism student assaulted by MU prof.", 
								"caseCity":"Columbia, MO", 
								"caseURL":"/case", 
								"caseImgURL":"http://www.gannett-cdn.com/-mm-/3f6586c93baca5feed713bdbb48f05d91be03b0c/c=86-0-937-640&r=x404&c=534x401/local/-/media/2016/01/27/USATODAY/USATODAY/635895248768515224-melissaclick.jpg" 
							},
							{
								"caseName":"Death of Eric Garner in NYC",
								"caseShortDescription":"Put in chokehold by Staten Island PD", 
								"caseCity":"Staten Island, NY", 
								"caseURL":"/case", 
								"caseImgURL":"https://www.popularresistance.org/wp-content/uploads/2014/08/1garner.jpg"
							}
							];

	if(request.session.UID){
		collection.findOne({'_id': request.session.UID}, function(err, user) {
			userName = user.username;
			response.render('index.html', {feature: true, featuredCases: featuredCases, title: title, brand: brand, userName: userName, loggedIn: true});
		});
	}
	else
	{
		response.render('index.html', {feature: true, featuredCases: featuredCases, title: title, brand: brand, loggedIn: false});
	}
});

// requesting upload directory
router.get('/upload', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');
	var userName;

	if(request.session.UID){
		collection.findOne({'_id': request.session.UID}, function(err, user) {
			userName = user.username;
			var projects = [{"name":"Traffic Stop","id":"1"}];
			response.render('upload.html', {projects: projects, title: title, brand: brand, userName: userName, loggedIn: true});
		});
	}
	else
	{
		response.render('upload.html', {title: title, brand: brand, userLogged: false});
	}
});

// requesting upload directory
router.post('/upload', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');
	var userName;

	if(request.session.UID){
		collection.findOne({'_id': request.session.UID}, function(err, user) {
			userName = user.username;

			var caseCollection = db.get('cases');
			caseCollection.insert({'title':request.body.caseTitle ,
									'date':request.body.date,
									'description':request.body.caseDescription, 
									'youtubeURL':request.body.youtubeURL,
									'officerName':request.body.officerName,
									'userCreated':request.session.UID},
				function(err, data) {

					response.redirect(301, "/");
				}
			);

			
		});
	}
	else
	{
		response.render('upload.html', {title: title, brand: brand, userLogged: false});
	}
});

// requesting profile directory
router.get('/profile', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');
	var userName;

	if(request.session.UID){
		collection.findOne({'_id': request.session.UID}, function(err, user) {
			userName = user.username;
			var projects = [{"name":"Traffic Stop","id":"1"}];
			response.render('profile.html', {projects: projects, title: title, brand: brand, userName: userName, loggedIn: true});
		});
	}
	else
	{
		response.render('profile.html', {title: title, brand: brand, userLogged: false});
	}
});

// requesting case directory
router.get('/case', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');
	var latitude = "41.818117";
	var longitude = "-87.7271817";
	var userName;


	if(request.session.UID){
		collection.findOne({'_id': request.session.UID}, function(err, user) {
			userName = user.username;

			response.render('case.html', {
							caseName: "Police Shooting of Laquan McDonald", 
							caseDescription: "The shooting of Laquan McDonald occurred on October 20, 2014 in Chicago, Illinois, when McDonald, a 17-year-old black male, was shot 16 times in 13 seconds by Chicago Police Officer Jason Van Dyke. Video of the shooting, captured on one police cruiser's dashboard camera, was released over 13 months after the shooting. Van Dyke was charged with first-degree murder a few hours after the video's release.", 
							youtubeURL: "https://www.youtube.com/embed/I5Yf0f1b_sU",
							caseNum: 22400,
							mapsAPISource: "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key="+process.env.API_Key,
							caseTime: "9:57 PM",
							caseDate: "October 20, 2014",
							officerName: "Jason Van Dyke",
							caseCity: "Chicago, IL",
							userName: userName, 
							loggedIn: true
							});
		});
	}
	else
	{
		response.render('case.html', {
							caseName: "Police Shooting of Laquan McDonald", 
							caseDescription: "The shooting of Laquan McDonald occurred on October 20, 2014 in Chicago, Illinois, when McDonald, a 17-year-old black male, was shot 16 times in 13 seconds by Chicago Police Officer Jason Van Dyke. Video of the shooting, captured on one police cruiser's dashboard camera, was released over 13 months after the shooting. Van Dyke was charged with first-degree murder a few hours after the video's release.", 
							youtubeURL: "https://www.youtube.com/embed/I5Yf0f1b_sU",
							caseNum: 22400,
							mapsAPISource: "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key="+process.env.API_Key,
							caseTime: "9:57 PM",
							caseDate: "October 20, 2014",
							officerName: "Jason Van Dyke",
							caseCity: "Chicago, IL",
							loggedIn: false
							});
	}
});

router.post('/login', function(request,response) {
	var db = request.db;
	var collection = db.get('userInfo');
	
	collection.findOne({'email': request.body.email}, function(err, user) {
		    if (err) {
		      response.redirect('loginFailure.html', {title: title, brand: brand, loggedIn: false});
     	    }
	        if (!user) {
		      response.redirect('loginFailure.html', {title: title, brand: brand, loggedIn: false});
		    }
	        if (user.password != request.body.password) {
		      response.redirect('loginFailure.html', {title: title, brand: brand, loggedIn: false});
		    }
		    request.session.UID = user._id;
		    response.redirect(301, "/");
	});
});

router.get('/login', function(request,response){
	response.render('login.html', {title: title, brand: brand, loggedIn: false});
});

router.get('/register', function(request,response){
	response.render('register.html', {title: title, brand: brand, loggedIn: false});
});

router.get('/logout', function(request,response){
	request.session.destroy(function (err) {
		response.redirect(301, '/');
	});
});

router.get('/myCases', function(request,response){
	var db = request.db;
	var collection = db.get('cases');

	if(request.session.UID){
		collection.find({ userCreated: request.session.UID }, function(err, cases) {
			response.render('myCases.html', {title: title, brand: brand, loggedIn: true, userCases: cases});
		});
	}
});

router.get('/registraionFailure', function(request,response){
	response.redirect('index.html', {title: title, brand: brand, loggedIn: false});
});

router.get('/accountCreated', function(request,response){
	var db = request.db;
	var collection = db.get('userInfo');

	if(request.session.UID){
		collection.findOne({'_id': request.session.UID}, function(err, user) {
			var userName = user.username;

			response.render('accountCreated.html', {title: title, brand: brand, userName: userName, loggedIn: true});
		});
	}
});


router.post('/register', function(request,response){
	var db = request.db;
	var collection = db.get('userInfo');

	collection.insert({'username':request.body.username ,'password':request.body.password,'email':request.body.email},
		function(err, user) {
			if(err)
			{
				response.redirect('registrationFailure.html');
			}
			collection.findOne({'email':request.body.email}, function(err, user) {
				if(err)
				{
					response.redirect('loginFailure.html');
				}
				request.session.UID = user._id;
				response.redirect(301, '/accountCreated');
			});
		}
	);	
});




// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
