
@import 'lib/foundation.js';
@import 'lib/page.js';
@import 'lib/palette.js';
@import 'lib/sketch.js';
@import 'lib/util.js';

var config = {

	border: {
		hex: "#EBF5DF",
		thickness: 5,
	},
	margin: 20,
	size: 100,
	pageName: "🎨",
	maxNumberOfColumns: 3,
	artboardNames: {
		colors: "🎨 (^⌘S)",
		replace: "↔️ (^⌘R)",
	},

	getOffset: function(index) {
    	return config.margin + index * (config.size + config.margin);
	},
	
}

var generatePalette = function(context) {
	var palette = new Palette(context, config);
	palette.generate();
}

var replacePalette = function(context) {
	var palette = new Palette(context, config);
	palette.replace();
}
