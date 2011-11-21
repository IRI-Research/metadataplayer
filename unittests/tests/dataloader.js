function test_dataloader() {
  module("Dataloader", { setup: function() {                                     
                                      IriSP.jQuery = jQuery;
                                }
    });  
  
  test("should initialize dataloader", function() {
    var dt = new IriSP.DataLoader();    
    deepEqual(dt._cache, {}, "_cache empty");
  });
               
  test("should get an outside ressource", function() {
   
    var response_array = [{ id: 12, text: "Hey there" }];
    var response_string = JSON.stringify(response_array);
    
    var xhr = this.sandbox.useFakeXMLHttpRequest();
    var requests = this.requests = [];
    
    xhr.onCreate = function (request) {
        requests.push(request);
    };

    var spy_callback = this.spy();
    var dt = new IriSP.DataLoader();
    
    var resp = dt.get("/url&a=1", spy_callback);

    equals(xhr.requests.length, 1, "the mock ajax object should have received the request");
    
    xhr.requests[0].respond(200, { "Content-Type": "application/json" },
                             response_string);
    
    
    ok(spy_callback.calledOnce, "callback called");
    ok(spy_callback.calledWith(response_array), "callback called with correct string");
    
    deepEqual(dt._cache["/url"], response_array, "the response should be stored in the cache");
    
    var resp2 = dt.get("/url&a=2", spy_callback);
    ok(spy_callback.calledTwice && xhr.requests.length === 1, "callback called twice but request made only once.");
    
  });
    
}