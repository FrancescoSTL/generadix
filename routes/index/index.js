'use strict';

var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
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
	var query = "true";

	if (request.query.cat != "true" && typeof request.query.cat != "undefined") {
		query = request.query.cat;

		recentCasesCollection.find({"peopleCategory": request.query.cat}, { sort: {$natural: -1 }, limit: 12}, function(err, cases) {
			if(request.session.UID){
				collection.findOne({'_id': request.session.UID}, function(err, user) {
					userName = user.username;
					response.render('index.html', {feature: true, title: title, brand: brand, userName: userName, recentCases: cases, loggedIn: true, peopleCategory: query, hn: user.htype});
				});
			}
			else
			{
				response.render('haveOrNeed.html');
			}
		});
	}
	else {
		recentCasesCollection.find({"privacy": "0"}, { sort: {$natural: -1 }, limit: 12}, function(err, cases) {
			if(request.session.UID){
				collection.findOne({'_id': request.session.UID}, function(err, user) {
					userName = user.username;
					response.render('index.html', {feature: true, title: title, brand: brand, userName: userName, recentCases: cases, loggedIn: true, notChosen: query, hn: user.htype});
				});
			}
			else
			{
				response.render('haveOrNeed.html');
			}
		});
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
			response.render('upload.html', {projects: projects, title: title, brand: brand, userName: userName, loggedIn: true, hn: user.htype});
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

			console.log(request.body.peopleCategory);

				caseCollection.insert({'title':request.body.caseTitle ,
									'description':request.body.caseDescription, 
									/* 'officerName':request.body.officerName, */
									'serviceCategory': request.body.serviceCategory,
									'needHave': ('needHave' in request.body ? request.body.needHave : 'need'),
									'peopleCategory': request.body.peopleCategory,
									'userCreated':request.session.UID,
									'privacy': "0",
									'additionalLink':request.body.addtlLink,
									'userName': userName,
									'claimingUserId': null, //for matching have user
									'claimedDate' : null, // matching user date
									'createdDate': today},
					function(err, data) {
                        console.log(err);
						response.redirect(301, "/");
					}
				);
		});
	}
	else
	{
        console.err("not logged in");
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


					if((chosenCase.userCreated == request.session.UID) || chosenCase.privacy == "0")
					{
						var isUserCreated;
						if(chosenCase.userCreated == request.session.UID)
							isUserCreated = true;
						else
							isUserCreated = false;

						var matched = false

						if(chosenCase.claimingUserId) {
							matched = true;
						}

						if ((user.htype == "need" && matched) || (user.htype == "have" && chosenCase.claimingUserId == request.session.UID  && matched)) {
							
							console.log(user.htype == "help" && chosenCase.claimingUserId == request.session.UID  && matched );
							response.render('case.html', {
									caseName: chosenCase.title, 
									caseDescription: chosenCase.description, 
									caseNum: chosenCase._id,
									mapsAPISource: "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key="+process.env.API_Key,
									/* 'officerName':request.body.officerName, */
									serviceCategory: chosenCase.serviceCategory,
									needHave: chosenCase.needHave,
									peopleCategory: chosenCase.peopleCategory,
									privacy: 0,
									caseCity: "Chicago, IL",
									userName: chosenCase.userName, 
									loggedIn: true,
									isUserCase: isUserCreated,
									addtlLink: chosenCase.additionalLink,
									createdDate: chosenCase.createdDate,
									claimingUserId: chosenCase.claimingUserId,
							 		claimedDate: chosenCase.claimedDate,
									userComments: comments,
									hn: user.htype,
									isMatched: true
							});
						} else {
							response.render('case.html', {
									caseName: chosenCase.title, 
									caseDescription: chosenCase.description, 
									caseNum: chosenCase._id,
									mapsAPISource: "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key="+process.env.API_Key,
									/* 'officerName':request.body.officerName, */
									serviceCategory: chosenCase.serviceCategory,
									needHave: chosenCase.needHave,
									peopleCategory: chosenCase.peopleCategory,
									privacy: 0,
									caseCity: "Chicago, IL",
									userName: chosenCase.userName, 
									loggedIn: true,
									isUserCase: isUserCreated,
									addtlLink: chosenCase.additionalLink,
									createdDate: chosenCase.createdDate,
									claimingUserId: chosenCase.claimingUserId,
							 		claimedDate: chosenCase.claimedDate,
									userComments: comments,
									hn: user.htype,
									isMatched: false
							});
						}
						
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

					if(chosenCase.privacy == "0")
					{

						response.render('case.html', {
									caseName: chosenCase.title, 
									caseDescription: chosenCase.description, 
									caseNum: chosenCase._id,
									mapsAPISource: "https://www.google.com/maps/embed/v1/place?q=" + latitude + "%2C" + longitude + "&key="+process.env.API_Key,
									/* 'officerName':request.body.officerName, */
									serviceCategory: chosenCase.serviceCategory,
									needHave: chosenCase.needHave,
									peopleCategory: chosenCase.peopleCategory,
									caseCity: "Chicago, IL",
									addtlLink: chosenCase.additionalLink,
									privacy: 0,
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
									caseNum: chosenCase._id,
									/* 'officerName':request.body.officerName, */
									serviceCategory: chosenCase.serviceCategory,
									needHave: chosenCase.needHave,
									peopleCategory: chosenCase.peopleCategory,
									privacySelected: chosenCase.privacy,
									privacySettings: privacySettings,
									addtlLink: chosenCase.additionalLink,
									createdDate: chosenCase.createdDate,
									claimingUserId: chosenCase.claimingUserId, //for matching have user
									claimedDate : chosenCase.claimedDate, // matching user date
									userName: chosenCase.userName,
									loggedIn: true,
									hn: user.htype
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
									loggedIn: true,
									hn: user.htype
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


router.get('/match', function (request,response) {
	var db = request.db;
	var collection = db.get('cases');
	var userCollection = db.get('userInfo');
	var userName;

	// if the user is logged in
	if(request.session.UID){
		// find them


			// find the case they want to edit
            console.log(request);
			collection.findOne({'_id': new mongo.ObjectID(request.query.caseID)}, function(err, chosenCase) {
                if(err){return response.status(500).send(err.toString());}
				// if they created the case they want to edit, let them
				if(request.session.UID != null)
				{

					// update the entry based upon their request
					collection.update({'_id': chosenCase._id}, {
							title: chosenCase.title,
							description: chosenCase.description,
							serviceCategory: chosenCase.serviceCategory,
							peopleCategory: chosenCase.peopleCategory,
							privacy: 0,
							addtlLink: chosenCase.additionalLink,
							createdDate: chosenCase.createdDate,
							userCreated: chosenCase.userCreated,
							claimingUserId: request.session.UID, //for matching have user
							claimedDate : today, // matching user date
							userName: chosenCase.userName,
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
	    console.log("err with UID");
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

						// update the entry based upon their request
						collection.update({'_id': request.query.caseID}, {
											'title':request.body.caseTitle,
											'description':request.body.caseDescription, 
											/* 'officerName':request.body.officerName, */
											'serviceCategory': request.body.serviceCategory,
											'needHave': ('needHave' in request.body ? request.body.needHave : 'want'),
											'peopleCategory': request.body.peopleCategory,
											'userCreated':request.session.UID,
											'privacy':0, 
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
	if (request.query.hn) {
		console.log('passing to register' + request.query.hn);
		response.render('register.html', {title: title, brand: brand, loggedIn: false, hn: request.query.hn});
	} else {
		response.render('register.html', {title: title, brand: brand, loggedIn: false});
	}
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

			if (user.htype == "have") {
				casesCollection.find({ claimingUserId: request.session.UID }, function(err, cases) {
					response.render('myCases.html', {title: title, brand: brand, loggedIn: true, userName: userName, userCases: cases, hn: user.htype});
				});
			} else {
				casesCollection.find({ userCreated: request.session.UID }, function(err, cases) {
					response.render('myCases.html', {title: title, brand: brand, loggedIn: true, userName: userName, userCases: cases, hn: user.htype});
				});
			}
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

			response.render('accountCreated.html', {title: title, brand: brand, userName: userName, loggedIn: true, hn: user.htype});
		});
	}
});


router.post('/register', function(request,response){
	var db = request.db;
	var collection = db.get('userInfo');
	var hn;

	collection.insert({'username':request.body.username ,'password':request.body.password,'email':request.body.email,'htype':request.body.hn},
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
				if(request.body.hn == "have")
				{
					response.redirect(301, '/accountCreated');
				} else {
					console.log(request.body.hn);
					response.redirect(301, '/upload');
				}
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
