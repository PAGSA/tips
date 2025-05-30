# TIPs &mdash; Telescopes, Instruments, and Purposes

Link to website: <a href="https://pagsa.github.io/tips">https://pagsa.github.io/tips</a>

The goal of TIPs is to provide a cheatsheet for new astronomers to get a feel for what telescopes exist, the differences between them, and what they tend to be used for. TIPs is a collaborative effort, so if you are very familiar with a particular telescope or instrument, please contribute your knowledge!

## Instructions for contributing:

The website parses a single JSON file to display which contains the information for each telescope. Contributions can be made by adding your telescope/instrument to this file. To do this:

1. Fork this repository to your own account.

2. Insert your telescope/instrument into the `telescopes.json` file, in alphabetical order. Detailed instructions are below.

3. If you have an image, copy it to the `img/` subdirectory.

4. Create a pull request on Github with your changes.

You can preview the changes you make by running a local web server from your TIPs directory. This can be done automatically in VS Code using the <a href="https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server">Live Server</a> plugin, or with Python by running `python -m http.server` from your TIPs directory in a terminal, then navigating to `localhost:[port]` in your web browser using the port number returned by the command.

## Detailed JSON instructions

<i>This format is still in progress. Please be alert for updates.</i>

The JSON file is structured as an array `[]` of telescope objects `{}`, each containing their own properties and sub-objects. Only the properties defined below are used on the website, although more properties are planned. If certain properties do not apply to your telescope, do not include them, as opposed to leaving a blank entry.

<i>Telescope object:</i>

&nbsp;&nbsp;`"name"`: Full name of the telescope.<br>
&nbsp;&nbsp;`"nameshort"`: Shortened name of the telescope &mdash; no spaces, used for HTML linking.<br>
&nbsp;&nbsp;`"location"`: Where the telescope is. Examples: Mauna Kea, HI, USA; Cerro Pach&oacute;n, Chile; L2; Low Earth orbit at 540 km; Elliptical high Earth orbit between 16,000 km and 139,000 km.<br>
&nbsp;&nbsp;`"altitude"`: For ground-based telescopes, the altitude in m. If space-based, omit.<br>
&nbsp;&nbsp;`"latitude"`: For ground-based telescopes, the latitude in (+/-) degrees. If space-based, omit.<br>
&nbsp;&nbsp;`"primirror"`: Effective diameter of the primary mirror, or effective aperture.<br>
&nbsp;&nbsp;`"image"`: The local path to an image of the telescope (beginning with `img/`). Please only add images which you have the rights to use.<br>
&nbsp;&nbsp;`"imcredit"`: The owner(s) of the image.<br>
&nbsp;&nbsp;`"website"`: Link to the main website for the telescope. If there are multiple, choose the one most directed toward astronomers.<br>
&nbsp;&nbsp;`"etc"`: Link to an exposure time calculator for the telescope.<br>
&nbsp;&nbsp;`"restrictions"`: Any restrictions the telescope has on observing proposals. This can be an `"affiliation"` such as university or nationality, or a `"general"` restriction such as "does not accept proposals".<br>
&nbsp;&nbsp;`"instruments"`: An array of objects, each containing one instrument used on the telescope.

<i>Instrument object:</i>

&nbsp;&nbsp;`"name"`: Short, common name of the instrument, often an abbreviation.<br>
&nbsp;&nbsp;`"namelong"`: Full, unabbreviated name of the instrument.<br>
&nbsp;&nbsp;`"firstlight"`: Year of first light of the instrument.<br>
&nbsp;&nbsp;`"type"`: What sort of instrument it is (e.g., imager, spectrograph, coronagraph). Multiple categories can apply.<br>
&nbsp;&nbsp;`"wavelengths"`: The full wavelength range of the instrument, spanning all filters. Formatted as an array of `[{min}, {max}, "{unit}"]`.<br>
&nbsp;&nbsp;`"filters"`: Available filters.<br>
&nbsp;&nbsp;`"detector"`: Type & size of the detector(s).<br>
&nbsp;&nbsp;`"resolution"`: On-sky or spectral resolution, or both, depending on the type of instrument.<br>
&nbsp;&nbsp;`"fov"`: Field of view.<br>
&nbsp;&nbsp;`"maglimit"`: Approximate sensitivity limit of targets.<br>
&nbsp;&nbsp;`"targets"`: Typical targets and science uses for the instrument.<br>
&nbsp;&nbsp;`"details"`: For categories requiring further explanation, `"details"` contains additional details for any category specified. Individual details for each category are listed in an array (new line for each item) and can be HTML-formatted.

### Template for a telescope object:

```
{
	"name": "James Webb Space Telescope",
	"nameshort": "JWST",
	"location": "L2",
	"primirror": "6.5 m",
	"image": "img/relative-image-path.png",
	"imcredit": "Owner(s) of the image",
	"website": "https://link.to/telescope-website",
	"etc": "https://link.to/exposure-time-calculator",
	"restrictions": {
		"affiliation": ["Canada", "University of Astronomy", "etc."],
		"general": "Other restrictions on applying for and using the telescope"
	},
	"instruments" : [
		{
			"name": "MIRI",
			"namelong": "Mid-Infrared Instrument",
			"firstlight": "2022",
			"type": "Imager, spectrograph, coronagraph, integral field spectrograph",
			"wavelengths": [4.9, 27.9, "&mu;m"],
			"filters": ["9 broadband filters", "4 coronographic filters"],
			"detector": "3 1024 x 1024 Si:As IBC detectors",
			"resolution": "0.11&Prime;",
			"fov": "1.2&prime; x 1.9&prime;",
			"maglimit": "approximate limiting magnitude for instrument",
			"targets": ["High-redshift galaxies", "Other objects"],
			"details": {
				"filters": [["F560W: 4.9&ndash;6.4 &mu;m", "F770W", "F1000W", "F1130W", "F1280W", "F1500W", "F1800W", "F2100W", "F2550W"],
							["F1065C (4QPM)", "F1140C (4QPM)", "F1550C (4QPM)", "F2300C (Lyot)"]],
				"detector": ["Raytheon Vision Systems (RVS) Impurity Band Conduction (IBC)", "25 &mu;m pixel pitch"],
				"targets": [["<a href="link.to/paper">Author+25</a>: One-line description of science", "another paper"],
					["Papers for the next science use case..."]]
				"other": ["Other details which may be important, such as observing modes",
						  "Surveys which use this instrument",
						  "Even more details"]
			}
		},
		{
			"name": "..."
		}
	]
}
```

Pull requests will be edited for formatting before merging, but please try to follow the template as closely as possible. If you are unsure on how an entry should be formatted, feel free to make a comment in the PR or email tgrosson [AT] uvic.ca.

### Planned features

<ul>
	<li>Radio telescope compatibility</li>
	<li>Improved mobile formatting</li>
	<li>Glossary</li>
</ul>
