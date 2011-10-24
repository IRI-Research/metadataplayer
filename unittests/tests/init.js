function test_init() {
	module("test initialization routines", 
  {
    setup: function() {
      IriSP.jQuery("#widget-div").append("<div id='player_container'></div>");
      this.popcornOptions = {
          container: "#player_container",
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

            
    var pop = IriSP.configurePopcorn(this.popcornOptions);
    notDeepEqual(pop, undefined, "returned object is not undefined");
    
    /* FIXME: add more test options ? */
    equal(pop.options.type, "jwplayer", "the player is of the correct type.");
  });
  
  test("test the instantiation of a bunch of widgets", function() {
    var pop = IriSP.configurePopcorn(this.popcornOptions);
    var widgets = IriSP.configureWidgets(pop, this.widgetOptions);
    
    ok(widgets[0] instanceof IriSP.PlayerWidget, "first widget is a player widget");
    ok(widgets[1] instanceof IriSP.SegmentsWidget, "second widget is a segments widget");
    ok(widgets[2] instanceof IriSP.AnnotationsWidget, "third widget is an annotation widget");
  });
}