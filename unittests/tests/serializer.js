function test_serializer() {
  module("Serializer basic tests");
  
  test("init the serializer with a DataLoader and an url", function() {
      var dt = new IriSP.DataLoader();
      var ser = new IriSP.Serializer(dt, "http://google.com");
      equal( ser._DataLoader, dt, "The dataloader reference is copied to the object." );
      equal( ser._url, "http://google.com", "The url has been copied as well." );
  });
  
  test("check that the serialize and deserialize abstract functions are defined", function() {
      var dt = new IriSP.DataLoader();
      var ser = new IriSP.Serializer(dt);
      equal(ser.serialize(), undefined, ".serialize is defined");
      equal(ser.deserialize(), undefined, ".deserialize is defined");
  });

};