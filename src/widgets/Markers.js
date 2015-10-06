
IriSP.Widgets.Markers = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.Markers.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.Markers.prototype.defaults = {
    annotation_type: "markers",
    line_height: 8,
    background: "#e0e0e0",
    marker_color: "#ff80fc",
    placeholder_color: "#ffffff",
    hover_color: "#e15581",
    selected_color: "#74d600",
    ball_radius: 4,
    pause_on_write: true,
    play_on_submit: true,
    api_serializer: "ldt_annotate",
    api_endpoint_template_create: "",
    api_endpoint_template_edit: "",
    api_endpoint_template_delete: "",
    api_method_create: "POST",
    api_method_edit: "PUT",
    api_method_delete: "DELETE",
    project_id: "",
    creator_name: "",
    after_send_timeout: 0,
    markers_gap: 2000,
    allow_empty_markers: false,
    close_after_send: false,
    custom_send_button: false,
    custom_cancel_button: false,
    preview_mode: false,
};

IriSP.Widgets.Markers.prototype.template = 
    '<div class="Ldt-Markers-Display" style="height:{{line_height}}px;">'
    +     '<div class="Ldt-Markers-List" style="height:{{line_height}}px; position: relative;"></div>'
    +     '<div class="Ldt-Markers-Position"></div>'
    + '</div>'
    + '<div class="Ldt-Markers-Inputs">'
    +     '<div class="Ldt-Markers-Screen Ldt-Markers-ScreenMain">'
    +         '<div class="Ldt-Markers-RoundButton Ldt-Markers-CannotCreate" title="{{#preview_mode}}{{l10n.preview_mode_submit}}{{/preview_mode}}{{^preview_mode}}{{l10n.cannot_create}}{{/preview_mode}}">+</div>'
    +         '<div class="Ldt-Markers-RoundButton Ldt-Markers-Create">+</div>'
    +         '{{^preview_mode}}<div class="Ldt-Markers-RoundButton Ldt-Markers-Delete">&#10006;</div>{{/preview_mode}}'
    +         '{{#preview_mode}}<div class="Ldt-Markers-RoundButton Ldt-Markers-PreviewDelete" title="{{l10n.preview_mode_delete}}">&#10006;</div>{{/preview_mode}}'
    +         '<div class="Ldt-Markers-Info"></div>'
    +     '</div>'
    +     '<div class="Ldt-Markers-Screen Ldt-Markers-ScreenSending">'  
    +         '<div class="Ldt-Markers-Screen-InnerBox">{{l10n.wait_while_processing}}</div>'
    +     '</div>'
    +     '<div class="Ldt-Markers-Screen Ldt-Markers-ScreenSuccess">'
    +         '<a title="{{l10n.close_widget}}" class="Ldt-Markers-Close" href="#"></a>'    
    +         '<div class="Ldt-Markers-Screen-InnerBox">{{l10n.annotation_saved}}</div>'
    +     '</div>'
    +     '<div class="Ldt-Markers-Screen Ldt-Markers-ScreenDeleteSuccess">'
    +         '<a title="{{l10n.close_widget}}" class="Ldt-Markers-Close" href="#"></a>'    
    +         '<div class="Ldt-Markers-Screen-InnerBox">{{l10n.delete_saved}}</div>'
    +     '</div>'
    +     '<div class="Ldt-Markers-Screen Ldt-Markers-ScreenFailure">'
    +         '<a title="{{l10n.close_widget}}" class="Ldt-Markers-Close" href="#"></a>'
    +         '<div class="Ldt-Markers-Screen-InnerBox">{{l10n.error_while_contacting}}</div>'
    +     '</div>'
    +     '<div class="Ldt-Markers-Screen Ldt-Markers-ScreenConfirmDelete">'
    +         '<a title="{{l10n.close_widget}}" class="Ldt-Markers-Close" href="#"></a>'
    +         '<div class="Ldt-Markers-Screen-InnerBox">'
    +           '{{l10n.delete_text}} '
    +           '<a class="Ldt-Markers-Screen-SubmitDelete">{{l10n.submit_delete}}</a> '
    +           '<a class="Ldt-Markers-Screen-CancelDelete">{{l10n.cancel}}</a>'
    +         '</div>'
    +     '</div>'
    + '</div>';


IriSP.Widgets.Markers.prototype.markerTemplate = 
    '<div class="Ldt-Markers-Marker" style="height:{{height}}px; left:{{left}}px; width: 2px; background-color: black;">' +
        '<div class="Ldt-Markers-MarkerBall" style="background-color: {{marker_color}}; position: relative; width: {{ball_diameter}}px; height: {{ball_diameter}}px; left: {{ball_left}}px; top: {{ball_top}}px; border: 1px solid; border-radius: {{ball_radius}}px"></div>' + 
    '</div>';

IriSP.Widgets.Markers.prototype.markerPlaceholderTemplate = 
    '<div class="Ldt-Markers-Marker Ldt-Markers-PlaceholderMarker" style="height:{{height}}px; left:{{left}}px; width: 2px; background-color: black;">' +
        '<div class="Ldt-Markers-MarkerBall" style="background-color: {{marker_color}}; position: relative; width: {{ball_diameter}}px; height: {{ball_diameter}}px; left: {{ball_left}}px; top: {{ball_top}}px; border: 1px solid; border-radius: {{ball_radius}}px"></div>' + 
    '</div>'; 

IriSP.Widgets.Markers.prototype.infoTemplate = 
    '{{^edit}}<div class="Ldt-Markers-MarkerDescription">{{marker_info}}</div>{{/edit}}' +
    '{{#edit}}<div class="Ldt-Markers-MarkerEdit">' + 
        '<textarea class="Ldt-Markers-MarkerTextArea" cols="60" rows="4">{{marker_info}}</textarea>' +
        '<div class="Ldt-Markers-Buttons">' +
            '{{^preview_mode}}<div class="Ldt-Markers-MarkerSend">{{send}}</div>{{/preview_mode}}' +
            '{{#preview_mode}}<div class="Ldt-Markers-MarkerPreviewSend" title="{{preview_mode_text}}">{{send}}</div>{{/preview_mode}}' +
            '<div class="Ldt-Markers-MarkerCancel">{{cancel}}</div>' +
        '</div>' +
    '</div>{{/edit}}'

IriSP.Widgets.Markers.prototype.messages = {
    en : {
        send : "Send",
        submit_delete: "Delete",
        cancel : "Cancel",
        preview_mode_submit: "You cannot submit a marker in preview mode.",
        preview_mode_delete: "You cannot delete a marker in preview mode",
        wait_while_processing: "Please wait while your annotation is being processed...",
        delete_text: "The selected marker will be deleted. Continue?",
        error_while_contacting: "An error happened while contacting the server. Your annotation has not been saved.",
        annotation_saved: "Thank you, your annotation has been saved.",
        delete_saved: "Thank you, your annotation has been deleted",
        close_widget: "Close",
        cannot_create: "Cannot create marker on this timecode"
    },
    fr : {
        send : "Envoyer",
        submit_delete: "Supprimer",
        cancel : "Annuler",
        preview_mode_submit: "Vous ne pouvez pas créer ou éditer de marqueur en mode aperçu",
        preview_mode_delete: "Vous ne pouvez pas supprimer de marqueur en mode aperçu",
        wait_while_processing: "Veuillez patienter pendant le traitement de votre annotation...",
        delete_text: "Le marqueur sélectionné sera supprimé. Continuer?",
        error_while_contacting: "Une erreur s'est produite en contactant le serveur. Votre annotation n'a pas été enregistrée.",
        annotation_saved: "Merci, votre annotation a été enregistrée.",
        delete_saved: "Merci, votre annotation a été supprimée",
        close_widget: "Fermer",
        cannot_create: "Impossible de créer un marqueur sur ce timecode"
    }
}

IriSP.Widgets.Markers.prototype.draw = function(){
    var _this = this;
    
    this.renderTemplate();
    
    this.markers = this.getWidgetAnnotations().filter(function(_ann) {
        return ((_ann.getDuration() == 0) || (_ann.begin == _ann.end));
    });
    this.drawMarkers();
    
    this.$.find(".Ldt-Markers-Create").click(this.functionWrapper("onCreateClick"));
    this.$.find(".Ldt-Markers-Delete").click(this.functionWrapper("onDeleteClick"));
    this.$.find(".Ldt-Markers-RoundButton").hide()
    this.updateCreateButtonState(this.media.getCurrentTime())
    this.$.find(".Ldt-Markers-Screen-SubmitDelete").click(this.functionWrapper("sendDelete"));
    this.$.find(".Ldt-Markers-Screen-CancelDelete").click(function(){
        _this.showScreen("Main");
        _this.cancelEdit();
    })
    this.showScreen("Main");
    this.$.css({
        margin: "1px 0",
        height: this.line_height,
        background: this.background
    });
    
    this.$.find(".Ldt-Markers-Close").click(this.functionWrapper("revertToMainScreen"));
    
    this.onMediaEvent("timeupdate", this.functionWrapper("updatePosition"));
    this.onMediaEvent("timeupdate", this.functionWrapper("updateCreateButtonState"));
    this.onMediaEvent("play", this.functionWrapper("clearSelectedMarker"));
    this.onMdpEvent("Markers.refresh", this.functionWrapper("drawMarkers"));
   
    this.newMarkerTimeCode = 0;
    this.selectedMarker = false;
}


IriSP.Widgets.Markers.prototype.updatePosition = function(_time) {    
    var _x = Math.floor( this.width * _time / this.media.duration);
    this.$.find('.Ldt-Markers-Position').css({
        left: _x + "px"
    });
}

IriSP.Widgets.Markers.prototype.updateCreateButtonState = function(_time){
    _this = this
    var can_create = this.preview_mode? false : this.markers.every(function(_marker){   
        return ((_time < (_marker.begin-_this.markers_gap))||(_time > (_marker.begin+_this.markers_gap)))
    });
    if (can_create){
        if ((this.$.find(".Ldt-Markers-Create").is(":hidden"))&&(this.$.find(".Ldt-Markers-Delete").is(":hidden")||this.$.find(".Ldt-Markers-PreviewDelete").is(":hidden"))){
            this.$.find(".Ldt-Markers-RoundButton").hide();
            this.$.find(".Ldt-Markers-Create").show();
        }
    }
    else {
        if ((this.$.find(".Ldt-Markers-CannotCreate").is(":hidden"))&&(this.$.find(".Ldt-Markers-Delete").is(":hidden")||this.$.find(".Ldt-Markers-PreviewDelete").is(":hidden"))){
            this.$.find(".Ldt-Markers-RoundButton").hide();
            this.$.find(".Ldt-Markers-CannotCreate").show();
        }
    }
}

IriSP.Widgets.Markers.prototype.onCreateClick = function(){
    this.pauseOnWrite();
    if (!this.selectedMarker){
        this.newMarkerCurrentTime = this.media.getCurrentTime();
        this.showPlaceholder(this.media.getCurrentTime());
        this.startEdit();
    }
}

IriSP.Widgets.Markers.prototype.onDeleteClick = function(){
    _this = this;
    this.pauseOnWrite();
    if(this.selectedMarker){
        this.showScreen("ConfirmDelete");
    }
    else {
        // Click on "x" without a selected marker: back to initial state
        this.cancelEdit();
    }
}

IriSP.Widgets.Markers.prototype.startEdit = function(){
    if (this.selectedMarker){
        _divHtml = Mustache.to_html(this.infoTemplate, {
            edit: true,
            preview_mode: this.preview_mode,
            preview_mode_text: this.l10n.preview_mode_submit,
            marker_info: this.selectedMarker.description,
            send: this.custom_send_button? this.custom_send_button : this.l10n.send,
            cancel: this.custom_cancel_button? this.custom_cancel_button :this.l10n.cancel
        })
    }
    else {
        _divHtml = Mustache.to_html(this.infoTemplate, {
            edit: true,
            marker_info: "",
            preview_mode: this.preview_mode,
            preview_mode_text: this.l10n.preview_mode_submit,
            send: this.custom_send_button? this.custom_send_button : this.l10n.send,
            cancel: this.custom_cancel_button? this.custom_cancel_button :this.l10n.cancel
        })
    }
    this.$.find(".Ldt-Markers-Info").html(_divHtml);
    this.$.find(".Ldt-Markers-MarkerSend").click(this.functionWrapper("onSubmit"));
    this.$.find(".Ldt-Markers-MarkerCancel").click(this.functionWrapper("cancelEdit"));
    this.$.find(".Ldt-Markers-MarkerTextArea").bind("change keyup input paste", this.functionWrapper("onDescriptionChange"));
    this.$.find(".Ldt-Markers-RoundButton").hide();
    if (this.preview_mode){
        this.$.find(".Ldt-Markers-PreviewDelete").show(); 
    }
    else {
        this.$.find(".Ldt-Markers-Delete").show();
    }
    this.editing = true;
}

IriSP.Widgets.Markers.prototype.cancelEdit = function(){
    if (this.selectedMarker){
        // Click on "cancel" while editing a marker: back to visualization state
        _divHtml = Mustache.to_html(this.infoTemplate, {
            edit: false,
            marker_info: this.selectedMarker.description,
        })
        this.$.find(".Ldt-Markers-Info").html(_divHtml);
        if (!this.preview_mode){
            this.$.find(".Ldt-Markers-MarkerDescription").click(this.functionWrapper("startEdit"));
        }
    }
    else {
        // Click on "cancel" while editing a marker: back to initial state
        this.hidePlaceholder();
        this.$.find(".Ldt-Markers-Info").html("");
        this.$.find(".Ldt-Markers-RoundButton").hide()
        this.$.find(".Ldt-Markers-Create").show()
        this.updateCreateButtonState(this.media.getCurrentTime())
    }
    this.editing = false;
}

IriSP.Widgets.Markers.prototype.onDescriptionChange = function(){
    // Returns false if the textarea is empty, true if there is text in it
    if(!this.allow_empty_markers){
        var _field = this.$.find(".Ldt-Markers-MarkerTextArea"),
            _contents = _field.val();
        _field.css("border-color", !!_contents ? "#e87d9f" : "#ff0000");
        if (!!_contents) {
            _field.removeClass("empty");
        } else {
            _field.addClass("empty");
        }
        this.pauseOnWrite();
        return !!_contents;
    }
    else {
        // If the widget is configured to allow to post empty markers, it returns true
        return true
    }
};

IriSP.Widgets.Markers.prototype.pauseOnWrite = function(){
    if (this.pause_on_write && !this.media.getPaused()) {
        this.media.pause();
    }
};

IriSP.Widgets.Markers.prototype.showScreen = function(_screenName) {
    this.$.find('.Ldt-Markers-Screen' + _screenName).show()
        .siblings().hide();
}

IriSP.Widgets.Markers.prototype.revertToMainScreen = function(){
    if (this.$.find(".Ldt-Markers-ScreenMain").is(":hidden")){
        this.showScreen("Main");
        this.cancelEdit();
        if (this.selectedMarker){
            this.$.find(".Ldt-Markers-RoundButton").hide();
            if (this.preview_mode){
                this.$.find(".Ldt-Markers-PreviewDelete").show(); 
            }
            else {
                this.$.find(".Ldt-Markers-Delete").show();
            }
        }
        else {
            this.$.find(".Ldt-Markers-RoundButton").hide();
            this.$.find(".Ldt-Markers-Create").show();
            this.updateCreateButtonState();
        }
    }
}

IriSP.Widgets.Markers.prototype.hidePlaceholder = function(){
    this.$.find(".Ldt-Markers-PlaceholderMarker").remove();
}

IriSP.Widgets.Markers.prototype.showPlaceholder = function(_time){   
    var _scale = this.width / this.source.getDuration(),
        _left = _time * _scale -1,
        _data = {
            left: _left,
            height: this.line_height-1,
            ball_top: (this.ball_radius*2 > this.line_height) ? 0 : ((this.line_height - this.ball_radius*2)/2)-1,
            ball_radius: (this.ball_radius*2 > this.line_height) ? this.line_height/2 : this.ball_radius,
            ball_diameter: (this.ball_radius*2 > this.line_height) ? this.line_height/2 : this.ball_radius*2,
            ball_left: -this.ball_radius,
            marker_color: this.placeholder_color
        },
        _html = Mustache.to_html(this.markerPlaceholderTemplate, _data),
        _el = IriSP.jQuery(_html);
        
    list_$ = this.$.find(".Ldt-Markers-List");
    _el.appendTo(list_$);
}

IriSP.Widgets.Markers.prototype.clearSelectedMarker = function(){
    if (this.selectedMarker){
        var _divHtml = "";
        
        this.selectedMarker = false;
        this.$.find(".Ldt-Markers-Info").html(_divHtml);
        this.$.find(".Ldt-Markers-RoundButton").hide();
        this.$.find(".Ldt-Markers-Create").show();
        this.$.find(".Ldt-Markers-MarkerBall").toggleClass("selected", false);
        this.updateCreateButtonState(this.media.getCurrentTime())
    }
}

IriSP.Widgets.Markers.prototype.drawMarkers = function(){
    var _this = this,
        _scale = this.width / this.source.getDuration(),
        list_$ = this.$.find('.Ldt-Markers-List');

    this.$.remove("Ldt-Markers-Marker");
    list_$.html("");
    this.markers.forEach(function(_marker){
        var _left = _marker.begin * _scale -1,
            _data = {
                left: _left,
                height: _this.line_height-1,
                ball_top: (_this.ball_radius*2 > _this.line_height) ? 0 : ((_this.line_height - _this.ball_radius*2)/2)-1,
                ball_radius: (_this.ball_radius*2 > _this.line_height) ? _this.line_height/2 : _this.ball_radius,
                ball_diameter: (_this.ball_radius*2 > _this.line_height) ? _this.line_height/2 : _this.ball_radius*2,
                ball_left: -_this.ball_radius,
                marker_color: ((_this.selectedMarker)&&(_this.selectedMarker.id == _marker.id))? _this.selected_color : _this.marker_color
            },
            _html = Mustache.to_html(_this.markerTemplate, _data),
            _el = IriSP.jQuery(_html);
        
        if ((_this.selectedMarker)&&(_this.selectedMarker.id == _marker.id)){
            _el.children().toggleClass("selected", true);
        }
        
        _el.mouseover(function(){
                if (!((_this.selectedMarker)&&(_this.selectedMarker.id == _marker.id))){
                    _el.children().css("background-color", _this.hover_color);
                };
            })
           .mouseout(function(){
              if (!((_this.selectedMarker)&&(_this.selectedMarker.id == _marker.id))){
                  _el.children().css("background-color", _this.marker_color);
              };
           })
           .click(function(){
               _this.showScreen("Main");
               _this.cancelEdit();
               _this.hidePlaceholder();
               if (!((_this.selectedMarker)&&(_this.selectedMarker.id == _marker.id))){
                  // if there either is no marker selected or we click a different marker
                  list_$.find(".Ldt-Markers-MarkerBall").css("background-color", _this.marker_color)
                  list_$.find(".Ldt-Markers-MarkerBall").toggleClass("selected", false);
                  _el.children().toggleClass("selected", true);
                  _el.children().css("background-color", _this.selected_color)
                  _this.selectedMarker = _marker;
                  
                  _divHtml = Mustache.to_html(_this.infoTemplate, {
                      edit: false,
                      marker_info: _marker.description,
                  })
                  
                  _this.$.find(".Ldt-Markers-Info").html(_divHtml);
                  if (!_this.preview_mode){
                      _this.$.find(".Ldt-Markers-MarkerDescription").click(_this.functionWrapper("startEdit"));
                  }
                  _this.$.find(".Ldt-Markers-RoundButton").hide();
                  if (_this.preview_mode){
                      _this.$.find(".Ldt-Markers-PreviewDelete").show(); 
                  }
                  else {
                      _this.$.find(".Ldt-Markers-Delete").show();
                  }

               }
               else {
                   // if we click the currently selected marker, we unselect it
                   _el.children().css("background-color", _this.hover_color);
                   _this.clearSelectedMarker();
               }
               
               if (_this.selectedMarker) {
                   // Only if we select a new marker do we pause video and time jump
                   _this.media.pause();
                   _marker.trigger("click");
               }
           })
           .appendTo(list_$);
    })
}


IriSP.Widgets.Markers.prototype.onSubmit = function(){
    
    /* If mandatory fields are empty, we cancel the sending */
    if (!this.allow_empty_markers && !this.onDescriptionChange()){
        return false;
    }
    
    /* We pause the video if it's still playing */
    if (!this.media.getPaused()){
        this.media.pause();
    }
    
    var _this = this,
        _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager), /* We create a List to send to the server that will contains the annotation */
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}), /* We create a source object using a specific serializer for export */
        _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type, true), /* We get the AnnotationType in which the annotation will be added */
        _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)); /* If it doesn't already exists, we create it */
    if (this.selectedMarker){
        var _annotation = this.selectedMarker,
            _url = Mustache.to_html(this.api_endpoint_template_edit, {annotation_id: this.selectedMarker ? this.selectedMarker.id : ""});
        _annotation.source = _export
        _annotation.description = this.$.find(".Ldt-Markers-MarkerTextArea").val(); /* Description field */
    }
    else {
        var _annotation = new IriSP.Model.Annotation(false, _export),
            _url = Mustache.to_html(this.api_endpoint_template_create);
        
        /* If we created an AnnotationType on the spot ... */
        if (!_annotationTypes.length) {
            /* ... We must not send its id to the server ... */
            _annotationType.dont_send_id = true;
            /* ... And we must include its title. */
            _annotationType.title = this.annotation_type;
        }
        
        _annotation.setMedia(this.source.currentMedia.id); /* Annotated media ID */
        if (!this.selectedMarker){
            _annotation.setBegin(this.newMarkerCurrentTime);
            _annotation.setEnd(this.newMarkerCurrentTime);
        }
        _annotation.setAnnotationType(_annotationType.id); /* AnnotationType ID */
        if (this.project_id != ""){
            /* Project id, only if it's been specifiec in the config */
            _annotation.project_id = this.project_id;
        }
        _annotation.created = new Date(); /* Creation date */
        _annotation.description = this.$.find(".Ldt-Markers-MarkerTextArea").val(); /* Description field */
        _annotation.creator = this.creator_name;
    }
    _annotation.project_id = this.project_id;
    
    _exportedAnnotations.push(_annotation); /* We add the annotation in the list to export */
    _export.addList("annotation",_exportedAnnotations); /* We add the list to the source object */ 
    
    /* We send the AJAX request to the server ! */
    IriSP.jQuery.ajax({
        url: _url,
        type: this.selectedMarker ? this.api_method_edit : this.api_method_create,
        contentType: 'application/json',
        data: _export.serialize(),
        success: function(_data) {
            _this.showScreen('Success');
            window.setTimeout(_this.functionWrapper("revertToMainScreen"),(_this.after_send_timeout || 5000));
            _export.getAnnotations().removeElement(_annotation, true); /* We delete the sent annotation to avoid redundancy */
            _export.deSerialize(_data); /* Data deserialization */
            _annotation.id = _data.id;
            _this.source.merge(_export); /* We merge the deserialized data with the current source data */
            if (_this.pause_on_write && _this.media.getPaused() && _this.play_on_submit) {
                _this.media.play();
            }
            _this.markers.push(_annotation);
            _this.selectedMarker = _annotation;
            _this.drawMarkers();
            _this.player.trigger("AnnotationsList.refresh");
            _this.player.trigger("Markers.refresh");
        },
        error: function(_xhr, _error, _thrown) {
            IriSP.log("Error when sending annotation", _thrown);
            _export.getAnnotations().removeElement(_annotation, true);
            _this.showScreen('Failure');
            window.setTimeout(_this.functionWrapper("revertToMainScreen"),(_this.after_send_timeout || 5000));
        }
    });
    this.showScreen('Sending');
    
    return false;
};

IriSP.Widgets.Markers.prototype.sendDelete = function(){
    _this = this;
    _url = Mustache.to_html(this.api_endpoint_template_delete, {annotation_id: this.selectedMarker ? this.selectedMarker.id : "", project_id: this.selectedMarker.project_id? this.selectedMarker.project_id : this.project_id});
    IriSP.jQuery.ajax({
        url: _url,
        type: this.api_method_delete,
        contentType: 'application/json',
        success: function(_data) {
            _this.showScreen('DeleteSuccess');
            window.setTimeout(_this.functionWrapper("revertToMainScreen"),(_this.after_send_timeout || 5000));
            if (_this.pause_on_write && _this.media.getPaused() && _this.play_on_submit) {
                _this.media.play();
            }
            _this.markers.removeElement(_this.selectedMarker);
            _this.selectedMarker = false
            _this.player.trigger("AnnotationsList.refresh");
            _this.player.trigger("Markers.refresh");
        },
        error: function(_xhr, _error, _thrown) {
            IriSP.log("Error when sending annotation", _thrown);
            _this.showScreen('Failure');
            window.setTimeout(_this.functionWrapper("revertToMainScreen"),(_this.after_send_timeout || 5000));
        }
    });
    this.showScreen("Sending")
}