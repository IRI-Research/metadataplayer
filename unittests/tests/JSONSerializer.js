function test_JSONSerializer() {
  module("JSON Serializer tests", 
    { setup: function() {
      this.dt = new IriSP.DataLoader();
      }
    }
    );    
    
    test("should return the correct JSON", function() {
      var arr = ["ab", {"de" : "fg"}, "lp"];
      var serializer = new IriSP.JSONSerializer(this.dt);

      equal(serializer.serialize(arr), JSON.stringify(arr), "assert that the outputted json is correct");
    });

};