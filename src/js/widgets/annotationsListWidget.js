IriSP.AnnotationsListWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.__counter = 0;
  this.__oldList = [];
  
  this.ajax_mode = IriSP.widgetsDefaults["AnnotationsListWidget"].ajax_mode;
};


IriSP.AnnotationsListWidget.prototype = new IriSP.Widget();

IriSP.AnnotationsListWidget.prototype.clear = function() {
};

IriSP.AnnotationsListWidget.prototype.clearWidget = function() {
};

/** effectively redraw the widget - called by drawList */
IriSP.AnnotationsListWidget.prototype.do_redraw = function(list) {
    var widgetMarkup = IriSP.templToHTML(IriSP.annotationsListWidget_template, {annotations: list});
    this.selector.html(widgetMarkup);
};

/** draw the annotation list */
IriSP.AnnotationsListWidget.prototype.drawList = function(force_redraw) {
  var _this = this;
  
  var view_type = this._serializer.getContributions();
  var annotations = this._serializer._data.annotations;
  var currentTime = this._Popcorn.currentTime();
    
  var list = [];

  if (typeof(view_type) === "undefined") {    
    return;
  }

  for (i = 0; i < annotations.length; i++) {
    var annotation = annotations[i];

    /* filter the annotations whose type is not the one we want */
    if (typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] !== view_type) {
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
  
  var idList = IriSP.underscore.pluck(list, "id").sort();

  if (idList.length !== this.__oldList.length) {
    this.do_redraw(list);
  }
    
  var res = 1;
  for (var i = 0; i < idList.length; i++) {
    if (idList[i] !== this.__oldList[i])
      res = 0;
      break;
  }
  
  this.__oldList = idList; /* save for next call */

  if (typeof(force_redraw) !== "undefined") {
    console.log("forced redraw");
    this.do_redraw(list);
  }
  
  /* the two lists are equal, no need to redraw */
  if (res === 1) {
    return;
  } else {
    this.do_redraw(list);
  }
  
};

IriSP.AnnotationsListWidget.prototype.ajaxRedraw = function(timecode) {
  var pre_url = IriSP.widgetsDefaults["AnnotationsListWidget"].ajax_url;
  var templ = "{{pre_url}}/{{content_id}}/{{begin_timecode}}/{{end_timecode}}/";
};

IriSP.AnnotationsListWidget.prototype.draw = function() {

  this.drawList();
    
  if (!this._ajax_mode) {    
    this._Popcorn.listen("IriSP.createAnnotationWidget.addedAnnotation", IriSP.wrap(this, function() { this.drawList(true); }));
  } else {
    this._Popcorn.listen("IriSP.StackGraphWidget.mouseOver", IriSP.wrap(this, this.ajaxRedraw));
  }
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.redraw));
};

IriSP.AnnotationsListWidget.prototype.redraw = function() {
  this.drawList();
};