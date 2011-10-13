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
    
    test("sync()", function() {
      this.xhr = this.sandbox.useFakeXMLHttpRequest();
      this.requests = [];
      this.xhr.onCreate = function (request) {
        this.requests.push(request);
      };
      
      var response_array = [{ media: 12, content: "Hey there" }];
      var response_string = JSON.stringify(response_array);
  
      var spy_callback = this.spy();
      var ser = new IriSP.JSONSerializer(this.dt, "/url");
      
      ser.sync(spy_callback);
      
      equals(this.xhr.requests.length, 1, "the mock ajax object should have received the request");
      this.xhr.requests[0].respond(200, { "Content-Type": "application/json" },
                             response_string);
        
      ok(spy_callback.calledOnce, "callback called");
      ok(spy_callback.calledWith(response_array), "callback called with correct value");
      deepEqual(ser._data, response_array, "the internal variable is initialized to the correct value");
    });

    test("currentMedia should return the current media", function() {
      var ser = new IriSP.JSONSerializer(this.dt, "/url");
      /* FIXME: actually get something instead of monkey-patching the struct */
      ser._data = {}
      ser._data.medias = [0];
      equal(ser.currentMedia(), 0, "currentMedia() returns the correct value");
    });
};