/* utils.js - various utils that don't belong anywhere else */

IriSP.jqEscape = function(_text) {
    return _text.replace(/(:|\.)/g, '\\$1');
};

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
};

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
};

IriSP.textFieldHtml = function(_text, _regexp, _extend) {
    var list = [],
        positions = [],
        text = _text.trim();

    function addToList(_rx, _startHtml, _endHtml) {
        while (true) {
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

    addToList(/(https?:\/\/)?[\w\d\-]+\.\w[\w\d\-]+\S+/gm, function(matches) {
        return '<a href="' + (matches[1] ? '' : 'http://') + matches[0] + '" target="_blank">';
    }, '</a>');
    addToList(/@([\d\w]{1,15})/gm, function(matches) {
        return '<a href="http://twitter.com/' + matches[1] + '" target="_blank">';
    }, '</a>');
    addToList(/\*[^*]+\*/gm, '<b>', '</b>');
    addToList(/[\n\r]+/gm, '', '<br />');

    IriSP._(_extend).each(function(x) {
        addToList.apply(null, x);
    });

    positions = IriSP._(positions)
        .chain()
        .uniq()
        .sortBy(function(p) { return parseInt(p); })
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

};

IriSP.log = function() {
    if (typeof console !== "undefined" && typeof IriSP.logging !== "undefined" && IriSP.logging) {
        console.log.apply(console, arguments);
    }
};

IriSP.attachDndData = function(jqSel, data) {
    jqSel.attr("draggable", "true").on("dragstart", function(_event) {
        var d = (typeof data === "function" ? data.call(this) : data);
        try {
            if (d.html === undefined && d.uri && d.text) {
                d.html = '<a href="' + d.uri + '">' + d.text + '</a>';
            }
            IriSP._(d).each(function(v, k) {
                if (v && k != 'text' && k != 'html') {
                    _event.originalEvent.dataTransfer.setData("text/x-iri-" + k, v);
                }
            });
            if (d.uri && d.text) {
                _event.originalEvent.dataTransfer.setData("text/x-moz-url", d.uri + "\n" + d.text.replace("\n", " "));
                _event.originalEvent.dataTransfer.setData("text/plain", d.text + " " + d.uri);
            }
            // Define generic text/html and text/plain last (least
            // specific types, see
            // https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#Drag_Data)
            if (d.html !== undefined) {
                _event.originalEvent.dataTransfer.setData("text/html", d.html);
            }
            if (d.text !== undefined && !d.uri) {
                _event.originalEvent.dataTransfer.setData("text/plain", d.text);
            }
        } catch (err) {
            _event.originalEvent.dataTransfer.setData("Text", JSON.stringify(d));
        }
    });
};

IriSP.FakeClass = function(properties) {
    var _this = this,
        noop = (function() {});
    IriSP._(properties).each(function(p) {
        _this[p] = noop;
    });
};

IriSP.timestamp2ms = function(t) {
    // Convert timestamp to numeric value
    // It accepts the following forms:
    // [h:mm:ss] [mm:ss] [ss]
    var s = t.split(":").reverse();
    while (s.length < 3) {
        s.push("0");
    }
    return 1000 * (3600 * parseInt(s[2], 10) + 60 * parseInt(s[1], 10) + parseInt(s[0], 10));
};

IriSP.setFullScreen = function(elem, value) {
    // Set fullscreen on or off
    if (value) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
};

IriSP.isFullscreen = function() {
    return (document.fullscreenElement ||  document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
};

IriSP.getFullscreenElement = function () {
    return (document.fullscreenElement
            || document.webkitFullscreenElement
            || document.mozFullScreenElement
            || document.msFullscreenElement
            || undefined);
};

IriSP.getFullscreenEventname = function () {
    return ((document.exitFullscreen && "fullscreenchange")
            || (document.webkitExitFullscreen && "webkitfullscreenchange")
            || (document.mozExitFullScreen && "mozfullscreenchange")
            || (document.msExitFullscreen && "msfullscreenchange")
            || "");
};

/**
 * Generate a UUID
 * Source: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
IriSP.generateUuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/**
 * Return a non-accentuated version of the given string
 */
IriSP.unaccent = function (s) {
    return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
