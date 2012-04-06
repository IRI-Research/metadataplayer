/* this widget displays a small tooltip */
IriSP.TooltipWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this._shown = false;
  this._displayedText = "";
  this._hideTimeout = -1;
};


IriSP.TooltipWidget.prototype = new IriSP.Widget();

IriSP.TooltipWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.tooltipWidget_template);
  // position the widget absolutely relative to document. --- NOOOO !!!!
  this.selector.css({
      "position": "absolute",
      "top": 0,
      "left": 0
  });
  this.selector.parent().css({
      "position": "relative"
  });
  this.selector.append(templ);
  var _this = this;
  this.selector.mouseover(function() {
      _this.hide();
  });
  this.hide();

};

IriSP.TooltipWidget.prototype.clear = function() {
	this.selector.find(".tiptext").html("");
};

IriSP.TooltipWidget.prototype.show = function(text, color, x, y) {

  if (this._displayedText == text && this._shown)
    return;

  this.selector.find(".tipcolor").css("background-color", color);
  this._displayedText = text;
  this.selector.find(".tiptext").html(text);
  
  var _tip = this.selector.find(".tip");
  _tip.show();
  _tip.css({
      "left": Math.floor(x - _tip.outerWidth() / 2)+"px",
      "top": Math.floor(y - _tip.outerHeight())+"px"
  });
  this._shown = true;
};

IriSP.TooltipWidget.prototype.hide = function() {                                                   
  this.selector.find(".tip").hide();
  this._shown = false;  
};