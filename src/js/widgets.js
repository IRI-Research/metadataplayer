/* the widget classes and definitions */

IriSP.Widget = function(Popcorn, config, Serializer) {
  this._Popcorn = Popcorn;
  this._config = config;  
  this._serializer = Serializer;
};

IriSP.Widget.prototype.draw = function() {
  /* implemented by "sub-classes" */  
};

IriSP.Widget.prototype.redraw = function() {
  /* implemented by "sub-classes" */  
};

IriSP.PlayerWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};