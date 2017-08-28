
function Palette(context, config) {
    this.config = config;

    this.context = context;
    this.doc = context.document;
	this.sketch = new Sketch(context);

    this._palettePage = this._getPalettePage();
    this._replaceArtboard = this._getReplaceArtboard()
    this._replaceColor1 = "#000000";
    this._replaceColor2 = "#000000";
}

Palette.prototype.generate = function() {
    this.sketch.alert("Generate palette...");
   
    this._clean()
    this._createColorsArtboards()

    this.sketch.alert("Done generating palette...");
}

Palette.prototype.replace = function() {
    this.sketch.alert("Replace palette...");

    this._findReplaceColors();
    this._replaceColors(this._replaceColor1, this._replaceColor2)
    this.generate()

    this.sketch.alert("Done replacing palette...");
}

Palette.prototype._clean = function() {
    this.sketch.alert("Cleaning up palette...");

    this._findReplaceColors();
    this._recreatePelettePage();
    this._createReplaceArtboard();
}

Palette.prototype._createColorLayer = function(artboard, hex, frame) {
    this.sketch.alert("Creating color layer: " + hex);

    var layer = this.sketch.createOval(artboard, frame)
    this.sketch.addBorderToLayer(layer, this.config.border.hex, this.config.border.thickness)
    this.sketch.addFillToLayer(layer, hex)
    return layer
}

Palette.prototype._createColorsArtboard = function(config) {
    var frame = new Frame(0, 0, this.config.getOffset(this.config.maxNumberOfColumns), 0)
    var artboard = this.sketch.createArtboard(this._palettePage, config.name, frame);

	var frame = new Frame();
    for (var i = 0; i < config.colors.length; i++) {
        frame = this._getColorLayerFrame(i)
        this._createColorLayer(artboard, config.colors[i], frame);
    }
	
	artboard.frame().setHeight(frame.bottom() + this.config.margin)

    return artboard
}

Palette.prototype._createColorsArtboards = function() {
    this.sketch.alert("Creating colors artboards...");

    var y = 0

    var artboards = this._getColorArtboards()
    for (var i = 0; i < artboards.length; i++) {
        var artboard = this._createColorsArtboard(artboards[i])
        artboard.frame().setY(y)

        y = Frame.fromObject(artboard).bottom() + this.config.margin
    }
}

Palette.prototype._createReplaceArtboard = function() {
    this.sketch.alert("Creating replace artboard...");

    var artboard = this.sketch.getOrCreateArtboard(this._palettePage, this.config.artboardNames.replace);
    new Frame(
        this.config.getOffset(this.config.maxNumberOfColumns) + this.config.margin, 
        0, 
        this.config.getOffset(2),
        this.config.getOffset(1)
    ).apply(artboard);

    this._createColorLayer(artboard, this._replaceColor1, this._getColorLayerFrame(0))
    this._createColorLayer(artboard, this._replaceColor2, this._getColorLayerFrame(1))

    return artboard
}

Palette.prototype._findAllColors = function(pages) {
    this.sketch.alert("Finding colors in document...")

    var colors = []

    for (var i = 0; i < pages.length; i++) {
        var page = pages[i]
        var hexes = page.findColors()
        for (var j = 0; j < hexes.length; j++) {
            colors.push(hexes[j])
        }
    }

    var colors = Util.unique(colors);
    this.sketch.alert("Found " + colors.length + " colors in document...");

    return colors
}

Palette.prototype._findReplaceColors = function() {
    if (this._replaceArtboard == null) {
        return
    }

    this.sketch.alert("Finding replace colors...");

    var layers = this._replaceArtboard.children();
    var objects = layers.valueForKeyPath("@distinctUnionOfObjects.style.fills");
    var fills = Util.convertArrayToList(objects);
    fills = fills.map(function(fill) { return Fill.fromObject(fill) })

    if (fills.length == 2) {
        this._replaceColor1 = fills[0].hexes()[0] || "#000000"
        this._replaceColor2 = fills[1].hexes()[0] || "#000000"

        this.sketch.alert("Found replace colors: " + this._replaceColor1 + ", " + this._replaceColor2);
    }
}

Palette.prototype._getAllPages = function() {
    this.sketch.alert("Getting all pages...");

    var pages = [];
    for (var i = 0; i < this.doc.pages().count(); i++) {
        var page = this.doc.pages().objectAtIndex(i);
        if (page.name().indexOf(this.config.pageName) === -1) {
            pages.push(new Page(this.context, page))
        }
    }

    return pages
}

Palette.prototype._getColorArtboards = function() {
    var pages = this._getAllPages();

    var artboards = pages
    artboards.unshift({
        name: this.config.artboardNames.colors,
        colors: this._findAllColors(pages),
    });

    return artboards;
}

Palette.prototype._getColorLayerFrame = function(index) {
    return new Frame(
        this.config.getOffset(index % this.config.maxNumberOfColumns), 
        this.config.getOffset(Math.floor(index / this.config.maxNumberOfColumns)), 
        this.config.size,
        this.config.size
    );
}

Palette.prototype._getPalettePage = function() {
    return this.sketch.getOrCreatePage(this.config.pageName);
}

Palette.prototype._getReplaceArtboard = function() {
    return this.sketch.getArtboard(this._palettePage, this.config.artboardNames.replace)
}

Palette.prototype._recreatePelettePage = function() {
    this.sketch.alert("Recreating palette page...");

    this.sketch.deletePage(this._palettePage)
    this._palettePage = this._getPalettePage()
}

Palette.prototype._replaceColors = function(fromColor, toColor) {
    var pages = this._getAllPages();

    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        page.replaceColors(fromColor, toColor);
    }
}
