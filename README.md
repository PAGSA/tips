# TIPs &mdash; Telescopes, Instruments, and Purposes

Link to website: <a href="https://pagsa.github.io/tips">https://pagsa.github.io/tips</a>

The goal of TIPs is to provide a cheatsheet for new astronomers to get a feel for what telescopes exist, the differences between them, and what they tend to be used for. TIPs is a collaborative effort, so if you are very familiar with a particular telescope or instrument, please contribute your knowledge!

## Instructions for contributing:

The website parses a single JSON file to display which contains the information for each telescope. Contributions can be made by adding your telescope/instrument to this file. To do this:

1. Fork this repository to your own account.

2. Insert your telescope/instrument into the `telescopes.json` file, in alphabetical order. Detailed instructions are below.

3. If you have an image, copy it to the `img/` subdirectory.

4. Create a pull request on Github with your changes.

## Detailed JSON instructions

<i>This format is still in progress. Please be alert for updates.</i>

The JSON file is structured as an array `[]` of telescope objects `{}`, each containing their own properties and sub-objects. Only the properties defined below are used on the website, although more properties are planned. If certain properties do not apply to your telescope, do not include them, as opposed to leaving a blank entry.

<i>Telescope object:</i>

&nbsp;&nbsp;`"name"`: Full name of the telescope.<br>
&nbsp;&nbsp;`"nameshort"`: Shortened name of the telescope &mdash; no spaces, used for HTML linking.<br>
&nbsp;&nbsp;`"location"`: Where the telescope is. Typically the mountain or city, state/province, and country are sufficient. If in space, describe the orbit. Examples: Mauna Kea, HI, USA; Cerro Pach&oacute;n, Chile; L2; Low Earth orbit at 540 km; Elliptical high Earth orbit between 16,000 km and 139,000 km.<br>
&nbsp;&nbsp;`"altitude"`: For ground-based telescopes, the altitude in km. If space-based, do not include this line.<br>
&nbsp;&nbsp;`"primirror"`: Effective diameter of the primary mirror, or effective aperture.<br>
&nbsp;&nbsp;`"image"`: The path to an image of the telescope (beginning with `img/`).<br>
&nbsp;&nbsp;`"website"`: Link to the main website for the telescope. If there are multiple, choose the one most directed toward astronomers.<br>
&nbsp;&nbsp;`"etc"`: Link to an exposure time calculator for the telescope.<br>
&nbsp;&nbsp;`"instruments"`: An array of objects, each containing one instrument used on the telescope.

<i>Instrument object:</i>

&nbsp;&nbsp;`"name"`: Short, common name of the instrument, often an abbreviation.<br>
&nbsp;&nbsp;`"namelong"`: Full, unabbreviated name of the instrument.<br>
&nbsp;&nbsp;`"firstlight"`: Year of first light of the instrument.
&nbsp;&nbsp;`"type"`: What sort of instrument it is (e.g., imager, spectrograph, coronagraph). Multiple categories can apply.<br>
&nbsp;&nbsp;`"wavelengths"`: The full wavelength range of the instrument, spanning all filters.<br>
&nbsp;&nbsp;`"filters"`: Available filters.<br>
&nbsp;&nbsp;`"detector"`: Type & size of the detector(s).<br>
&nbsp;&nbsp;`"resolution"`: On-sky or spectral resolution, or both, depending on the type of instrument.<br>
&nbsp;&nbsp;`"fov"`: Field of view.<br>
&nbsp;&nbsp;`"maglimit"`: Approximate sensitivity limit of targets.<br>
&nbsp;&nbsp;`"targets"`: Typical targets and science uses for the instrument.<br>
&nbsp;&nbsp;`"details"`: 

### Template for a telescope object:

```
{
	"name": "James Webb Space Telescope",
	"nameshort": "JWST",
	"location": "L2",
	"primirror": "6.5 m",
	"image": "img/relative-image-path.png",
	"website": "https://webb.nasa.gov/",
	"etc": "https://link.to/exposure-time-calculator",
	"instruments" : [
		{
			"name": "MIRI",
			"namelong": "Mid-Infrared Instrument",
			"firstlight": "2022",
			"type": "Imager, spectrograph, coronagraph",
			"wavelengths": "4.9&ndash;27.9 &mu;m",
			"filters": "9 broadband filters",
			"detector": "3 1024 x 1024 Si:As IBC detectors",
			"resolution": "0.11&rdquo;",
			"fov": "1.2&rsquo; x 1.9&rsquo;",
			"maglimit": "",
			"targets": ["High-redshift galaxies", "Other objects"],
			"details": {
				"filters": ["F560W, F770W, F1000W, F1130W, F1280W, F1500W, F1800W, F2100W, F2550W"],
				"detector": ["Raytheon Vision Systems (RVS) Impurity Band Conduction (IBC)", "25 &mu;m pixel pitch"],
				"other": ["Other details which may be important, such as observing modes", "Even more details"]
			}
		},
		{
			"name": "..."
		}
	]
}
```

### Planned features

<ul>
	<li>Science use cases &mdash; examples of research which use this instrument</li>
	<li>Detector &mdash; type and details of instrument's detector(s)</li>
	<li>Observation limits &mdash; area of sky, limiting magnitudes, etc.</li>
	<li>Observer requirements &mdash; nationality, member of collaboration, proposal process, etc.</li>
	<li>Filter response curves</li>
	<li>Glossary</li>
</ul>