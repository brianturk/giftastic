$(function () {
	$("#menu-toggle").click(function (e) {
		e.preventDefault();
		$("#wrapper").toggleClass("toggled");
	});

	$(window).resize(function (e) {
		if ($(window).width() <= 768) {
			$("#wrapper").removeClass("toggled");
		} else {
			$("#wrapper").addClass("toggled");
		}
	});
});


var tags = ["baseball", "football", "soccer", "basketball", "hockey", "trackandfield", "lacrosse", "frisbee", "swimming", "rugby"];
var ratings = ["Y", "G", "PG", "PG-13"];
var currentTag = "";
var currentKey = 0;
var totalGifs = 0;
var newTag = "";
var offset = 0;
var gifs = [];

$(document).ready(function () {


	// $(".git_outer_footer").mouseenter(function() {
	// 	$(this).css(""

	// }).mouseleave(function() {
	// 	 $(this).css("background", "00F").css("border-radius", "0px");
	// });

	//put tags on the page
	showTags();


	//Clicking "more gifs" text at the bottom of the list of gifs to get 10 more gifs
	$(document).on("click","#more_gifs",function(){
		offset = offset + 10;
		$("#more_gifs").remove();
		getGifs();
	})


	// When the user clicks on <span> (x), close the modal
	$(document).on("click", ".close", function () {
		$('#myModal').css("display", "none");
	})

	//User clicks the close button in the modal dialog box
	$(document).on("click", ".new_tag_close", function () {
		$('#myModal').css("display", "none");
	})

	//User clicks the ok button in the modal dialog box
	$(document).on("click", ".new_tag_ok", function () {
		newTag = $('#new_tag_enter').val();
		$('#myModal').css("display", "none");

		if (newTag != null && newTag != "") {

			var dupe = false;
			var x = 0;
			//check to see if tag is a duplicate
			while (!(dupe) && (x <= tags.length)) {
				if (newTag === tags[x]) {
					dupe = true;
				}
				x++;
			}

			if (dupe) { 		//found duplicate tag.  show alert and do not add
				alert("You already have tag '" + newTag + "' in your list");
			} else {			//add tag to list
				tags.push(newTag);
				currentKey = tags.length;
				currentTag = newTag;
				showTags();
				gifs = [];
				offset = 0;
				$("#main").empty();
				getGifs();
			}

			newTag = "";
		}
	})

	//User clicks the ok in the delete tag modal box
	$(document).on("click", ".delete_tag_ok", function () {

		tags = jQuery.grep(tags, function (a) {
			return a !== currentTag;
		});

		currentKey = 0;
		currentTag = "";
		showTags();
		gifs = [];
		offset = 0;
		$("#main").empty();
		getGifs();

		$('#myModal').css("display", "none");
	})

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function (event) {
		if (event.target == $('#myModal')) {
			$('#myModal').css("display", "none");
		}
	}

	//Toggle between animated gif and still gif
	$(document).on("click", ".gif_image", changeImage);

	//Click a tag and show the gifs for that tag
	$(document).on("click", ".tag", function () {

		$("#tag_" + currentKey).removeClass("active");
		currentKey = $(this).attr("data-num");
		$("#tag_" + currentKey).attr("class", "active");
		gifs = [];
		offset = 0;
		currentTag = tags[currentKey];
		$("#main").empty();
		getGifs()

	})

	//Clicked tghe "Add a Tag" link
	$(document).on("click", "#add_tag", function () {

		$("#modal_header_text").text("Add a Tag")

		var enterLabel = $("<label>");
		enterLabel.attr("for", "newtag");
		enterLabel.text("Enter your new tag");

		var enterText = $("<input>")
		enterText.attr("class", "form-control");
		enterText.attr("type", "text");
		enterText.attr("id", "new_tag_enter");

		$(".modal-body").empty();
		$(".modal-body").append(enterLabel, enterText);

		var btnOK = $("<button>");
		btnOK.attr("id", "#new_tag_ok");
		btnOK.attr("class", "btn btn-secondary new_tag_ok");
		btnOK.text("OK");

		var btnCancel = $("<button>");
		btnCancel.attr("id", "#new_tag_cancel");
		btnCancel.attr("class", "btn btn-secondary new_tag_close");
		btnCancel.text("CANCEL");

		$(".modal-footer").empty();
		$(".modal-footer").append(btnOK, btnCancel);


		$('#myModal').css("display", "block");

		enterText.focus();
	})


	//Clicked the delete tag icon in the upper right corner
	$(document).on("click", "#delete_tag", function () {

		$("#modal_header_text").text("Delete a Tag")

		var deleteP = $("<P>");
		deleteP.text("Do you want to delete '" + currentTag + "'?");

		$(".modal-body").empty();
		$(".modal-body").append(deleteP);

		var btnOK = $("<button>");
		btnOK.attr("id", "#new_tag_ok");
		btnOK.attr("class", "btn btn-secondary delete_tag_ok");
		btnOK.text("OK");

		var btnCancel = $("<button>");
		btnCancel.attr("id", "#new_tag_cancel");
		btnCancel.attr("class", "btn btn-secondary new_tag_close");
		btnCancel.text("CANCEL");

		$(".modal-footer").empty();
		$(".modal-footer").append(btnOK, btnCancel);


		$('#myModal').css("display", "block");
	})

	//Display the list of tags
	function showTags() {
		//first sort the tags alphabetically
		tags = tags.sort();
		if (currentTag === "") {
			currentTag = tags[0];
			currentKey = 0;
			offset = 0;
			getGifs();
		}

		$("#tags").empty();

		$.each(tags, function (key, value) {
			var tLi = $("<li>");
			tLi.attr("id", "tag_" + key);
			if (value === currentTag) {
				tLi.attr("class", "active");
			}

			var tA = $("<a>");
			tA.attr("href", "#");
			tA.attr("class", "tag")
			tA.attr("data-num", key);
			tA.text(value);

			tLi.append(tA);

			$("#tags").append(tLi);
		})
	}

	//Swap between still and animated image
	function changeImage() {
		gifKey = $(this).parent().attr("data-num");

		if (gifs[gifKey].still) {  //toggle image and gif
			$(this).attr("src", gifs[gifKey].image_gif);
			gifs[gifKey].still = false;
		} else {
			$(this).attr("src", gifs[gifKey].image_still);
			gifs[gifKey].still = true;
		}
	}


	function getGifs() {

		//update current tag on the screen
		$("#current_tag").text(currentTag);
		var apiKey = "FYH24Rrm6xWi8PN1FbMMhGpJK1WivHiM"
		var apiURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + currentTag + "&offset=" + offset + "&limit=10&rating=PG-13&lang=en"

		$.ajax({
			url: apiURL,
			method: "GET"
		}).then(function (response) {

			totalGifs = response.pagination.total_count;
			addGifs(response.data);
		});

		//Add gifs to the page
		function addGifs(jsonGifs) {

			$.each(jsonGifs, function (key, value) {
				var gDiv = $("<div>");
				gDiv.attr("class", "gif_card");
				gDiv.attr("data-id", value.id);
				gDiv.attr("data-num", key + offset);

				var gImg = $("<img>");
				gImg.attr("class", "gif_image");
				gImg.attr("src", value.images.original_still.url);
				gImg.attr("alt", value.title);


				var gDivOF = $("<div>");
				gDivOF.attr("class", "git_outer_footer");

				var gDivIF = $("<div>");
				gDivIF.attr("class", "gif_footer_inner");
				gDivIF.text(value.rating.toUpperCase());

				
				// gSpan = $("<span>");
				// gSpan.attr("id","<span id='more_info_" + key + offset  + "'");
				// gSpan.html("<i class='fas fa-info-circle'></i>");
				// gSpan.css("padding-left","5px");
				// gSpan.css("visibility","hidden");

				// gDivIF.append(gSpan);

				gDivOF.append(gDivIF);

				gDiv.append(gImg);
				gDiv.append(gDivOF);

				$("#main").append(gDiv);


				gifs.push({
					id: value.id,
					title: value.title,
					image_gif: value.images.original.url,
					image_still: value.images.original_still.url,
					rating: value.rating.toUpperCase(),
					still: true
				})

			})

			if (gifs.length === 0) {		//no gifs found, display a message instead
				var ngP = "<p>";
				ng.text("No Gifs found for that tag.");

				$("#main").append(ngP);
			} else if (gifs.length < totalGifs) {  //Gifs left in the API then show a "more gifs" option

				var moreDiv = $("<div>");
				moreDiv.attr("id","more_gifs")
				var moreP = $("<p>");

				moreP.text("More Gifs...");

				moreDiv.append(moreP);

				$("#main").append(moreDiv);

			}
		}
	}


	//Handle side bar
	if ($('#sidebar').css("margin-left") === "-250px") {
		$('.brand-view').css("visibility", "visible")
	} else {
		$('.brand-view').css("visibility", "hidden")
	}
	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
		// $('#brand').toggleClass('brand-view');
		if ($('.brand-view').css("visibility") === "visible") {
			$('.brand-view').css("visibility", "hidden")
		} else {
			if ($('#sidebar').css("margin-left") != "-250px") {
				setTimeout(function () {
					$('.brand-view').css("visibility", "visible")
				}, 200);
			}
		}
	});


	$(window).resize(function () {
		if ($('#sidebar').css("margin-left") === "-250px") {
			setTimeout(function () {
				$('.brand-view').css("visibility", "visible")
			}, 200);
		} else {
			$('.brand-view').css("visibility", "hidden")
		}
	});

	//end sidebar handle



});