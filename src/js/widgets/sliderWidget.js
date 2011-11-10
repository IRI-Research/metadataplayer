IriSP.SliderWidget = function(Popcorn, config, Serializer) { 
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.SliderWidget.prototype = new IriSP.Widget();

IriSP.SliderWidget.prototype.draw = function() {
  var self = this;
  
  this.selector.append("<div class='sliderBackground'></div>");
  this.sliderBackground = this.selector.children(".sliderBackground");
  
  this.selector.append("<div class='sliderForeground' style='position: absolute; top: 0%; width: 0%;'></div>");
  this.sliderForeground = this.selector.children(".sliderForeground");
  
  this.selector.append(Mustache.to_html(IriSP.overlay_marker_template));
  this.positionMarker = this.selector.children(".positionMarker");
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
};

/* updates the slider as time passes */
IriSP.SliderWidget.prototype.sliderUpdater = function() {  
  var time = this._Popcorn.currentTime();
  
  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var percent = ((time / duration) * 100).toFixed(2);
	this.sliderForeground.css("width", percent + "%");
	this.positionMarker.css("left", percent + "%");
  
};