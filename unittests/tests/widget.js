/* test module for base widgets */
function test_widget() {
  module("Base widget testing", 
  {setup : function() {
    this.Popcorn = Popcorn.youtube("#popcorn-div", "http://www.youtube.com/watch?v=QH2-TGUlwu4");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.JSONSerializer(this.dt, "/url");
  } }
  );
  
  test("test initialisation", function() {
    var wid = new IriSP.Widget(this.Popcorn, {parent: "widget-div"}, this.ser);
    deepEqual(wid._config, {parent: "widget-div"}, "Check if the parent div is set correctly");
    
  });
  
  
};