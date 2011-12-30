IriSP.createAnnotationWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this._hidden = true;
  this.keywords = IriSP.widgetsDefaults["createAnnotationWidget"].keywords;
  this.cinecast_version = IriSP.widgetsDefaults["createAnnotationWidget"].cinecast_version;
  this.ids = {}; /* a dictionnary linking buttons ids to keywords */
};


IriSP.createAnnotationWidget.prototype = new IriSP.Widget();

IriSP.createAnnotationWidget.prototype.clear = function() {
    this.selector.find(".Ldt-SaTitle").text("");
    this.selector.find(".Ldt-SaDescription").text("");
    this.selector.find(".Ldt-SaKeywordText").text("");
};

IriSP.createAnnotationWidget.prototype.draw = function() {
  var _this = this;

  if (this.cinecast_version) {    
    var annotationMarkup = IriSP.templToHTML(IriSP.createAnnotationWidget_festivalCinecast_template);
  } else {
    var annotationMarkup = IriSP.templToHTML(IriSP.createAnnotationWidget_template);
  }
  
	this.selector.append(annotationMarkup);
  
  this.selector.hide();
  for (var i = 0; i < this.keywords.length; i++) {
    var keyword = this.keywords[i];
    var id = IriSP.guid("button_");
    var templ = IriSP.templToHTML("<button id={{id}} class='Ldt-createAnnotation-absent-keyword'>{{keyword}}</button>", 
                                  {keyword: keyword, id: id});
                                  
    this.ids[keyword] = id; // save it for the function that handle textarea changes.
    
    this.selector.find(".Ldt-createAnnotation-keywords").append(templ);
    this.selector.find("#" + id).click(function(keyword) { return function() {
      var contents = _this.selector.find(".Ldt-createAnnotation-Description").val();
      if (contents.indexOf(keyword) != -1) {
        var newVal = contents.replace(keyword, "");        
      } else {
        var newVal = contents + keyword;      
      }
      
      _this.selector.find(".Ldt-createAnnotation-Description").val(newVal);
      // also call our update function.
      _this.handleTextChanges();
    }
   }(keyword));
  }
  
  this.selector.find(".Ldt-createAnnotation-Description")
               .bind("propertychange keyup input paste", IriSP.wrap(this, this.handleTextChanges));
  
  this.selector.find(".Ldt-createAnnotation-submitButton").click(IriSP.wrap(this, this.handleButtonClick));
  this._Popcorn.listen("IriSP.PlayerWidget.AnnotateButton.clicked", 
                        IriSP.wrap(this, this.handleAnnotateSignal));  
};

IriSP.createAnnotationWidget.prototype.handleAnnotateSignal = function() {
  if (this._hidden == false) {
    this.selector.hide();
    this._hidden = true;
    /* reinit the fields */
    
    this.selector.find(".Ldt-createAnnotation-DoubleBorder").children().show();
    this.selector.find("Ldt-createAnnotation-Description").val("");
    this.selector.find(".Ldt-createAnnotation-endScreen").hide();
  } else {
    if (this.cinecast_version) {
      var currentTime = this._Popcorn.currentTime();
      var currentAnnotation = this._serializer.currentAnnotations(currentTime)[0];
      var beginTime = IriSP.msToTime(currentAnnotation.begin);
      var endTime = IriSP.msToTime(currentAnnotation.end);
      
      if (typeof(currentAnnotation.content) !== "undefined")
        this.selector.find(".Ldt-createAnnotation-Title").html(currentAnnotation.content.title);

      var timeTemplate = IriSP.templToHTML("- ({{begin}} - {{ end }})", {begin: beginTime, end: endTime });
      this.selector.find(".Ldt-createAnnotation-TimeFrame").html(timeTemplate);
    }
    
    this.selector.show();
    this._hidden = false;
  }
};

/** watch for changes in the textfield and change the buttons accordingly */
IriSP.createAnnotationWidget.prototype.handleTextChanges = function(event) {
  var contents = this.selector.find(".Ldt-createAnnotation-Description").val();

  for(var keyword in this.ids) {
  
    var id = this.ids[keyword];

    if (contents.indexOf(keyword) != -1) {
      /* the word is present in the textarea but the button is not toggled */
      if (this.selector.find("#" + id).hasClass("Ldt-createAnnotation-absent-keyword"))
          this.selector.find("#" + id).removeClass("Ldt-createAnnotation-absent-keyword")
                                      .addClass("Ldt-createAnnotation-present-keyword");      
    } else {
      /* the word is absent from the textarea but the button is toggled */
      if (this.selector.find("#" + id).hasClass("Ldt-createAnnotation-present-keyword")) {
          this.selector.find("#" + id).removeClass("Ldt-createAnnotation-present-keyword")
                                      .addClass("Ldt-createAnnotation-absent-keyword");
      }
    }
  }
};

/** handle clicks on "send annotation" button */
IriSP.createAnnotationWidget.prototype.handleButtonClick = function(event) {
  this.selector.find(".Ldt-createAnnotation-DoubleBorder").children().hide();
  this.selector.find(".Ldt-createAnnotation-endScreen").show();
};