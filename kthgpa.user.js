// ==UserScript==
// @name           KTH Mean Grade
// @author         frgustaf@kth.se
// @namespace      all
// @description    Calculates your mean grade at Mina sidor @ KTH
// @include        https://www.kth.se/student/minasidor/kurser/*
// @version        0.2
// @date           2011-07-10
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
	var table = $("#courselistresults");
	var header = table.children("thead");
	var body = table.children("tbody");
	var countcell = body.children().last()

	//Updates the cells
	updateCount = function() {
		totalCount = 0;
		totalPoints = 0;
		body.children().each(function() { 
			var checkbox = $(this).children().last().children("input");
			if(checkbox.length != 0) {
				if(checkbox.attr("checked")) {
					var points = parseFloat($(this).children().get(2).innerHTML);
					var grade = $(this).children().get(4).innerHTML;
					var gradescale = [5, 4.5, 4, 3.5, 3];
					var gradepoints = gradescale[(grade.charCodeAt(0)-65)];
					var totpoints = points*gradepoints;
					totalCount += totpoints;
					totalPoints += points;
				}
			}
		});
		countcell.children().last().html((totalCount/totalPoints).toFixed(3));
	}

	header.children().children().last().after("<th style='text-align:right'>Medel</th>");
	body.children().each(function() { 
		var html = $(this).html();
		if($(this).hasClass("grayout") || $(this).children().get(2).innerHTML.length == 0 || $.inArray($(this).children().get(4).innerHTML, ['A','B','C','D','E'])==-1 || $(this).children().get(0).innerHTML.length < 10) {
			$(this).html(html+"<td style='text-align:right'></td>")
		} else {
			$(this).html(html+"<td style='text-align:right'><input onclick='updateCount()' type='checkbox' id='count' checked='true'/></td>")
		}
	});

	updateCount()
}

// load jQuery and execute the main function
addJQuery(main);