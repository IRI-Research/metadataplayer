IriSP.AnnotationsListWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};


IriSP.AnnotationsListWidget.prototype = new IriSP.Widget();

IriSP.AnnotationsListWidget.prototype.clear = function() {
};

IriSP.AnnotationsListWidget.prototype.clearWidget = function() {
};

/** draw the annotation list */
IriSP.AnnotationsListWidget.prototype.drawList = function() {
  var _this = this;

  var view_type = this._serializer.getContributions();
  var annotations = this._serializer._data.annotations;
  var currentTime = this._Popcorn.currentTime();
  
  /* happens when the player hasn't yet loaded */
  if (typeof(currentTime) === "undefined") {
    window.setTimeout(IriSP.wrap(this, this.drawList), 4000);
    return;
  }
  
  var list = [];

  if (typeof(view_type) === "undefined") {
    console.log("no type suitable for display");
    return;
  }

  for (i = 0; i < annotations.length; i++) {
    var annotation = annotations[i];

    /* filter the annotations whose type is not the one we want */
    if (typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }

    /* only get the annotations happening in the current chapter */
    if (!(annotation.begin <= currentTime * 1000 && annotation.end > currentTime * 1000)) {        
        continue;
    }

    var a = annotation;
    var obj = {};

    obj["id"] = a.id;
    obj["title"] = a.content.title;
    obj["desc"] = a.content.description;
    obj["begin"] = IriSP.msToTime(annotation.begin);
    obj["end"] = IriSP.msToTime(annotation.end);

    list.push(obj);
  }

  var widgetMarkup = IriSP.templToHTML(IriSP.annotationsListWidget_template, {annotations: list});
  this.selector.html(widgetMarkup);
};

IriSP.AnnotationsListWidget.prototype.draw = function() {

  this.drawList();
  this._Popcorn.listen("IriSP.createAnnotationWidget.addedAnnotation", IriSP.wrap(this, this.redraw));
  this._Popcorn.listen("seeked", IriSP.wrap(this, this.redraw));
};

IriSP.AnnotationsListWidget.prototype.redraw = function() {
  this.drawList();
};