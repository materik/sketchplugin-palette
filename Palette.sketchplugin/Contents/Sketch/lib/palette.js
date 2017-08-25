
function Palette(context, config) {
    this.context = context;
	this.doc = context.document;
	this.sketch = new Sketch(context);

    this.config = config;
    this.page = this.getPalettePage();
}

Palette.prototype.clean = function() {
    this.sketch.cleanPage(this.page);
}

Palette.prototype.createArtboard = function(name) {
    var frame = new Frame(0, 0, this.getX(this.config.maxNumberOfColumns), 0)
   	return this.sketch.createArtboard(this.page, name, frame);
}

Palette.prototype.createColorLayer = function(artboard, hex, frame) {
    var layer = this.sketch.createOval(artboard, frame)
    this.sketch.addBorderToLayer(layer, this.config.border.hex, this.config.border.thickness)
    this.sketch.addFillToLayer(layer, hex)
    return layer
}

Palette.prototype.createColorArtboard = function(page) {
    var artboard = this.createArtboard(page.name);

	var frame = new Frame(0, 0, this.config.size, this.config.size);
    for (var i = 0; i < page.colors.length; i++) {
        frame.x = this.getX(i % this.config.maxNumberOfColumns)
        frame.y = this.getY(Math.floor(i / this.config.maxNumberOfColumns))
        this.createColorLayer(artboard, page.colors[i], frame);
    }
	
	artboard.frame().setHeight(frame.bottom() + this.config.margin)

    return artboard
}

Palette.prototype.createColorArtboards = function() {
    var y = 0

    var pages = this.getAllPages()
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i]
        page.findFills()

        var artboard = this.createColorArtboard(page)
        artboard.frame().setY(y)

        y = Frame.fromObject(artboard).bottom() + this.config.margin
    }
}

Palette.prototype.generate = function() {
    this.sketch.alert("Generate palette...");
   
    this.clean();
    this.createColorArtboards()
}

Palette.prototype.getAllPages = function() {
    var pages = [];
    for (var i = 0; i < this.doc.pages().count(); i++) {
        var page = this.doc.pages().objectAtIndex(i);
        if (page.name().indexOf(this.config.pageName) === -1) {
            pages.push(new Page(this.context, page))
        }
    }
    return pages
}

Palette.prototype.getPalettePage = function() {
    return this.sketch.getOrCreatePage(this.config.pageName);
}

Palette.prototype.getX = function(column) {
	return this.config.margin + column * (this.config.size + this.config.margin);
}

Palette.prototype.getY = function(row) {
	return this.config.margin + row * (this.config.size + this.config.margin);
}
