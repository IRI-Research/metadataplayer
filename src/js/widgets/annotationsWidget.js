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
    var begin = +annotation.begin / 1000;
    var end = +annotation.end / 1000;
    var duration = +this._serializer.currentMedia().meta["dc:duration"];
    
    var title_templ = "{{title}} - ( {{begin}} - {{end}} )";
    var endstr = Mustache.to_html(title_templ, {title: title, begin: IriSP.secondsToTime(begin), end: IriSP.secondsToTime(end)});

    this.selector.find(".Ldt-SaTitle").text(endstr);
    this.selector.find(".Ldt-SaDescription").text(description);
    
    // update sharing buttons
    var defaults = IriSP.widgetsDefaults.AnnotationsWidget;
    var text = defaults.share_text;
    var fb_link = defaults.fb_link;
    var tw_link = defaults.tw_link;
    var gplus_link = defaults.gplus_link;
    var url = document.location.href + "#a=" + annotation.id;
    this.selector.find(".Ldt-fbShare").attr("href", fb_link + IriSP.encodeURI(text) + IriSP.encodeURI(url));
    this.selector.find(".Ldt-TwShare").attr("href", tw_link + IriSP.encodeURI(text) + IriSP.encodeURI(url));
    this.selector.find(".Ldt-GplusShare").attr("href", fb_link + IriSP.encodeURI(text) + IriSP.encodeURI(url));
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

  var annotationMarkup = IriSP.templToHTML(IriSP.annotationWidget_template);
	this.selector.append(annotationMarkup);
  var view;

  if (typeof(this._serializer._data.views) !== "undefined" && this._serializer._data.views !== null)
     view = this._serializer._data.views[0];

  var view_type = "";

  if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
          view_type = view.annotation_types[0];
  }
 
  var annotations = this._serializer._data.annotations;
  var i;
  
	for (i in annotations) {    
    var annotation = annotations[i];
    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);

    if (view_type != "" && typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }


    var conf = {start: begin, end: end, 
                onStart: 
                       function(annotation) { 
                        return function() { 
                            _this.displayAnnotation(annotation); 
                          
                        } }(annotation),
                onEnd: 
                       function() { _this.clearWidget.call(_this); },
                };
    this._Popcorn = this._Popcorn.code(conf);                                             
  }

};
