IriSP.SegmentsWidget = function(Popcorn, config, Serializer) {

  var self = this;
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.oldSearchMatches = [];

  // event handlers
  this._Popcorn.listen("IriSP.search", function(searchString) { self.searchHandler.call(self, searchString); });
  this._Popcorn.listen("IriSP.search.closed", function() { self.searchFieldClosedHandler.call(self); });
  this._Popcorn.listen("IriSP.search.cleared", function() { self.searchFieldClearedHandler.call(self); });
};

IriSP.SegmentsWidget.prototype = new IriSP.Widget();

/* Get the width of a segment, in pixels. */
IriSP.SegmentsWidget.prototype.segmentToPixel = function(annotation) {  
  var begin = Math.round((+ annotation.begin) / 1000);
  var end = Math.round((+ annotation.end) / 1000);    
  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  
  var startPourcent 	= IriSP.timeToPourcent(begin, duration);
  var startPixel = Math.floor(this.selector.parent().width() * (startPourcent / 100));
  
  var endPourcent 	= Math.floor(IriSP.timeToPourcent(end, duration) - startPourcent);
  var endPixel = Math.floor(this.selector.parent().width() * (endPourcent / 100));
  
  return endPixel;
};

/* compute the total length of a group of segments */
IriSP.SegmentsWidget.prototype.segmentsLength = function(segmentsList) {
  var self = this;
  var total = 0;
  
  for (var i = 0; i < segmentsList.length; i++)
    total += self.segmentToPixel(segmentsList[i].annotation);
  
  return total;  
};

IriSP.SegmentsWidget.prototype.draw = function() {

  var self = this;
  var annotations = this._serializer._data.annotations;

  this.selector.addClass("Ldt-SegmentsWidget");
  this.selector.append(Mustache.to_html(IriSP.overlay_marker_template));
          
  var view_type = this._serializer.getNonTweetIds()[0];    
  
  this.positionMarker = this.selector.children(":first");
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.positionUpdater));
  
  
  var i = 0;
  
  var segments_annotations = [];
  
  for (i = 0; i < annotations.length; i++) {
    var annotation = annotations[i];

    /* filter the annotations whose type is not the one we want */
    if (view_type != "" && typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }

    segments_annotations.push(annotation);
  }
    
  var totalWidth = this.selector.width() - segments_annotations.length;
  var lastSegment = IriSP.underscore.max(segments_annotations, function(annotation) { return annotation.end; });
  
  for (i = 0; i < segments_annotations.length; i++) {
  
    var annotation = segments_annotations[i];
    var begin = (+ annotation.begin);
    var end = (+ annotation.end);
    var duration = this._serializer.currentMedia().meta["dc:duration"];
    var id = annotation.id;
        
    var startPixel = Math.floor(this.selector.parent().width() * (begin / duration));

    var endPixel = Math.floor(this.selector.parent().width() * (end / duration));
    
    if (annotation.id !== lastSegment.id) 
      var pxWidth = endPixel - startPixel -1;
    else
      /* the last segment has no segment following it */
      var pxWidth = endPixel - startPixel;
 
    var divTitle = (annotation.content.title + " - " + annotation.content.description).substr(0,55);

    if (typeof(annotation.content.color) !== "undefined")
      var color = annotation.content.color;
    else
      var color = annotation.color;
    
    var hexa_color = IriSP.DEC_HEXA_COLOR(color);

    if (hexa_color === "FFCC00")
      hexa_color = "333";
    if (hexa_color.length == 4)
      hexa_color = hexa_color + '00';
    
    var annotationTemplate = Mustache.to_html(IriSP.annotation_template,
        {"divTitle" : divTitle, "id" : id, "startPixel" : startPixel,
        "pxWidth" : pxWidth, "hexa_color" : hexa_color,
        "seekPlace" : Math.round(begin/1000)});

        
    this.selector.append(annotationTemplate);
    
    /* add a special class to the last segment and change its border */
    if (annotation.id === lastSegment.id) {
        this.selector.find("#" + id).addClass("Ldt-lastSegment");        
        this.selector.find(".Ldt-lastSegment").css("border-color", "#" + hexa_color);        
    }

    IriSP.jQuery("#" + id).fadeTo(0, 0.3);

    IriSP.jQuery("#" + id).mouseover(
    /* we wrap the handler in another function because js's scoping
       rules are function-based - otherwise, the internal vars like
       divTitle are preserved but they are looked-up from the draw
       method scope, so after that the loop is run, so they're not
       preserved */
    (function(divTitle) { 
     return function(event) {
          IriSP.jQuery(this).animate({opacity: 0.6}, 5);
          var offset = IriSP.jQuery(this).offset();
          var correction = IriSP.jQuery(this).outerWidth() / 2;

          var offset_x = offset.left + correction - 106;
          if (offset_x < 0)
            offset_x = 0;
          
          var offset_y = offset.top;          
          console.log(offset_y);
          self.TooltipWidget.show(divTitle, color, offset_x, offset_y - 160);
    } })(divTitle)).mouseout(function(){
      IriSP.jQuery(this).animate({opacity: 0.3}, 5);
      self.TooltipWidget.hide();
    });

    IriSP.jQuery("#" + id).click(function(_this, annotation) {
                                    return function() { _this.clickHandler(annotation)};
                                 }(this, annotation));
  }
};

/* restores the view after a search */
IriSP.SegmentsWidget.prototype.clear = function() {
  this.selector.children(".Ldt-iri-chapter").animate({opacity:0.3}, 100);
};

IriSP.SegmentsWidget.prototype.clickHandler = function(annotation) {
  this._Popcorn.trigger("IriSP.SegmentsWidget.click", annotation.id);
  var begin = (+ annotation.begin) / 1000;
  this._Popcorn.currentTime(Math.round(begin));
};

IriSP.SegmentsWidget.prototype.searchHandler = function(searchString) {

  if (searchString == "")
    return;

  var matches = this._serializer.searchOccurences(searchString);

  if (IriSP.countProperties(matches) > 0) {
    this._Popcorn.trigger("IriSP.search.matchFound");
  } else {
    this._Popcorn.trigger("IriSP.search.noMatchFound");
  }

  // un-highlight all the blocks
  this.selector.children(".Ldt-iri-chapter").css("opacity", 0.1);
 
  // then highlight the ones with matches.
  for (var id in matches) {
    var factor = 0.5 + matches[id] * 0.2;
    this.selector.find("#"+id).dequeue();
    this.selector.find("#"+id).animate({opacity:factor}, 200);
  }

 
  this.oldSearchMatches = matches;
};

IriSP.SegmentsWidget.prototype.searchFieldClearedHandler = function() {
  this.clear();
};

IriSP.SegmentsWidget.prototype.searchFieldClosedHandler = function() {
  this.clear();
};

IriSP.SegmentsWidget.prototype.positionUpdater = function() {  
  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var time = this._Popcorn.currentTime();
  //var position 	= ((time / duration) * 100).toFixed(2);
  var position 	= ((time / duration) * 100).toFixed(2);

  this.positionMarker.css("left", position + "%");  
};
