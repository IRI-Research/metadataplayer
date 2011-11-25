IriSP.SliderWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.SliderWidget.prototype = new IriSP.Widget();

IriSP.SliderWidget.prototype.draw = function() {
  var self = this;

  this.selector.append(Mustache.to_html(IriSP.sliderWidget_template, {}));
  this.selector.addClass("Ldt-SliderMinimized");

  this.sliderBackground = this.selector.find(".Ldt-sliderBackground");
  this.sliderForeground = this.selector.find(".Ldt-sliderForeground");
  this.positionMarker = this.selector.find(".Ldt-sliderPositionMarker");


  // a special variable to stop methods from tinkering
  // with the positionMarker when the user is dragging it
  this.draggingOngoing = false;

  this.positionMarker.draggable({axis: "x",
  start: IriSP.wrap(this, this.positionMarkerDraggingStartedHandler),
  stop: IriSP.wrap(this, this.positionMarkerDraggedHandler),
  containment: "parent"
  });

  this.sliderBackground.click(function(event) { self.clickHandler.call(self, event); });

  this.selector.hover(IriSP.wrap(this, this.mouseOverHandler), IriSP.wrap(this, this.mouseOutHandler));
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
};

/* update the slider and the position marker as time passes */
IriSP.SliderWidget.prototype.sliderUpdater = function() {
  if(this.draggingOngoing)
    return;

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

/* handles mouse over the slider */
IriSP.SliderWidget.prototype.mouseOverHandler = function(event) {
  this.sliderBackground.animate({"height": "9px"}, 100);
  this.sliderForeground.animate({"height": "9px"}, 100);
  
//  this.selector.removeClass("Ldt-SliderMinimized");
//  this.selector.addClass("Ldt-SliderMaximized");
};

/* handles when the mouse leaves the slider */
IriSP.SliderWidget.prototype.mouseOutHandler = function(event) {
  this.sliderBackground.animate({"height": "5px"}, 100);
  this.sliderForeground.animate({"height": "5px"}, 100);
  
//  this.selector.removeClass("Ldt-SliderMaximized");
//  this.selector.addClass("Ldt-SliderMinimized");

};

// called when the user starts dragging the position indicator
IriSP.SliderWidget.prototype.positionMarkerDraggingStartedHandler = function(event, ui) {
  this.draggingOngoing = true;
};

IriSP.SliderWidget.prototype.positionMarkerDraggedHandler = function(event, ui) {
  var width = this.sliderBackground.width();
  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((ui.offset.left / width) * duration).toFixed(2);

  this._Popcorn.currentTime(newTime);

  this.draggingOngoing = false;
};

