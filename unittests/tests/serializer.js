function test_serializer() {
  module("Serializer basic tests", {setup: function() {
    this.dt = new IriSP.DataLoader();
    this.ser = new IriSP.Serializer(this.dt, "http://google.com");
  }});
  
  test("init the serializer with a DataLoader and an url", function() {
      
      equal( this.ser._DataLoader, this.dt, "The dataloader reference is copied to the object." );
      equal( this.ser._url, "http://google.com", "The url has been copied as well." );      
      deepEqual( this.ser._data, [], "The serializer data is not defined." );
  });
  
  test("check that the serialize and deserialize abstract functions are defined", function() {
      notEqual(this.ser.serialize, undefined, ".serialize is defined");
      notEqual(this.ser.deserialize, undefined, ".deserialize is defined");
  });
  
  test("check if currentMedia() is defined", function() {
  
  });

};