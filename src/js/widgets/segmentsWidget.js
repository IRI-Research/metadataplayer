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

IriSP.SegmentsWidget.prototype.draw = function() {

  var self = this;
  var annotations = this._serializer._data.annotations;

  this.selector.addClass("Ldt-SegmentsWidget");

  /* in case we have different types of annotations, we want to display only the first type */
  /* the next two lines are a bit verbose because for some test data, _serializer.data.view is either
     null or undefined.
  */
  var view;

  if (typeof(this._serializer._data.views) !== "undefined" && this._serializer._data.views !== null)
     view = this._serializer._data.views[0];

  var view_type = "";

  if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
          view_type = view.annotation_types[0];
  }
 
  this.selector.append(Mustache.to_html(IriSP.overlay_marker_template));
  
  this.positionMarker = this.selector.children(":first");
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.positionUpdater));
  
  
  var i = 0;
  var totalWidth = this.selector.width();
  var onePxPercent = 100 / totalWidth; /* the value of a pixel, in percents */
 
  for (i = 0; i < annotations.length; i++) {
    var annotation = annotations[i];

    /* filter the annotations whose type is not the one we want */
    if (view_type != "" && typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }

    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);
    var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
    var id = annotation.id;
    var startPourcent 	= IriSP.timeToPourcent(begin, duration);
    
    /* some sort of collapsing occurs, so we only have to substract one pixel to each box instead of
       two
    */
    var endPourcent 	= IriSP.timeToPourcent(end, duration) - startPourcent - onePxPercent * 1;
    
    /* on the other hand, we have to substract one pixel from the first box because it's the only
       one to have to effective 1px margins */
    if (i == 0) {

      endPourcent -= onePxPercent;
    }
    
    var divTitle = annotation.content.title.substr(0,55);
    var color = annotation.content.color


    var annotationTemplate = Mustache.to_html(IriSP.annotation_template,
        {"divTitle" : divTitle, "id" : id, "startPourcent" : startPourcent,
        "endPourcent" : endPourcent, "hexa_color" : IriSP.DEC_HEXA_COLOR(color),
        "seekPlace" : Math.round(begin/1000)});


    this.selector.append(annotationTemplate);

//    IriSP.jQuery("#" + id).tooltip({ effect: 'slide'});

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

          self.TooltipWidget.show(divTitle, color, offset_x, event.pageY - 160);
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
  this.selector.children(".Ldt-iri-chapter").css('border','none').animate({opacity:0.3}, 100);
};

IriSP.SegmentsWidget.prototype.clickHandler = function(annotation) {
  var begin = (+ annotation.begin) / 1000;
  this._Popcorn.currentTime(Math.floor(begin));
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
    this.selector.find("#"+id).css('border','1px red');
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
  var position 	= ((time / duration) * 100).toFixed(2);

  this.positionMarker.css("left", position + "%");  
};
