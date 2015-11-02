/* Widget that displays the last annotation that was posted, optionally for current segment, optionally for a given username */

IriSP.Widgets.LatestAnnotation = function(player, config){
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.LatestAnnotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.LatestAnnotation.prototype.defaults = {
    pre_draw_callback: function(){
        return this.importUsers();
    },
    from_user: false,
    filter_by_segment: false,
    segments_annotation_type: "chap",
    hide_without_segment: false,
    annotation_type: "contribution",
    /*
     * Set to a username if you only want to display annotations from a given user
     */
    show_only_annotation_from_user: false,
    /*
     * Displays a button that copy currently displayed annotation into CreateAnnotation input field
     */
    copy_and_edit_button: false,
    hide_annotations_list: false,
    /*
     * Allows clicks on an annotation from Annotations to display the annotation content into this widget
     */
    selectable_annotations: false,
    empty_message: false,
    starts_hidden: false,
    show_header: false,
    custom_header: false,
    make_name_string_function: function(params){
        return params.username ? params.username : "Anonymous";
    }, 
};

IriSP.Widgets.LatestAnnotation.prototype.messages = {
    fr : {
        copy_and_edit: "Copier et Editer",
        empty : "Aucune annotation à afficher",
        header: "Dernière annotation"
    },
    en: {
        copy_and_edit: "Copy and Edit",
        empty: "No annotation to display",
        header: "Last annotation"
    }
}

IriSP.Widgets.LatestAnnotation.prototype.template = 
    "{{#show_header}}"
    + "<p class='Ldt-LatestAnnotation-header'>"
    +     "{{#custom_header}}{{custom_header}}{{/custom_header}}"
    +     "{{^custom_header}}{{l10n.header}}{{/custom_header}}"
    + "</p>"
    + "{{/show_header}}"
    + "<div class='Ldt-LatestAnnotation'>"
    + "</div>";

IriSP.Widgets.LatestAnnotation.prototype.annotationTemplate =
    "<div class='Ldt-LatestAnnotation-Box'>"
    + "{{#copy_and_edit_button}}<div class='Ldt-LatestAnnotation-CopyEditButton'>{{button_text}}</div>{{/copy_and_edit_button}}"
    +     "<div class='Ldt-LatestAnnotation-Element Ldt-LatestAnnotation-CreationDate'>{{{annotation_created}}}</div>" 
    +     "<div class='Ldt-LatestAnnotation-Element Ldt-LatestAnnotation-Title'>{{{annotation_creator}}}{{#annotation_title}}: {{{annotation_title}}}{{/annotation_title}}</div>" 
    +     "<div class='Ldt-LatestAnnotation-Element Ldt-LatestAnnotation-Content'>"
    +         "{{{annotation_content}}}"
    +     "</div>"
    + "</div>"


IriSP.Widgets.LatestAnnotation.prototype.importUsers = function(){
    if (!this.source.users_data){
        this.usernames = Array();
        var _this = this,
            _list = this.getWidgetAnnotations(),
            usernames_list_string = "";
        
        _list.forEach(function(_annotation){
            if(_this.usernames.indexOf(_annotation.creator) == -1){
                _this.usernames.push(_annotation.creator);
            }
        });
        this.usernames.forEach(function(_username){
            usernames_list_string+=_username+","
        })
        usernames_list_string = usernames_list_string.substring(0, usernames_list_string.length - 1);
        _url = Mustache.to_html(this.api_users_endpoint, {usernames_list_string: encodeURIComponent(usernames_list_string), usernames_list_length: this.usernames.length});
        return IriSP.jQuery.ajax({
            async: false,
            url: _url,
            type: "GET",
            success: function(_data) {
                _this.source.users_data = _data.objects
            },
            error: function(_xhr, _error, _thrown) {
                console.log(_xhr)
                console.log(_error)
                console.log(_thrown)
            }
        })
    }
}
    
IriSP.Widgets.LatestAnnotation.prototype.draw = function(){
    var _this = this;
    this.renderTemplate();
    
    this.annotationContainer_$ = this.$.find('.Ldt-LatestAnnotation');
    
    if (this.selectable_annotations){
        this.onMdpEvent("AnnotationsList.refresh", function(){
            _this.getWidgetAnnotations().forEach(function(_annotation){
                _annotation.off("click");
                _annotation.on("click", function(){
                    var _user = {},
                        _user_display_string = "",
                        _users = this.source.users_data.filter(function(_user_data){
                            return _user_data.username == _annotation.creator
                        });
                    if (_users.length == 0){
                        _user.username = _annotation.creator;
                    }
                    else {
                        _user = _users[0];
                    }
                    _user_display_string = _this.make_name_string_function(_user)
                    _html = Mustache.to_html(_this.annotationTemplate, {
                        annotation_created: _annotation.created.toLocaleDateString()+", "+_annotation.created.toLocaleTimeString(),
                        annotation_creator: _user_display_string,
                        annotation_title: _annotation.title,
                        annotation_content: _annotation.description,
                        copy_and_edit_button: _this.copy_and_edit_button,
                        button_text: _this.l10n.copy_and_edit,
                    });
                    _this.annotationContainer_$.html(_html);
                    _this.selectedAnnotation = true;
                });
            }); 
        });
        
        this.segments = _this.source.getAnnotationsByTypeTitle(this.segments_annotation_type)
        this.segments.forEach(function(_segment){
            _segment.on("click", function(){
                _this.selectedAnnotation = false;
            })
        })
        this.currentSegment = false;
    }
    
    this.onMediaEvent("timeupdate", function(){
        _this.refresh();
    });
    this.onMediaEvent("settimerange", function(_timeRange){
        _this.refresh(_timeRange);
    })
    
    if (this.starts_hidden){
        this.visible = true;
        this.hide();
    }
    else{
        this.visible = false;
        this.show();
    }
    
    this.selectedAnnotation = false; // This flag tells the widget if it must display last annotation (false) or clicked annotation (true)
    this.player.trigger("AnnotationsList.refresh");
    this.refresh();
}


IriSP.Widgets.LatestAnnotation.prototype.refresh = function(_timeRange){
    _timeRange = typeof _timeRange !== 'undefined' ? _timeRange : false ;
    var _this = this;
    if (this.hide_without_segment){
        if (!_timeRange && !this.media.getTimeRange()){
            var _currentTime = this.media.getCurrentTime();
            var _currentSegments = this.segments.filter(function(_segment){
                return (_currentTime >= _segment.begin && _currentTime <= _segment.end)
            });
            if (_currentSegments.length == 0){
                this.currentSegment = false;
                this.selectedAnnotation = false;
            }
            else {
                this.currentSegment = _currentSegments[0]
            }
        }
        else {
            var _segmentBegin = _timeRange? _timeRange[0] : this.media.getTimeRange()[0],
                _segmentEnd = _timeRange? _timeRange[1] : this.media.getTimeRange()[1];
            if ((!this.currentSegment)||(this.currentSegment.begin != _segmentBegin || this.currentSegment.end != _segmentEnd)) {
                var _currentSegments = this.segments.filter(function(_segment){
                    return _segment.begin == _segmentBegin && _segment.end == _segmentEnd
                });
                if (_currentSegments.length > 0){
                    this.selectedAnnotation = false;
                    this.currentSegment = _currentSegments[0];
                }
            }
        }
        if (!this.currentSegment){
            if (this.visible){
                this.hide();
            }
        }
        else {
            if (!this.visible){
                this.show();
            }
        }
    }
    
    if (this.visible && !this.selectedAnnotation){
        var _list = this.getWidgetAnnotations();
        
        if(this.filter_by_segment){
            if (!this.currentSegment) {
                _list = _list.filter(function(_annotation){
                    return false;
                });
            }
            else {
                _list = _list.filter(function(_annotation){
                    _annotationTime = (_annotation.begin+_annotation.end)/2;
                    return (_this.currentSegment.begin <= _annotationTime && _this.currentSegment.end >= _annotationTime);
                });
            }
        }
        _list = _list.sortBy(function(_annotation){
            return _annotation.created;
        });
        
        var _latestAnnotation = false,
            _html="",
            _user_display_string = "",
            _user = {};
        if (_list.length != 0){
            _latestAnnotation = _list.pop();
            _users = this.source.users_data.filter(function(_user_data){
                return _user_data.username == _latestAnnotation.creator
            })
            if (_users.length == 0){
                _user.username = _latestAnnotation.creator;
            }
            else {
                _user = _users[0];
            }
            _user_display_string = this.make_name_string_function(_user)
            _html = Mustache.to_html(this.annotationTemplate, {
                annotation_created: _latestAnnotation.created.toLocaleDateString()+", "+_latestAnnotation.created.toLocaleTimeString(),
                annotation_creator: _user_display_string,
                annotation_title: _latestAnnotation.title,
                annotation_content: _latestAnnotation.description,
                copy_and_edit_button: this.copy_and_edit_button,
                button_text: this.l10n.copy_and_edit,
            });
        }
        else {
            var _empty_message = this.l10n.empty
            if (this.empty_message) {
                _empty_message = this.empty_message
            }
            _html = "<div class='Ldt-LatestAnnotation-Element Ldt-LatestAnnotation-NoAnnotation'>"+_empty_message+"</div>";
        }
        this.annotationContainer_$.html(_html);    
    }

    if(this.copy_and_edit_button){
        this.copyAndEditButton_$ = this.$.find('.Ldt-LatestAnnotation-CopyEditButton');
        this.copyAndEditButton_$.click(this.functionWrapper("copy_and_edit"));
    }
}

IriSP.Widgets.LatestAnnotation.prototype.copy_and_edit = function(){
    this.player.trigger("CreateAnnotation.show");
    if (this.hide_annotations_list){
        this.player.trigger("AnnotationsList.hide");
    }
    annotationText = $('.Ldt-LatestAnnotation-Content').get(0).innerHTML;
    
    $('.Ldt-CreateAnnotation-Description').removeClass('empty');
    $('.Ldt-CreateAnnotation-Description').val(annotationText);
}

IriSP.Widgets.LatestAnnotation.prototype.hide = function() {
    if (this.visible){
        this.visible = false;
        this.$.find('.Ldt-LatestAnnotation-header').hide();
        this.annotationContainer_$.hide()
    }
}

IriSP.Widgets.LatestAnnotation.prototype.show = function() {
    if(!this.visible){
        this.visible = true;
        this.$.find('.Ldt-LatestAnnotation-header').show();
        this.annotationContainer_$.show()
    }
}
