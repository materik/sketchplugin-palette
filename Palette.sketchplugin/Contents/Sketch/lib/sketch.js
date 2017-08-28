
function Sketch(context) {
	this.doc = context.document;
}

Sketch.prototype.addBorderToLayer = function(layer, hex, thickness) {
    var border = layer.style().addStylePartOfType(1);
    border.color = new Color(hex).color
    border.thickness = thickness || 1;
    return layer;
}

Sketch.prototype.addFillToLayer = function(layer, hex) {
    var fill = layer.style().addStylePartOfType(0);
    fill.setFillType(0);
    fill.color = new Color(hex).color
    layer.setName(hex);
    return layer;
}

Sketch.prototype.alert = function(msg) {
    log(msg)
    this.doc.showMessage("🎨: " + msg);
}

Sketch.prototype.cleanPage = function(page) {
    var enumerator = page.artboards().objectEnumerator()
    while (artboard = enumerator.nextObject()) {
        page.removeLayer(artboard);
    }
}

Sketch.prototype.createArtboard = function(page, name, frame) {
	frame = frame || new Frame()

    var artboard = MSArtboardGroup.new();
    artboard.setName(name);
    artboard.frame().setX(frame.x || 0)
    artboard.frame().setY(frame.y || 0)
    artboard.frame().setWidth(frame.width || 1);
    artboard.frame().setHeight(frame.height || 1);
    page.addLayer(artboard);

    return artboard;
}

Sketch.prototype.createLayer = function(artboard, frame, shape) {
    shape.frame().setX(frame.x || 0)
    shape.frame().setY(frame.y || 0)
    shape.frame().setWidth(frame.width || 1)
    shape.frame().setHeight(frame.height || 1)
    var layer = MSShapeGroup.shapeWithPath(shape)
    artboard.addLayer(layer)
    return layer;
}

Sketch.prototype.createOval = function(artboard, frame) {
    return this.createLayer(artboard, frame, MSOvalShape.new())
}

Sketch.prototype.createRectangle = function(artboard, frame) {
    return this.createLayer(artboard, frame, MSRectangleShape.new())
}

Sketch.prototype.createPage = function(name) {
    var page = this.doc.addBlankPage();
    page.setName(name);
    return page;
}

Sketch.prototype.deletePage = function(page) {
    this.alert("Delete page: \"" + page.name() + "\"")

    this.doc.removePage(page)
}

Sketch.prototype.getArtboard = function(page, name) {
    for (var i = 0; i < page.artboards().count(); i++) {
        var artboard = page.artboards().objectAtIndex(i);
        if (artboard.name() == name) {
            return artboard;
        }
    }
}

Sketch.prototype.getOrCreateArtboard = function(page, name) {
    var artboard = this.getArtboard(page, name);
    if (artboard == null) {
        return this.createArtboard(page, name);
    }
    return page;
}

Sketch.prototype.getOrCreatePage = function(name) {
    var page = this.getPage(name);
    if (page == null) {
        return this.createPage(name);
    }
    this.doc.setCurrentPage(page);
    return page;
}

Sketch.prototype.getPage = function(name) {
    for (var i = 0; i < this.doc.pages().count(); i++) {
        var page = this.doc.pages().objectAtIndex(i);
        if (page.name() == name) {
            this.doc.setCurrentPage(page);
            return page;
        }
    }
}
