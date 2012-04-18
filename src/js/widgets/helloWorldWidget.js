IriSP.i18n.addMessages({
    "fr": {
        "Hello" : "Bonjour,"
    },
    "en" : {
        "Hello" : "Hello,"
    }
})

IriSP.HelloWorldWidget = function(player, config) {
    console.log("Calling IriSP.Widget's constructor from IriSP.HelloWorldWidget");
    IriSP.Widget.call(this, player, config);
    if (typeof this.text == "undefined") {
        this.text = 'world'
    }
}

IriSP.HelloWorldWidget.prototype = new IriSP.Widget();

IriSP.HelloWorldWidget.prototype.draw = function() {
    var _tmpl = '<p>{{l10n.Hello}} {{text}}</p><p>Looks like we have {{source.contents.annotation.length}} annotations in this feed</p>'
        _html = IriSP.templToHTML(_tmpl, this);
    this.$.append(_html);
    this.$.find('p').css({
        "text-align" : "center",
        "margin": "10px 0",
        "font-size" : "14px"
    });
    console.log("HelloWorldWidget was drawn");
}
