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
 this.selector.children(".Ldt-arrowWidget").css("left", percents + "%");
}
