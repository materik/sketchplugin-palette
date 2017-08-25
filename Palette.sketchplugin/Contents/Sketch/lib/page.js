
function Page(context, page) {
    this.context = context;
	this.doc = context.document;
	this.sketch = new Sketch(context);
	
	this.colors = []
    this.name = page.name()
    this.page = page
}

Page.prototype.findFills = function() {
    this.sketch.alert("Finding fills in \"" + this.name + "\"...")

    var layers = this.page.children();
    var objects = layers.valueForKeyPath("@distinctUnionOfObjects.style.fills.color");
    var colors = Util.convertArrayToList(objects);

    this.sketch.alert("Found " + colors.length + " colors in \"" + this.name + "\"...");

    this.colors = colors.map(function(color) { return Color.fromObject(color).hex })
}
