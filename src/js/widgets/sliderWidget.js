IriSP.SliderWidget = function(Popcorn, config, Serializer) { 
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.SliderWidget.prototype = new IriSP.Widget();

IriSP.SliderWidget.prototype.draw = function() {
  var self = this;
  
  this.selector.slider( { //range: "min",
    value: 0,
    min: 1,
    max: this._serializer.currentMedia().meta["dc:duration"]/1000,//1:54:52.66 = 3600+3240+
    step: 0.1,
    slide: function(event, ui) {     
      self._Popcorn.currentTime(ui.value);
    },
    /* change event is similar to slide, but it happens when the slider position is 
       modified programatically. We use it for unit tests */       
    change: function(event, ui) {      
      self._Popcorn.trigger("test.fixture", ui.value);
    }
    
  });
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
};

/* updates the slider as time passes */
IriSP.SliderWidget.prototype.sliderUpdater = function() {  
  var currentPosition = this._Popcorn.currentTime();   
	this.selector.slider( "value", currentPosition);		
};