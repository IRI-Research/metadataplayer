/* Widget displays info on the current segment, with possibility of config for editing description and tags */

IriSP.Widgets.CurrentSegmentInfobox = function(player, config){
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.CurrentSegmentInfobox.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.CurrentSegmentInfobox.prototype.defaults = {
    annotation_type: "chap",
    editable_segments: false,
    empty_message: false,
    project_id: false,
    api_serializer: "ldt_annotate",
    api_method: "PUT",
    api_endpoint_template: "",
    new_tag_button: true,
    show_headers: false,
    custom_edit_text: false,
    empty_description_placeholder: false,
};

IriSP.Widgets.CurrentSegmentInfobox.prototype.template = 
      '<div class="Ldt-CurrentSegmentInfobox">'
    +   '<div class="Ldt-CurrentSegmentInfobox-SelectedSegment">'
    +     '{{#editable_segments}}<div class="Ldt-CurrentSegmentInfobox-EditButton">{{edit}}</div>{{/editable_segments}}'
    +     '<div class="Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Title">{{title}}</div>'
    +     '<div class="Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Description">{{description}}</div>' 
    +     '{{^description}}{{^tags.length}}{{#description_placeholder}}<div class="Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Description-placeholder">{{description_placeholder}}</div>{{/description_placeholder}}{{/tags.length}}{{/description}}' 
    +     '<div class="Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Tags">'
    +         '{{#tags.length}}'
    +         '<ul class="Ldt-CurrentSegmentInfobox-Tags-Ul">'
    +         '{{#tags}}'
    +             '{{#.}}'
    +             '<li class="Ldt-CurrentSegmentInfobox-Tags-Li">'
    +                 '<span>{{.}}</span>'
    +             '</li>'
    +             '{{/.}}'
    +         '{{/tags}}'
    +         '</ul>'
    +         '{{/tags.length}}'
    +     '</div>'
    +   '</div>'
    + '</div>'

IriSP.Widgets.CurrentSegmentInfobox.prototype.editTemplate = 
      '<div class="Ldt-CurrentSegmentInfobox">'
    +   '<div class="Ldt-CurrentSegmentInfobox-SelectedSegment">'
    +     '{{#headers}}<div class="Ldt-CurrentSegmentInfobox-FieldsHeader">{{fields_header}}</div>{{/headers}}'
    +     '<input type="text" class="Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-TitleInput Ldt-CurrentSegmentInfobox-Title" value="{{title}}"></input>'   
    +     '<textarea class="Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-DescriptionInput Ldt-CurrentSegmentInfobox-Description">{{description}}</textarea>'
    +     '<div class="Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Tags">'
    +         '{{#headers}}<div class="Ldt-CurrentSegmentInfobox-TagsHeader">{{tags_header}}</div>{{/headers}}'
    +     '{{#new_tag_button}}'
    +         '<div class="Ldt-CurrentSegmentInfobox-CreateTagButton">{{new_tag}}</div>'
    +     '{{/new_tag_button}}'
    +     '{{^new_tag_button}}'
    +         '<input class="Ldt-CurrentSegmentInfobox-CreateTagInput" placeholder="{{new_tag}}"></input>'
    +         '<div class="Ldt-CurrentSegmentInfobox-CreateTagInput-Add">+</div>'
    +     '{{/new_tag_button}}'
    +         '<ul class="Ldt-CurrentSegmentInfobox-Tags-Ul">'
    +         '{{#tags}}'
    +             '{{#.}}'
    +             '<li class="Ldt-CurrentSegmentInfobox-Tags-Li">'
    +                 '<input type="text" class="Ldt-CurrentSegmentInfobox-Tags-Li-Input" value="{{.}}"></input>'
    +                 '<div class="Ldt-CurrentSegmentInfobox-Tags-Li-DeleteTagButton">{{delete_tag}}</div>'
    +             '</li>'
    +             '{{/.}}'
    +         '{{/tags}}'
    +         '</ul>'
    +     '</div>'
    +     '<div class="Ldt-CurrentSegmentInfobox-SubmitButton">{{submit}}</div>'
    +     '<div class="Ldt-CurrentSegmentInfobox-CancelButton">{{cancel}}</div>'
    +   '</div>'
    + '</div>'
    
IriSP.Widgets.CurrentSegmentInfobox.prototype.messages = {
    fr : {
        submit : "Soumettre",
        cancel : "Annuler",
        edit : "Editer",
        new_tag : "Nouveau tag",
        delete_tag : "Supprimer",
        fields_header : "Commentaire associé à ce segment",
        tags_header : "Mots-clés associés à ce segment",
        empty : "Le player vidéo ne lit actuellement aucun segment"
    },
    en: {
        submit : "Submit",
        cancel : "Cancel",
        edit : "Edit",
        new_tag : "New tag",
        delete_tag : "Delete tag",
        fields_header : "Current segment content",
        tags_header : "Current segment tags",
        empty : "The player currently doesn't read any segment"
    }
}    
    
IriSP.Widgets.CurrentSegmentInfobox.prototype.draw = function() {
    var _this = this;
    this.segments = this.getWidgetAnnotations();
    this.renderTemplate();
    this.currentSegment = false;
    this.clearBox();
    this.refresh();
    this.onMediaEvent("timeupdate", "refresh");
    this.onMediaEvent("settimerange", function(_timeRange){
        var _segmentBegin = _timeRange[0],
            _segmentEnd = _timeRange[1],
            _list = _this.segments.filter(function(_segment){
                return _segment.begin.milliseconds == _segmentBegin.milliseconds && _segment.end.milliseconds == _segmentEnd.milliseconds
            });
        if (_list.length >0){
            _this.$.toggleClass("editing", false);
            if (_this.currentSegment.id != _list[0].id){
                _this.currentSegment = _list[0];
                _data = {
                        editable_segments: _this.editable_segments,
                        edit: _this.custom_edit_text ? _this.custom_edit_text : _this.l10n.edit,
                        title: _this.currentSegment.title,
                        description : _this.currentSegment.description,
                        description_placeholder : _this.empty_description_placeholder,
                        tags : _this.currentSegment.getTagTexts()
                }
                _this.$.html(Mustache.to_html(_this.template, _data))
                if(_this.editable_segments&&_this.currentSegment){
                    _this.$.find(".Ldt-CurrentSegmentInfobox").click(_this.functionWrapper("enableEditMode"));            
                }
            }
        }
    });
    
    if(this.editable_segments&&this.currentSegment){
        this.$.find(".Ldt-CurrentSegmentInfobox").click(_this.functionWrapper("enableEditMode"));        
    }
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.enableEditMode = function() {
    var _this = this;
    if(this.currentSegment){
        _data = {
            title: this.currentSegment.title,
            description : this.currentSegment.description,
            tags : this.currentSegment.getTagTexts(),
            submit : this.l10n.submit,
            cancel : this.l10n.cancel,
            headers : this.show_headers,
            tags_header : this.custom_tags_header ? this.custom_tags_header : this.l10n.tags_header,
            fields_header : this.custom_fields_header ? this.custom_fields_header : this.l10n.fields_header,
            new_tag : this.l10n.new_tag,
            delete_tag : this.l10n.delete_tag,
            new_tag_button : this.new_tag_button,
        }
        this.$.toggleClass("editing", true);
        this.$.html(Mustache.to_html(this.editTemplate, _data));
        this.$.find(".Ldt-CurrentSegmentInfobox-CancelButton").click(this.functionWrapper("disableEditMode"));
        if (this.new_tag_button){
            this.$.find(".Ldt-CurrentSegmentInfobox-CreateTagButton").click(this.functionWrapper("insertTagInput"));            
        } else {
            this.$.find(".Ldt-CurrentSegmentInfobox-CreateTagInput").keypress(this.functionWrapper("insertTagInputKeypress"));
            this.$.find(".Ldt-CurrentSegmentInfobox-CreateTagInput-Add").click(this.functionWrapper("insertTagInputKeypress"));
        }
        this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Li-DeleteTagButton").click(this.functionWrapper("deleteTagInput"));
        this.$.find(".Ldt-CurrentSegmentInfobox-SubmitButton").click(this.functionWrapper("onSubmit"))
    }
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.disableEditMode = function() {
    if(this.currentSegment){
        _data = {
                editable_segments: this.editable_segments,
                edit: this.custom_edit_text ? this.custom_edit_text : this.l10n.edit,
                title: this.currentSegment.title,
                description : this.currentSegment.description,
                description_placeholder : this.empty_description_placeholder,
                tags : this.currentSegment.getTagTexts()
            }
        this.$.toggleClass("editing", false);
        this.$.html(Mustache.to_html(this.template, _data));
        this.$.find(".Ldt-CurrentSegmentInfobox").click(this.functionWrapper("enableEditMode")); 
    }
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.insertTagInput = function() {
    if((!this.currentSegment.getTagTexts().length)&&(!this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Ul").length)){
        this.$.find(".Ldt-CurrentSegmentInfobox-Tags").prepend('<ul class="Ldt-CurrentSegmentInfobox-Tags-Ul"></ul>')
    }
    this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Ul").append(
        '<li class="Ldt-CurrentSegmentInfobox-Tags-Li">'
        +'<input type="text" class="Ldt-CurrentSegmentInfobox-Tags-Li-Input" value=""></input>'
        +'<div class="Ldt-CurrentSegmentInfobox-Tags-Li-DeleteTagButton">'+this.l10n.delete_tag+'</div>'
        +'</li>');
    this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Li-DeleteTagButton").click(this.functionWrapper("deleteTagInput"));
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.insertTagInputKeypress = function(event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13' || event.type == 'click'){
        if((!this.currentSegment.getTagTexts().length)&&(!this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Ul").length)){
            this.$.find(".Ldt-CurrentSegmentInfobox-Tags").prepend('<ul class="Ldt-CurrentSegmentInfobox-Tags-Ul"></ul>')
        }
        this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Ul").append(
            '<li class="Ldt-CurrentSegmentInfobox-Tags-Li">'
            +'<input type="text" class="Ldt-CurrentSegmentInfobox-Tags-Li-Input" value="'+ this.$.find(".Ldt-CurrentSegmentInfobox-CreateTagInput").val() +'"></input>'
            +'<div class="Ldt-CurrentSegmentInfobox-Tags-Li-DeleteTagButton">'+this.l10n.delete_tag+'</div>'
            +'</li>');
        this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Li-DeleteTagButton").click(this.functionWrapper("deleteTagInput"));
        this.$.find(".Ldt-CurrentSegmentInfobox-CreateTagInput").val("");
        return false;
    }
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.deleteTagInput = function(clickEvent) {
    $(clickEvent.currentTarget).parent().remove();
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.onSubmit = function() {
    new_tags_titles = this.$.find(".Ldt-CurrentSegmentInfobox-Tags-Li-Input").map(function(){
        if($(this).val()){
            return $(this).val()
        }
    });
    new_title = this.$.find(".Ldt-CurrentSegmentInfobox-TitleInput").val()
    new_description = this.$.find(".Ldt-CurrentSegmentInfobox-DescriptionInput").val()
    
    var _this = this,
        _exportedAnnotations = new IriSP.Model.List(this.player.sourceManager), /* We create an Annotations List to send to the server */
        _export = this.player.sourceManager.newLocalSource({serializer: IriSP.serializers[this.api_serializer]}), /* We create a source object using a specific serializer for export */
        _annotation = new IriSP.Model.Annotation(this.currentSegment.id, _export); /* We create an annotation in the source with a generated ID (param. false) */
    
    _annotation.setAnnotationType(this.currentSegment.getAnnotationType().id);
    _annotation.setMedia(this.currentSegment.getMedia().id);
    _annotation.setBegin(this.currentSegment.begin);
    _annotation.setEnd(this.currentSegment.end);
    _annotation.created = this.currentSegment.created;
    _annotation.creator = this.currentSegment.creator;
    _annotation.title = new_title /* Title field */
    _annotation.description = new_description /* Description field */
    var _tagIds = IriSP._(new_tags_titles).map(function(_title) {
        var _tags = _this.source.getTags(true).searchByTitle(_title, true);
        if (_tags.length) {
            var _tag = _tags[0];
        }
        else {
            _tag = new IriSP.Model.Tag(_title.replace(/\W/g,'_'), _this.source);
            _tag.title = _title;
            _this.source.getTags().push(_tag);
        }
        return _tag.id;
    });
    _annotation.setTags(_tagIds);
    _annotation.project_id = this.project_id;
    
    _exportedAnnotations.push(_annotation); /* We add the annotation in the list to export */
    _export.addList("annotation",_exportedAnnotations); /* We add the list to the source object */    
    
    _url = Mustache.to_html(this.api_endpoint_template, {annotation_id: this.currentSegment.id});
    
    IriSP.jQuery.ajax({
        url: _url,
        type: this.api_method,
        contentType: 'application/json',
        data: _export.serialize(), /* Source is serialized */
        success: function(_data) {
            _export.getAnnotations().removeElement(_annotation, true); /* We delete the sent annotation to avoid redundancy */
            _export.deSerialize(_data); /* Data deserialization */
            _this.source.merge(_export); /* We merge the deserialized data with the current source data */
            _this.segments.forEach(function(_segment){
                if (_segment.id == _annotation.id){
                    _this.segments.removeElement(_segment)
                }
            })
            _this.segments.push(_annotation)
            _this.currentSegment = _annotation
            _data = {
                    editable_segments: _this.editable_segments,
                    edit: _this.custom_edit_text ? _this.custom_edit_text : _this.l10n.edit,
                    title: _this.currentSegment.title,
                    description : _this.currentSegment.description,
                    description_placeholder : _this.empty_description_placeholder,
                    tags : _this.currentSegment.getTagTexts()
                }
            _this.$.html(Mustache.to_html(_this.template, _data))
            if(_this.editable_segments&&_this.currentSegment){
                _this.$.find(".Ldt-CurrentSegmentInfobox").click(_this.functionWrapper("enableEditMode"));             
            }
            _this.$.toggleClass("editing", false);
        },
        error: function(_xhr, _error, _thrown) {
            IriSP.log("Error when sending annotation", _thrown);
            _export.getAnnotations().removeElement(_annotation, true);
        }
    });
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.refresh = function() {
    if(!this.media.getTimeRange()){
        var _currentTime = this.media.getCurrentTime();
        var _list = this.segments.filter(function(_segment){
            return (_segment.begin <= _currentTime && _segment.end >= _currentTime);
        })
        
        if (_list.length > 0){
            if (this.currentSegment.id != _list[0].id){
                this.currentSegment = _list[0];
                _data = {
                    editable_segments: this.editable_segments,
                    edit: this.custom_edit_text ? this.custom_edit_text : this.l10n.edit,
                    title: this.currentSegment.title,
                    description : this.currentSegment.description,
                    description_placeholder : this.empty_description_placeholder,
                    tags : this.currentSegment.getTagTexts()
                }
                this.$.html(Mustache.to_html(this.template, _data))
                if(this.editable_segments&&this.currentSegment){
                    this.$.find(".Ldt-CurrentSegmentInfobox").click(this.functionWrapper("enableEditMode"));             
                }
            }
        }
        else {
            this.currentSegment = false;
            this.clearBox();
        }
    }
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.clearBox = function(){
    var _empty_message = this.l10n.empty
    if (this.empty_message) {
        _empty_message = this.empty_message
    }
    this.$.find(".Ldt-CurrentSegmentInfobox").html("<div class='Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-NoSegment'>"+_empty_message+"</div>");
}