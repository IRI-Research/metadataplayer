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

    // Load current transcript
    if (window.localStorage[widget.editable_storage]) {
        $(content).val(window.localStorage[widget.editable_storage]);
    }

    // Thanks to http://stackoverflow.com/questions/4456545/how-to-insert-text-at-the-current-caret-position-in-a-textarea
    $.fn.insertAtCaret = function(text) {
        return this.each(function() {
            if (document.selection && this.tagName == 'TEXTAREA') {
                //IE textarea support
                this.focus();
                sel = document.selection.createRange();
                sel.text = text;
                this.focus();
            } else if (this.selectionStart || this.selectionStart == '0') {
                //MOZILLA/NETSCAPE support
                startPos = this.selectionStart;
                endPos = this.selectionEnd;
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
 
    $(content).keydown(function (_event) {
        if (_event.keyCode == 13 && (_event.ctrlKey || _event.metaKey)) {
            // Insert current timestamp
            _event.preventDefault();
            $(content).insertAtCaret("[" + (new IriSP.Model.Time(widget.media.getCurrentTime())).toString() + "]");
        }
    }).on("input", function (_event) {
        console.log("Change");
        // Store updated value
        window.localStorage[widget.editable_storage] = $(content).val();
    });
};
