/* Widget that displays the last annotation that was posted, optionally for current segment, optionally for a given username */

IriSP.Widgets.LatestAnnotation = function(player, config){
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.LatestAnnotation.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.LatestAnnotation.prototype.defaults = {
    from_user: false,
    filter_by_segment: false,
    segments_annotation_type: "chap",
    hide_without_segment: false,
    annotation_type: "contribution",
    /*
     * Set to a username if you only want to display annotations from a given user
     */
    show_only_annotation_from_user: false,
    empty_message: false,
    starts_hidden: false,
};

IriSP.Widgets.LatestAnnotation.prototype.template = 
    "<div class='Ldt-LatestAnnotation'>"
    + "</div>";

IriSP.Widgets.LatestAnnotation.prototype.annotationTemplate =
    "<div class='Ldt-LatestAnnotation-Box'>"
    + "    <div class='Ldt-LatestAnnotation-Element Ldt-LatestAnnotation-CreationDate'>{{{annotation_created}}}</div>" 
    + "    <div class='Ldt-LatestAnnotation-Element Ldt-LatestAnnotation-Title'>{{{annotation_creator}}}{{#annotation_title}}: {{{annotation_title}}}{{/annotation_title}}</div>" 
    + "    <div class='Ldt-LatestAnnotation-Element Ldt-LatestAnnotation-Content'>"
    +         "{{{annotation_content}}}"
    + "    </div>"
    + "</div>"

IriSP.Widgets.LatestAnnotation.prototype.draw = function(){
    var _this = this;
    
    this.renderTemplate();
    
    this.annotationContainer_$ = this.$.find('.Ldt-LatestAnnotation');
    
    this.onMediaEvent("timeupdate", "refresh");
    
    if (this.starts_hidden){
        this.visible = true;
        this.hide();
    }
    else{
        this.visible = false;
        this.show();
    }
    
    this.refresh();
}

IriSP.Widgets.LatestAnnotation.prototype.messages = {
    fr : {
        empty : "Aucune annotation à afficher"
    },
    en: {
        empty: "No annotation to display"
    }
}

IriSP.Widgets.LatestAnnotation.prototype.refresh = function(){ 
    var _currentTime = this.media.getCurrentTime() 
    var _segmentsAnnotations = this.source.getAnnotationsByTypeTitle(this.segments_annotation_type)
    var _currentSegments = _segmentsAnnotations.filter(function(_segment){
        return (_currentTime >= _segment.begin && _currentTime <= _segment.end)
    });
    if (this.hide_without_segment){
        if (_currentSegments.length == 0){
            if (this.visible){
                this.hide()
            }
        }
        else {
            if (!this.visible){
                this.show()
            }
        }
    }
    if (this.visible){
        var _list = this.getWidgetAnnotations();
        if(this.filter_by_segment){
            if (_currentSegments.length == 0) {
                _list = _list.filter(function(_annotation){
                    return false;
                });
            }
            else {
                _list = _list.filter(function(_annotation){
                    _annotationTime = (_annotation.begin+_annotation.end)/2;
                    return (_currentSegments[0].begin <= _annotationTime && _currentSegments[0].end >= _annotationTime);
                });
            }
            _list.sortBy(function(_annotation){
                return _annotation.created;
            });
            
            var _latestAnnotation = false;
            var _html="";
            if (_list.length != 0){
                _latestAnnotation = _list.pop();
                _html = Mustache.to_html(this.annotationTemplate, {
                    annotation_created: _latestAnnotation.created.toLocaleDateString()+", "+_latestAnnotation.created.toLocaleTimeString(),
                    annotation_creator: _latestAnnotation.creator,
                    annotation_title: _latestAnnotation.title,
                    annotation_content: _latestAnnotation.description,
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
    }
}

IriSP.Widgets.LatestAnnotation.prototype.hide = function() {
    if (this.visible){
        this.visible = false;
        this.annotationContainer_$.hide()
    }
}

IriSP.Widgets.LatestAnnotation.prototype.show = function() {
    if(!this.visible){
        this.visible = true;
        this.annotationContainer_$.show()
    }
}
