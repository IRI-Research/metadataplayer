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
  
  this.sliderBackground.click(function(event) { self.clickHandler.call(self, event); });
  
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

IriSP.SliderWidget.prototype.clickHandler = function(event) {
  /* this piece of code is a little bit convoluted - here's how it works :
     we want to handle clicks on the progress bar and convert those to seeks in the media.
     However, jquery only gives us a global position, and we want a number of pixels relative
     to our container div, so we get the parent position, and compute an offset to this position,
     and finally compute the progress ratio in the media.
     Finally we multiply this ratio with the duration to get the correct time
  */
  
  var parentOffset = this.sliderBackground.parent().offset();
  var width = this.sliderBackground.width();
  var relX = event.pageX - parentOffset.left;
      
  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((relX / width) * duration).toFixed(2);
	
  this._Popcorn.currentTime(newTime);
};