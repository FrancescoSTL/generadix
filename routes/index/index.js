'use strict';

var express = require('express');
var router = express.Router();

var stepAPI = 0;
var stepPage = 0;
var title= "HaveNeed";
var brand= "Warm beds for those in need";

// get today's date
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd='0'+dd
} 

if(mm<10) {
    mm='0'+mm
} 

today = mm+'/'+dd+'/'+yyyy;

// requesting root directory
router.get('/', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');
	var recentCasesCollection = db.get('cases');
	var userName;

	var featuredCases = [{	"caseName":"Police Shooting of Laquan McDonald",
								"caseShortDescription":"Officer 1st Degree Murder", 
								"caseCity":"Chicago, IL", 
								"caseURL":"/casesu?caseID=56afd185a81aff8010ce474a", 
								"caseImgURL":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/LAQUAN_McDonald_Chicago_memorial_from_protestors.jpg/480px-LAQUAN_McDonald_Chicago_memorial_from_protestors.jpg" 
							},
							{
								"caseName":"Unlawful Conviction of Steven Avery",
								"caseShortDescription":"Acquited after 18 years served", 
								"caseCity":"Manitowoc, WI", 
								"caseURL":"/case?caseID=56afd185a81aff8010ce474a", 
								"caseImgURL":"http://pixel.nymag.com/imgs/daily/vulture/2015/12/30/30-making-a-murderer-netflix-steven-avery.w529.h529.2x.jpg" 
							},
							{
								"caseName":"Battery of Journalist by Mizzou Professor",
								"caseShortDescription":"Journalism student assaulted by MU prof.", 
								"caseCity":"Columbia, MO", 
								"caseURL":"/case?caseID=56afd185a81aff8010ce474a", 
								"caseImgURL":"http://www.gannett-cdn.com/-mm-/3f6586c93baca5feed713bdbb48f05d91be03b0c/c=86-0-937-640&r=x404&c=534x401/local/-/media/2016/01/27/USATODAY/USATODAY/635895248768515224-melissaclick.jpg" 
							},
							{
								"caseName":"Death of Eric Garner in NYC",
								"caseShortDescription":"Put in chokehold by Staten Island PD", 
								"caseCity":"Staten Island, NY", 
								"caseURL":"/case?caseID=56afd185a81aff8010ce474a", 
								"caseImgURL":"https://www.popularresistance.org/wp-content/uploads/2014/08/1garner.jpg"
							}
							];

	recentCasesCollection.find({"privacy": "0"}, { sort: {$natural: -1 }, limit: 12}, function(err, cases) {
		if(request.session.UID){
			collection.findOne({'_id': request.session.UID}, function(err, user) {
				userName = user.username;
				response.render('index.html', {feature: true, featuredCases: featuredCases, title: title, brand: brand, userName: userName, recentCases: cases, loggedIn: true});
			});
		}
		else
		{
			response.render('index.html', {feature: true, featuredCases: featuredCases, title: title, brand: brand, recentCases: cases, loggedIn: false});
		}
	});
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
		response.render('upload.html', {title: title, brand: brand});
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
			if(request.body.youtubeURL){
				var youtubeURL = request.body.youtubeURL;
				var length = youtubeURL.length;
				var endIndex = youtubeURL.indexOf("watch?v=");
				var youtubeID = youtubeURL.slice((endIndex+8),length);

				caseCollection.insert({'title':request.body.caseTitle ,
									'description':request.body.caseDescription, 
									'youtubeURL':youtubeID,
									/*'officerName':request.body.officerName,*/
									'serviceCategory': request.body.serviceCategory,
									'wantHave': ('wanthave' in request.body ? request.body.wantHave : 'want'),
									'peopleCategory': request.body.peopleCategory,
									'userCreated':request.session.UID,
									'privacy':request.body.privacy,
									'additionalLink':request.body.addtlLink,
									'userName': userName,
									'claimingUserId': null, //for matching have user
									'claimedDate' : null, // matching user date
									'createdDate': today},
					function(err, data) {

						response.redirect(301, "/");
					}
				);
			}
			else
			{
				caseCollection.insert({'title':request.body.caseTitle ,
									'description':request.body.caseDescription, 
									/* 'officerName':request.body.officerName, */
									'serviceCategory': request.body.serviceCategory,
									'wantHave': ('wanthave' in request.body ? request.body.wantHave : 'want'),
									'peopleCategory': request.body.peopleCategory,
									'userCreated':request.session.UID,
									'privacy':request.body.privacy,
									'additionalLink':request.body.addtlLink,
									'userName': userName,
									'claimingUserId': null, //for matching have user
									'claimedDate' : null, // matching user date
									'createdDate': today},
					function(err, data) {

						response.redirect(301, "/");
					}
				);
			}


			
		});
	}
	else
	{
		response.render('login.html', {title: title, brand: brand, userLogged: false});
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
		response.redirect(301, "/login?=post");
		//response.render('profile.html', {title: title, brand: brand, userLogged: false});
	}
});



// requesting case directory
router.get('/case', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');
	var userName;
	var latitude =0;
	var longitude =0;

	if(request.session.UID){
		collection.findOne({'_id': request.session.UID}, function(err, user) {
			userName = user.username;

			var casesCollection = db.get('cases');

			casesCollection.findOne({'_id': request.query.caseID}, function(err, chosenCase) {

				var comments = db.get('comments');
				comments.find({'caseID': request.query.caseID}, function(err, comments) {

					if(chosenCase.youtubeURL)
						var youtubeEmbedURL = "https://www.youtube.com/embed/" + chosenCase.youtubeURL;
					else
						youtubeEmbedURL = false;

					if((chosenCase.userCreated == request.session.UID) || chosenCase.privacy == "0")
					{
						var isUserCreated;
						if(chosenCase.userCreated == request.session.UID)
							isUserCreated = true;
						else
							isUserCreated = false;

						response.render('case.html', {
									caseName: chosenCase.title, 
									caseDescription: chosenCase.description, 
									youtubeURL: youtubeEmbedURL,
									caseNum: chosenCase._id,
									mapsAPISource: "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key="+process.env.API_Key,
									/* 'officerName':request.body.officerName, */
									serviceCategory: choseCase.serviceCategory,
									wantHave: chosenCase.wantHave,
									peopleCategory: chosenCase.peopleCategory,
									caseCity: "Chicago, IL",
									userName: chosenCase.userName, 
									loggedIn: true,
									isUserCase: isUserCreated,
									addtlLink: chosenCase.additionalLink,
									createdDate: chosenCase.createdDate,
									claimingUserId: chosenCase.claimingUserId,
							 		claimedDate: chosenCase.claimedDate,
									userComments: comments
									});
					}
					// if not, they don't have permission to view the case, so redirect them to the homepage (for now). Eventually will redirect to a insufficient permission page
					else
					{
						response.redirect(301, "/");
					}
				});
			});
		});
	}
	else
	{
		var casesCollection = db.get('cases');

			casesCollection.findOne({'_id': request.query.caseID}, function(err, chosenCase) {

				var comments = db.get('comments');
				comments.find({'caseID': request.query.caseID}, function(err, comments) {

					if(chosenCase.youtubeURL)
						var youtubeEmbedURL = "https://www.youtube.com/embed/" + chosenCase.youtubeURL;
					else
						youtubeEmbedURL = false;

					if(chosenCase.privacy == "0")
					{

						response.render('case.html', {
									caseName: chosenCase.title, 
									caseDescription: chosenCase.description, 
									youtubeURL: youtubeEmbedURL,
									caseNum: chosenCase._id,
									mapsAPISource: "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key="+process.env.API_Key,
									/* 'officerName':request.body.officerName, */
									serviceCategory: choseCase.serviceCategory,
									wantHave: chosenCase.wantHave,
									peopleCategory: chosenCase.peopleCategory,
									caseCity: "Chicago, IL",
									addtlLink: chosenCase.additionalLink,
									loggedIn: false,
									isUserCase: false,
									userName: chosenCase.userName,
									createdDate: chosenCase.createdDate,
									claimingUserId: chosenCase.claimingUserId,
									claimedDate : chosenCase.claimedDate,
									userComments: comments
									});
					}
					// if not, they don't have permission to view the case, so redirect them to the homepage (for now). Eventually will redirect to a insufficient permission page
					else
					{
						response.redirect(301, "/");
					}
				});
			});
	}
});

// post a comment -> only if case is in 'matched=true'
router.post('/case', function(request, response) {
	var db = request.db;
	var collection = db.get('userInfo');

		// if the user is in a logged-in session
	if(request.session.UID){
			// find that user
		collection.findOne({'_id': request.session.UID}, function(err, user) {

				// get all cases
			var casesCollection = db.get('cases');

				// find the case we want to comment on
			casesCollection.findOne({'_id': request.body.caseID}, function(err, chosenCase) {

				// get all comments
			var comments = db.get('comments');

			var comments = db.get('comments');
			comments.insert({'caseID':request.body.caseID,
							'comment':request.body.comment,
							'userID':request.session.UID,
							'userName':user.username
							},
					function(err, data) {
						response.redirect(301, "/case?caseID="+request.body.caseID);
					}
				);
			});
		});
	}
	else
	{
		response.redirect(301, "/login/");
	}
});

router.get('/login', function(request,response){
	response.render('login.html', {title: title, brand: brand, loggedIn: false});
});

router.post('/login', function(request,response) {
	var db = request.db;
	var collection = db.get('userInfo');
	
	collection.findOne({'email':request.body.email}, function(err, user) {
		    if (err) {
		    	console.log(err);
		      response.redirect(301, "/loginFailure");
     	    }
	        else if (!user) {
	        	console.log("NO SUCH USER");
		      response.redirect(301, "/loginFailure");
		    }
	        else if (user.password != request.body.password) {
	        	console.log("PASSWORDS NOT EQUAL");
		      response.redirect(301, "/loginFailure");
		    }
		    else
		    {
			    request.session.UID = user._id;
			    response.redirect(301, "/");
		    }
	})
});

router.get("/edit", function(request,response){
	var db = request.db;
	var collection = db.get('cases');
	var userCollection = db.get('userInfo');
	var userName;
	var privacySettings = [{ id : 0, text : "Public" }, { id : 1, text : "Private" }, { id : 2, text : "Private with Lawyer Access" }];

	// if the user is logged in
	if(request.session.UID){
		// find them
		userCollection.findOne({'_id': request.session.UID}, function(err, user) {
			// save their user name
			userName = user.username;

			// find the case they want to edit
			collection.findOne({'_id': request.query.caseID}, function(err, chosenCase) {

					// if they created the case they want to edit, let them
					if(chosenCase.userCreated == request.session.UID)
					{
						response.render('edit.html', {
									caseName: chosenCase.title,
									caseDescription: chosenCase.description,
									youtubeURL: chosenCase.youtubeURL,
									caseNum: chosenCase._id,
									/* 'officerName':request.body.officerName, */
									serviceCategory: choseCase.serviceCategory,
									wantHave: chosenCase.wantHave,
									peopleCategory: chosenCase.peopleCategory,
									privacySelected: chosenCase.privacy,
									privacySettings: privacySettings,
									addtlLink: chosenCase.additionalLink,
									createdDate: chosenCase.createdDate,
									claimingUserId: chosenCase.claimingUserId, //for matching have user
									claimedDate : chosenCase.claimedDate, // matching user date
									userName: chosenCase.userName,
									loggedIn: true
									});
					}
					// if not, redirect them to the homepage (for now). In the future we should redirect to an improper permissions page
					else
					{
						response.redirect(301, "/");
					}
				
			});
		});	
	}
	// if the user is not logged in, send them back to the case page
	else
	{
		response.redirect(301, "/case?caseID="+request.query.caseID);
	}

});

router.get("/delete", function(request,response){
	var db = request.db;
	var collection = db.get('cases');
	var userCollection = db.get('userInfo');
	var userName;

	// if the user is logged in
	if(request.session.UID){
		// find them
		userCollection.findOne({'_id': request.session.UID}, function(err, user) {
			// save their user name
			userName = user.username;

			// find the case they want to edit
			collection.findOne({'_id': request.query.caseID}, function(err, chosenCase) {

					// if they created the case they want to edit, let them
					if(chosenCase.userCreated == request.session.UID)
					{
						response.render('delete.html', {
									caseName: chosenCase.title, 
									caseNum: chosenCase._id,
									userName: userName, 
									loggedIn: true
									});
					}
					// if not, redirect them to the homepage (for now). In the future we should redirect to an improper permissions page
					else
					{
						response.redirect(301, "/");
					}
				
			});
		});	
	}
	// if the user is not logged in, send them back to the case page
	else
	{
		response.redirect(301, "/case?caseID="+request.query.caseID);
	}

});

router.post("/delete", function(request,response){
	var db = request.db;
	var collection = db.get('cases');
	var userCollection = db.get('userInfo');
	var userName;

	// if the user is logged in
	if(request.session.UID){
		// find them
		userCollection.findOne({'_id': request.session.UID}, function(err, user) {
			// save their user name
			userName = user.username;

			// find the case they want to delete
			collection.findOne({'_id': request.query.caseID}, function(err, chosenCase) {

					// if they created the case they want to delete, let them
					if(chosenCase.userCreated == request.session.UID)
					{
						// update the entry based upon their request
						collection.remove({'_id': request.query.caseID}, 
											function(err, caseI)
											{
												response.redirect(301, "/");
											});
					}
					// if the user is not the one who created the case, send them back to the case page (for now). In the future, we will send them to inadquate permissions page
					else
					{
						response.redirect(301, "/case?caseID="+request.query.caseID);
					}

			});
		});
	}
	// if the user is not logged in, send them back to the case page (for now). In the future, we will send them to inadquate permissions page
	else
	{
		response.redirect(301, "/case?caseID="+request.query.caseID);
	}

});


router.post('/match', function (request,response) {
	var db = request.db;
	var collection = db.get('cases');
	var userCollection = db.get('userInfo');
	var userName;

	// if the user is logged in
	if(request.session.UID){
		// find them


			// find the case they want to edit
			collection.findOne({'_id': request.query.caseID}, function(err, chosenCase) {

				// if they created the case they want to edit, let them
				if(chosenCase.claimingUserId == null)
				{
					if(request.body.youtubeURL)
					{
						var youtubeURL = request.body.youtubeURL;
						var length = youtubeURL.length;
						var endIndex = youtubeURL.indexOf("watch?v=");
						var youtubeID = youtubeURL.slice((endIndex+8),length);
					}

					// update the entry based upon their request
					collection.update({'_id': chosenCase._id}, {
							caseName: chosenCase.title,
							caseDescription: chosenCase.description,
							youtubeURL: chosenCase.youtubeURL,
							caseNum: chosenCase._id,
							/* 'officerName':request.body.officerName, */
							serviceCategory: choseCase.serviceCategory,
							wantHave: chosenCase.wantHave,
							peopleCategory: chosenCase.peopleCategory,
							privacySelected: chosenCase.privacy,
							privacySettings: privacySettings,
							addtlLink: chosenCase.additionalLink,
							createdDate: chosenCase.createdDate,
							claimingUserId: request.session.UID, //for matching have user
							claimedDate : today, // matching user date
							userName: chosenCase.userName,
							loggedIn: true

						},
						function(err, caseI)
						{
							response.redirect(301, "/case?caseID="+request.query.caseID);
						});
				}
				// if the user is not the one who created the case, send them back to the case page (for now). In the future, we will send them to inadquate permissions page
				else
				{
					response.redirect(301, "/case?caseID="+request.query.caseID);
				}

			});

	}
	// if the user is not logged in, send them back to the case page (for now). In the future, we will send them to inadquate permissions page
	else
	{
		response.redirect(301, "/case?caseID="+request.query.caseID);
	}
});
router.post("/edit", function(request,response){
	var db = request.db;
	var collection = db.get('cases');
	var userCollection = db.get('userInfo');
	var userName;

	// if the user is logged in
	if(request.session.UID){
		// find them
		userCollection.findOne({'_id': request.session.UID}, function(err, user) {
			// save their user name
			userName = user.username;

			// find the case they want to edit
			collection.findOne({'_id': request.query.caseID}, function(err, chosenCase) {

					// if they created the case they want to edit, let them
					if(chosenCase.userCreated == request.session.UID)
					{
						if(request.body.youtubeURL)
						{
							var youtubeURL = request.body.youtubeURL;
							var length = youtubeURL.length;
							var endIndex = youtubeURL.indexOf("watch?v=");
							var youtubeID = youtubeURL.slice((endIndex+8),length);
						}

						// update the entry based upon their request
						collection.update({'_id': request.query.caseID}, {
											'title':request.body.caseTitle,
											'description':request.body.caseDescription, 
											'youtubeURL':youtubeID,
											/* 'officerName':request.body.officerName, */
											'serviceCategory': request.body.serviceCategory,
											'wantHave': ('wanthave' in request.body ? request.body.wantHave : 'want'),
											'peopleCategory': request.body.peopleCategory,
											'userCreated':request.session.UID,
											'privacy':request.body.privacy, 
											'additionalLink':request.body.addtlLink,
											'userName': request.body.userName,
											'createdDate': request.body.createdDate},
											function(err, caseI)
											{
												response.redirect(301, "/case?caseID="+request.query.caseID);
											});
					}
					// if the user is not the one who created the case, send them back to the case page (for now). In the future, we will send them to inadquate permissions page
					else
					{
						response.redirect(301, "/case?caseID="+request.query.caseID);
					}

			});
		});
	}
	// if the user is not logged in, send them back to the case page (for now). In the future, we will send them to inadquate permissions page
	else
	{
		response.redirect(301, "/case?caseID="+request.query.caseID);
	}

});


router.get('/loginFailure', function(request,response){
	response.render('loginFailure.html', {title: title, brand: brand, loggedIn: false});
});

/*router.get('/logout', function(request,response){
	response.render('logout.html', {title: title, brand: brand, loggedIn: false});
});*/

router.get('/register', function(request,response){
	response.render('register.html', {title: title, brand: brand, loggedIn: false});
});

router.get('/logout', function(request,response){
	response.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	request.session.destroy(function (err) {
		response.render('logout.html', {title: title, brand: brand, loggedIn: false});
	});
});

router.get('/chat', function(req, res) {
    res.render('chat.html');
});

router.get('/myCases', function(request,response){
	var db = request.db;
	var casesCollection = db.get('cases');
	var usersCollection = db.get('userInfo');
	var userName;

	if(request.session.UID){
		usersCollection.findOne({'_id': request.session.UID}, { sort: { $natural: -1 }, limit: 16}, function(err, user) {
			userName = user.username;

			casesCollection.find({ userCreated: request.session.UID }, function(err, cases) {
				response.render('myCases.html', {title: title, brand: brand, loggedIn: true, userName: userName, userCases: cases});
			});
		});
	}
	else
	{
		response.redirect(301, "/login");
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
