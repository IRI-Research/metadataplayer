IriSP.AnnotationsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};


IriSP.AnnotationsWidget.prototype = new IriSP.Widget;

IriSP.AnnotationsWidget.prototype.clear = function() {
    IriSP.jQuery("#Ldt-SaTitle").text("");
    IriSP.jQuery("#Ldt-SaDescription").text("");
    IriSP.jQuery("#Ldt-SaKeywordText").text("");
};

IriSP.AnnotationsWidget.prototype.displayAnnotation = function(annotation) {
    var title = annotation.content.title;
    var description = annotation.content.description;
    var keywords =  "" // FIXME;
    var begin = +annotation.begin;
    var end = +annotation.end;
    var duration = +this._serializer.currentMedia().meta["dc:duration"];

    IriSP.jQuery("#Ldt-SaTitle").text(title);
    IriSP.jQuery("#Ldt-SaDescription").text(description);
    IriSP.jQuery("#Ldt-SaKeywordText").text("Mots clefs : "+ keywords);
		var startPourcent = parseInt(Math.round((begin*1+(end*1-begin*1)/2) / (duration*1)) / 100); 
		IriSP.jQuery("#Ldt-Show-Arrow").animate({left:startPourcent+'%'},1000);
		//IriSP.jQuery("#"+annotationTempo.id).animate({alpha:'100%'},1000);

};

IriSP.AnnotationsWidget.prototype.draw = function() {
  var _this = this;

  var annotationMarkup = Mustache.to_html(IriSP.annotationWidget_template, {"share_template" : IriSP.share_template});
	IriSP.jQuery("#Ldt-Ligne").append(annotationMarkup);
  console.dir(this._serializer);
  
  var annotations = this._serializer._data.annotations;
	for (i in annotations) {    
    var annotation = annotations[i];
    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);

    this._Popcorn = this._Popcorn.code({start: begin, end: end, 
                                        onStart: 
                                          function(annotation) { return function() { _this.displayAnnotation(annotation); } }(annotation) });                                             
  }
};
