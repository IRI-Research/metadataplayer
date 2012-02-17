/* This is the constructor of the widget. It's called by the
   initialization routine.
*/
IriSP.TutorialWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  /* After having called the parent constructor, a couple objects are defined for us
     this._config contains all the configuration options passed in the config.
     this._id holds the id of the div where the widget has to draw himself
     this._serializer is an object containing the metadata that was request in the configuration 
     options.
  */
  
}

/* We need to create assign new prototype to TutorialWidget.prototype
   because we're going to declare methods in it */
IriSP.TutorialWidget.prototype = new IriSP.Widget();

/* This method draws the widget - it's called automatically by
   the initialization script.
 */
IriSP.TutorialWidget.prototype.draw = function() {
    /* this.selector is a shortcut to jQuery(widget.container) - it's used everywhere in the code */
    this.selector.html('Hello');
    this.selector.css({
            "text-align" : "center",
            "padding": "10px 0",
            "font-size" : "14px"
        });
        
    /* The following is a list of idioms found throughout the code */
    var templ = IriSP.player_template; /* get the compiled template code for the player.html template - 
                                          templates are located in the src/templates directory and are automatically
                                          compiled and made available in the compiled file as IriSP.templatename_template (without the .html)
                                        */
    var res = IriSP.templToHTML(IriSP.player_template, {var: 1}); /* format the template with the variable 'var' */
    
    /* this._Popcorn is a handle on the Popcorn object. It exposes the API which is documented
       here : http://popcornjs.org/api
       currentTime is a Popcorn method that either returns or changes the currentTime.
       */
    var time = this._Popcorn.currentTime();    
    
    /* Listen to the IriSP.TutorialWidget.foo message. By convention, the name of
       a message is IriSP.widgetName.messageName */
    this._Popcorn.listen("IriSP.TutorialWidget.foo",
                          /* IriSP.wrap preserves this in the callback */
                          IriSP.wrap(this, this.fooMessageHandler));
    /* send a message, passing an object allong */
    this._Popcorn.trigger("IriSP.TutorialWidget.foo", {name: "Dave", surname: "Grohl"});
};

/* Handler for the IriSP.foo message */
IriSP.TutorialWidget.prototype.fooMessageHandler = function(param) {
  
  // show that this is preserved correctly.
  console.log(this !== window, this);
  
  this.selector.append(IriSP.templToHTML("<h2>{{ name }}, {{ surname }}</h2>", {name: param.name, surname: param.surname}));
  return;
};