IriSP.AnnotationsListWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.__counter = 0;
  this.__oldList = [];
  
  this.ajax_mode = IriSP.widgetsDefaults["AnnotationsListWidget"].ajax_mode;
  this.project_url = IriSP.widgetsDefaults["AnnotationsListWidget"].project_url;  
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
  var media_id = this._serializer.currentMedia()["id"];
  var duration = +this._serializer.currentMedia().meta["dc:duration"];
  
  var begin_timecode = (Math.floor(this._Popcorn.currentTime()) - 300) * 1000;
  if (begin_timecode < 0)
    begin_timecode = 0;
    
  var end_timecode = (Math.floor(this._Popcorn.currentTime()) + 300) * 1000;
  if (end_timecode > duration)
    end_timecode = duration;
  
  var templ = Mustache.to_html("{{pre_url}}/{{media_id}}/{{begin_timecode}}/{{end_timecode}}",
                                {pre_url: pre_url, media_id: media_id, begin_timecode: begin_timecode,
                                 end_timecode: end_timecode});
  
  /* we create on the fly a serializer to get the ajax */
  var serializer = new IriSP.JSONSerializer(IriSP.__dataloader, templ);
  serializer.sync(IriSP.wrap(this, function(json) { this.processJson(json, serializer) }));                  
};

/** process the received json - it's a bit hackish */
IriSP.AnnotationsListWidget.prototype.processJson = function(json, serializer) {
  /* FIXME: DRY the whole thing */
  var annotations = serializer._data.annotations;
  if (IriSP.null_or_undefined(annotations))
    return;
  
  var view_types = serializer.getIds("Contributions");
  var l = [];
  
  var media = this._serializer.currentMedia()["id"];
  
  for (i = 0; i < annotations.length; i++) {
      var annotation = annotations[i];

      /* filter the annotations whose type is not the one we want */
      /* We want _all_ the annotations.
      if (typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
            && !IriSP.underscore.include(view_types, annotation.meta["id-ref"])) {
          continue;
      }
      */
      var a = annotation;
      var obj = {};

      obj["id"] = a.id;
      obj["title"] = a.content.title;
      obj["desc"] = a.content.description;
      obj["begin"] = IriSP.msToTime(annotation.begin);
      obj["end"] = IriSP.msToTime(annotation.end);

      /* only if the annotation isn't present in the document create an
         external link */
      if (!this.annotations_ids.hasOwnProperty(obj["id"])) {
        // braindead url; jacques didn't want to create a new one in the platform,
        // so we append the cutting id to the url.
        obj["url"] = this.project_url + "/" + media + "/" + 
                     annotation.meta["project"] + "/" +
                     annotation.meta["id-ref"] + "/";
        
        // obj["url"] = document.location.href.split("#")[0] + "/" + annotation.meta["project"];
      }
      
      l.push(obj);
  }

  this.do_redraw(l);
};
IriSP.AnnotationsListWidget.prototype.draw = function() {
  
  /* build a table of the annotations present in the document for faster 
     lookup
  */
  this.annotations_ids = {};
  
  var annotations = this._serializer._data.annotations;
  var i = 0;
  for(i = 0; i < annotations.length; i++) {
    this.annotations_ids[annotations[i]["id"]] = 1;
  }
  
  this.drawList();
    
  if (!this.ajax_mode) {    
    this._Popcorn.listen("IriSP.createAnnotationWidget.addedAnnotation", IriSP.wrap(this, function() { this.drawList(true); }));
    this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.redraw));
  } else {
    this._Popcorn.listen("seeked", IriSP.wrap(this, this.ajaxRedraw));
    this._Popcorn.listen("paused", IriSP.wrap(this, this.ajaxRedraw));
  }

};

IriSP.AnnotationsListWidget.prototype.redraw = function() {
  this.drawList();
};