/* this widget displays a small tooltip */
IriSP.TooltipWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};


IriSP.TooltipWidget.prototype = new IriSP.Widget();

IriSP.TooltipWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.tooltipWidget_template);

  this.selector.append(templ);
  this.hide();

};

IriSP.TooltipWidget.prototype.clear = function() {
	this.selector.find(".tiptext").text("");
};

IriSP.TooltipWidget.prototype.show = function(text, color, x, y) {
  if (this.selector.find(".tiptext").text() == text)
    return;

  this.selector.find(".tipcolor").css("background-color", color);
	this.selector.find(".tiptext").text(text);
  this.selector.find(".tip").css("left", x).css("top", y);
};

IriSP.TooltipWidget.prototype.hide = function() {
  this.clear();
  this.selector.find(".tip").css("left", -10000).css("top", -100000);
};
