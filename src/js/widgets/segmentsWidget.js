IriSP.SegmentsWidget = function(Popcorn, config, Serializer) {
  
  var self = this;
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.oldSearchMatches = [];
  
  // event handlers
  this._Popcorn.listen("IriSP.search", function(searchString) { self.searchHandler.call(self, searchString); });
  this._Popcorn.listen("IriSP.search.closed", function() { self.searchFieldClosedHandler.call(self); });
};

IriSP.SegmentsWidget.prototype = new IriSP.Widget();

IriSP.SegmentsWidget.prototype.draw = function() {

  var self = this;
  var annotations = this._serializer._data.annotations;
  
  var i = 0;
	for (i = 0; i < annotations.length; i++) {    
    var annotation = annotations[i];

    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);
    var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
    var id = annotation.id;    
    var startPourcent 	= IriSP.timeToPourcent(begin, duration);
    var endPourcent 	= IriSP.timeToPourcent(end, duration) - startPourcent;
    var divTitle		= annotation.content.title.substr(0,55);
    var color = annotation.content.color
    
    
    var annotationTemplate = Mustache.to_html(IriSP.annotation_template,
        {"divTitle" : divTitle, "id" : id, "startPourcent" : startPourcent,
        "endPourcent" : endPourcent, "hexa_color" : IriSP.DEC_HEXA_COLOR(color),
        "seekPlace" : Math.round(begin/1000)});
    
    
    var toolTipTemplate = Mustache.to_html(IriSP.tooltip_template, 
          {"title" : divTitle, "begin" : begin, "end" : end,
          "description": annotation.content.description});
    
    IriSP.jQuery("#Ldt-Annotations").append(annotationTemplate);    
    
    IriSP.jQuery("#" + id).tooltip({ effect: 'slide'});
    
    IriSP.jQuery("#" + id).fadeTo(0,0.3);
    
    IriSP.jQuery("#" + id).mouseover(function() {
      IriSP.jQuery("#" + id).animate({opacity: 0.6}, 5);
    }).mouseout(function(){		
      IriSP.jQuery("#" + id).animate({opacity: 0.3}, 5);
    });
    
    IriSP.jQuery("#" + id).click(function(_this, annotation) { 
                                    return function() { _this.clickHandler(annotation)};
                                 }(this, annotation));

    // also add an handler to move the arrow.
    // FIXME: make it work - the arrow swings wildly atm.
    var middle = IriSP.timeToPourcent(begin + (end - begin)/ 2, duration);
    var arrow_div_width = IriSP.jQuery("#Ldt-Show-Arrow").width();
    
    var real_middle = middle - (middle * (1 - this.width/arrow_div_width));
    var conf = {start: begin, end: end, 
                onStart: 
                       function(middle) {                         
                        return function() { 
                          IriSP.jQuery("#Ldt-Show-Arrow").animate({left: real_middle + '%'}, 1000); }}(middle)                
                };
    this._Popcorn = this._Popcorn.code(conf);
  } 
};

IriSP.SegmentsWidget.prototype.clickHandler = function(annotation) {
  var begin = Math.round((+ annotation.begin) / 1000);
  this._Popcorn.currentTime(begin)
};

IriSP.SegmentsWidget.prototype.searchHandler = function(searchString) {

  if (searchString == "")
    return;
  
  console.log(searchString);
  var matches = this._serializer.searchOccurences(searchString);
  
  for (var id in matches) {
    var factor = matches[id] * 8;
    IriSP.jQuery("#"+id).dequeue();
    IriSP.jQuery("#"+id).animate({height: factor},200);
    IriSP.jQuery("#"+id).css('border','2px');
    IriSP.jQuery("#"+id).css('border-color','red');
    IriSP.jQuery("#"+id).animate({opacity:0.6},200);

    //IriSP.jQuery("#LdtSearchInput").css('background-color','#e1ffe1');
  }
  
  // clean up the blocks that were in the previous search
  // but who aren't in the current one.
  for (var id in this.oldSearchMatches) { 
    if (!matches.hasOwnProperty(id)) {
        IriSP.jQuery("#"+id).dequeue();
				IriSP.jQuery("#"+id).animate({height:0},250);
				IriSP.jQuery("#"+id).animate({opacity:0.3},200);
    }
  }
  this.oldSearchMatches = matches;
};

IriSP.SegmentsWidget.prototype.searchFieldClosedHandler = function() {
  // reinit the fields
  for (var id in this.oldSearchMatches) {     
      
      IriSP.jQuery("#"+id).dequeue();
			IriSP.jQuery("#"+id).animate({height:0},100);	
			IriSP.jQuery("#"+id).css('border','0px');
			IriSP.jQuery("#"+id).css('border-color','red');
			IriSP.jQuery("#"+id).animate({opacity:0.3},100);
  }
  
  
};