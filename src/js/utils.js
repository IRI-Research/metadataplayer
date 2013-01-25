/* utils.js - various utils that don't belong anywhere else */

IriSP.jqEscape = function(_text) {
    return _text.replace(/(:|\.)/g,'\\$1');
}

IriSP.getLib = function(lib) {
    if (IriSP.libFiles.useCdn && typeof IriSP.libFiles.cdn[lib] == "string") {
        return IriSP.libFiles.cdn[lib];
    }
    if (typeof IriSP.libFiles.locations[lib] == "string") {
        return IriSP.libFiles.locations[lib];
    }
    if (typeof IriSP.libFiles.inDefaultDir[lib] == "string") {
        return IriSP.libFiles.defaultDir + '/' + IriSP.libFiles.inDefaultDir[lib];
    }
}

IriSP._cssCache = [];

IriSP.loadCss = function(_cssFile) {
    if (IriSP._(IriSP._cssCache).indexOf(_cssFile) === -1) {
        IriSP.jQuery("<link>", {
            rel : "stylesheet",
            type : "text/css",
            href : _cssFile
        }).appendTo('head');
        IriSP._cssCache.push(_cssFile);
    }
}

IriSP.textFieldHtml = function(_text, _regexp, _extend) {
    var list = [],
        positions = [],
        text = _text.replace(/(^\s+|\s+$)/g,'');
    
    function addToList(_rx, _startHtml, _endHtml) {
        while(true) {
            var result = _rx.exec(text);
            if (!result) {
                break;
            }
            var end = _rx.lastIndex,
                start = result.index;
            list.push({
                start: start,
                end: end,
                startHtml: (typeof _startHtml === "function" ? _startHtml(result) : _startHtml),
                endHtml: (typeof _endHtml === "function" ? _endHtml(result) : _endHtml)
            });
            positions.push(start);
            positions.push(end);
        }
    }
    
    if (_regexp) {
        addToList(_regexp, '<span class="Ldt-Highlight">', '</span>');
    }
    
    addToList(/(https?:\/\/)?\w+\.\w+\S+/gm, function(matches) {
        return '<a href="' + (matches[1] ? '' : 'http://') + matches[0] + '" target="_blank">'
    }, '</a>');
    addToList(/@([\d\w]{1,15})/gm, function(matches) {
        return '<a href="http://twitter.com/' + matches[1] + '" target="_blank">'
    }, '</a>');
    addToList(/\*[^*]+\*/gm, '<b>', '</b>');
    addToList(/[\n\r]+/gm, '', '<br />');
    
    IriSP._(_extend).each(function(x) {
        addToList.apply(null, x);
    });
    
    positions = IriSP._(positions)
        .chain()
        .uniq()
        .sortBy(function(p) { return parseInt(p) })
        .value();
    
    var res = "", lastIndex = 0;
    
    for (var i = 0; i < positions.length; i++) {
        var pos = positions[i];
        res += text.substring(lastIndex, pos);
        for (var j = list.length - 1; j >= 0; j--) {
            var item = list[j];
            if (item.start < pos && item.end >= pos) {
                res += item.endHtml;
            }
        }
        for (var j = 0; j < list.length; j++) {
            var item = list[j];
            if (item.start <= pos && item.end > pos) {
                res += item.startHtml;
            }
        }
        lastIndex = pos;
    }
    
    res += text.substring(lastIndex);
    
    return res;
    
}

IriSP.log = function() {
    if (typeof console !== "undefined" && typeof IriSP.logging !== "undefined" && IriSP.logging) {
        console.log.apply(console, arguments);
    }
}
