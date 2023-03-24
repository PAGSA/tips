$(function() {
	$.fn.hasAttr = function(name) {  
		return this.attr(name) !== undefined;
	};

	$.getJSON('telescopes.json', function(data) {
		// For each telescope in the JSON
		$.each(data.telescopes, function(i, t) {
			// Create a jumpto button for the telescope
			var jumpbutton = "<a href=\"#" + t.nameshort + "\">" + t.nameshort + "</a>&emsp;";
			$('#jumpto').children('p').append(jumpbutton);


			// Create the main telescope panel
			var scopehtml = "<div class=\"telescope\" id=\"" + t.nameshort + "\">" + 
				"<div class=\"telescope-header\">" +
					"<img class=\"telescope-img\" src=\"" + t.image + "\"/>" +
					"<h3>" + t.name + "</h3>" + 
					"<p class=\"telescope-info\">" + t.location +
						($(t).hasAttr("altitude") ? "<br>" + t.altitude : "") + "</p>" +
						"<p>" + t.primirror + " primary mirror</p>" +
						"<p><a href=\"" + t.website + "\">Website</a>&emsp;<a href=\"" + t.etc + "\">Exposure time calculator</a></p>" +
				"</div>" +
				"<div class=\"instrument-bar\"></div>" +
			"</div>";
			$('#telescope-container').append(scopehtml);

			var tselector = '#' + t.nameshort;


			// Loop through the instruments
			$.each(t.instruments, function(j, inst) {
				// Add button to instrument bar
				var buttonhtml = "<button class=\"instrument-button\" onClick=\"openInst(this,'#" + inst.name + "')\">" +
					inst.name + "</button>";
				$(tselector).children('.instrument-bar').append(buttonhtml);

				// Add instrument panel
				var insthtml = "<div class=\"instrument\" id=\"" + inst.name + "\">" +
					"<h4>" + inst.namelong + "</h4>" +
					"<p><i>" + inst.type + "<br>First Light: " + inst.firstlight + "</i></p>" + 
					"<p>Wavelengths: " + inst.wavelengths + "</p>" + 
					"<p>Filters: </p>" +
					"<p>Resolution: " + inst.resolution + "</p>" + 
					"<p>FOV: " + inst.fov + "</p>" +
				"</div>";
				$(tselector).append(insthtml);
			});


			// Add collapse button
			var collapsehtml = "<div class=\"telescope-bottom-bar\">" +
				"<button class=\"collapse-button\" onClick=\"collapse('#" + t.nameshort + "')\"></button></div>";
			$(tselector).append(collapsehtml);
		});
	});

	
	// Use this section to override the default format
	$('#VAT').children('.telescope-header').children('h3').append(' (a super cool telescope)');
});


function openInst(tab,inst) {
	$(tab).siblings().removeClass('active');
	$(tab).addClass('active');
	$(inst).siblings(".instrument").removeClass("expand");
	$(inst).addClass("expand");
}
function collapse(scope) {
	$(scope).children(".instrument").removeClass("expand");
	$(scope).children(".instrument-bar").children(".instrument-button").removeClass('active');
}