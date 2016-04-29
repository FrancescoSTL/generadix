//var progressBar = $("#progressBar");
var title = $("#title");
var subhead = $("#subhead");
var submitBtn = $("#submitBtn");
var nextBtn = $("#nextBtn");
var titlePage = $("#titleDiv");
var tagsPage = $("#tags");
var descPage = $("#description");
var mediaPage = $("#privacyAndMedia");
var progress = $("#progress");
var prevButton = $("#prevBtn");

$(nextBtn).click(function() {
	switch(progress.text())
	{
		case "0":
			title.text("Who does this involve?");
			subhead.text("This can be the person, organization, or group involved with your occurence. FedUp makes it easy to find officer numbers and police departments and it helps the community identify reoccuring patterns of injustice.");
			titlePage.toggle();
			tagsPage.toggle();
			prevButton.toggle();
			progress.text("1");
			break;
		case "1":
			title.text("Explain what happened");
			subhead.text("People are more likely to connect with your story if you can explain the impact on you, your family, or your community.");
			tagsPage.toggle();
			descPage.toggle();
			progress.text("2");
			break;
		case "2":
			title.text("Add photos, videos, and links");
			subhead.text("People are more likely to connect with your story if you can explain the impact on you, your family, or your community.");
			descPage.toggle();
			mediaPage.toggle();
			nextBtn.toggle();
			submitBtn.toggle();
			progress.text("3");
			break;
	}
});

$(prevBtn).click(function() {
	switch(progress.text())
	{
		case "1":
			title.text("Write your case title");
			subhead.text("This is the first thing people will see about your case. Get their attention with a short title that focuses on why your story matters.");
			tagsPage.toggle();
			titlePage.toggle();
			prevButton.toggle();
			progress.text("0");
			break;
		case "2":
			title.text("Who does this involve?");
			subhead.text("This can be the person, organization, or group involved with your occurence. FedUp makes it easy to find officer numbers and police departments and it helps the community identify reoccuring patterns of injustice.");
			descPage.toggle();
			tagsPage.toggle();
			progress.text("1");
			break;
		case "3":
			title.text("Explain what happened");
			subhead.text("People are more likely to connect with your story if you can explain the impact on you, your family, or your community.");
			mediaPage.toggle()
			descPage.toggle();
			nextBtn.toggle();
			submitBtn.toggle();
			progress.text("2");
			break;
	}
});