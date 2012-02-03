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

  var left = this.selector.offset().left;
  var top = this.selector.offset().top;

  // contain the handles correctly - we cannot set
  // containment: parent because it wouldn't allow to select the 
  // whole slice, so we have to compute a box in which the slice is
  // allowed to move.
  var containment = [left - 8, top, this.selector.width() + left, top];
  // var containment = [left - 16, top, this.selector.width() + left - 8, top];
  this.leftHandle.draggable({axis: "x",
  drag: IriSP.wrap(this, this.leftHandleDragged),  
  containment: containment
  });

  containment = [left, top, this.selector.width() + left, top];
  // containment = [left, top, this.selector.width() + left - 8, top];
  this.rightHandle.draggable({axis: "x",
  drag: IriSP.wrap(this, this.rightHandleDragged),    
  containment: containment
  });

  this.leftHandle.css("position", "absolute");
  this.rightHandle.css("position", "absolute");
  
  this._Popcorn.listen("IriSP.SliceWidget.position", 
                        IriSP.wrap(this, this.positionSliceHandler));
  
  this._Popcorn.listen("IriSP.SliceWidget.show", IriSP.wrap(this, this.show));
  this._Popcorn.listen("IriSP.SliceWidget.hide", IriSP.wrap(this, this.hide));
  this.selector.hide();
};

/** responds to an "IriSP.SliceWidget.position" message
    @param params an array with the first element being the left distance in
           percents and the second element the width of the slice in pixels
*/        
IriSP.SliceWidget.prototype.positionSliceHandler = function(params) {
  left = params[0];
  width = params[1];
  
  this.zoneLeft = left;
  this.zoneWidth = width;
  this.sliceZone.css("left", left + "px");
  this.sliceZone.css("width", width + "px");
  this.leftHandle.css("left", (left - 7) + "px");
  this.rightHandle.css("left", left + width + "px");
  
  this._leftHandleOldLeft = left - 7;
  this._rightHandleOldLeft = left + width;
};

/** handle a dragging of the left handle */
IriSP.SliceWidget.prototype.leftHandleDragged = function(event, ui) {
  /* we have a special variable, this._leftHandleOldLeft, to keep the
     previous position of the handle. We do that to know in what direction
     is the handle being dragged
  */
  
  var currentX = this.leftHandle.offset().left;
  var rightHandleX = Math.floor(this.rightHandle.position()["left"]);
  
  var container_offset = this.selector.offset().left;

  if (Math.floor(ui.position.left) >= rightHandleX - 7) {
    /* prevent the handle from moving past the right handle */
    ui.position.left = rightHandleX - 7;
  }

  this.zoneWidth = rightHandleX - Math.floor(ui.position.left) - 7;  
  this.zoneLeft = Math.floor(ui.position.left) + 8;
  
  this.sliceZone.css("width", this.zoneWidth);
  this.sliceZone.css("left", this.zoneLeft + "px");
  
  this._leftHandleOldLeft = ui.position.left;  
  this.broadcastChanges();
    
};

/** handle a dragging of the right handle */
IriSP.SliceWidget.prototype.rightHandleDragged = function(event, ui) { 
  /* we have a special variable, this._leftHandleOldLeft, to keep the
     previous position of the handle. We do that to know in what direction
     is the handle being dragged
  */
  
  var currentX = this.leftHandle.position()["left"];
  var leftHandleX = Math.floor(this.leftHandle.position()["left"]);

  var container_offset = this.selector.offset().left + this.selector.width();
  
  if (Math.floor(ui.position.left) < leftHandleX + 7) {
    /* prevent the handle from moving past the left handle */
    ui.position.left = leftHandleX + 7;
  }

  this.zoneWidth = Math.floor(ui.position.left) - (leftHandleX + 7);    
  
  this.sliceZone.css("width", this.zoneWidth);
  //this.sliceZone.css("left", this.zoneLeft + "px");
  this._rightHandleOldLeft = Math.floor(this._rightHandleOldLeft);  
  this.broadcastChanges();
};

/** tell to the world that the coordinates of the slice have
    changed 
*/
IriSP.SliceWidget.prototype.broadcastChanges = function() {
  var leftPercent = (this.zoneLeft / this.selector.width()) * 100;
  var zonePercent = (this.zoneWidth / this.selector.width()) * 100;

  this._Popcorn.trigger("IriSP.SliceWidget.zoneChange", [leftPercent, zonePercent]);  
};

IriSP.SliceWidget.prototype.show = function() {
  this.selector.show();
};

IriSP.SliceWidget.prototype.hide = function() {
  this.selector.hide();
};