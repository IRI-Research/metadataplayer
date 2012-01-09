IriSP.AnnotationsListWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};


IriSP.AnnotationsListWidget.prototype = new IriSP.Widget();

IriSP.AnnotationsListWidget.prototype.clear = function() {
};

IriSP.AnnotationsListWidget.prototype.clearWidget = function() {
};

IriSP.AnnotationsListWidget.prototype.draw = function() {
  var _this = this;

  var view_type = this._serializer.getContributions();
  var annotations = this._serializer._data.annotations;
  var list = [];

  if (typeof(view_type) === "undefined") {
    console.log("not type suitable for display");
    return;
  }

  for (i = 0; i < annotations.length; i++) {
    var annotation = annotations[i];

    /* filter the annotations whose type is not the one we want */
    if (typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }

    var a = annotation;
    var obj = {};

    obj["id"] = a.id;
    obj["title"] = a.content.title;
    obj["desc"] = a.content.description;
    obj["begin"] = IriSP.msToTime(a.begin);
    obj["end"] = IriSP.msToTime(a.end);

    list.push(obj);
  }

  var widgetMarkup = IriSP.templToHTML(IriSP.annotationsListWidget_template, {annotations: list});
  this.selector.append(widgetMarkup);
};