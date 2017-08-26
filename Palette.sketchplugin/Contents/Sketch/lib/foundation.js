
function Color(hex, color) {
	this.color = color || MSImmutableColor.colorWithSVGString(hex)
	this.hex = hex
}

Color.fromObject = function(object) {
    return new Color("#" + object.immutableModelObject().hexValue(), object);
}

function Fill(type, colors) {
	this.type = type
	this.colors = colors
}

Fill.fromObject = function(object) {
	var type = object.fillType()
	switch (type) {
		case 0: // Solid
			return new Fill(type, [object.color()]);
		case 1: // Gradient
			var gradient = Gradient.fromObject(object.gradient());
			return new Fill(type, gradient.colors);
		default: // Unknown
			return new Fill(-1, []);
	}
}

Fill.prototype.hexes = function() {
	return this.colors.map(function(object) { return Color.fromObject(object).hex })
}

function Frame(x, y, width, height) {
	this.x = x
	this.y = y
	this.width = width
	this.height = height
}

Frame.fromObject = function(object) {
    var frame = object.frame();
    return new Frame(frame.x(), frame.y(), frame.width(), frame.height());
}

Frame.prototype.bottom = function() {
	return this.y + this.height
}

Frame.prototype.right = function() {
	return this.x + this.width
}

function Gradient(colors) {
	this.colors = colors
}

Gradient.fromObject = function(object) {
	var stops = Util.convertArrayToList(object.stops());
	var colors = stops.map(function(stop) { return stop.color() })
	return new Gradient(colors);
}
