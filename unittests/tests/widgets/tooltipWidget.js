/* tooltipWidget.js */

function test_tooltip_widget() {
  module("tooltip widget testing", 
  {setup : function() {    
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.MockSerializer(this.dt, "/url"); /* dummy serializer */
            
    this.config = {
							width: 160,
							height:120,
              container: "widget-div"
						};
    },
    
  teardown: function() {
    /* free the popcorn object because it has signal handlers attached to it */
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
  }
  });
  
  test("test tooltip widget initialization", function() {  
    var widget = new IriSP.TooltipWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();

    equal(widget.selector.children(".tip").length, 1, "test if the div has been added correctly");
    equal(widget.selector.children(".tip").css("position"), "fixed", "test if the widget has the correct position attr");    
    equal(widget.selector.children(".tip").css("left"), "-10000px", "test if div has been positionned correctly");
    equal(widget.selector.children(".tip").css("top"), "-100000px", "test if div has been positionned correctly");
  });
  
  test("test widget display function", function() {
    var widget = new IriSP.TooltipWidget(this.Popcorn, this.config, this.ser);    
    widget.draw();
    
    widget.show("ceci est un texte", "#fefefe", 105, 240);
    equal(widget.selector.children(".tip").css("left"), "105px", "test if div has been positionned correctly");
    equal(widget.selector.children(".tip").css("top"), "240px", "test if div has been positionned correctly");    
    equal(widget.selector.find(".tiptext").text(), "ceci est un texte", "test if text has been set correctly");
    
    widget.hide();
    equal(widget.selector.children(".tip").css("left"), "-10000px", "test if div has been positionned correctly");
    equal(widget.selector.children(".tip").css("top"), "-100000px", "test if div has been positionned correctly");
  });
}; 