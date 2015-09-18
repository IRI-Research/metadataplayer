
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
};

IriSP.Widgets.Markers.prototype.template = 
    '<div class="Ldt-Markers-Display" style="height:{{line_height}}px;">'
    +     '<div class="Ldt-Markers-List" style="height:{{line_height}}px; position: relative;"></div>'
    +     '<div class="Ldt-Markers-Position"></div>'
    + '</div>'
    + '<div class="Ldt-Markers-Inputs">'
    +     '<div class="Ldt-Markers-Screen Ldt-Markers-ScreenMain">'
    +         '<div class="Ldt-Markers-RoundButton Ldt-Markers-CannotCreate" title="{{l10n.cannot_create}}">+</div>'
    +         '<div class="Ldt-Markers-RoundButton Ldt-Markers-Create">+</div>'
    +         '<div class="Ldt-Markers-RoundButton Ldt-Markers-Delete">&#10006;</div>'
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
            '<div class="Ldt-Markers-MarkerSend">{{send}}</div>' +
            '<div class="Ldt-Markers-MarkerCancel">{{cancel}}</div>' +
        '</div>' +
    '</div>{{/edit}}'

IriSP.Widgets.Markers.prototype.messages = {
    en : {
        send : "Send",
        submit_delete: "Delete",
        cancel : "Cancel",
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
    var can_create = this.markers.every(function(_marker){   
        return ((_time < (_marker.begin-_this.markers_gap))||(_time > (_marker.begin+_this.markers_gap)))
    });
    if (can_create){
        if ((this.$.find(".Ldt-Markers-Create").is(":hidden"))&&(this.$.find(".Ldt-Markers-Delete").is(":hidden"))){
            this.$.find(".Ldt-Markers-RoundButton").hide();
            this.$.find(".Ldt-Markers-Create").show();
        }
    }
    else {
        if ((this.$.find(".Ldt-Markers-CannotCreate").is(":hidden"))&&(this.$.find(".Ldt-Markers-Delete").is(":hidden"))){
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
        // Clic sur - sans marqueur sélectionné = retour à l'état initial
        this.cancelEdit();
    }
}

IriSP.Widgets.Markers.prototype.startEdit = function(){
    if (this.selectedMarker){
        _divHtml = Mustache.to_html(this.infoTemplate, {
            edit: true,
            marker_info: this.selectedMarker.description,
            send: this.custom_send_button? this.custom_send_button : this.l10n.send,
            cancel: this.custom_cancel_button? this.custom_cancel_button :this.l10n.cancel
        })
    }
    else {
        _divHtml = Mustache.to_html(this.infoTemplate, {
            edit: true,
            marker_info: "",
            send: this.custom_send_button? this.custom_send_button : this.l10n.send,
            cancel: this.custom_cancel_button? this.custom_cancel_button :this.l10n.cancel
        })
    }
    this.$.find(".Ldt-Markers-Info").html(_divHtml);
    this.$.find(".Ldt-Markers-MarkerSend").click(this.functionWrapper("onSubmit"));
    this.$.find(".Ldt-Markers-MarkerCancel").click(this.functionWrapper("cancelEdit"));
    this.$.find(".Ldt-Markers-MarkerTextArea").bind("change keyup input paste", this.functionWrapper("onDescriptionChange"));
    this.$.find(".Ldt-Markers-RoundButton").hide();
    this.$.find(".Ldt-Markers-Delete").show();
    this.editing = true;
}

IriSP.Widgets.Markers.prototype.cancelEdit = function(){
    if (this.selectedMarker){
        // Clic sur "cancel" pendant édition d'un marqueur = retour à l'état visualisation
        _divHtml = Mustache.to_html(this.infoTemplate, {
            edit: false,
            marker_info: this.selectedMarker.description,
        })
        this.$.find(".Ldt-Markers-Info").html(_divHtml);
        this.$.find(".Ldt-Markers-MarkerDescription").click(this.functionWrapper("startEdit"));
    }
    else {
        // Clic sur "cancel" pendant la création d'un marqueur = retour à l'état initial
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
            this.$.find(".Ldt-Markers-Delete").show();
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
                  _this.$.find(".Ldt-Markers-MarkerDescription").click(_this.functionWrapper("startEdit"));
                  _this.$.find(".Ldt-Markers-RoundButton").hide();
                  _this.$.find(".Ldt-Markers-Delete").show();

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
    
    /* Si les champs obligatoires sont vides, on annule l'envoi */
    if (!this.allow_empty_markers && !this.onDescriptionChange()){
        return false;
    }
    
    /* On pause la vidéo si elle est encore en train de tourner */
    if (!this.media.getPaused()){
        this.media.pause();
    }
    
    var _this = this,
        _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager); /* Création d'une liste d'annotations contenant une annotation afin de l'envoyer au serveur */        
    if (this.selectedMarker){
        var _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]})
            _annotation = this.selectedMarker,
            _url = Mustache.to_html(this.api_endpoint_template_edit, {annotation_id: this.selectedMarker ? this.selectedMarker.id : ""});
        _annotation.source = _export
        _annotation.description = this.$.find(".Ldt-Markers-MarkerTextArea").val(), /* Champ description */
        _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type, true), /* Récupération du type d'annotation dans lequel l'annotation doit être ajoutée */
        _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)); /* Si le Type d'Annotation n'existe pas, il est créé à la volée */
    }
    else {
        var _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}), /* Création d'un objet source utilisant un sérialiseur spécifique pour l'export */
            _annotation = new IriSP.Model.Annotation(false, _export); /* Création d'une annotation dans cette source avec un ID généré à la volée (param. false) */
            _annotationTypes = this.source.getAnnotationTypes().searchByTitle(this.annotation_type, true), /* Récupération du type d'annotation dans lequel l'annotation doit être ajoutée */
            _annotationType = (_annotationTypes.length ? _annotationTypes[0] : new IriSP.Model.AnnotationType(false, _export)), /* Si le Type d'Annotation n'existe pas, il est créé à la volée */
            _url = Mustache.to_html(this.api_endpoint_template_create);
        /* Si nous avons dû générer un ID d'annotationType à la volée... */
        if (!_annotationTypes.length) {
            /* Il ne faudra pas envoyer l'ID généré au serveur */
            _annotationType.dont_send_id = true;
            /* Il faut inclure le titre dans le type d'annotation */
            _annotationType.title = this.annotation_type;
        }
        
        _annotation.setMedia(this.source.currentMedia.id); /* Id du média annoté */
        if (!this.selectedMarker){
            _annotation.setBegin(this.newMarkerCurrentTime);
            _annotation.setEnd(this.newMarkerCurrentTime);
        }
        _annotation.setAnnotationType(_annotationType.id); /* Id du type d'annotation */
        if (this.project_id != ""){
            /* Champ id projet, seulement si on l'a renseigné dans la config */
            _annotation.project_id = this.project_id;
        }
        _annotation.created = new Date(); /* Date de création de l'annotation */
        _annotation.description = this.$.find(".Ldt-Markers-MarkerTextArea").val(); /* Champ description */
        _annotation.creator = this.creator_name;
    }
    _annotation.project_id = this.project_id;
    
    /*
     * Nous remplissons les données de l'annotation générée à la volée
     * ATTENTION: Si nous sommes sur un MASHUP, ces éléments doivent se référer AU MEDIA D'ORIGINE
     * */
    
    _exportedAnnotations.push(_annotation); /* Ajout de l'annotation à la liste à exporter */
    _export.addList("annotation",_exportedAnnotations); /* Ajout de la liste à exporter à l'objet Source */
    
    /* Envoi de l'annotation via AJAX au serveur ! */
    IriSP.jQuery.ajax({
        url: _url,
        type: this.selectedMarker ? this.api_method_edit : this.api_method_create,
        contentType: 'application/json',
        data: _export.serialize(), /* L'objet Source est sérialisé */
        success: function(_data) {
            _this.showScreen('Success'); /* Si l'appel a fonctionné, on affiche l'écran "Annotation enregistrée" */
            window.setTimeout(_this.functionWrapper("revertToMainScreen"),(_this.after_send_timeout || 5000));
            _export.getAnnotations().removeElement(_annotation, true); /* Pour éviter les doublons, on supprime l'annotation qui a été envoyée */
            _export.deSerialize(_data); /* On désérialise les données reçues pour les réinjecter */
            _annotation.id = _data.id;
            _this.source.merge(_export); /* On récupère les données réimportées dans l'espace global des données */
            if (_this.pause_on_write && _this.media.getPaused() && _this.play_on_submit) {
                _this.media.play();
            }
            _this.markers.push(_annotation);
            _this.selectedMarker = _annotation;
            _this.drawMarkers();
            _this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
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
    _url = Mustache.to_html(this.api_endpoint_template_delete, {annotation_id: this.selectedMarker ? this.selectedMarker.id : ""});
    IriSP.jQuery.ajax({
        url: _url,
        type: this.api_method_delete,
        contentType: 'application/json',
        success: function(_data) {
            _this.showScreen('DeleteSuccess'); /* Si l'appel a fonctionné, on affiche l'écran "Annotation enregistrée" */
            window.setTimeout(_this.functionWrapper("revertToMainScreen"),(_this.after_send_timeout || 5000));
            if (_this.pause_on_write && _this.media.getPaused() && _this.play_on_submit) {
                _this.media.play();
            }
            _this.markers.removeElement(_this.selectedMarker);
            _this.selectedMarker = false
            _this.player.trigger("AnnotationsList.refresh"); /* On force le rafraîchissement du widget AnnotationsList */
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