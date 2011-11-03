function test_init() {
	module("test initialization routines", 
  {
    setup: function() {
      IriSP.jQuery("#widget-div").append("<div id='LdtPlayer'></div>");
      this.popcornOptions = {
          container: "LdtPlayer",
          type: "jwplayer", file : "video/franceculture/franceculture_retourdudimanche20100620.flv", 
          streamer: "rtmp://media.iri.centrepompidou.fr/ddc_player/", 
          flashplayer : '../libs/player.swf',
          live: true, 
          "controlbar.position" : "none", 
          height: 300, 
          width: 200, 
          provider: "rtmp" 
        };
        
        this.widgetOptions = {
						width:650,
						height:480,							
						container:'LdtPlayer',
						css:'../../src/css/LdtPlayer.css',
            widgets: [
              {type: "PlayerWidget",
               mode: "radio",
               metadata:{
                format:'cinelab',
                src:'test.json',
                type:'dummy'}
              },
             {type: "SegmentsWidget", 
               metadata:{
                format:'cinelab',
                src:'test.json',
                type:'dummy'}
              },
             {type: "AnnotationsWidget", 
               metadata:{
                format:'cinelab',
                src:'test.json',
                type:'dummy'}
              },
            ]};
    }
  });
  
  test("test the creation of a correct popcorn object", function() {

    var layoutManager = new IriSP.LayoutManager({container: "LdtPlayer", width: 327, height: 542});
    var pop = IriSP.configurePopcorn(layoutManager, this.popcornOptions);
    notDeepEqual(pop, undefined, "returned object is not undefined");
    
    /* FIXME: add more test options ? */
    equal(pop.options.type, "jwplayer", "the player is of the correct type.");
  });
  
  test("test the creation of a video tag", function() {
  
    var popcornOptions = {
            type: "html5",
            file: "demo.mp4"
          };
    
    var layoutManager = new IriSP.LayoutManager({container: "LdtPlayer", width: 327, height: 542});
    var pop = IriSP.configurePopcorn(layoutManager, popcornOptions);
    
    var elem = IriSP.jQuery("#LdtPlayer").find("video");
    notDeepEqual(elem, [], "the element is not null");
    equal(elem.attr("src"), popcornOptions.file, "the src attribute is set correctly");    
  });
  
  test("test the instantiation of a single widget without dependencies", function() {
    
    var dt = new IriSP.DataLoader();
    var serialFactory = new IriSP.SerializerFactory(dt);
 
    var layoutManager = new IriSP.LayoutManager({container: "LdtPlayer", width: 327, height: 542});
    var pop = IriSP.configurePopcorn(layoutManager, this.popcornOptions);
    var conf = {type: "PlayerWidget",
               mode: "radio",
               metadata:{
                format:'cinelab',
                src:'test.json',
                type:'dummy'}
              };
              
    var res = IriSP.instantiateWidget(pop, serialFactory, layoutManager, conf);    
    ok(res instanceof IriSP.PlayerWidget, "the returned widget is of the correct instance");
    equal(res._config.mode, "radio", "the parameters not interpreted by the config are copied into the object");
  });  
  
  test("test the instantiation of a single widget with one dependency", function() {
    var dt = new IriSP.DataLoader();
    var serialFactory = new IriSP.SerializerFactory(dt);
 
    var layoutManager = new IriSP.LayoutManager({container: "LdtPlayer", width: 327, height: 542});    
    
    var pop = IriSP.configurePopcorn(layoutManager, this.popcornOptions);
    var conf = {type: "PlayerWidget",
               mode: "radio",
               metadata:{
                format:'cinelab',
                src:'test.json',
                type:'dummy'},
                requires: [
                {type: "PlayerWidget",
                  mode: "radio",
                  metadata:{
                    format:'cinelab',
                    src:'test.json',
                    type:'dummy'
                } }]
              };
    
    
    var res = IriSP.instantiateWidget(pop, serialFactory, layoutManager, conf);
    
    ok(res instanceof IriSP.PlayerWidget, "the returned widget is of the correct instance");
    ok(res.PlayerWidget instanceof IriSP.PlayerWidget, "the dependency widget is accessible from the parent");
  });
  
  test("test the instantiation of a bunch of widgets", function() {
  
    var layoutManager = new IriSP.LayoutManager({container: "LdtPlayer", width: 327, height: 542});
    var pop = IriSP.configurePopcorn(layoutManager, this.popcornOptions);
    
    var widgets = IriSP.configureWidgets(pop, layoutManager, this.widgetOptions);

    ok(widgets[0] instanceof IriSP.PlayerWidget, "first widget is a player widget");       
    ok(widgets[1] instanceof IriSP.SegmentsWidget, "second widget is a segments widget");
    ok(widgets[2] instanceof IriSP.AnnotationsWidget, "third widget is an annotation widget");
    equal(IriSP.jQuery("#" + this.widgetOptions.container).length, 1, "a new dom element has been created");
  });
  

}