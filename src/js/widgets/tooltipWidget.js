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

IriSP.TooltipWidget.prototype.show = function(text, color, x, y) {
  this.selector.children(".tipcolor").css("background-color", color);
	this.selector.find(".tiptext").text(text);
  this.selector.children(".tip").css("left", x).css("top", y);
};

IriSP.TooltipWidget.prototype.hide = function() {
  this.selector.children(".tip").css("left", -10000).css("top", -100000);
};