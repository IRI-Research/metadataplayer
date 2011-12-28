/* layout.js - very basic layout management */

/**
  @class a layout manager manages a div and the layout of objects
  inside it.
*/
IriSP.LayoutManager = function(options) {
    this._Popcorn = null;
    this._widgets = [];
    
    this._div = "LdtPlayer";
    this._width = 640;
    
    if (options === undefined) {
      options = {};
    };
    
    if (options.hasOwnProperty('container')) {
      this._div = options.container;
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
    
    if (this._height !== undefined)
      this.selector.css("height", this._height);
};

/** 
   Set the popcorn instance used by the manager.
   
   we need this special setter because of a chicken and egg problem :
   we want the manager to use popcorn but the popcorn div will be managed
   by the manager. So we need a way to set the instance the manager uses
*/
   
IriSP.LayoutManager.prototype.setPopcornInstance = function(popcorn) {
    this._Popcorn = popcorn;
}

/** create a subdiv with an unique id, and a spacer div as well.
    @param widgetName the name of the widget.
    @return an array of the form [createdivId, spacerdivId].
*/
IriSP.LayoutManager.prototype.createDiv = function(widgetName) {
    if (typeof(widgetName) === "undefined")
       widgetName = "";

    var newDiv = IriSP.guid(this._div + "_widget_" + widgetName + "_");
    var spacerDiv = IriSP.guid("LdtPlayer_spacer_");
    this._widgets.push([widgetName, newDiv]);    

    var divTempl = "<div id='{{id}}' style='width: {{width}}px; position: relative;'></div";
    var spacerTempl = "<div id='{{spacer_id}}' style='width: {{width}}px; position: relative; height: {{spacer_div_height}};'></div";
    
    var divCode = Mustache.to_html(divTempl, {id: newDiv, width: this._width});
    var spacerCode = Mustache.to_html(spacerTempl, {spacer_id: spacerDiv, width: this._width,
                                                    spacer_div_height: IriSP.widgetsDefaults.LayoutManager.spacer_div_height });

    this.selector.append(divCode);
    this.selector.append(spacerCode);

    return [newDiv, spacerDiv];
};