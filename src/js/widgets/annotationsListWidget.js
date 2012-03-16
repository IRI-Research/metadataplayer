IriSP.AnnotationsListWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.__counter = 0;
  this.__oldList = [];
 
  this.checkOption('ajax_mode');
  this.checkOption('project_url');
  this.checkOption('default_thumbnail');
  this.checkOption("cinecast_version", false);
  var _this = this;
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

IriSP.AnnotationsListWidget.prototype.transformAnnotation = function(a) {
    var _this = this
    return {
        "id" : a.id,
        "title": this.cinecast_version ? IriSP.get_aliased(a.meta, ['creator_name', 'creator']) : a.content.title,
        "desc" : this.cinecast_version ? a.content.data : a.content.description,
        "begin": IriSP.msToTime(a.begin),
        "end" : IriSP.msToTime(a.end),
        "thumbnail" : (typeof a.meta == "object" && typeof a.meta.thumbnail == "string") ? a.meta.thumbnail : this.default_thumbnail,
        "url" : (typeof a.meta == "object" && typeof a.meta.url == "string") ? a.meta.url : null,
        "tags": typeof a.tags == "object"
            ? IriSP.underscore(a.tags)
                .chain()
                .map(function(_t) {
                    if (typeof _t == "string") {
                        return _t.replace(/^.*:/,'#');
                    } else {
                        if (typeof _t['id-ref'] != "undefined") {
                            var _f = IriSP.underscore.find(_this._serializer._data.tags, function(_tag) {
                                return _tag['id-ref'] == _t.id;
                            });
                            if (typeof _f != "undefined") {
                                return IriSP.get_aliased(_f.meta, ['dc:title', 'title']);
                            }
                        }
                    }
                    return null;
                })
                .filter(function(_t) {
                    return _t !== null && _t !== ""
                })
                .value()
            : []
    }    
}

/** draw the annotation list */
IriSP.AnnotationsListWidget.prototype.drawList = function(force_redraw) {
  var _this = this;
  
//  var view_type = this._serializer.getContributions();
  var annotations = this._serializer._data.annotations;
  var currentTime = this._Popcorn.currentTime();
  var list = [];

/*  if (typeof(view_type) === "undefined") {    
    return;
} */
  for (i = 0; i < annotations.length; i++) {
    var obj = this.transformAnnotation(annotations[i]);
    obj.iterator = i;
    obj.distance = Math.abs((annotations[i].end + annotations[i].begin) / 2000 - currentTime);
    list.push(obj);
  }
  
  list = IriSP.underscore(list)
    .chain()
    .sortBy(function(_o) {
        return _o.distance;
    })
    .first(10)
    .sortBy(function(_o) {
        return _o.iterator;
    })
    .value();
  
  var idList = IriSP.underscore.pluck(list, "id").sort();

  
  if (!IriSP.underscore.isEqual(this.__oldList, idList) || typeof(force_redraw) !== "undefined") {
    this.do_redraw(list);
    this.__oldList = idList;
  }
   /* save for next call */
  
  
};

IriSP.AnnotationsListWidget.prototype.ajaxRedraw = function(timecode) {

  /* the seeked signal sometimes passes an argument - depending on if we're using
     our popcorn lookalike or the real thing - if it's the case, use it as it's
     more precise than currentTime which sometimes contains the place we where at */
  if (IriSP.null_or_undefined(timecode) || typeof(timecode) != "number") {
     var tcode = this._Popcorn.currentTime();     
   } else {
     var tcode = timecode;     
  }
   
  
  /* the platform gives us a special url - of the type : http://path/{media}/{begin}/{end}
     we double the braces using regexps and we feed it to mustache to build the correct url
     we have to do that because the platform only knows at run time what view it's displaying.
  */
     
  var platf_url = IriSP.widgetsDefaults["AnnotationsListWidget"].ajax_url
                                      .replace(/\{/g, '{{').replace(/\}/g, '}}');
  var media_id = this._serializer.currentMedia()["id"];
  var duration = this._serializer.getDuration();
  
  var begin_timecode = (Math.floor(tcode) - 300) * 1000;
  if (begin_timecode < 0)
    begin_timecode = 0;
    
  var end_timecode = (Math.floor(tcode) + 300) * 1000;
  if (end_timecode > duration)
    end_timecode = duration;
  
  var templ = Mustache.to_html(platf_url, {media: media_id, begin: begin_timecode,
                                 end: end_timecode});

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
  
  /*
  commented in case we wanted to discriminate against some annotation types.
  var view_types = serializer.getIds("Contributions");
  */
  var l = [];
  
  var media = this._serializer.currentMedia()["id"];
  
  for (i = 0; i < annotations.length; i++) {
    var obj = this.transformAnnotation(annotations[i])

      /* only if the annotation isn't present in the document create an
         external link */
      if (!this.annotations_ids.indexOf(obj["id"]) != -1) {
        // braindead url; jacques didn't want to create a new one in the platform,
        // so we append the cutting id to the url.
        obj["url"] = this.project_url + "/" + media + "/" + 
                     annotation.meta["project"] + "/" +
                     annotation.meta["id-ref"];
        
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
  this.annotations_ids = [];
  
  var annotations = this._serializer._data.annotations;
  var i = 0;
  for(i = 0; i < annotations.length; i++) {
    this.annotations_ids.push(annotations[i]["id"]);
  }
  
  this.drawList();
  
  var _this = this;
    
  if (!this.ajax_mode) {
      var _throttled = IriSP.underscore.throttle(function() {
      _this.drawList();
    }, 1500);
    this._Popcorn.listen("IriSP.createAnnotationWidget.addedAnnotation", _throttled);
    this._Popcorn.listen("timeupdate", _throttled);
  } else {
    /* update the widget when the video has finished loading and when it's seeked and paused */
    this._Popcorn.listen("seeked", IriSP.wrap(this, this.ajaxRedraw));
    this._Popcorn.listen("loadedmetadata", IriSP.wrap(this, this.ajaxRedraw));
    this._Popcorn.listen("paused", IriSP.wrap(this, this.ajaxRedraw));
    
    this._Popcorn.listen("IriSP.createAnnotationWidget.addedAnnotation", IriSP.wrap(this, this.ajaxRedraw));
  }

};