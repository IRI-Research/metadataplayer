/* segmentsWidget.js */

function test_segments_widget() {
  module("segments widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockSerializer(this.dt, "/url"); /* dummy serializer */
    
    
    IriSP.jQuery("#widget-div").append("<div id='Ldt-Annotations'></div>");
    this.config = {
						metadata:{
							format:'cinelab',
							src:'test.json',
							load:'json'},
						gui:{
							width:650,
							height:1,
							mode:'radio',
							container:'widget-div',
							debug:true,
							css:'../src/css/LdtPlayer.css'},
					};
    },
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
  }
  });
  
  test("test widget initialization", function() {  
    var widget = new IriSP.SegmentsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
  
    equal(IriSP.jQuery("#Ldt-Annotations").length, 1, "test if the div has been added correctly");
    equal(IriSP.jQuery("#Ldt-Annotations").children().length, this.ser._data.annotations.length, "test if children have been added correctly");     
  });
  
  test("test click on a random segment", function() {
    var widget = new IriSP.SegmentsWidget(this.Popcorn, this.config, this.ser);
    widget.draw();
    
    var spy_callback = this.spy();
    var spy_handler = sinon.spy(widget, "clickHandler");
    this.Popcorn.listen("timeupdate", spy_callback);    
    
    var selector = IriSP.jQuery("#Ldt-Annotations :not(first-child)");
    var random = Math.round(Math.random() * selector.length);
    selector.eq(random).click();
        
    ok(spy_callback.called, "the currenttime was changed");         
    ok(spy_handler.called, "handling function has been called");           
  });
}; 