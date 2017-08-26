
function Page(context, page) {
    this.context = context;
	this.doc = context.document;
	this.sketch = new Sketch(context);

	this.colors = []
    this.fills = []
    this.name = page.name()
    this.page = page
}

Page.prototype.findColors = function() {
    this.sketch.alert("Finding colors in \"" + this.name + "\"...")

    var fills = this.findFills()

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

Page.prototype.findFills = function() {
    this.sketch.alert("Finding fills in \"" + this.name + "\"...")

    var layers = this.page.children();
    var objects = layers.valueForKeyPath("@distinctUnionOfObjects.style.fills");
    var fills = Util.convertArrayToList(objects);

    this.fills = fills.map(function(fill) { return Fill.fromObject(fill) })
    this.sketch.alert("Found " + this.fills.length + " fills in \"" + this.name + "\"...");

    return this.fills
}
