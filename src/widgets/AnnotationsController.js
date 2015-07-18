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
    starts_hidden: false,
    hide_without_segment: false,
    segments_annotation_type: "chap"
};

IriSP.Widgets.AnnotationsController.prototype.template = 
    "<div class='Ldt-AnnotationsController'>"
    + "<div class='Ldt-AnnotationsController-ButtonsContainer'>"
    + "    <div class='Ldt-AnnotationsController-Button Ldt-AnnotationsController-ShowAnnotationsListButton'>{{l10n.display}}</div>"
    + "    <div class='Ldt-AnnotationsController-Button Ldt-AnnotationsController-ShowCreateAnnotationButton'>{{l10n.write}}</div>"
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
        _this.player.trigger("CreateAnnotation.toggle");
        if (_this.display_or_write){
            _this.player.trigger("AnnotationsList.hide");
        }
    });
    this.displayButton_$.click(function(){
        _this.player.trigger("AnnotationsList.toggle");
        if (_this.display_or_write){
            _this.player.trigger("CreateAnnotation.hide");
        }
    })
    this.onMediaEvent("timeupdate", "onTimeUpdate")
    
    if (this.starts_hidden) {
        this.visible = true
        this.hide();
    }
    else{
        this.visible = false
        this.show();
    }
    
};

IriSP.Widgets.AnnotationsController.prototype.onTimeUpdate = function(){
    if (this.hide_without_segment){
        _currentTime = this.media.getCurrentTime() 
        _segmentsAnnotations = this.source.getAnnotationsByTypeTitle(this.segments_annotation_type)
        _currentSegments = _segmentsAnnotations.filter(function(_segment){
            return (_currentTime >= _segment.begin && _currentTime <= _segment.end)
        });
        if (_currentSegments.length == 0){
            if (this.visible){
                this.hide();
                _this.player.trigger("CreateAnnotation.hide");
                _this.player.trigger("AnnotationsList.hide");
            }
        }
        else {
            if (!this.visible){
                this.show();
                _this.player.trigger("CreateAnnotation.hide");
                _this.player.trigger("AnnotationsList.hide");
            }
        }
    }
}

IriSP.Widgets.AnnotationsController.prototype.hide = function() {
    if (this.visible){
        this.visible = false;
        this.element_$.hide()
    }
}

IriSP.Widgets.AnnotationsController.prototype.show = function() {
    if(!this.visible){
        this.visible = true;
        this.element_$.show()
    }
}
