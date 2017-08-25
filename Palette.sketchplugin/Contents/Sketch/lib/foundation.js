
function Color(hex) {
	this.color = MSImmutableColor.colorWithSVGString(hex)
	this.hex = hex
}

Color.fromObject = function(object) {
    return new Color("#" + object.NSColorWithColorSpace(nil).hexValue());
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
