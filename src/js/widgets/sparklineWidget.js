/** @class The constructor for the sparkline widget */
IriSP.SparklineWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);

  this._oldAnnotation = null;
  
};


IriSP.SparklineWidget.prototype = new IriSP.Widget();

IriSP.SparklineWidget.prototype.clear = function() {

};

/** draw the sparkline using jquery sparkline */
IriSP.SparklineWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.SparklineWidget_template, {width: this.width, height: this.height});
  /** this widget uses three divs -
    the first is the sparkline, which is generated by jquery sparkline,
    the second is an overlay div to display the progression in the video,
    and the third is a div to react to clicks
  */
    
  /* we suppose that a column is 5 pixels wide */
  var num_columns = (this.selector.width()) / 10;
  var duration = +this._serializer.currentMedia().meta["dc:duration"];
  var time_step = duration / num_columns; /* the time interval between two columns */
  var results = [];
  var i = 0; /* the index in the loop */

  /* this algorithm makes one assumption : that the array is sorted 
     (it's done for us by the JSONSerializer). We go through the array 
     and count how many comments fall within a peculiar time piece.
     As i is preserved between each iteration, it's O(n).
  */
  for(var j = 0; j < num_columns; j++) {
    var count = 0;
    
    var annotation_begin = +(this._serializer._data.annotations[i].begin);
    
    while(annotation_begin >= j * time_step && annotation_begin <= (j + 1) * time_step ) {
      count++;
      i++;
      if (i >= this._serializer._data.annotations.length)
        break;
        
      annotation_begin = +(this._serializer._data.annotations[i].begin);
      
    }
    
    results.push(count);
  }
  
  this.selector.append(templ);
  this.selector.find(".Ldt-sparkLine").css("background", "#c7c8cc");
  this.selector.find(".Ldt-sparkLine").sparkline(results, {lineColor: "#7492b4", fillColor: "#aeaeb8",
                                                           spotColor: "#b70056",
                                                           width: this.width, height: this.height});
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeUpdateHandler));
  IriSP.jQuery(".Ldt-sparkLineClickOverlay").click(IriSP.wrap(this, this.clickHandler));
  this.spacer.css("height", "2px");
};

/** react to a timeupdate event */
IriSP.SparklineWidget.prototype.timeUpdateHandler = function() {
  var currentTime = this._Popcorn.currentTime();  
  var duration = +this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var proportion = ((currentTime / duration) * 100).toFixed(4);
  
  IriSP.jQuery(".Ldt-sparkLinePositionMarker").css("width", proportion + "%");                                    
}

/** handle clicks on the widget */
IriSP.SparklineWidget.prototype.clickHandler = function(event) {
  /* this piece of code is a little bit convoluted - here's how it works :
     we want to handle clicks on the progress bar and convert those to seeks in the media.
     However, jquery only gives us a global position, and we want a number of pixels relative
     to our container div, so we get the parent position, and compute an offset to this position,
     and finally compute the progress ratio in the media.
     Finally we multiply this ratio with the duration to get the correct time
  */

  var parentOffset = this.selector.offset();
  var width = this.selector.width();
  var relX = event.pageX - parentOffset.left;

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((relX / width) * duration).toFixed(2);
  
  this._Popcorn.currentTime(newTime);                                 
};