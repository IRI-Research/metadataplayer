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
    
    // free the arrow.
    this._Popcorn.trigger("IriSP.ArrowWidget.releaseArrow");
  } else {
    if (this.cinecast_version) {
      var currentTime = this._Popcorn.currentTime();
      var currentAnnotation = this._serializer.currentAnnotations(currentTime)[0];

      var beginTime = IriSP.msToTime(currentAnnotation.begin);
      var endTime = IriSP.msToTime(currentAnnotation.end);
      
      /* save the variable because the user may take some time writing his 
         comment so the currentAnnottion may change when it's time to post it */
      this._currentAnnotation = currentAnnotation;
      
      if (typeof(currentAnnotation.content) !== "undefined")
        this.selector.find(".Ldt-createAnnotation-Title").html(currentAnnotation.content.title);

      var timeTemplate = IriSP.templToHTML("- ({{begin}} - {{ end }})", {begin: beginTime, end: endTime });
      this.selector.find(".Ldt-createAnnotation-TimeFrame").html(timeTemplate);
    }
    
    this.selector.show();
    this._hidden = false;
    
    // block the arrow.
    this._Popcorn.trigger("IriSP.ArrowWidget.blockArrow");
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
      // use namespaced events to be able to unbind them quickly and without unbinding
      // the other event handlers.
      textfield.bind("js_mod.tmp propertychange.tmp keyup.tmp input.tmp paste.tmp", IriSP.wrap(this, function() {
                      var contents = textfield.val();
                      console.log(contents);
                      if (contents !== "") {
                        this.selector.find(".Ldt-createAnnotation-errorMessage").hide();
                        textfield.css("background-color", "");
                        textfield.unbind(".tmp");
                      }
                   }));
  } else {
    this.selector.find(".Ldt-createAnnotation-DoubleBorder").children().hide();
    
    if (this.cinecast_version) {
      this.selector.find(".Ldt-createAnnotation-Title").parent().show();      
    }

    var twStatus = IriSP.mkTweetUrl(document.location.href);
    var gpStatus = IriSP.mkGplusUrl(document.location.href);
    var fbStatus = IriSP.mkFbUrl(document.location.href);
    
    this.selector.find(".Ldt-createAnnotation-endScreen-TweetLink").attr("href", twStatus);
    this.selector.find(".Ldt-createAnnotation-endScreen-FbLink").attr("href", fbStatus);
    this.selector.find(".Ldt-createAnnotation-endScreen-GplusLink").attr("href", gpStatus);
            
    this.selector.find(".Ldt-createAnnotation-endScreen").show();

        
    if (typeof(this._currentAnnotation) === "undefined") {      
      console.log("this._currentAnnotation undefined");
      return;
    }
    
    var apiJson = {annotations : [{}], meta: {}};
    var annotation = apiJson["annotations"][0];
    //annotation["type_title"] = "Contributions";
    annotation["type_title"] = "";
    annotation["media"] = this._serializer.currentMedia()["id"];
    annotation["begin"] = this._currentAnnotation.begin;
    annotation["end"] = this._currentAnnotation.end;
    annotation["type"] = this._serializer.getContributions();
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
    console.log(url);
    IriSP.jQuery.ajax({
                url: url,
                type: 'PUT',
                contentType: 'application/json',
                data: jsonString,
                // bug with jquery >= 1.5, "json" adds a callback so we don't specify dataType
                dataType: 'json',
                success: function(json, textStatus, XMLHttpRequest) {
                    /* add the annotation to the annotations and tell the world */
                    delete annotation.tags;
                    annotation.content.description = annotation.content.data;
                    delete annotation.content.data;
                    annotation.id = json.annotations[0].id;
                    annotation.title = _this._currentAnnotation.content.title;
                    annotation.meta = meta;
                    annotation.meta["id-ref"] = annotation["type"];
                    // everything is shared so there's no need to propagate the change
                    _this._serializer._data.annotations.push(annotation);
                    _this._Popcorn.trigger("IriSP.createAnnotationWidget.addedAnnotation");
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    alert("ERROR = " + jqXHR.responseText + ", " + errorThrown);
                }
            });
  }
};