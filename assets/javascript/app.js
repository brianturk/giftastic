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

// var gifs = [{
// 	id: "",
// 	title: "",
// 	image_gif: "",
// 	image_still: "",
// 	rating: "",
// 	still: true
// }]

var gifs = [];

$(document).ready(function () {


	//put tags on the page
	showTags();
	// currentTag = tags[currentKey];
	// getGifs();

	$(document).on("click", ".gif_image", changeImage);
	$(document).on("click", ".tag", function () {

		$("#tag_"+currentKey).removeClass("active");
		currentKey = $(this).attr("data-num");
		$("#tag_"+currentKey).attr("class", "active");
		gifs = [];
		currentTag = tags[currentKey];
		$("#main").empty();
		getGifs()

	})


	function showTags() {
		//first sort the tags alphabetically
		tags = tags.sort();
		if (currentTag === "") {
			currentTag = tags[0];
			currentKey = 0;
			getGifs();
		}

		$("#tags").empty();

		$.each(tags, function (key, value) {
			var tLi = $("<li>");
			tLi.attr("id","tag_"+key);
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

		//clear tag list
		// <li class="sidebar-brand"> <a href="#"> Add a Tag </a> </li>


		//add tags to list

	}

	function changeImage() {
		gifKey = $(this).parent().attr("data-num");

		// console.log(gifKey);
		// console.log(gifs);

		if (gifs[gifKey].still) {  //toggle image and gif
			$(this).attr("src", gifs[gifKey].image_gif);
			gifs[gifKey].still = false;
		} else {
			$(this).attr("src", gifs[gifKey].image_still);
			gifs[gifKey].still = true;
		}
	}


	function getGifs() {
		// var apiKey = "7mqpXLfwgxU0ELM4LULox0Aa04gKwkA5"
		// var apiKey = "vkVcwtm6Qn8d7x8VbAj8IKB5fNQldtxR"
		var apiKey = "FYH24Rrm6xWi8PN1FbMMhGpJK1WivHiM"

		var apiURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=" + currentTag + "&limit=10&rating=PG-13&lang=en"

		var x = 0;

		
		// console.log(apiURL);
		$.ajax({
			url: apiURL,
			method: "GET"
		}).then(function (response) {

			// console.log(response);
			addGifs(response.data);

		});

		function addGifs(jsonGifs) {

			$.each(jsonGifs, function (key, value) {
				var gDiv = $("<div>");
				gDiv.attr("class", "gif_card");
				gDiv.attr("data-id", value.id);
				gDiv.attr("data-num", key);

				var gImg = $("<img>");
				gImg.attr("class", "gif_image");
				gImg.attr("src", value.images.original_still.url);


				var gDivOF = $("<div>");
				gDivOF.attr("class", "git_outer_footer");

				var gDivIF = $("<div>");
				gDivIF.attr("class", "gif_footer_inner");
				gDivIF.text(value.rating.toUpperCase());

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