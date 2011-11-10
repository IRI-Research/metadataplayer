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

  this.selector.css("overflow", "auto"); // clear the floats - FIXME : to refactor ?
  this.selector.append(Mustache.to_html(IriSP.segment_marker_template));
  
  this.positionMarker = this.selector.children(":first");
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.positionUpdater));
  
  this.selector.after("<div class='cleaner'></div>"); // we need to do this because the segments are floated                                                      
  
  var i = 0;
  var totalWidth = this.selector.width();
  var onePxPercent = 100 / totalWidth; /* the value of a pixel, in percents */
  
  for (i = 0; i < annotations.length; i++) {
    var annotation = annotations[i];

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


    var toolTipTemplate = Mustache.to_html(IriSP.tooltip_template,
          {"title" : divTitle, "begin" : begin, "end" : end,
          "description": annotation.content.description});

    this.selector.append(annotationTemplate);

    IriSP.jQuery("#" + id).tooltip({ effect: 'slide'});

    IriSP.jQuery("#" + id).fadeTo(0, 0.3);

    IriSP.jQuery("#" + id).mouseover(function() {
      IriSP.jQuery("#" + id).animate({opacity: 0.6}, 5);
    }).mouseout(function(){
      IriSP.jQuery("#" + id).animate({opacity: 0.3}, 5);
    });

    IriSP.jQuery("#" + id).click(function(_this, annotation) {
                                    return function() { _this.clickHandler(annotation)};
                                 }(this, annotation));
  }
};

/* restores the view after a search */
IriSP.SegmentsWidget.prototype.clear = function() {
  // reinit the fields
  for (var id in this.oldSearchMatches) {

      IriSP.jQuery("#"+id).dequeue();
			IriSP.jQuery("#"+id).animate({height:0}, 100);
			IriSP.jQuery("#"+id).css('border-color','lightgray');
			IriSP.jQuery("#"+id).animate({opacity:0.3}, 100);
  }
};

IriSP.SegmentsWidget.prototype.clickHandler = function(annotation) {
  var begin = Math.round((+ annotation.begin) / 1000);
  this._Popcorn.currentTime(begin);
};

IriSP.SegmentsWidget.prototype.searchHandler = function(searchString) {

  if (searchString == "")
    return;

  var matches = this._serializer.searchOccurences(searchString);

  for (var id in matches) {
    var factor = matches[id] * 8;
    this.selector.find("#"+id).dequeue();
    this.selector.find("#"+id).animate({height: factor}, 200);    
    this.selector.find("#"+id).css('border-color','red');
    this.selector.find("#"+id).animate({opacity:0.6}, 200);

    IriSP.jQuery("#LdtSearchInput").css('background-color','#e1ffe1');
  }

  // clean up the blocks that were in the previous search
  // but who aren't in the current one.
  for (var id in this.oldSearchMatches) {
    if (!matches.hasOwnProperty(id)) {
        IriSP.jQuery("#"+id).dequeue();
				IriSP.jQuery("#"+id).animate({height:0}, 250);				
				IriSP.jQuery("#"+id).animate({opacity:0.3}, 200);
        this.selector.find("#"+id).css('border','solid 1px #aaaaaa');
    }
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