
function Page(context, page) {
    this.context = context;
	this.doc = context.document;
	this.sketch = new Sketch(context);

	this.colors = []
    this.name = page.name()
    this._page = page
}

Page.prototype.findColors = function() {
    this.sketch.alert("Finding colors in \"" + this.name + "\"...")

    var fills = this._find("fills")
    fills = fills.concat(this._find("borders"))

    for (var i = 0; i < fills.length; i++) {
        var hexes = fills[i].hexes()
        for (var j = 0; j < hexes.length; j++) {
            this.colors.push(hexes[j])
        }
    }

    this.colors = Util.unique(this.colors);
    this.sketch.alert("Found " + this.colors.length + " colors in \"" + this.name + "\"...");

    return this.colors
}

Page.prototype.replaceColors = function(fromColor, toColor) {
    this.sketch.alert("Replacing colors in \"" + this.name + "\"...")

    var fills = this.__find("fills")
    fills = fills.concat(this.__find("borders"))

    for (var i = 0; i < fills.length; i++) {
        var fill = fills[i];
        Fill.replace(fill, fromColor, toColor);
    }
}

Page.prototype._find = function(keyword) {
    this.sketch.alert("Finding " + keyword + " in \"" + this.name + "\"...")

    var fills = this.__find(keyword)
    fills = fills.map(function(fill) { return Fill.fromObject(fill) })

    this.sketch.alert("Found " + fills.length + " " + keyword + " in \"" + this.name + "\"...");

    return fills
}

Page.prototype.__find = function(keyword) {
    var layers = this._page.children();
    var objects = layers.valueForKeyPath("@distinctUnionOfObjects.style." + keyword);
    return Util.convertArrayToList(objects);
}
