IriSP.Widgets.MultiSegments = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.MultiSegments.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.MultiSegments.prototype.defaults = {
    annotation_show_arrow: true,
    annotation_start_minimized: false,
    annotation_show_annotation_type: true,
    show_all: false
};

IriSP.Widgets.MultiSegments.prototype.draw = function() {
    var _this = this,
        lines = [],
        currentLine = null,
        segmentsopts = {},
        annotationopts = {};
    IriSP._(this).each(function(_v,_k) {
        if (/^segments_/.test(_k)) {
            segmentsopts[_k.replace(/^segments_/,"")] = _v;
        }
        if (/^annotation_/.test(_k)) {
            annotationopts[_k.replace(/^annotation_/,"")] = _v;
        }
    });
    this.source.getAnnotationTypes().forEach(function(_anntype) {
        var segments = _anntype.getAnnotations().filter(function(_ann) {
            return _ann.getDuration() > 0 && _ann.getMedia().id == _this.media.id;
        });
        if (segments.length) {
            
            var visible = false;
            
            var line = {
                segmentWidget: IriSP.jQuery("<div>"),
                annotationWidget: IriSP.jQuery("<div>"),
                hasSegmentsNow: function() {
                    var _time = _this.media.getCurrentTime();
                    return !!segments.filter(function(_annotation) {
                        return _annotation.begin <= _time && _annotation.end > _time;
                    }).length;
                },
                hide: function() {
                    if (visible) {
                        visible = false;
                        this.annotationWidget.slideUp();
                    }
                },
                show: function() {
                    if (!visible) {
                        visible = true;
                        this.annotationWidget.slideDown();
                    }
                }
            };
                
                
            line.segmentWidget
                .addClass("Ldt-MultiSegments-Segment")
                .appendTo(_this.$);
                
            if (!_this.show_all) {
                line.segmentWidget.mouseenter(function() {
                    if (line.hasSegmentsNow()) {
                        currentLine = line;
                        checkVisibilities();
                    }
                });
            }
            
            line.annotationWidget
                .addClass("Ldt-MultiSegments-Annotation")
                .appendTo(_this.$)
                .hide();
                
            _this.insertSubwidget(
                line.segmentWidget,
                IriSP._({
                    type: "Segments",
                    annotation_type: _anntype,
                    width: '100%'
                }).extend(segmentsopts)
            );
            
            _this.insertSubwidget(
                line.annotationWidget,
                IriSP._({
                    type: "Annotation",
                    annotation_type: _anntype,
                    width: '100%'
                }).extend(annotationopts)
            );
            
            lines.push(line);
        }
    });
    
    // open line on segment click
    IriSP.jQuery(document).on("click",".Ldt-Segments-Segment",function(e){
    	if (!_this.show_all && currentLine && !currentLine.hasSegmentsNow()) {
            currentLine = undefined;
        }
        IriSP._(lines).each(function(line) {
        	if(IriSP.jQuery(e.target).parent().parent()[0]==line.segmentWidget[0]){
        		currentLine = line;
        		line.show();
        	} else {
                line.hide();
            }
        });
    });
    
    //var _annotationWidgets = _this.$.find(".Ldt-MultiSegments-Annotation");
    
    function checkVisibilities(_time) {
        /*if (!_this.show_all && currentLine && !currentLine.hasSegmentsNow()) {
            currentLine = undefined;
        }
        IriSP._(lines).each(function(line) {
            if (line.hasSegmentsNow()) {
                if (!_this.show_all && !currentLine) {
                    currentLine = line;
                }
                if (_this.show_all || line === currentLine) {
                    line.show();
                } else {
                    line.hide();
                }
            } else {
                line.hide();
            }
        });*/
    }
};
