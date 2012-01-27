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

  // another special variable used by the timeout handler to
  // open or close the slider.
  this.sliderMaximized = false;
  this.timeOutId = null;

  
  this.positionMarker.draggable({axis: "x",
  start: IriSP.wrap(this, this.positionMarkerDraggingStartedHandler),
  stop: IriSP.wrap(this, this.positionMarkerDraggedHandler),
  containment: "parent"
  });
  this.positionMarker.css("position", "absolute");
  
  this.sliderBackground.click(function(event) { self.backgroundClickHandler.call(self, event); });
  this.sliderForeground.click(function(event) { self.foregroundClickHandler.call(self, event); });

  this.selector.hover(IriSP.wrap(this, this.mouseOverHandler), IriSP.wrap(this, this.mouseOutHandler));

  // update the positions
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));

  // special messages :
  this._Popcorn.listen("IriSP.PlayerWidget.MouseOver", IriSP.wrap(this, this.mouseOverHandler));
  this._Popcorn.listen("IriSP.PlayerWidget.MouseOut", IriSP.wrap(this, this.mouseOutHandler));
};

/* update the slider and the position marker as time passes */
IriSP.SliderWidget.prototype.sliderUpdater = function() {
  if(this.draggingOngoing || this._disableUpdate)
    return;
  
  var time = this._Popcorn.currentTime();

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var percent = ((time / duration) * 100).toFixed(2);
  
  /* we do these complicated calculations to center exactly
     the position Marker */
  var pixels_to_percents = 100 / this.selector.width(); /* how much is a pixel in percents */
  var positionMarker_width = this.positionMarker.width();
  var correction = (pixels_to_percents * positionMarker_width) / 2;

  /* check that we don't leave the left side */
  var newPos = percent - correction;
  if (newPos <= 0)
    newPos = 0;
  
  /* check that we don't leave the right side */
  var outPos = percent + correction;
  if (outPos > 100)
    newPos = 100;
  
	this.sliderForeground.css("width", percent + "%");
	this.positionMarker.css("left", newPos + "%");

};

IriSP.SliderWidget.prototype.backgroundClickHandler = function(event) {
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

/* same function as the previous one, except that it handles clicks
   on the foreground element */
IriSP.SliderWidget.prototype.foregroundClickHandler = function(event) {
  var parentOffset = this.sliderForeground.parent().offset();
  var width = this.sliderBackground.width();
  var relX = event.pageX - parentOffset.left;

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((relX / width) * duration).toFixed(2);

  this._Popcorn.currentTime(newTime);
};

/* handles mouse over the slider */
IriSP.SliderWidget.prototype.mouseOverHandler = function(event) {
  
  if (this.timeOutId !== null) {
    window.clearTimeout(this.timeOutId);
  }
 
  this.sliderMaximized = true;

  this.sliderBackground.animate({"height": "9px"}, 100);
  this.sliderForeground.animate({"height": "9px"}, 100);
  this.positionMarker.animate({"height": "9px", "width": "9px"}, 100);
  //this.positionMarker.css("margin-top", "-4px");
  
//  this.selector.removeClass("Ldt-SliderMinimized");
//  this.selector.addClass("Ldt-SliderMaximized");
};

/* handles when the mouse leaves the slider */
IriSP.SliderWidget.prototype.mouseOutHandler = function(event) {

  this.timeOutId = window.setTimeout(IriSP.wrap(this, this.minimizeOnTimeout),
                                     IriSP.widgetsDefaults.SliderWidget.minimize_period);
};

IriSP.SliderWidget.prototype.minimizeOnTimeout = function(event) {
  this.sliderBackground.animate({"height": "5px"}, 100);
  this.sliderForeground.animate({"height": "5px"}, 100);
  this.positionMarker.animate({"height": "5px", "width": "5px"}, 100);
  this.positionMarker.css("margin-top", "0px");
  this.sliderMinimized = true;
  
//  this.selector.removeClass("Ldt-SliderMaximized");
//  this.selector.addClass("Ldt-SliderMinimized");

};

// called when the user starts dragging the position indicator
IriSP.SliderWidget.prototype.positionMarkerDraggingStartedHandler = function(event, ui) {  
  this.draggingOngoing = true;
};

IriSP.SliderWidget.prototype.positionMarkerDraggedHandler = function(event, ui) {   
  this._disableUpdate = true; // disable slider position updates while dragging is ongoing.
  window.setTimeout(IriSP.wrap(this, function() { this._disableUpdate = false; }), 500);

  var parentOffset = this.sliderForeground.parent().offset();
  var width = this.sliderBackground.width();
  var relX = event.pageX - parentOffset.left;

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((relX / width) * duration).toFixed(2);

  this._Popcorn.currentTime(newTime);
  
  this.draggingOngoing = false;
};

