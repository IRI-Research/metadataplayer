/** A widget to create a new segment */
IriSP.SliceWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};

IriSP.SliceWidget.prototype = new IriSP.Widget();

IriSP.SliceWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.sliceWidget_template);
  this.selector.append(templ);
  
  this.sliceZone = this.selector.find(".Ldt-sliceZone");
  
  /* global variables used to keep the position and width
     of the zone.
  */  
  this.zoneLeft = 0;
  this.zoneWidth = 0;
  
  this.leftHandle = this.selector.find(".Ldt-sliceLeftHandle");
  this.rightHandle = this.selector.find(".Ldt-sliceRightHandle");

  this.leftHandle.draggable({axis: "x",
  drag: IriSP.wrap(this, this.leftHandleDragged),  
  containment: "parent"
  });

  this.rightHandle.draggable({axis: "x",
  drag: IriSP.wrap(this, this.rightHandleDragged),    
  containment: "parent"
  });

  
  this._Popcorn.listen("IriSP.SliceWidget.position", 
                        IriSP.wrap(this, this.positionSliceHandler));
  this._Popcorn.trigger("IriSP.SliceWidget.position", [57, 24]);
};

IriSP.SliceWidget.prototype.positionSliceHandler = function(params) {
  left = params[0];
  width = params[1];
  
  this.zoneLeft = left;
  this.zoneWidth = width;
  this.sliceZone.css("left", left + "px");
  this.sliceZone.css("width", width + "px");
  this.leftHandle.css("left", (left - 7) + "px");
  this.rightHandle.css("left", left + width + "px");
};

/*
IriSP.SliceWidget.prototype.leftHandleDragged = function(event, ui) {
  var currentX = this.leftHandle.position()["left"];
  
  var parentOffset = this.selector.offset();  
  var relX = event.pageX - parentOffset.left;
  
  
  var increment = this.zoneLeft - relX;
  console.log(increment);

  this.sliceZone.css("width", this.zoneWidth + increment);
  this.sliceZone.css("left", relX + "px");
  this.zoneLeft = relX;
  this.zoneWidth += increment;
};
*/

/** handle a dragging of the left handle */
IriSP.SliceWidget.prototype.leftHandleDragged = function(event, ui) {
  var currentX = this.leftHandle.position()["left"];
    
  var increment = this.zoneLeft - (currentX + 7);
  
  this.zoneWidth += increment;
  this.zoneLeft = currentX + 7;
  this.sliceZone.css("width", this.zoneWidth);
  this.sliceZone.css("left", this.zoneLeft + "px");
  this.broadcastChanges();
};

/** handle a dragging of the right handle */
IriSP.SliceWidget.prototype.rightHandleDragged = function(event, ui) { 
  var currentX = this.rightHandle.position()["left"];
    
  var increment = currentX - (this.zoneLeft + this.zoneWidth);  

  this.zoneWidth += increment;  
  this.sliceZone.css("width", this.zoneWidth);
  this.broadcastChanges();
};

/** tell to the world that the coordinates of the slice have
    changed 
*/
IriSP.SliceWidget.prototype.broadcastChanges = function() {
  var leftPercent = (this.zoneLeft / this.selector.width()) * 100;
  var zonePercent = (this.zoneWidth / this.selector.width()) * 100;
  console.log(leftPercent, zonePercent);
  
  this._Popcorn.trigger("IriSP.SliceWidget.zoneChange", [leftPercent, zonePercent]);
  
};