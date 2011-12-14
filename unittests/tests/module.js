/* test module for base widgets */
function test_module() {
  module("Base module testing", 
  {setup : function() {
    this.Popcorn = Popcorn("#popcorn-div");
    
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.JSONSerializer(this.dt, "/url");
  } }
  );
  
  test("test initialisation", function() {
    var config = { a : 540};
    var mod = new IriSP.Module(this.Popcorn, config, this.ser);
    deepEqual(mod._config, config, "Check that config is copied correctly");
  });
};
