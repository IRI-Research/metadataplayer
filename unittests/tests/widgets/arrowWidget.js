/* arrowWidget.js */

function test_arrow_widget() {
  module("arrow widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn("#popcorn-div");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockSerializer(this.dt, "/url"); /* dummy serializer */
        
    
    this.config = {
							width:650,
							height:1,
							mode:'radio',
							container:'widget-div',
							debug:true,
							css:'../src/css/LdtPlayer.css'};
    },
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn("#popcorn-div");
  }
  });
  
  test("test widget initialization", function() {  
  
    var widget = new IriSP.ArrowWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();

    equal(widget.selector.children(".Ldt-arrowWidget").length, 1, "test if the div has been added correctly");

    /*
    widget._Popcorn.media.currentTime = 400;
    widget._Popcorn.trigger("timeupdate");
    equal(widget.selector.children(".Ldt-arrowWidget").css("left"), "22%", "test if the widget responds correctly to messages.");
  */
  });
 }; 
