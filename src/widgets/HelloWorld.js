/* Shows an example of a widget, with :
 * - Use of source data
 * - Use of templating
 * - Use of internationalization
 */

IriSP.Widgets.HelloWorld = function(player, config) {
    console.log("Calling IriSP.Widget's constructor from IriSP.HelloWorldWidget");
    IriSP.Widgets.Widget.call(this, player, config);
};

IriSP.Widgets.HelloWorld.prototype = new IriSP.Widgets.Widget();

IriSP.Widgets.HelloWorld.prototype.defaults = {
    text: "world"
};

IriSP.Widgets.HelloWorld.prototype.template =
    '<div class="Ldt-HelloWorld"><p>{{l10n.Hello}} {{text}}</p><p>Looks like we have {{source.contents.annotation.length}} annotations in this feed</p></div>';

IriSP.Widgets.HelloWorld.prototype.messages = {
    "fr": {
        "Hello" : "Bonjour,"
    },
    "en" : {
        "Hello" : "Hello,"
    }
};

IriSP.Widgets.HelloWorld.prototype.draw = function() {
    this.renderTemplate();
    console.log("HelloWorldWidget was drawn");
};