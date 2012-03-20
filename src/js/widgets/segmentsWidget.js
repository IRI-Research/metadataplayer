IriSP.SegmentsWidget = function(Popcorn, config, Serializer) {

  var self = this;
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.oldSearchMatches = [];

  // event handlers
  this._Popcorn.listen("IriSP.search", function(searchString) { self.searchHandler.call(self, searchString); });
  this._Popcorn.listen("IriSP.search.closed", function() { self.searchFieldClosedHandler.call(self); });
  this._Popcorn.listen("IriSP.search.cleared", function() { self.searchFieldClearedHandler.call(self); });
  
  this.checkOption("cinecast_version");
  this.defaultColors = ["#1f77b4","#aec7e8","#ff7f0e","#ffbb78","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5","#8c564b","#c49c94","#e377c2","#f7b6d2","#7f7f7f","#c7c7c7","#bcbd22","#dbdb8d","#17becf","#9edae5"]
};

IriSP.SegmentsWidget.prototype = new IriSP.Widget();

IriSP.SegmentsWidget.prototype.draw = function() {

  var self = this;
  var annotations = this._serializer._data.annotations;

  this.selector.addClass("Ldt-SegmentsWidget");
  this.selector.append(Mustache.to_html(IriSP.overlay_marker_template));
  
  this.positionMarker = this.selector.find(".Ldt-SegmentPositionMarker");
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.positionUpdater));
  var duration = this._serializer.getDuration();
  
  if (this.cinecast_version) {
      var segments_annotations = IriSP.underscore.filter(
          this._serializer._data.annotations,
          function(_a) {
              return _a.type == "cinecast:MovieExtract";
          }
      );
  }
  else {

      var view_type = this._serializer.getChapitrage();
      if (typeof(view_type) === "undefined") {
        view_type = this._serializer.getNonTweetIds()[0];  
      }
    
      
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
}    
    var _w = this.selector.width();
  var lastSegment = IriSP.underscore.max(segments_annotations, function(annotation) { return annotation.end; });
  
  for (i = 0; i < segments_annotations.length; i++) {
  
    var annotation = segments_annotations[i];
    var begin = (+ annotation.begin);
    var end = (+ annotation.end);
    var id = annotation.id;
        
    var startPixel = Math.floor(_w * (begin / duration));

    var endPixel = Math.floor(_w * (end / duration));
    if (annotation.id !== lastSegment.id) 
      var pxWidth = endPixel - startPixel -1;
    else
      /* the last segment has no segment following it */
      var pxWidth = endPixel - startPixel;
    
    var divTitle = this.cinecast_version
        ? annotation.content.data
        : IriSP.clean_substr(annotation.content.title + " -<br>" + annotation.content.description, 0, 132) + "...";
    
    var hexa_color = typeof(annotation.content.color) !== "undefined"
        ? '#' + IriSP.DEC_HEXA_COLOR(annotation.content.color)
        : typeof(annotation.color) !== "undefined"
            ? '#' + IriSP.DEC_HEXA_COLOR(annotation.color)
            : this.defaultColors[i % this.defaultColors.length];

    /*
    if (hexa_color === "FFCC00")
      hexa_color = "333";
    */
    if (hexa_color.length == 5)
      hexa_color = hexa_color + '00';
    
    
    var annotationTemplate = Mustache.to_html(IriSP.annotation_template,
        {"divTitle" : divTitle, "id" : id, "startPixel" : startPixel,
        "pxWidth" : pxWidth, "hexa_color" : hexa_color,
        "seekPlace" : Math.round(begin/1000)});

        
    this.selector.append(annotationTemplate);
    
    /* add a special class to the last segment and change its border */
    if (annotation.id === lastSegment.id) {
        IriSP.jqId(id).addClass("Ldt-lastSegment").css("border-color", hexa_color);  
    }
   }
    // react to mediafragment messages.
    this._Popcorn.listen("IriSP.Mediafragment.showAnnotation", 
        function(id, divTitle) {
        
            var divObject = IriSP.jqId(id);
            if (divObject.length) {
            divObject.fadeTo(0,1);
            var offset_x = divObject.position().left + divObject.outerWidth() / 2;
            self.TooltipWidget.show(divObject.attr("title"), IriSP.jQuery(this).css("background-color"), offset_x, 0);
            IriSP.jQuery(document).one("mousemove", function() { divObject.fadeTo(0,.5);
                                                                self.TooltipWidget.hide(); });
        }
      });
      
    this.selector.find(".Ldt-iri-chapter")
        .fadeTo(0, .5)
        .click(function() {
            self._Popcorn.trigger("IriSP.SegmentsWidget.click", this.id);
            self._Popcorn.currentTime(IriSP.jQuery(this).attr("data-seek"));
        })
        .mouseover( function(event) {
            var divObject = IriSP.jQuery(this);
            divObject.fadeTo(0,1);
            var offset_x = divObject.position().left + divObject.outerWidth() / 2;
            self.TooltipWidget.show(divObject.attr("title"), IriSP.jQuery(this).css("background-color"), offset_x, 0);
        })
        .mouseout(function(){
            IriSP.jQuery(this).fadeTo(0,.5);
            self.TooltipWidget.hide();
        });
};

/* restores the view after a search */
IriSP.SegmentsWidget.prototype.clear = function() {
  this.selector.children(".Ldt-iri-chapter").fadeTo(0,.5);
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
  var duration = this._serializer.getDuration() / 1000;
  var time = this._Popcorn.currentTime();
  //var position 	= ((time / duration) * 100).toFixed(2);
  var position 	= ((time / duration) * 100).toFixed(2);

  this.positionMarker.css("left", position + "%");  
};

IriSP.SegmentsWidget.prototype.showAnnotation = function() {

};
