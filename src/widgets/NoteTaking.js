/* This widget displays a note-taking view, that can be saved to localStorage */

IriSP.Widgets.NoteTaking = function(player, config) {
    IriSP.Widgets.Widget.call(this, player, config);
}

IriSP.Widgets.NoteTaking.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.NoteTaking.prototype.defaults = {
    // Id that will be used as localStorage key
    editable_storage: ""
}

IriSP.Widgets.NoteTaking.prototype.template = '<textarea class="Ldt-NoteTaking-Text"></textarea>';

IriSP.Widgets.NoteTaking.prototype.draw = function() {
    var widget = this;
    var content;
    var $ = IriSP.jQuery;

    widget.renderTemplate();
    content = widget.$.find('.Ldt-NoteTaking-Text');

    function load_content() {
        $(content).val(window.localStorage[widget.editable_storage]);
    }
    function save_content() {
        window.localStorage[widget.editable_storage] = $(content).val();
    }

    // Load current transcript
    if (window.localStorage[widget.editable_storage]) {
        load_content();
    }

    // Thanks to http://stackoverflow.com/questions/4456545/how-to-insert-text-at-the-current-caret-position-in-a-textarea
    $.fn.insertAtCaret = function(text) {
        return this.each(function() {
            if (this.selectionStart !== undefined) {
                // mozilla/netscape support
                var startPos = this.selectionStart,
                    endPos = this.selectionEnd,
                    scrollTop = this.scrollTop;
                this.value = this.value.substring(0, startPos) + text + this.value.substring(endPos, this.value.length);
                this.focus();
                this.selectionStart = startPos + text.length;
                this.selectionEnd = startPos + text.length;
                this.scrollTop = scrollTop;
            } else {
                // IE input[type=text] and other browsers
                this.value += text;
                this.focus();
                this.value = this.value;    // forces cursor to end
            }
        });
    };

    function getAroundCaret(el, length) {
        // Return a selection of 2 * length characters around the caret
        var startPos = el.selectionStart;
        return el.value.substring(startPos - length, startPos + length);
    };


    $(content).keydown(function (_event) {
        if (_event.keyCode == 13 && (_event.ctrlKey || _event.metaKey)) {
            // Insert current timestamp
            _event.preventDefault();
            // Get current value
            var match = /\[([\d:]+)\]/.exec(getAroundCaret(content[0], 8));
            if (match) {
                // Found a timecode. Go to position.
                widget.media.setCurrentTime(IriSP.timestamp2ms(match[1]));
            } else {
                $(content).insertAtCaret("[" + (new IriSP.Model.Time(widget.media.getCurrentTime())).toString() + "]");
                save_content();
            }
        }
    }).on("input", function (_event) {
        console.log("Change");
        // Store updated value
        save_content();
    }).on("dblclick", function (_event) {
            var match = /\[([\d:]+)\]/.exec(getAroundCaret(content[0], 8));
            if (match) {
                // Found a timecode. Go to position.
                _event.preventDefault();
                widget.media.setCurrentTime(IriSP.timestamp2ms(match[1]));
            };
    });
};
