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
  // position the widget absolutely relative to document.
  this.selector.css("position", "static");
  this.selector.append(templ);
  this.hide();

};

IriSP.TooltipWidget.prototype.clear = function() {
	this.selector.find(".tiptext").text("");
};

IriSP.TooltipWidget.prototype.show = function(text, color, x, y) {

  if (this._displayedText == text)
    return;
  
  this.selector.find(".tipcolor").css("background-color", color);
  this._displayedText = text;
	this.selector.find(".tiptext").text(text);
  //this.selector.find(".tip").css("left", x).css("top", y);  
  this.selector.find(".tip").css("left", x).css("top", y);
  this.selector.find(".tip").show();
  this._shown = true;
};

IriSP.TooltipWidget.prototype.hide = function() {                                                   
  this.selector.find(".tip").hide();
  this._shown = false;  
};