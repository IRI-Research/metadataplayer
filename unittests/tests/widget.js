/* test module for base widgets */
function test_widget() {
  module("Base widget testing", 
  {setup : function() {
    this.Popcorn = Popcorn("#popcorn-div");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.JSONSerializer(this.dt, "/url");
  } }
  );
  
  test("test initialisation", function() {
    var config = { container: "mydiv", width: 640, height: 480};
    var wid = new IriSP.Widget(this.Popcorn, config, this.ser);
    deepEqual(wid._config, config, "Check if the parent div is set correctly");
    ok(wid.selector, "Check if the jquery selector is set");
    
  });
  
  test("test initialisation with more values", function() {
    var config = { container: "mydiv", widthmax: 640, heightmax: 480};
    var wid = new IriSP.Widget(this.Popcorn, config, this.ser);
    deepEqual(wid._config, config, "Check if the parent div is set correctly");
    ok(wid.selector, "Check if the jquery selector is set");
    
  });
  
  
};
