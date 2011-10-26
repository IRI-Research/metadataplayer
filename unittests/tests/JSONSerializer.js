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
      
      var response_array = { media: 12, content: "Hey there", 
                             annotations: [{"begin": "32", "end" : 64}, {"begin": "08", "end" : 27},{"begin": "02", "end" : 61}]  };

      /* sorted array is our comparision array */
      var sorted_array = IriSP.jQuery.extend({}, response_array);
      sorted_array.annotations.sort(function(a, b) 
          { var a_begin = +a.begin;
            var b_begin = +b.begin;
            return a_begin - b_begin;
          });
          
      var response_string = JSON.stringify(response_array);
  
      var spy_callback = this.spy();
      var ser = new IriSP.JSONSerializer(this.dt, "/url");
      
      ser.sync(spy_callback);
      
      equals(this.xhr.requests.length, 1, "the mock ajax object should have received the request");
      equals(this.xhr.requests[0].url, "/url", "the requested url is correct");

      this.xhr.requests[0].respond(200, { "Content-Type": "application/json" },
                             response_string);
        
      ok(spy_callback.calledOnce, "callback called");
      ok(spy_callback.calledWith(response_array), "callback called with correct value");
      deepEqual(ser._data, response_array, "the internal variable is initialized to the correct value");
      
      var order_preserved = true;
      
      var i = 0;
      for(i = 0; i < ser._data.length - 1; i++) {
        if (ser._data.annotations[i].begin > ser._data.annotations[i+1].begin) {
            order_preserved = false;
            break;
        }
      }
      
      ok(order_preserved, "the annotation sub-array is sorted by begin time");
    });

    test("currentMedia should return the current media", function() {
      var ser = new IriSP.JSONSerializer(this.dt, "/url");

      ser._data = {}
      ser._data.medias = [0];
      equal(ser.currentMedia(), 0, "currentMedia() returns the correct value");
    });

    test("test annotation search", function() {
      var ser = new IriSP.JSONSerializer(this.dt, "../test/test.json");
            
      ser._data = { annotations : [
      {"content": {        
        "description": "professeur", 
        "title": "garrigou"
        }},
      { "content": {        
        "description": "interview", 
        "title": "Revue de presse - Hervé Gardette"
      }},
      {"content": {        
        "description": "concept", 
        "title": "idée"
      }},
      { "content": {        
        "description": "", 
        "title": "sans titre"
      }}
      ]};
      
      equal(ser.searchAnnotations("GarriGOU", "", "").length, 1, "requesting on title works");
      equal(ser.searchAnnotations("", "IntErView", "").length, 1, "requesting on description works");      
      equal(ser.searchAnnotations("", "", "").length, 4, "empty request works");
      equal(ser.searchAnnotations("idée", "concept", "").length, 1, "specific request works");
      
      
    });
};