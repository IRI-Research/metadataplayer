/* tests for layout.js */
function test_layout() {
  module("layout manager", {setup: 
    function() { 
    IriSP.jQuery("#widget-div").append("<div id='LdtPlayer'></div>"); 
    IriSP.jQuery("#widget-div").append("<div id='myDiv'></div>"); 
    }});
  
  test("test the default initialization of layout manager", function() {
      var lay = new IriSP.LayoutManager();
      equal(lay._div, "LdtPlayer", "the default div is set correctly");
      equal(lay._width, 640, "the default width is set correctly");
      equal(lay._height, 480, "the default height is set correctly");
      
      equal(IriSP.jQuery("#" + lay._div).css("width"), lay._width + "px", "div width is set correctly");
      equal(IriSP.jQuery("#" + lay._div).css("height"), lay._height + "px", "div height is set correctly");
  });
  
  test("test custom init of layout manager", function() {
    var lay = new IriSP.LayoutManager({container: "myDiv", width: 327, height: 542});
    equal(lay._div, "myDiv", "the default div is set correctly");
    equal(lay._width, 327, "the default width is set correctly");
    equal(lay._height, 542, "the default height is set correctly");
    
    equal(IriSP.jQuery("#" + lay._div).css("width"), lay._width + "px", "div width is set correctly");
    equal(IriSP.jQuery("#" + lay._div).css("height"), lay._height + "px", "div height is set correctly");
  });
  
  test("test widget div creation", function() {
    var lay = new IriSP.LayoutManager({});
    var divId = lay.createDiv();
    
    equal(lay.selector.children("#" + divId).length, 1, "check that a subdiv is created");
    
  });
  
};
