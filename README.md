Insert your telescope/instrument into the `telescopes.json` file using the template below. Please insert telescopes in alphabetical order.

Template for telescope

		{
			"name": "James Webb Space Telescope",
			"nameshort": "JWST - no spaces, used for HTML linking",
			"location": "L2 - where the telescope is",
			"primirror": "6.5 m - diameter of primary mirror",
			"image": "img/relative-image-path.png",
			"website": "https://webb.nasa.gov/",
			"etc": "https://link.to/exposure-time-calculator",
			"instruments" : [
				{
					"name": "MIRI - short name, often an abbreviation",
					"namelong": "Mid-Infrared Instrument - full name",
					"type": "Imager, spectrograph, coronagraph - what sort of instrument it is",
					"wavelengths": "4.9&ndash;27.9 &mu;m - wavelength range of instrument",
					"resolution": "0.11&rdquo; - on-sky or spectral resolution",
					"fov": "1.2&rsquo; x 1.9&rsquo; - field of view",
					"targets": "Galaxies - use cases for instrument (will add way to link references)",
					"firstlight": "2022 - when the instrument first came online"
				},
				{
					"name": "..."
				}
			]
		}
