IriSP.AnnotationsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};


IriSP.AnnotationsWidget.prototype = new IriSP.Widget();

IriSP.AnnotationsWidget.prototype.clear = function() {
    this.selector.find(".Ldt-SaTitle").text("");
    this.selector.find(".Ldt-SaDescription").text("");
    this.selector.find(".Ldt-SaKeywordText").text("");
};

IriSP.AnnotationsWidget.prototype.displayAnnotation = function(annotation) {

    var title = annotation.content.title;
    var description = annotation.content.description;
    var keywords =  "" // FIXME;
    var begin = +annotation.begin;
    var end = +annotation.end;
    var duration = +this._serializer.currentMedia().meta["dc:duration"];

    this.selector.find(".Ldt-SaTitle").text(title);
    this.selector.find(".Ldt-SaDescription").text(description);
		var startPourcent = parseInt(Math.round((begin*1+(end*1-begin*1)/2) / (duration*1)) / 100); 		

};

IriSP.AnnotationsWidget.prototype.clearWidget = function() {

    
    /* retract the pane between two annotations */
    this.selector.find(".Ldt-SaTitle").text("");
    this.selector.find(".Ldt-SaDescription").text("");
    this.selector.find(".Ldt-SaKeywordText").html("");
    this.selector.find(".Ldt-ShowAnnotation").slideUp();
};

IriSP.AnnotationsWidget.prototype.draw = function() {
  var _this = this;

  var annotationMarkup = Mustache.to_html(IriSP.annotationWidget_template, {"share_template" : IriSP.share_template});
	this.selector.append(annotationMarkup);

  var annotations = this._serializer._data.annotations;
  var i;
  
	for (i in annotations) {    
    var annotation = annotations[i];
    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);

    var conf = {start: begin, end: end, 
                onStart: 
                       function(annotation) { 
                        return function() { 
                          /* we need it because we have to restore
                             the display after displaying the contents
                             of a tweet.
                          */
                          _this._currentAnnotation = annotation;
                          _this.displayAnnotation(annotation); 
                          
                        } }(annotation),
                onEnd: 
                       function() { _this.clearWidget.call(_this); },
                };
    this._Popcorn = this._Popcorn.code(conf);                                             
  }

};