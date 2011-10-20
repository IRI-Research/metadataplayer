IriSP.SegmentsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);  
};

IriSP.SegmentsWidget.prototype = new IriSP.Widget;

IriSP.SegmentsWidget.prototype.draw = function() {

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
    
        
    IriSP.jQuery(annotationTemplate).appendTo("#Ldt-Annotations");
    // TOOLTIP BUG ! 
    
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
  }
};

IriSP.SegmentsWidget.prototype.clickHandler = function(annotation) {
  var begin = Math.round((+ annotation.begin) / 1000);
  this._Popcorn.currentTime(begin)
}