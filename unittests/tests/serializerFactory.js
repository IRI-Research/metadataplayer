/* tests for the serializer factory */
function test_serializerFactory() {
  module("SerializerFactory tests", 
    { setup: function() {
              this.dt = new IriSP.DataLoader();
  }}); 
  
  test("test instantiation of a json serializer", function() {
    var factory = new IriSP.SerializerFactory(this.dt);    
    var config = {metadata : { load: "json", src : "/url" } };
    var ser = factory.getSerializer(config);
    
    ok(ser instanceof IriSP.JSONSerializer, "returned object is instance of json serializer");    
  });
  
  test("test instantiation of a garbage serializer", function() {
    var factory = new IriSP.SerializerFactory(this.dt);    
    var config = {metadata : { load: "garbage", src : "/url" } };
    var ser = factory.getSerializer(config);
    
    equal(ser, undefined, "returned object is undefined");    
  });
};