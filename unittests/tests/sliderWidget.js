function test_slider_widget() {
 module("slider widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockSerializer(this.dt, "/url"); /* dummy serializer */
            
    this.config = {
						metadata:{
							format:'cinelab',
							src:'test.json',
							load:'json'},
							width:650,
							height:1,
							mode:'radio',
							container:'widget-div',
							debug:true,
							css:'../src/css/LdtPlayer.css'}
    },  
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
  }});
  
  test("test widget initialization", function() {  
    var widget = new IriSP.SliderWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
    
    ok(IriSP.jQuery("#widget-div").hasClass("ui-slider"), "test if the div has been set-up");
  
  });
  
  test("test slider seeking", function() {    
    var widget = new IriSP.SliderWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
    
    var spy_callback = this.spy();
    widget._Popcorn.listen("test.fixture", spy_callback);       
    IriSP.jQuery("#widget-div").slider("value", 30);
    ok(spy_callback.called, "handling function has been called");
  });
}