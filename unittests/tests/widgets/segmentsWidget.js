/* segmentsWidget.js */

function test_segments_widget() {
  module("segments widget testing", 
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
    var widget = new IriSP.SegmentsWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
  
    equal(IriSP.jQuery("#widget-div").length, 1, "test if the div has been added correctly");
    // the + 1 is because we have a z-index div to indicate progress in the video.
    equal(IriSP.jQuery("#widget-div").children().length, this.ser._data.annotations.length + 1, "test if children have been added correctly");
    equal(IriSP.jQuery("#widget-div").children(":first").css("z-index"), 100, "test if slider div is created correctly.");
    equal(IriSP.jQuery("#widget-div").css("overflow"), "auto", "test if the divs are floated correctly.");
  });
  
  test("test click on a random segment", function() {
    var widget = new IriSP.SegmentsWidget(this.Popcorn, this.config, this.ser);
    widget.draw();
    
    var spy_timeupdate = this.spy();
    var spy_segmentClick = this.spy();
    var spy_handler = sinon.spy(widget, "clickHandler");
    this.Popcorn.listen("timeupdate", spy_timeupdate);    
    
    var selector = IriSP.jQuery("#widget-div :not(first-child)");
    var random = Math.round(Math.random() * selector.length) + 1;
    selector.eq(random).click();
        
    ok(spy_timeupdate.called, "the timeupdate signal has been sent");         
    ok(spy_handler.called, "handling function has been called");           
  });
  
  test("test search highlight features", function() {
  
    var tag_id = "#s_" + "82613B88-9578-DC2C-D7D0-B2C5BE0B7BDA".toUpperCase();
    
    var widget = new IriSP.SegmentsWidget(this.Popcorn, this.config, this.ser);
    widget.draw();    

    var oldStyle = IriSP.jQuery("#widget-div").children(tag_id).attr("style");
    widget._Popcorn.trigger("IriSP.search", "sociologie");
    var newStyle = IriSP.jQuery("#widget-div").children(tag_id).attr("style");
    notEqual(oldStyle, newStyle, "the segment style has been modified");
  });
}; 
