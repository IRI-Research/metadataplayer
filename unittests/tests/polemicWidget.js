/* polemicWidget.js */

function test_polemic_widget() {
  module("polemic widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockTweetSerializer(this.dt, "/url"); /* dummy serializer */

    IriSP.jQuery("#widget-div").append("<div id='TooltipDiv'></div>");
    IriSP.jQuery("#widget-div").append("<div id='PolemicDiv'></div>");
    this.config = {
						metadata:{
							format:'cinelab',
							src:'test.json',
							load:'json'},
							width:650,
							height:1,
							mode:'radio',
							container:'PolemicDiv',
							debug:true,
							css:'../src/css/LdtPlayer.css',
            requires: [{
							type: "TooltipWidget",
              container: "TooltipDiv",
							width: 180,
							heigh: 160,
							metadata : {
								format:'cinelab',
								type:'empty'
							}
						 }]
    }
    },  
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
  }});
  
  test("test widget initialization", function() {

    var tooltip = new IriSP.TooltipWidget(this.Popcorn, this.config.requires[0], this.ser);
    var widget = new IriSP.PolemicWidget(this.Popcorn, this.config, this.ser);
    widget.TooltipWidget = tooltip;
    
    widget.draw();    
    equal(IriSP.jQuery("#widget-div").length, 1, "test if the div has been added correctly");        
    equal(IriSP.jQuery("#PolemicDiv").children().length, 1, "test if children have been added correctly");
  });
}; 