$(function() {
	let iDetail = 0;

	$.fn.hasAttr = function(name) {  
		return this.attr(name) !== undefined;
	};

	function makeProperty(t, i, prop) {
		if (prop == "other") {
			if ($(i.details).hasAttr("other")) {
				return "<p" + makeDetailTag(t, i.name) + ">Other details</p>";
			} else {
				return "";
			}
		}

		if (!$(i).hasAttr(prop)) {return "";}
		
		let hasDetails = $(i.details).hasAttr(prop);
		let hasSubprops = Array.isArray(i[prop]);
		
		let retval = "";
		if (hasSubprops) {
			retval += "<div class=\"instrument-subproperties\"";
		} else if (hasDetails) {
			retval += "<p" + makeDetailTag(t, i.name);
		} else {
			retval += "<p";
		}
		retval += ">";

		switch(prop) {
			case "type":
				break;
			case "wavelengths":
				retval += "<strong>Wavelengths: </strong>";
				break;
			case "filters":
				retval += "<strong>Filters: </strong>";
				break;
			case "detector":
				retval += "<strong>Detector: </strong>";
				break;
			case "resolution":
				retval += "<strong>Resolution: </strong>";
				break;
			case "fov":
				retval += "<strong>FOV: </strong>";
				break;
			case "maglimit":
				retval += "<strong>Sensitivity: </strong>";
				break;
			case "targets":
				retval += "<strong>Science cases: </strong>";
				break;
		}

		if (hasSubprops) {
			// Loop over subproperties
			$.each(i[prop], function(l, subprop) {
				retval += "<p" + (hasDetails ? makeDetailTag(t, i.name) : "") + ">" + 
					subprop + "</p>";
			});
			retval += "</div>";
		} else {
			retval += i[prop] + "</p>";
		}

		return retval;
	};

	function makeDetailTag(t, i) {
		let retval = " class=\"has-details\" tabindex=\"0\" onfocus=\"$(\'#" + i +
			"\').children(\'.property-detail\').hide();$(\'#" + t + "-" + i + "-detail" + iDetail + "\').show();\"";
		iDetail++;
		return retval;
	}

	function makeDetail(detail, t, i) {
		let retval = "<div class=\"property-detail\" id=\"" + t + "-" + i + "-detail" + iDetail + "\">";
		$.each(detail, function(m, line) {
			retval += "<p>" + line + "</p>";
		});
		retval += "</div>";
		iDetail++;
		return retval;
	}

	function makeDetailElems(details, t, i) {
		iDetail = 0;
		let retval = "";
		$.each(details, function(l, detail) {
			if (Array.isArray(detail[0])) {
				// Account for subproperty details
				$.each(detail, function(m, subdetail) {
					retval += makeDetail(subdetail, t, i);
				});
			} else {
				retval += makeDetail(detail, t, i);
			}
		});
		
		return retval;
	}

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
				let details = inst.details;
				iDetail = 0;

				// Add button to instrument bar
				let buttonhtml = "<button class=\"instrument-button\" onClick=\"toggleInst(this,'#" + inst.name + "')\">" +
					inst.name + "</button>";
				$(tselector).children('.instrument-bar').append(buttonhtml);

				// Add instrument panel
				let insthtml = "<div class=\"instrument\" id=\"" + inst.name + "\">" +
				"<div class=\"instrument-properties\">" +
					"<h4>" + inst.namelong + "</h4>" +
					"<p><i>First Light: " + inst.firstlight + "</i></p>";
				let properties = ["type", "wavelengths", "filters", "detector", "resolution", "fov", "maglimit", "targets", "other"];
				$.each(properties, function(k, prop) {
					insthtml += makeProperty(t.nameshort, inst, prop);
				});
				insthtml += "</div>";
				insthtml += makeDetailElems(details, t.nameshort, inst.name);
				$(tselector).append(insthtml);
			});


			// Add collapse button
			let collapsehtml = "<div class=\"telescope-bottom-bar\">" +
				"<button class=\"collapse-button\" onClick=\"collapse('#" + t.nameshort + "')\"></button></div>";
			$(tselector).append(collapsehtml);
		});
	});

	
	// Use this section to override the default format
	$('#VAT').children('.telescope-header').children('h3').append(' (a super cool telescope)');
});


function toggleInst(tab,inst) {
	$(tab).siblings().removeClass("active");
	$(tab).addClass("active");

	var instSibs = $(inst).siblings(".instrument");
	if (instSibs.length > 0) {
		$(instSibs).removeClass("expand").slideUp(200, function() {
			if (!$(inst).hasClass("expand")) {
				$(inst).slideDown(200).addClass("expand").css('display', 'flex');
			} else {
				$(inst).slideUp(200).removeClass("expand");
				$(tab).removeClass("active");
			}
		});
	} else {
		if (!$(inst).hasClass("expand")) {
			$(inst).slideDown(200).addClass("expand").css('display', 'flex');
		} else {
			$(inst).slideUp(200).removeClass("expand");
			$(tab).removeClass("active");
		}
	}
}
function collapse(scope) {
	var tab = $(scope).find(".instrument-button.active");
	var inst = $(scope).children(".instrument.expand");
	toggleInst(tab,inst);
	// $(scope).children(".instrument-bar").children(".instrument-button").removeClass('active');
	// $(scope).children(".instrument").slideUp(200);
}