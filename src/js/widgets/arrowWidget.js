IriSP.ArrowWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);

  this._oldAnnotation = null;
  this._blockArrow = false;
};


IriSP.ArrowWidget.prototype = new IriSP.Widget();

IriSP.ArrowWidget.prototype.clear = function() {

};

IriSP.ArrowWidget.prototype.clearWidget = function() {
};

IriSP.ArrowWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.arrowWidget_template, {});
  this.selector.append(templ);
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeUpdateHandler));
  this._Popcorn.listen("IriSP.ArrowWidget.blockArrow", IriSP.wrap(this, this.blockArrow));
  this._Popcorn.listen("IriSP.ArrowWidget.releaseArrow", IriSP.wrap(this, this.releaseArrow));
  
};

IriSP.ArrowWidget.prototype.timeUpdateHandler = function(percents) {
  if (this._blockArrow)
    return;
  
  var currentTime = this._Popcorn.currentTime();
  var currentAnnotation = this._serializer.currentChapitre(currentTime);
  if (IriSP.null_or_undefined(currentAnnotation)) {
    var c_annots = this._serializer.currentAnnotation(currentTime)
    if (c_annots.length != 0)
      var currentAnnotation = c_annots[0]; // FIXME : use the others ?
    else
      return;
  }
  
  /* move the arrow only if the current annotation changes */
  if (currentAnnotation != this._oldAnnotation) {
    var begin = (+ currentAnnotation.begin) / 1000;
    var end = (+ currentAnnotation.end) / 1000;

    var duration = this.getDuration() / 1000;
    var middle_time = (begin + end) / 2;
    var percents = middle_time / duration;

    // we need to apply a fix because the arrow has a certain length
    // it's half the length of the arrow (27 / 2). We need to convert
    // it in percents though.
    var totalWidth = this.selector.width();    
    var pixels = percents * totalWidth;
    var correction = (27 / 2);
    var corrected_pixels = pixels - correction;
    
    /* make sure that the arrow is aligned with the pattern
       of the widget under it */
    if (corrected_pixels % 3 != 0)
      corrected_pixels -= (corrected_pixels % 3 - 1);
    
    /* don't move out of the screen */
    if (corrected_pixels <= 0)
      corrected_pixels = 0;
    
    if (corrected_pixels <= 15) {      
      this.selector.children(".Ldt-arrowWidget").removeClass("Ldt-arrowLeftEdge Ldt-arrowCenter Ldt-arrowRightEdge")
                                                .addClass("Ldt-arrowLeftEdge"); 
    } else if (corrected_pixels >= totalWidth - 25) {
           this.selector.children(".Ldt-arrowWidget").removeClass("Ldt-arrowLeftEdge Ldt-arrowCenter Ldt-arrowRightEdge")
                                                .addClass("Ldt-arrowRightEdge"); 
    } else {
      this.selector.children(".Ldt-arrowWidget").removeClass("Ldt-arrowLeftEdge Ldt-arrowCenter Ldt-arrowRightEdge")
                                                .addClass("Ldt-arrowCenter"); 
    }
    
    this.selector.children(".Ldt-arrowWidget").animate({"left" : corrected_pixels + "px"});

    this._oldAnnotation = currentAnnotation;
  }
};

/** Block the arrow for instance when the user is annotating */
IriSP.ArrowWidget.prototype.blockArrow = function() {
  this._blockArrow = true;
};

IriSP.ArrowWidget.prototype.releaseArrow = function() {
  this._blockArrow = false;   
};
