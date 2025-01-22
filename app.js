const app = Vue.createApp({
	data() {
		return {
			telescopes: [], // Holds telescope data
			visibleInstruments: {} // Tracks visible instruments
		};
	},
	mounted() {
		// Fetch JSON data on app initialization
		fetch('./telescopes.json')
			.then(response => response.json())
			.then(data => {
				this.telescopes = data.telescopes;
			})
			.catch(error => console.error('Error loading JSON:', error));
	},
	methods: {
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
			if (["name","namelong","firstlight","type","details"].includes(key)) {return false;}
			return true;
		},
		getLabel(key) {
			switch (key) {
				case 'wavelengths':
					return 'Wavelength range';
				case 'fov':
					return 'Field of view';
				case 'maglimit':
					return 'Magnitude limit';
				case 'targets':
					return 'Science targets';
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
			return instrument[key];
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
