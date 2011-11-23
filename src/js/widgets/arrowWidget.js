IriSP.ArrowWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};


IriSP.ArrowWidget.prototype = new IriSP.Widget();

IriSP.ArrowWidget.prototype.clear = function() {

};

IriSP.ArrowWidget.prototype.clearWidget = function() {
};

IriSP.ArrowWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.arrowWidget_template, {});
  this.selector.append(templ);
  this._Popcorn.listen("IriSP.SegmentsWidget.segmentClick", IriSP.wrap(this, this.segmentClickHandler));
};

IriSP.ArrowWidget.prototype.segmentClickHandler = function(percents) {
 // we need to apply a fix because the arrow has a certain length
 // it's half the length of the arrow (27 / 2). We need to convert
 // it in percents though.
 var totalWidth = this.selector.width();
 var correction = ((27 / 2) / totalWidth) * 100;
 var corrected_percents = percents - correction;
 this.selector.children(".Ldt-arrowWidget").animate({"left" : corrected_percents + "%"});
}
