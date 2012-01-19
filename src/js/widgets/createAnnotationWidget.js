IriSP.createAnnotationWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this._hidden = true;
  this.keywords = IriSP.widgetsDefaults["createAnnotationWidget"].keywords;
  this.cinecast_version = IriSP.widgetsDefaults["createAnnotationWidget"].cinecast_version;
  this.ids = {}; /* a dictionnary linking buttons ids to keywords */
  
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

  var annotationMarkup = IriSP.templToHTML(IriSP.createAnnotationWidget_template);
  
	this.selector.append(annotationMarkup);
  
  if (!this.cinecast_version)
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
        var newVal = contents.replace(" " + keyword, "");
        if (newVal == contents)
          newVal = contents.replace(keyword, "");
      } else {
        if (contents === "")
          var newVal = keyword;
        else
          var newVal = contents + " " + keyword;      
      }
      
      _this.selector.find(".Ldt-createAnnotation-Description").val(newVal);
      // we use a custom event because there's no simple way to test for a js
      // change in a textfield.
      _this.selector.find(".Ldt-createAnnotation-Description").trigger("js_mod");
      // also call our update function.
      _this.handleTextChanges();
    }
   }(keyword));
  }
  
  this.selector.find(".Ldt-createAnnotation-Description")
               .bind("propertychange keyup input paste", IriSP.wrap(this, this.handleTextChanges));
               
  /* the cinecast version of the player is supposed to pause when the user clicks on the button */
  if (this.cinecast_version) {
    this.selector.find(".Ldt-createAnnotation-Description")
                 .one("propertychange keyup input paste js_mod", 
                 function() { if (!_this._Popcorn.media.paused) _this._Popcorn.pause() });
  }
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
  
  if (!this.cinecast_version)
    this._Popcorn.listen("IriSP.PlayerWidget.AnnotateButton.clicked", 
                          IriSP.wrap(this, this.handleAnnotateSignal));  
};

/** handles clicks on the annotate button. Works only for the non-cinecast version */
IriSP.createAnnotationWidget.prototype.handleAnnotateSignal = function() {
  
  if (this._hidden == false) {
    this.selector.hide();
    this._hidden = true;
    
    // free the arrow.
    this._Popcorn.trigger("IriSP.ArrowWidget.releaseArrow");
    this._Popcorn.trigger("IriSP.SliceWidget.hide");
    
  } else {
    this.showStartScreen();
    this.selector.show();
    this._hidden = false;
    var currentTime = this._Popcorn.currentTime();
    
    // block the arrow.
    this._Popcorn.trigger("IriSP.ArrowWidget.blockArrow");
    
    var duration = +this._serializer.currentMedia().meta["dc:duration"];
        
    var currentChapter = this._serializer.currentChapitre(currentTime);
    if (typeof(currentChapter) === "undefined") {
      var left = this.selector.width() / 2;
      var width = this.selector.width() / 10;
    } else {
      var left = (currentChapter.begin / duration) * this.selector.width();
      var width = (currentChapter.end / duration) * this.selector.width() - left;
    }
    
    this.sliceLeft = left;
    this.sliceWidth = width;
    this._Popcorn.trigger("IriSP.SliceWidget.position", [left, width]);
    this._Popcorn.listen("IriSP.SliceWidget.zoneChange", IriSP.wrap(this, this.handleSliderChanges));
    this._Popcorn.trigger("IriSP.SliceWidget.show");
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

IriSP.createAnnotationWidget.prototype.showStartScreen = function() {
  this.selector.find(".Ldt-createAnnotation-DoubleBorder").children().hide();
  this.selector.find(".Ldt-createAnnotation-startScreen").show();
  this.selector.find("Ldt-createAnnotation-Description").val("Type your annotation here.");  
};

IriSP.createAnnotationWidget.prototype.showWaitScreen = function() {
  this.selector.find(".Ldt-createAnnotation-DoubleBorder").children().hide();
  this.selector.find(".Ldt-createAnnotation-waitScreen").show();  
};

IriSP.createAnnotationWidget.prototype.showEndScreen = function(annotation) {
  this.selector.find(".Ldt-createAnnotation-DoubleBorder").children().hide();
  
  if (this.cinecast_version) {
    this.selector.find(".Ldt-createAnnotation-Title").parent().show();      
  }

  var url = document.location.href + "id=" + annotation.id;
  var twStatus = IriSP.mkTweetUrl(url);
  var gpStatus = IriSP.mkGplusUrl(url);
  var fbStatus = IriSP.mkFbUrl(url);
  
  this.selector.find(".Ldt-createAnnotation-endScreen-TweetLink").attr("href", twStatus);
  this.selector.find(".Ldt-createAnnotation-endScreen-FbLink").attr("href", fbStatus);
  this.selector.find(".Ldt-createAnnotation-endScreen-GplusLink").attr("href", gpStatus);
          
  this.selector.find(".Ldt-createAnnotation-endScreen").show();
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

                    _this.showEndScreen(annotation);
                    if (_this.cinecast_version) {
                      window.setTimeout(IriSP.wrap(_this, function() { this.showStartScreen(); }), 5000);
                    }
                    
                    // hide the slicer widget
                    if (!_this.cinecast_version) {
                      console.log("hie");
                      this._Popcorn.trigger("IriSP.SliceWidget.hide");
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
  var annotation = apiJson["annotations"][0];
  
  annotation["media"] = this._serializer.currentMedia()["id"];
  var duration_part = Math.round(this._serializer.currentMedia().meta["dc:duration"] / 20);
  
  if (this.cinecast_version) {   
      annotation["begin"] = Math.round(this._Popcorn.currentTime() * 1000 - duration_part);
      annotation["end"] = Math.round(this._Popcorn.currentTime() * 1000 + duration_part);
      if (annotation["begin"] < 0)
        annotation["begin"] = 0;
      
      if (annotation["end"] > this._serializer.currentMedia().meta["dc:duration"])
        annotation["end"] = this._serializer.currentMedia().meta["dc:duration"];
      
  } else {
    var duration = +this._serializer.currentMedia().meta["dc:duration"];    
    annotation["begin"] = +((duration * (this.sliceLeft / 100)).toFixed(0));
    annotation["end"] = +((duration * ((this.sliceWidth + this.sliceLeft) / 100)).toFixed(0));
  }
  
  annotation["type"] = this._serializer.getContributions();
  if (typeof(annotation["type"]) === "undefined")
    annotation["type"] = "";
  
  annotation["type_title"] = "Contributions";
  annotation.content = {};
  annotation.content["data"] = contents;
  
  var meta = apiJson["meta"];
  meta.creator = "An User";    
  meta.created = Date().toString();
  
  annotation["tags"] = [];
  
  for (var i = 0; i < this.keywords.length; i++) {
    var keyword = this.keywords[i];
    if (contents.indexOf(keyword) != -1)
      annotation["tags"].push(keyword);
  }
  
  var jsonString = JSON.stringify(apiJson);
  var project_id = this._serializer._data.meta.id;
  
  var url = Mustache.to_html("{{platf_url}}/ldtplatform/api/ldt/projects/{{id}}.json",
                              {platf_url: IriSP.platform_url, id: project_id});
                          
  IriSP.jQuery.ajax({
      url: url,
      type: 'PUT',
      contentType: 'application/json',
      data: jsonString,               
      //dataType: 'json',
      success: IriSP.wrap(this, function(json, textStatus, XMLHttpRequest) {                   
                    /* add the annotation to the annotation and tell the world */
                    
                    /* if the media doesn't have a contributions line, we need to add one */
                    if (typeof(this._serializer.getContributions()) === "undefined") {
                      /* set up a basic view */
                      var tmp_view = {"dc:contributor": "perso", "dc:creator": "perso", "dc:title": "Contributions",
                                      "id": json.annotations[0].type}

                      this._serializer._data["annotation-types"].push(tmp_view);
                    }
                    
                    delete annotation.tags;
                    annotation.content.description = annotation.content.data;
                    annotation.content.title = "";
                    delete annotation.content.data;
                    annotation.id = json.annotations[0].id;

                    annotation.meta = meta;
                    annotation.meta["id-ref"] = json.annotations[0]["type"];
                    
                    // everything is shared so there's no need to propagate the change
                    _this._serializer._data.annotations.push(annotation);
 
                    _this._Popcorn.trigger("IriSP.createAnnotationWidget.addedAnnotation", annotation);
                    callback(annotation);
      }), 
      error: 
              function(jqXHR, textStatus, errorThrown) { 
                            console.log("an error occured while contacting " 
                            + url + " and sending " + jsonString + textStatus ); } });
};