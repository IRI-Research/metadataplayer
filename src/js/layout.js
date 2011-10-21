/* layout.js - very basic layout management */

/*
  a layout manager manages a div and the layout of objects
  inside it.
*/

IriSP.LayoutManager = function(options) {
    this._Popcorn = null;
    this._widgets = [];
    
    this._div = "LdtPlayer";
    this._width = 640;
    this._height = 480;
    
    if (options === undefined) {
      options = {};
      console.error("The options parameter is undefined.");
    };
    
    if (options.hasOwnProperty('divId')) {
      this._div = options.divId;
    }

    if (options.hasOwnProperty('width')) {
      this._width = options.width;
    }    
    
    if (options.hasOwnProperty('height')) {
      this._height = options.height;
    } 
    
    /* this is a shortcut */
    this.selector = IriSP.jQuery("#" + this._div);
    
    this.selector.css("width", this._width);
    this.selector.css("height", this._height);
};

/* we need this special setter because of a chicken and egg problem :
   we want the manager to use popcorn but the popcorn div will be managed
   by the manager. So we need a way to set the instance the manager uses
*/
   
IriSP.LayoutManager.prototype.setPopcornInstance = function(popcorn) {
    this._Popcorn = popcorn;
    /* FIXME - don't forget to add the popcorn messages handlers there */
}

IriSP.LayoutManager.prototype.createDiv = function() {
    var newDiv = Popcorn.guid(this._div + "_widget_");
    this._widgets.push(newDiv);    
    this.selector.append("<div id='" + newDiv + "'></div");
    
    return newDiv;
};
