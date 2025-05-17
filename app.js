function decodeHTMLEntities(str) {
	let txt = document.createElement("textarea");
	txt.innerHTML = str;
	return txt.value;
}
function traverseAndDecode(obj) {
	if (typeof obj === "string") {
		return decodeHTMLEntities(obj);
	} else if (Array.isArray(obj)) {
		return obj.map(traverseAndDecode);
	} else if (obj !== null && typeof obj === "object") {
		let result = {};
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				result[key] = traverseAndDecode(obj[key]);
			}
		}
		return result;
	}
	return obj;
}
function getUnitConversionFactor(str) {
	switch (str) {
		case "nm":
			return 1;
		case "Å":
			return 0.1;
		case "μm":
			return 1000;
		case "′":
			return 60;
		default:
			return 1;
	}
}
function decodeField(field, val) {
	switch (field) {
		case 'resolution':
			val = val.split(', ');
			const physvals = [];
			const specvals = [];
			for (v of val) {
				if (v.includes('R = ')) {
					specvals.push(parseFloat(v.match(/(\d+|\d{1,3}(,\d{3})*)(\.\d+)?/)[0].replace(',','')));
				} else {
					const r = parseFloat(v.match(/(?:\d+\.)?\d+/));
					const u = v.slice(-1);
					physvals.push(getUnitConversionFactor(u)*r);
				}
			}
			return [physvals, specvals];
		case 'fov':
			val = val.split(', ');
			const retval = val.map(v => {
				const fs = v.match(/(?:\d+\.)?\d+/g).map(f => parseFloat(f));
				// assume all units are the same...
				return getUnitConversionFactor(v.slice(-1)) * Math.max(...fs);
			});
			return retval;
		case 'aperture':
			return parseFloat(val.match(/(?:\d+\.)?\d+/));
		default:
			return 1;
	}
}
function extractText(obj) {
	let result = '';

	function recurse(value, key=null) {
		if (typeof value === 'string') {
			result += ' ' + value.toLowerCase();
		} else if (Array.isArray(value)) {
			value.forEach(item => recurse(item, key));
		} else if (value && typeof value === 'object') {
			Object.entries(value).forEach(([k,v]) => {
				if (k != 'instruments') {
					recurse(v,k);
				}
			});
		}
	}

	recurse(obj);
	return result;
}

const app = Vue.createApp({
	data() {
		return {
			telescopes: [], // Holds telescope data
			filters: { // Options to select visible instruments
				types: {
					imager: false,
					spectrograph: false,
					polarimeter: false,
					interferometer: false,
					coronagraph: false,
					mos: false,
					ifs: false,
					fts: false
				},
				wvl: null,
				resolution: {
					physmin: -Infinity,
					physmax: Infinity,
					specmin: -Infinity,
					specmax: Infinity
				},
				fovmin: -Infinity,
				fovmax: Infinity,
				aperturemin: -Infinity,
				aperturemax: Infinity,
				north: false,
				south: false,
				keywords: ''
			}
		};
	},
	mounted() {
		// Fetch JSON data on app initialization
		let telescopes = null;
		fetch('./telescopes.json')
			.then(response => response.json())
			.then(data => {
				// Convert HTML character entities
				this.telescopes = traverseAndDecode(data.telescopes);
			})
			.catch(error => console.error('Error loading JSON:', error));
	},
	computed: {
		activeTypes() {
			const aliasMap = {
				mos: 'multi-object spectrograph',
				ifs: 'integral field spectrograph',
				fts: 'fourier transform spectrograph'
			}
			return Object.entries(this.filters.types)
				.filter(([type, isChecked]) => isChecked)
				.map(([type]) => aliasMap[type] || type);
		},
		filteredTelescopes() {
			return this.telescopes.map(telescope => {
				const filteredInstruments = telescope.instruments.filter(instrument => {
					// Check each filter
					// Instrument type
					const types = this.activeTypes;
					const matchesType = types.length ? types.every(type => instrument.type.toLowerCase().includes(type)) : true;

					// Wavelength range
					const c = getUnitConversionFactor(instrument.wavelengths[2]);
					const matchesWavelength = this.filters.wvl == null ? true : c*instrument.wavelengths[0] < this.filters.wvl &&
						this.filters.wvl < c*instrument.wavelengths[1];

					// Resolution
					const resns = decodeField('resolution', instrument.resolution);
					const matchesPhysRes = resns[0].length > 0 ? resns[0].some(val => this.filters.resolution.physmin < val && val < this.filters.resolution.physmax) : true;
					const matchesSpecRes = resns[1].length > 0 ? resns[1].some(val => this.filters.resolution.specmin < val && val < this.filters.resolution.specmax) : true;
					const matchesResolution = matchesPhysRes && matchesSpecRes;

					// FOV
					const fovs = decodeField('fov', instrument.fov);
					const matchesFOV = fovs.length > 0 ? fovs.some(val => 60*this.filters.fovmin < val && val < 60*this.filters.fovmax) : true;

					// Diameter
					const diam = decodeField('aperture', telescope.primirror);
					const matchesDiam = this.filters.aperturemin < diam && diam < this.filters.aperturemax;

					// Latitude
					const lat = parseFloat(telescope.latitude);
					let matchesLat = true;
					if (this.filters.north || this.filters.south) {
						matchesLat = (lat > 0 && this.filters.north) || (lat < 0 && this.filters.south) || isNaN(lat);
					}

					// Keyword search
					const keywords = this.filters.keywords.split(',')
						.map(k => k.trim().toLowerCase())
						.filter(k => k.length);
					const telstr = extractText(telescope); // only gets text outside of 'instruments'
					const inststr = extractText(instrument);
					const matchesKeywords = keywords.length ? keywords.some(word => telstr.includes(word) || inststr.includes(word)) : true;

					return matchesType && matchesWavelength && matchesResolution && matchesFOV && matchesDiam && matchesLat && matchesKeywords;
				});
				return {...telescope, instruments: filteredInstruments};
			}).filter(telescope => telescope.instruments.length > 0);
		}
	},
	methods: {
		toggleFilters() {
			let $filters = $("#filter-controls");
			let newVisibility = !$filters.is(":visible");
			
			if (newVisibility) {
				$filters.slideDown(200);//css("display", "flex");
			} else {
				$filters.slideUp(200);
			}
		},
		checkEmpty(field, defaultval) {
			const keys = field.split('.');
			const lastKey = keys.pop();
			let obj = this.filters;

			for (const key of keys) { //traverse filters
				obj = obj[keys];
			}

			if (obj[lastKey] === '') obj[lastKey] = defaultval;
		},
		clearFilters() {
			Object.keys(this.filters.types).forEach(v => this.filters.types[v] = false);
			this.filters.wvl = null;
			this.filters.resolution.physmin = -Infinity;
			this.filters.resolution.physmax = Infinity;
			this.filters.resolution.specmin = -Infinity;
			this.filters.resolution.specmax = Infinity;
			this.filters.fovmin = -Infinity;
			this.filters.fovmax = Infinity;
			this.filters.aperturemin = -Infinity;
			this.filters.aperturemax = Infinity;
			this.filters.north = false;
			this.filters.south = false;
			this.filters.keywords = '';
		},
		formatLatitude(lat) {
			// Convert +/- to °N/S
			let retval = "0°";
			if (lat > 0) {
				retval = lat + "°N";
			} else if (lat < 0) {
				retval = lat.slice(1) + "°S";
			}
			return retval;
		},
		toggleInstrument(telescopeId, instrumentId) {
			// Use JQuery because Vue+CSS transitions are a pain and this does what I want
			let $inst = $(`#${telescopeId}-${instrumentId}`);
			let newVisibility = !$inst.is(':visible');
			let $currentInst = $inst.siblings(".instrument").addBack().filter(':visible').first();
			
			// Close any open instruments
			if ($currentInst.length > 0) {
				$currentInst.slideUp(200, function() {
					// Wait before opening the new instrument
					if (newVisibility) {
						$inst.slideDown(200).css('display', 'flex');
					}
				})
			} else {
				$inst.slideDown(200).css('display', 'flex');
			}
		},
		collapse(telescopeId) {
			let $inst = $(`#${telescopeId}`).find('.instrument').filter(':visible').first();
			$inst.slideUp(200);
		},
		useKey(key) {
			if (["name","namelong","firstlight","type","wavelengths","details"].includes(key)) {return false;}
			return true;
		},
		getLabel(key) {
			switch (key) {
				case 'type':
					return 'Instrument type';
				case 'wavelengths':
					return 'Wavelength range';
				case 'fov':
					return 'Field of view';
				case 'maglimit':
					return 'Approx. magnitude limit';
				case 'targets':
					return 'Science use cases';
				case 'other':
					return 'Other details';
				default:
					return key.charAt(0).toUpperCase() + key.slice(1); // capitalize otherwise
			}
		},
		hasDetails(instrument,key) {
			if (!instrument.hasOwnProperty('details')) { return false; }
			return instrument.details.hasOwnProperty(key);
		},
		getInstrumentDetails(instrument) {
			if (!instrument.hasOwnProperty('details')) { return; }
			let details = {};
			Object.keys(instrument.details).forEach(function(k,i) {
				d = instrument.details[k];
				if (!Array.isArray(d[0])) {
					details[k] = d;
				} else {
					d.forEach(function(dd,j) {
						details[k+j] = dd;
					})
				}
			});
			return details;
		},
		handleClick(telescope,instrument,key,subprop=-1) {
			if (!(this.hasDetails(instrument,key) && (subprop>-1 || !Array.isArray(instrument[key])))) { return; } //what a wonderful expression
			// Close open tabs
			$(`#${telescope.nameshort}-${instrument.name} .property-detail`).hide();
			
			// Open correct detail tab
			let id = `#${telescope.nameshort}-${instrument.name}-${key}`;
			if (Array.isArray(instrument[key]) && subprop>-1) { id += subprop; }
			// console.log(id);
			$(id).show();
		},
		getDetailLabel(instrument,key) {
			// Check if the key includes an index (indicating an array)
			const indexMatch = key.match(/(\d+)$/);  // Extract the index at the end of the key string
    
			if (indexMatch) {
			  // key is for a subproperty (array index)
			  const baseKey = key.slice(0, -indexMatch[0].length);  // Remove the index from the key
			  const index = parseInt(indexMatch[0], 10);  // Convert the index to a number
			  const property = instrument[baseKey];
			  
			  if (Array.isArray(property)) {
				return property[index];  // Return the subproperty based on the index
			  }
			}

			// key is not for a subproperty
			return this.getLabel(key);
		}
	}
});

app.directive('clickenter', {
	// Combined click/enter listener
	mounted(el, binding) {
	  const isFocusable = binding.arg === 'focusable'; // Optional condition
	  const handler = (event) => {
		if (event.type === 'click' || event.key === 'Enter') {
		  binding.value(event);
		}
	  };
	  if (isFocusable) {
		el.tabIndex = 0; // Make focusable only if required
	  }
	  el.addEventListener('click', handler);
	  el.addEventListener('keydown', handler);
	  el.__vueClickOrEnterHandler__ = handler; // Store handler for unbinding
	},
	unmounted(el) {
	  const handler = el.__vueClickOrEnterHandler__;
	  el.removeEventListener('click', handler);
	  el.removeEventListener('keydown', handler);
	},
  });

app.mount('#app'); // Mount Vue app to HTML
