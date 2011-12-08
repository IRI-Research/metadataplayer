/* polemicWidget.js */

function test_polemic_widget() {
  module("polemic widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn("#popcorn-div");
    
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
							height:120,
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
    this.Popcorn = Popcorn("#popcorn-div");
  }});
  
  test("test widget initialization", function() {

    var tooltip = new IriSP.TooltipWidget(this.Popcorn, this.config.requires[0], this.ser);
    var widget = new IriSP.PolemicWidget(this.Popcorn, this.config, this.ser);
    widget.TooltipWidget = tooltip;
    
    widget.draw();    
    equal(IriSP.jQuery("#widget-div").length, 1, "test if the div has been added correctly");        
    equal(IriSP.jQuery("#PolemicDiv svg").length, 1, "test if svg div has been added correctly");
    
    // select the second element of the svg. the second because the first is a rect which serves
    // as a background.
    var paperSlider = IriSP.jQuery("#PolemicDiv svg :nth-child(2)");
    // querying svg with jquery is quite the piece of cake.
    equal(paperSlider.attr("x").baseVal.value, 0, "test if the slider has been created correctly");            
  });
  
  test("test widget interactions", function() {
  
    /* We can't test interactions because of raphael */
    // var tooltip = new IriSP.TooltipWidget(this.Popcorn, this.config.requires[0], this.ser);
    // var widget = new IriSP.PolemicWidget(this.Popcorn, this.config, this.ser);
    
    // widget.TooltipWidget = tooltip;
    // widget.draw();
    
    // var spy_callback = this.spy();    
    // this.Popcorn.listen("timeupdate", spy_callback);
    
    // var random = Math.round(Math.random() * widget.svgElements.length) + 1;
    // var e = widget.svgElements[random].node;
    // IriSP.jQuery(e).click();
    
    // ok(spy_callback.called, "the currenttime was changed");  
    
  });
  
  
}; 
