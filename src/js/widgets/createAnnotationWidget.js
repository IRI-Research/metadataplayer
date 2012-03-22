IriSP.createAnnotationWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this._hidden = true;
  
  this.checkOption("keywords");
  this.checkOption("polemic_mode", true);
  this.checkOption("polemics");
  this.checkOption("cinecast_version", false);
  this.checkOption("api_endpoint_template");
  this.checkOption("show_from_field", true);
  this.checkOption("api_method");
                         
  if (!IriSP.null_or_undefined(IriSP.user)) {
      if (!IriSP.null_or_undefined(IriSP.user.avatar)) {
        this.user_avatar = IriSP.user.avatar;
      }
      if (!IriSP.null_or_undefined(IriSP.user.name)) {
        this.user_name = IriSP.user.name;
      }
  }
  
  /* variables to save the current position of the slicer */
  if (this.cinecast_version) {
    this.sliceLeft = 0;
    this.sliceWidth = 0;
  }
};


IriSP.createAnnotationWidget.prototype = new IriSP.Widget();

IriSP.createAnnotationWidget.prototype.clear = function() {
    this.selector.find(".Ldt-SaTitle").text("");
    this.selector.find(".Ldt-SaDescription").text("");
    this.selector.find(".Ldt-SaKeywordText").text("");
};

IriSP.createAnnotationWidget.prototype.draw = function() {
  var _this = this;
  
  var annotationMarkup = IriSP.templToHTML(IriSP.createAnnotationWidget_template, 
                                           this);
  
	this.selector.append(annotationMarkup);
  
  if (!this.cinecast_version)
    this.selector.hide();
  else {
    this.showStartScreen();
  }

  // Add onclick event to both polemic and keywords buttons
  
  this.selector.find(".Ldt-createAnnotation-btnblock button").click(function() {
      _this.addKeyword(IriSP.jQuery(this).text());
  });
  
  // js_mod is a custom event because there's no simple way to test for a js
  // change in a textfield.                    
  this.selector.find(".Ldt-createAnnotation-Description")
               .bind("propertychange keyup input paste js_mod", IriSP.wrap(this, this.handleTextChanges));
               
  /* the cinecast version of the player is supposed to pause when the user clicks on the button */

  /* the cinecast version expects the user to comment on a defined segment.
     As the widget is always shown, we need a way to update it's content as
     time passes. We do this like we did with the annotationsWidget : we schedule
     a .code start function which will be called at the right time.
  */
  if (this.cinecast_version) {
    var legal_ids;
    if (typeof(this._serializer.getChapitrage()) !== "undefined")
      legal_id = this._serializer.getChapitrage();
    else 
      legal_id = this._serializer.getNonTweetIds()[0];
    
    var annotations = this._serializer._data.annotations;
    var i;
  
    for (i in annotations) {     
      var annotation = annotations[i];
      if (typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
            && legal_id !== annotation.meta["id-ref"]) {
          continue;
      }
      
      code = {start: annotation.begin / 1000, end: annotation.end / 1000,
              onStart: function(annotation) { return function() {
                      if (typeof(annotation.content) !== "undefined")
                        _this.selector.find(".Ldt-createAnnotation-Title").html(annotation.content.title);

                      _this._currentAnnotation = annotation;
                      var beginTime = IriSP.msToTime(annotation.begin);
                      var endTime = IriSP.msToTime(annotation.end);
                      var timeTemplate = IriSP.templToHTML("- ({{begin}} - {{ end }})", {begin: beginTime, end: endTime });
                      _this.selector.find(".Ldt-createAnnotation-TimeFrame").html(timeTemplate);
              } }(annotation)
            };
      
      this._Popcorn.code(code);
    }
  }
  
  this.selector.find(".Ldt-createAnnotation-submitButton").click(IriSP.wrap(this, this.handleButtonClick));
  
  if (!this.cinecast_version) {
    this._Popcorn.listen("IriSP.PlayerWidget.AnnotateButton.clicked", 
                          IriSP.wrap(this, this.handleAnnotateSignal));
    
    // handle clicks on the cancel button too.
    this.selector.find(".Ldt-createAnnotation-Minimize").click(IriSP.wrap(this, 
      function() {
        // we've got to simulate the pressing of the button because there's no
        // other way to minimize the widget and show the widgets that were hidden
        // same time
        this._Popcorn.trigger("IriSP.PlayerWidget.AnnotateButton.clicked");
      }
    ));
  }
};

/* Handles adding keywords and polemics */
IriSP.createAnnotationWidget.prototype.addKeyword = function(_keyword) {
    var _field = this.selector.find(".Ldt-createAnnotation-Description"),
        _rx = IriSP.regexpFromText(_keyword),
        _contents = _field.val();
    _contents = ( _rx.test(_contents)
        ? _contents.replace(_rx,"").replace("  "," ").trim()
        : _contents.trim() + " " + _keyword
    );
    _field.val(_contents);
    _field.trigger("js_mod");
}

/** handles clicks on the annotate button. Works only for the non-cinecast version */
IriSP.createAnnotationWidget.prototype.handleAnnotateSignal = function() {
  
  if (this._hidden == false && this._state == 'startScreen') {
    this.selector.hide();
    this._hidden = true;
    
    // free the arrow.
    this._Popcorn.trigger("IriSP.ArrowWidget.releaseArrow");
    this._Popcorn.trigger("IriSP.SliceWidget.hide");
    this._Popcorn.trigger("IriSP.AnnotationsWidget.show");
    
  } else {
    this._Popcorn.trigger("IriSP.AnnotationsWidget.hide");
    this.showStartScreen();    
    this.selector.show();
    this._hidden = false;
    var currentTime = this._Popcorn.currentTime();
    
    // block the arrow.
    this._Popcorn.trigger("IriSP.ArrowWidget.blockArrow");
    
    var duration = this._serializer.getDuration();
        
    var currentChapter = this._serializer.currentChapitre(currentTime);

    if (IriSP.null_or_undefined(currentChapter)) {      
      var left = this.selector.width() / 2;
      var width = this.selector.width() / 10;
    } else {
      var left = (currentChapter.begin / duration) * this.selector.width();
      var width = (currentChapter.end / duration) * this.selector.width() - left;
    }
    
    // slider position and length is kept in percents.
    this.sliceLeft = (left / this.selector.width()) * 100;
    this.sliceWidth = (width / this.selector.width()) * 100;
    
    this._Popcorn.trigger("IriSP.SliceWidget.position", [left, width]);
    this._Popcorn.listen("IriSP.SliceWidget.zoneChange", IriSP.wrap(this, this.handleSliderChanges));
    this._Popcorn.trigger("IriSP.SliceWidget.show");
    
    if (!IriSP.null_or_undefined(currentChapter)) {
      this.selector.find(".Ldt-createAnnotation-Title").html(currentChapter.content.title);

      this._currentcurrentChapter = currentChapter;
      var beginTime = IriSP.msToTime(currentChapter.begin);
      var endTime = IriSP.msToTime(currentChapter.end);
      var timeTemplate = IriSP.templToHTML("- ({{begin}} - {{ end }})", {begin: beginTime, end: endTime });
      this.selector.find(".Ldt-createAnnotation-TimeFrame").html(timeTemplate);
    }
  }
};


/** watch for changes in the textfield and change the buttons accordingly */
IriSP.createAnnotationWidget.prototype.handleTextChanges = function(event) {
  var contents = this.selector.find(".Ldt-createAnnotation-Description").val();
  if (this.cinecast_version && !this._Popcorn.media.paused) {
      this._Popcorn.pause();
  }
  this.selector.find(".Ldt-createAnnotation-btnblock button").each(function() {
      var _rx = IriSP.regexpFromText(IriSP.jQuery(this).text());
      if (_rx.test(contents)) {
          IriSP.jQuery(this).parent().addClass("Ldt-createAnnotation-active-button");
      } else {
          IriSP.jQuery(this).parent().removeClass("Ldt-createAnnotation-active-button");
      }
  });
  
};

IriSP.createAnnotationWidget.prototype.showStartScreen = function() {
  this.selector.find(".Ldt-createAnnotation-screen").hide();
  this.selector.find(".Ldt-createAnnotation-startScreen").show();
  
  var jqTextfield = this.selector.find(".Ldt-createAnnotation-Description"); // handle on the textfield. used for the closure
  
  /* test if the browser supports the placeholder attribute */
  if (!IriSP.null_or_undefined(jqTextfield.get(0).placeholder)) {
    jqTextfield.attr("placeholder", IriSP.i18n.getMessage('type_here')); 
  } else {
    jqTextfield.val(IriSP.i18n.getMessage('type_here'));
    jqTextfield.one("click", IriSP.wrap(this, function() { jqTextfield.val(""); }));    
  }
  
 
  
  this._state = "startScreen";
};

IriSP.createAnnotationWidget.prototype.showWaitScreen = function() {
  this.selector.find(".Ldt-createAnnotation-screen").hide();
  this.selector.find(".Ldt-createAnnotation-waitScreen").show();
  this._state = "waitScreen";
};

IriSP.createAnnotationWidget.prototype.showErrorScreen = function() {
  this.selector.find(".Ldt-createAnnotation-screen").hide();
  this.selector.find(".Ldt-createAnnotation-errorScreen").show();
  this._state = "errorScreen";
  var _this = this;
  window.setTimeout(function() { _this.showStartScreen(); }, 2000);
};

/** update show the final screen with links to share the created annotation */
IriSP.createAnnotationWidget.prototype.showEndScreen = function(annotation) {
  this.selector.find(".Ldt-createAnnotation-screen").hide();
  
  if (this.cinecast_version) {
    this.selector.find(".Ldt-createAnnotation-Title").parent().show();      
  }

  var url = ( (typeof annotation.meta == "object" && typeof annotation.meta.url == "string" && annotation.meta.url.length)
    ? annotation.meta.url
    : ( document.location.href + "#id=" + annotation.id ) );
  var twStatus = IriSP.mkTweetUrl(url);
  var gpStatus = IriSP.mkGplusUrl(url);
  var fbStatus = IriSP.mkFbUrl(url);
  
  this.selector.find(".Ldt-createAnnotation-endScreen-TweetLink").attr("href", twStatus);
  this.selector.find(".Ldt-createAnnotation-endScreen-FbLink").attr("href", fbStatus);
  this.selector.find(".Ldt-createAnnotation-endScreen-GplusLink").attr("href", gpStatus);
          
  this.selector.find(".Ldt-createAnnotation-endScreen").show();
  this._state = "endScreen";
};

/** handle clicks on "send annotation" button */
IriSP.createAnnotationWidget.prototype.handleButtonClick = function(event) {
  var _this = this;
  var textfield = this.selector.find(".Ldt-createAnnotation-Description");
  var contents = textfield.val();
  
  if (contents === "") {  
    if (this.selector.find(".Ldt-createAnnotation-errorMessage").length === 0) {
      this.selector.find(".Ldt-createAnnotation-Container")
                   .after(IriSP.templToHTML(IriSP.createAnnotation_errorMessage_template));
      textfield.css("background-color", "#d93c71");      
    } else {      
      this.selector.find(".Ldt-createAnnotation-errorMessage").show();
    }

      textfield.one("js_mod propertychange keyup input paste", IriSP.wrap(this, function() {
                      var contents = textfield.val();
                      
                      if (contents !== "") {
                        this.selector.find(".Ldt-createAnnotation-errorMessage").hide();
                        textfield.css("background-color", "");
                      }
                   }));
  } else {
    this.showWaitScreen();
    
    this.sendLdtData(contents, function(annotation) {
                      if (_this.cinecast_version) {
                          if (_this._Popcorn.media.paused)
                            _this._Popcorn.play();
                      }

                      if (_this._state == "waitScreen") {
                        _this.showEndScreen(annotation);
                        if (_this.cinecast_version) {
                          window.setTimeout(function() { _this.showStartScreen(); }, 5000);
                        }
                      }
                      // hide the slicer widget
                      if (!_this.cinecast_version) {                      
                        _this._Popcorn.trigger("IriSP.SliceWidget.hide");
                      }           
                    });
  }
};

IriSP.createAnnotationWidget.prototype.handleSliderChanges = function(params) {
  this.sliceLeft = params[0];
  this.sliceWidth = params[1];
};

IriSP.createAnnotationWidget.prototype.sendLdtData = function(contents, callback) {
  var _this = this;
  var apiJson = {annotations : [{}], meta: {}};
  var annotation = apiJson.annotations[0];
  
  annotation.media = this._serializer.currentMedia()["id"];
  
  if (this.cinecast_version) {   
      annotation.begin = Math.round(this._Popcorn.currentTime() * 1000);
      annotation.end = annotation.begin;      
  } else {
    var duration = this._serializer.getDuration();    
    annotation.begin = +((duration * (this.sliceLeft / 100)).toFixed(0));
    annotation.end = +((duration * ((this.sliceWidth + this.sliceLeft) / 100)).toFixed(0));
  }

  // boundary checks
  annotation.begin = Math.max(0, annotation.begin);
  annotation.end = Math.min(this._serializer.getDuration(), annotation.end);
  
  annotation.type = ( this.cinecast_version ? "cinecast:UserAnnotation" : ( this._serializer.getContributions() || "" ));
  if (typeof(annotation.type) === "undefined")
    annotation.type = "";
  
  annotation.type_title = "Contributions";
  annotation.content = {};
  annotation.content.data = contents;
  
  var meta = apiJson.meta;
  
  
  var _username = this.selector.find(".Ldt-createAnnotation-userName").val();
  meta.creator = (
      (_username && _username.length)
      ? _username
      : (
          (!IriSP.null_or_undefined(IriSP.user) && !IriSP.null_or_undefined(IriSP.user.name))
          ? IriSP.user.name
          : "Anonymous user"
      )
  );
  
  meta.created = Date().toString();
  
  // All #hashtags are added to tags
  annotation.tags = contents.match(/#[^#\s]+\b/gim) || [];
  
  var jsonString = JSON.stringify(apiJson);
  var project_id = this._serializer._data.meta.id;
  
  //TODO: extract magic url
  var url = Mustache.to_html(this.api_endpoint_template,
                              {id: project_id});
                          
  IriSP.jQuery.ajax({
      url: url,
      type: this.api_method,
      contentType: 'application/json',
      data: jsonString,               
      //dataType: 'json',
      success: IriSP.wrap(this, function(json, textStatus, XMLHttpRequest) {                   
                    /* add the annotation to the annotation and tell the world */
                    if (this.cinecast_version) {
                        var annotation = json.annotations[0];
                    } else {
                    /* if the media doesn't have a contributions line, we need to add one */
                        if (typeof(this._serializer.getContributions()) === "undefined") {
                          /* set up a basic view */
                          var tmp_view = {"dc:contributor": "perso", "dc:creator": "perso", "dc:title": "Contributions",
                                          "id": json.annotations[0].type}
    
                          
                            IriSP.get_aliased(this._serializer._data, ["annotation_types", "annotation-types"]).push(tmp_view);
                        }
                        
                        delete annotation.tags;
                        annotation.content.description = annotation.content.data;
                        annotation.content.title = "";
                        delete annotation.content.data;
                        annotation.id = json.annotations[0].id;
    
                        annotation.meta = meta;
                        annotation.meta["id-ref"] = json.annotations[0]["type"];
                    }
                        
                    // everything is shared so there's no need to propagate the change
                    _this._serializer._data.annotations.push(annotation);
 
                    _this._Popcorn.trigger("IriSP.createAnnotationWidget.addedAnnotation", annotation);
                    callback(annotation);
      }), 
      error: 
              function(jqXHR, textStatus, errorThrown) { 
                            console.log("an error occured while contacting " 
                            + url + " and sending " + jsonString + textStatus ); 
                            _this.showErrorScreen(); } });
};