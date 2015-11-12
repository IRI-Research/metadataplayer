/* 
 * Widget that ties AnnotationList and CreateAnnotation together
 * using buttons to hide/show AnnotationList and CreateAnnotation widgets.
 * 
 */

IriSP.Widgets.AnnotationsController = function(player, config){
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.AnnotationsController.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.AnnotationsController.prototype.defaults = {
    // If true, displaying AnnotationList will hide CreateAnnotation and vice versa.
    display_or_write: false,
    toggle_widgets: false,
    starts_hidden: false,
    hide_without_segment: false,
    hide_when_writing: true,
    starting_widget: false,
    always_show_widget: false,
    segments_annotation_type: "chap",
    custom_write_text: false,
    custom_display_text: false,
};

IriSP.Widgets.AnnotationsController.prototype.template = 
    "<div class='Ldt-AnnotationsController'>"
    + "<div class='Ldt-AnnotationsController-ButtonsContainer'>"
    + "    <div class='Ldt-AnnotationsController-Button Ldt-AnnotationsController-ShowCreateAnnotationButton'>{{#custom_write_text}}{{/custom_write_text}}{{custom_write_text}}{{^custom_write_text}}{{l10n.write}}{{/custom_write_text}}</div>"
    + "    <div class='Ldt-AnnotationsController-Button Ldt-AnnotationsController-ShowAnnotationsListButton'>{{#custom_display_text}}{{/custom_display_text}}{{custom_display_text}}{{^custom_display_text}}{{l10n.display}}{{/custom_display_text}}</div>"
    + "</div>"
    + "</div>"

IriSP.Widgets.AnnotationsController.prototype.messages = {
    en : {
        write : "Write",
        display : "Display",
    },
    fr : {
        write : "Ecrire",
        display : "Voir"
    }
};

IriSP.Widgets.AnnotationsController.prototype.draw = function() { 
    this.renderTemplate();
    var _this = this;
    this.element_$ = this.$.find(".Ldt-AnnotationsController")
    
    this.displayButton_$ = this.$.find(".Ldt-AnnotationsController-ShowAnnotationsListButton");
    this.writeButton_$ = this.$.find(".Ldt-AnnotationsController-ShowCreateAnnotationButton");
    
    this.writeButton_$.click(function(){
        if (!_this.writeButton_$.hasClass("selected")){
            _this.player.trigger("CreateAnnotation.show")
            if (_this.display_or_write){
                _this.player.trigger("AnnotationsList.hide");
            }
        }
        else {
            _this.player.trigger("CreateAnnotation.hide")
            if (_this.toggle_widgets){
                _this.player.trigger("AnnotationsList.show")
            }
            else if (_this.display_or_write){
                _this.player.trigger("AnnotationsList.hide");
            }
        }
    });
    this.displayButton_$.click(function(){
        if (!_this.displayButton_$.hasClass("selected")){
            _this.player.trigger("AnnotationsList.show")
            if (_this.display_or_write){
                _this.player.trigger("CreateAnnotation.hide");
            }
        }
        else {
            _this.player.trigger("AnnotationsList.hide")
            if (_this.toggle_widgets){
                _this.player.trigger("CreateAnnotation.show")
            }
            else if (_this.display_or_write){
                _this.player.trigger("CreateAnnotation.hide");
            }
        }
        
    })
    
    if(this.hide_without_segment){
        this.onMediaEvent("timeupdate", function(){
            _this.refresh();
        })
        this.onMediaEvent("settimerange", function(_timeRange){
            _this.refresh(_timeRange);
        })
        this.segments = this.source.getAnnotationsByTypeTitle(this.segments_annotation_type)
        this.currentSegment = false
    }
    

    this.createAnnotationEnabled = false;
    this.onMdpEvent("CreateAnnotation.hide", function(){
        if (_this.hide_when_writing){
            _this.show()
        }
        _this.createAnnotationEnabled = false;
        _this.writeButton_$.toggleClass("selected", false);
    })
    this.onMdpEvent("CreateAnnotation.show", function(){
        if (_this.hide_when_writing){
            _this.hide()
        }
        _this.createAnnotationEnabled = true;
        _this.writeButton_$.toggleClass("selected", true);
    })
    this.onMdpEvent("AnnotationsList.hide", function(){
        _this.displayButton_$.toggleClass("selected", false);
    })
    this.onMdpEvent("AnnotationsList.show", function(){
        _this.displayButton_$.toggleClass("selected", true);
    })
    
    if (this.starts_hidden) {
        this.visible = true
        this.hide();
    }
    else{
        this.visible = false
        this.show();
    }
    
    if (this.starting_widget && this.visible){
        if (this.starting_widget == "AnnotationsList"){
            this.player.trigger("AnnotationsList.show")
        }
        else if (this.starting_widget == "CreateAnnotation"){
            this.player.trigger("CreateAnnotation.show")
        }
    }
    
};

IriSP.Widgets.AnnotationsController.prototype.refresh = function(_timeRange){
    _timeRange = typeof _timeRange !== 'undefined' ? _timeRange : false ;
    
    if(!_timeRange){
        if (this.media.getTimeRange()){
            _timeRange = this.media.getTimeRange();
        }
    }
    
    if (this.hide_without_segment){
        if (!_timeRange && !this.media.getTimeRange()){
            _currentTime = this.media.getCurrentTime() 
            _currentSegments = this.segments.filter(function(_segment){
                return (_currentTime >= _segment.begin && _currentTime <= _segment.end)
            });
            if(_currentSegments.length > 0){
                currentSegment = true;
            }
            else {
                currentSegment = false;
            }
        }
        else {
            var _timeRangeBegin = _timeRange[0],
                _timeRangeEnd = _timeRange[1];
            _currentSegments = this.segments.filter(function(_segment){
                return (_timeRangeBegin == _segment.begin && _timeRangeEnd == _segment.end)
            });
            if(_currentSegments.length > 0){
                currentSegment = true;
            }
            else {
                currentSegment = false;
            }
        }
        if (!currentSegment && _currentSegments.length == 0){
            if (this.visible || this.hide_when_writing){
                this.writeButton_$.toggleClass("selected", false);
                this.displayButton_$.toggleClass("selected", false);
                this.player.trigger("CreateAnnotation.hide");
                this.player.trigger("AnnotationsList.hide");
                this.hide();
            }
        }
        else {
            if (!this.visible){
                if (!this.createAnnotationEnabled){
                    this.show();
                }
                this.writeButton_$.toggleClass("selected", false);
                this.displayButton_$.toggleClass("selected", false);
                if (this.starting_widget == "AnnotationsList"){
                    this.player.trigger("AnnotationsList.show")
                }
                if (this.starting_widget == "CreateAnnotation"){
                    this.player.trigger("CreateAnnotation.show")
                }
            }
            
        }
    }
}

IriSP.Widgets.AnnotationsController.prototype.hide = function() {
    if (this.visible){
        this.visible = false;
        this.element_$.hide();
    }
}

IriSP.Widgets.AnnotationsController.prototype.show = function() {
    if(!this.visible){
        this.visible = true;
        this.element_$.show();
    }
}
