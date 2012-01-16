IriSP.HelloWorldWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
}

IriSP.HelloWorldWidget.prototype = new IriSP.Widget();

IriSP.HelloWorldWidget.prototype.draw = function() {
    this.selector
        .html('Hello, world')
        .css({
            "text-align" : "center",
            "padding": "10px 0",
            "font-size" : "14px",
        });
        
    console.log(this);
}
