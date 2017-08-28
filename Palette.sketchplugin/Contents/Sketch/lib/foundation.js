
function Color(hex, color) {
	this.color = color || MSImmutableColor.colorWithSVGString(hex)
	this.hex = hex
}

Color.fromObject = function(object) {
    return new Color("#" + object.immutableModelObject().hexValue(), object);
}

Color.fromObjects = function(objects) {
	return objects.map(function(object) { return Color.fromObject(object) })
}

function Fill(type, colors) {
	this.type = type || -1;
	this.colors = colors || [];
}

Fill.fromObject = function(object) {
	var type = object.fillType()
	if (!object.isEnabled()) {
		log("~ Fill is not enabled")
		return new Fill();
	}
	switch (type) {
		case 0: // Solid
			log("~ Found a solid color")
			return new Fill(type, [object.color()]);
		case 1: // Gradient
			log("~ Found a gradient color")
			var gradient = Gradient.fromObject(object.gradient());
			return new Fill(type, gradient.colors);
		default: // Unknown
			log("~ Found an unknown color (" + type + ")")
			return new Fill(type);
	}
}

Fill.hexes = function(colors) {
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

Frame.prototype.apply = function(object) {
    object.frame().setX(this.x || 0)
    object.frame().setY(this.y || 0)
    object.frame().setWidth(this.width || 1)
    object.frame().setHeight(this.height || 1)
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
