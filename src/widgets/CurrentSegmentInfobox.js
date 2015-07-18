/* Widget displays info on the current segment, with possibility of config for editing description and tags */

IriSP.Widgets.CurrentSegmentInfobox = function(player, config){
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.CurrentSegmentInfobox.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.CurrentSegmentInfobox.prototype.defaults = {
    annotation_type: "chap",
    readonly: true,
    empty_message: false
};

IriSP.Widgets.CurrentSegmentInfobox.prototype.template = 
    "<div class='Ldt-CurrentSegmentInfobox'>" 
    + "    <div class='Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Title'>{{title}}</div>" 
    + "    <div class='Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Description'>{{description}}</div>" 
    + "    <div class='Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-Tags'>"
    + '        {{#tags.length}}'
    + '        <ul class="Ldt-CurrentSegmentInfobox-Tags-Ul">'
    + '        {{#tags}}'
    + '            {{#.}}'
    + '            <li class="Ldt-CurrentSegmentInfobox-Tags-Li">'
    + '                <span>{{.}}</span>'
    + '            </li>'
    + '            {{/.}}'
    + '        {{/tags}}'
    + '        </ul>'
    + '        {{/tags.length}}'
    + "    </div>" 
    + "</div>"

IriSP.Widgets.CurrentSegmentInfobox.prototype.messages = {
    fr : {
        empty : "Le player vidéo ne lit actuellement aucun segment"
    },
    en: {
        empty: "The player currently doesn't read any segment"
    }
}    
    
IriSP.Widgets.CurrentSegmentInfobox.prototype.draw = function() {
    var _this = this;
    this.segments = this.getWidgetAnnotations();
    
    this.renderTemplate();
    this.refresh();
    
    this.onMediaEvent("timeupdate", "refresh");
}

IriSP.Widgets.CurrentSegmentInfobox.prototype.refresh = function() {
    var _list = this.segments;
    
    _currentTime = this.media.getCurrentTime();
    _list = _list.filter(function(_segment){
        return (_segment.begin <= _currentTime && _segment.end >= _currentTime);
    })
    if (_list.length > 0){
        _currentSegment = _list[0];
        _data = {
            title: _currentSegment.title,
            description : _currentSegment.description,
            tags : _currentSegment.getTagTexts()
        }
        this.$.html(Mustache.to_html(this.template, _data))
    }
    else {
        var _empty_message = this.l10n.empty
        if (this.empty_message) {
            _empty_message = this.empty_message
        }
        this.$.find(".Ldt-CurrentSegmentInfobox").html("<div class='Ldt-CurrentSegmentInfobox-Element Ldt-CurrentSegmentInfobox-NoSegment'>"+_empty_message+"</div>");
    }
}