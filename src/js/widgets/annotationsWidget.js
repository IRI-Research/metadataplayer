IriSP.AnnotationsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  /* flag used when we're creating an annotation */
  this._hidden = false;
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
    var keywords =  "";
    var begin = +annotation.begin / 1000;
    var end = +annotation.end / 1000;
    var duration = +this._serializer.currentMedia().meta["dc:duration"];
    var tags = "";
    
    var title_templ = "{{title}} - ( {{begin}} - {{end}} )";
    var endstr = Mustache.to_html(title_templ, {title: title, begin: IriSP.secondsToTime(begin), end: IriSP.secondsToTime(end)});

    this.selector.find(".Ldt-SaTitle").text(endstr);
    this.selector.find(".Ldt-SaDescription").text(description);
    
    
    if (!IriSP.null_or_undefined(annotation.tags) && !IriSP.null_or_undefined(this._serializer._data.tags)) {
      /* save the tag id and keywords in a unique structure */
      var tag_list = {};
      for (var i = 0; i < this._serializer._data.tags.length; i++) {
        var id = this._serializer._data.tags[i]["id"];
        var keyword = this._serializer._data.tags[i]["meta"]["dc:title"];

        tag_list[id] = keyword;
      }

      /* then browse the list of defined tags for the current annotation */
      for (var i = 0; i < annotation.tags.length; i++) {
        if (tag_list.hasOwnProperty(annotation.tags[i]["id-ref"]))
          tags += tag_list[annotation.tags[i]["id-ref"]] + ", ";
      }
    }
    
    tags = "Keywords: " + tags.slice(0, tags.length - 2);
    
    this.selector.find(".Ldt-SaKeywords").text(tags);
    
    // update sharing buttons
    var defaults = IriSP.widgetsDefaults.AnnotationsWidget;
    var text = defaults.share_text;
    var fb_link = defaults.fb_link;
    var tw_link = defaults.tw_link;
    var gplus_link = defaults.gplus_link;
    var url = document.location.href + "#id=" + annotation.id;
    this.selector.find(".Ldt-fbShare").attr("href", IriSP.mkFbUrl(url, text));
    this.selector.find(".Ldt-TwShare").attr("href", IriSP.mkTweetUrl(url, text));
    this.selector.find(".Ldt-GplusShare").attr("href", IriSP.mkGplusUrl(url, text));
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

  this._Popcorn.listen("IriSP.AnnotationsWidget.show", 
                        IriSP.wrap(this, this.show));
  this._Popcorn.listen("IriSP.AnnotationsWidget.hide", 
                        IriSP.wrap(this, this.hide));
 
  var legal_ids = [];
  if (typeof(this._serializer.getChapitrage()) !== "undefined")
    legal_ids.push(this._serializer.getChapitrage());
  else 
    legal_ids = this._serializer.getNonTweetIds();
  
  var annotations = this._serializer._data.annotations;
  var i;
  
	for (i in annotations) {    
    var annotation = annotations[i];
    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);

    if (typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && !IriSP.underscore.include(legal_ids, annotation.meta["id-ref"])) {
        continue;
    }


    var conf = {start: begin, end: end, 
                onStart: 
                       function(annotation) { 
                        return function() { 
                            _this.displayAnnotation(annotation); 
                          
                        } }(annotation),
                onEnd: 
                       function() { _this.clearWidget.call(_this); }
                };
    this._Popcorn = this._Popcorn.code(conf);                                             
  }

};

IriSP.AnnotationsWidget.prototype.hide = function() {
  if (this._hidden == false) {
    this.selector.hide();
    this._hidden = true;
  }
};

IriSP.AnnotationsWidget.prototype.show = function() {
  if (this._hidden == true) {
    this.selector.show();
    this._hidden = false;
  }
};