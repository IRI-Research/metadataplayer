/* 
 * 	
 *	Copyright 2010 Institut de recherche et d'innovation 
 *	contributor(s) : Samuel Huron 
 *	 
 *	contact@iri.centrepompidou.fr
 *	http://www.iri.centrepompidou.fr 
 *	 
 *	This software is a computer program whose purpose is to show and add annotations on a video .
 *	This software is governed by the CeCILL-C license under French law and
 *	abiding by the rules of distribution of free software. You can  use, 
 *	modify and/ or redistribute the software under the terms of the CeCILL-C
 *	license as circulated by CEA, CNRS and INRIA at the following URL
 *	"http://www.cecill.info". 
 *	
 *	The fact that you are presently reading this means that you have had
 *	knowledge of the CeCILL-C license and that you accept its terms.
*/
/*! LAB.js (LABjs :: Loading And Blocking JavaScript)
    v2.0.3 (c) Kyle Simpson
    MIT License
*/

(function(global){
	var _$LAB = global.$LAB,
	
		// constants for the valid keys of the options object
		_UseLocalXHR = "UseLocalXHR",
		_AlwaysPreserveOrder = "AlwaysPreserveOrder",
		_AllowDuplicates = "AllowDuplicates",
		_CacheBust = "CacheBust",
		/*!START_DEBUG*/_Debug = "Debug",/*!END_DEBUG*/
		_BasePath = "BasePath",
		
		// stateless variables used across all $LAB instances
		root_page = /^[^?#]*\//.exec(location.href)[0],
		root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
		append_to = document.head || document.getElementsByTagName("head"),
		
		// inferences... ick, but still necessary
		opera_or_gecko = (global.opera && Object.prototype.toString.call(global.opera) == "[object Opera]") || ("MozAppearance" in document.documentElement.style),

/*!START_DEBUG*/
		// console.log() and console.error() wrappers
		log_msg = function(){}, 
		log_error = log_msg,
/*!END_DEBUG*/
		
		// feature sniffs (yay!)
		test_script_elem = document.createElement("script"),
		explicit_preloading = typeof test_script_elem.preload == "boolean", // http://wiki.whatwg.org/wiki/Script_Execution_Control#Proposal_1_.28Nicholas_Zakas.29
		real_preloading = explicit_preloading || (test_script_elem.readyState && test_script_elem.readyState == "uninitialized"), // will a script preload with `src` set before DOM append?
		script_ordered_async = !real_preloading && test_script_elem.async === true, // http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
		
		// XHR preloading (same-domain) and cache-preloading (remote-domain) are the fallbacks (for some browsers)
		xhr_or_cache_preloading = !real_preloading && !script_ordered_async && !opera_or_gecko
	;

/*!START_DEBUG*/
	// define console wrapper functions if applicable
	if (global.console && global.console.log) {
		if (!global.console.error) global.console.error = global.console.log;
		log_msg = function(msg) { global.console.log(msg); };
		log_error = function(msg,err) { global.console.error(msg,err); };
	}
/*!END_DEBUG*/

	// test for function
	function is_func(func) { return Object.prototype.toString.call(func) == "[object Function]"; }

	// test for array
	function is_array(arr) { return Object.prototype.toString.call(arr) == "[object Array]"; }

	// make script URL absolute/canonical
	function canonical_uri(src,base_path) {
		var absolute_regex = /^\w+\:\/\//;
		
		// is `src` is protocol-relative (begins with // or ///), prepend protocol
		if (/^\/\/\/?/.test(src)) {
			src = location.protocol + src;
		}
		// is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /)
		else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
			// prepend `base_path`, if any
			src = (base_path || "") + src;
		}
		// make sure to return `src` as absolute
		return absolute_regex.test(src) ? src : ((src.charAt(0) == "/" ? root_domain : root_page) + src);
	}

	// merge `source` into `target`
	function merge_objs(source,target) {
		for (var k in source) { if (source.hasOwnProperty(k)) {
			target[k] = source[k]; // TODO: does this need to be recursive for our purposes?
		}}
		return target;
	}

	// does the chain group have any ready-to-execute scripts?
	function check_chain_group_scripts_ready(chain_group) {
		var any_scripts_ready = false;
		for (var i=0; i<chain_group.scripts.length; i++) {
			if (chain_group.scripts[i].ready && chain_group.scripts[i].exec_trigger) {
				any_scripts_ready = true;
				chain_group.scripts[i].exec_trigger();
				chain_group.scripts[i].exec_trigger = null;
			}
		}
		return any_scripts_ready;
	}

	// creates a script load listener
	function create_script_load_listener(elem,registry_item,flag,onload) {
		elem.onload = elem.onreadystatechange = function() {
			if ((elem.readyState && elem.readyState != "complete" && elem.readyState != "loaded") || registry_item[flag]) return;
			elem.onload = elem.onreadystatechange = null;
			onload();
		};
	}

	// script executed handler
	function script_executed(registry_item) {
		registry_item.ready = registry_item.finished = true;
		for (var i=0; i<registry_item.finished_listeners.length; i++) {
			registry_item.finished_listeners[i]();
		}
		registry_item.ready_listeners = [];
		registry_item.finished_listeners = [];
	}

	// make the request for a scriptha
	function request_script(chain_opts,script_obj,registry_item,onload,preload_this_script) {
		// setTimeout() "yielding" prevents some weird race/crash conditions in older browsers
		setTimeout(function(){
			var script, src = script_obj.real_src, xhr;
			
			// don't proceed until `append_to` is ready to append to
			if ("item" in append_to) { // check if `append_to` ref is still a live node list
				if (!append_to[0]) { // `append_to` node not yet ready
					// try again in a little bit -- note: will re-call the anonymous function in the outer setTimeout, not the parent `request_script()`
					setTimeout(arguments.callee,25);
					return;
				}
				// reassign from live node list ref to pure node ref -- avoids nasty IE bug where changes to DOM invalidate live node lists
				append_to = append_to[0];
			}
			script = document.createElement("script");
			if (script_obj.type) script.type = script_obj.type;
			if (script_obj.charset) script.charset = script_obj.charset;
			
			// should preloading be used for this script?
			if (preload_this_script) {
				// real script preloading?
				if (real_preloading) {
					/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("start script preload: "+src);/*!END_DEBUG*/
					registry_item.elem = script;
					if (explicit_preloading) { // explicit preloading (aka, Zakas' proposal)
						script.preload = true;
						script.onpreload = onload;
					}
					else {
						script.onreadystatechange = function(){
							if (script.readyState == "loaded") onload();
						};
					}
					script.src = src;
					// NOTE: no append to DOM yet, appending will happen when ready to execute
				}
				// same-domain and XHR allowed? use XHR preloading
				else if (preload_this_script && src.indexOf(root_domain) == 0 && chain_opts[_UseLocalXHR]) {
					xhr = new XMLHttpRequest(); // note: IE never uses XHR (it supports true preloading), so no more need for ActiveXObject fallback for IE <= 7
					/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("start script preload (xhr): "+src);/*!END_DEBUG*/
					xhr.onreadystatechange = function() {
						if (xhr.readyState == 4) {
							xhr.onreadystatechange = function(){}; // fix a memory leak in IE
							registry_item.text = xhr.responseText + "\n//@ sourceURL=" + src; // http://blog.getfirebug.com/2009/08/11/give-your-eval-a-name-with-sourceurl/
							onload();
						}
					};
					xhr.open("GET",src);
					xhr.send();
				}
				// as a last resort, use cache-preloading
				else {
					/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("start script preload (cache): "+src);/*!END_DEBUG*/
					script.type = "text/cache-script";
					create_script_load_listener(script,registry_item,"ready",function() {
						append_to.removeChild(script);
						onload();
					});
					script.src = src;
					append_to.insertBefore(script,append_to.firstChild);
				}
			}
			// use async=false for ordered async? parallel-load-serial-execute http://wiki.whatwg.org/wiki/Dynamic_Script_Execution_Order
			else if (script_ordered_async) {
				/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("start script load (ordered async): "+src);/*!END_DEBUG*/
				script.async = false;
				create_script_load_listener(script,registry_item,"finished",onload);
				script.src = src;
				append_to.insertBefore(script,append_to.firstChild);
			}
			// otherwise, just a normal script element
			else {
				/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("start script load: "+src);/*!END_DEBUG*/
				create_script_load_listener(script,registry_item,"finished",onload);
				script.src = src;
				append_to.insertBefore(script,append_to.firstChild);
			}
		},0);
	}
		
	// create a clean instance of $LAB
	function create_sandbox() {
		var global_defaults = {},
			can_use_preloading = real_preloading || xhr_or_cache_preloading,
			queue = [],
			registry = {},
			instanceAPI
		;
		
		// global defaults
		global_defaults[_UseLocalXHR] = true;
		global_defaults[_AlwaysPreserveOrder] = false;
		global_defaults[_AllowDuplicates] = false;
		global_defaults[_CacheBust] = false;
		/*!START_DEBUG*/global_defaults[_Debug] = false;/*!END_DEBUG*/
		global_defaults[_BasePath] = "";

		// execute a script that has been preloaded already
		function execute_preloaded_script(chain_opts,script_obj,registry_item) {
			var script;
			
			function preload_execute_finished() {
				if (script != null) { // make sure this only ever fires once
					script = null;
					script_executed(registry_item);
				}
			}
			
			if (registry[script_obj.src].finished) return;
			if (!chain_opts[_AllowDuplicates]) registry[script_obj.src].finished = true;
			
			script = registry_item.elem || document.createElement("script");
			if (script_obj.type) script.type = script_obj.type;
			if (script_obj.charset) script.charset = script_obj.charset;
			create_script_load_listener(script,registry_item,"finished",preload_execute_finished);
			
			// script elem was real-preloaded
			if (registry_item.elem) {
				registry_item.elem = null;
			}
			// script was XHR preloaded
			else if (registry_item.text) {
				script.onload = script.onreadystatechange = null;	// script injection doesn't fire these events
				script.text = registry_item.text;
			}
			// script was cache-preloaded
			else {
				script.src = script_obj.real_src;
			}
			append_to.insertBefore(script,append_to.firstChild);

			// manually fire execution callback for injected scripts, since events don't fire
			if (registry_item.text) {
				preload_execute_finished();
			}
		}
	
		// process the script request setup
		function do_script(chain_opts,script_obj,chain_group,preload_this_script) {
			var registry_item,
				registry_items,
				ready_cb = function(){ script_obj.ready_cb(script_obj,function(){ execute_preloaded_script(chain_opts,script_obj,registry_item); }); },
				finished_cb = function(){ script_obj.finished_cb(script_obj,chain_group); }
			;
			
			script_obj.src = canonical_uri(script_obj.src,chain_opts[_BasePath]);
			script_obj.real_src = script_obj.src + 
				// append cache-bust param to URL?
				(chain_opts[_CacheBust] ? ((/\?.*$/.test(script_obj.src) ? "&_" : "?_") + ~~(Math.random()*1E9) + "=") : "")
			;
			
			if (!registry[script_obj.src]) registry[script_obj.src] = {items:[],finished:false};
			registry_items = registry[script_obj.src].items;

			// allowing duplicates, or is this the first recorded load of this script?
			if (chain_opts[_AllowDuplicates] || registry_items.length == 0) {
				registry_item = registry_items[registry_items.length] = {
					ready:false,
					finished:false,
					ready_listeners:[ready_cb],
					finished_listeners:[finished_cb]
				};

				request_script(chain_opts,script_obj,registry_item,
					// which callback type to pass?
					(
					 	(preload_this_script) ? // depends on script-preloading
						function(){
							registry_item.ready = true;
							for (var i=0; i<registry_item.ready_listeners.length; i++) {
								registry_item.ready_listeners[i]();
							}
							registry_item.ready_listeners = [];
						} :
						function(){ script_executed(registry_item); }
					),
					// signal if script-preloading should be used or not
					preload_this_script
				);
			}
			else {
				registry_item = registry_items[0];
				if (registry_item.finished) {
					finished_cb();
				}
				else {
					registry_item.finished_listeners.push(finished_cb);
				}
			}
		}

		// creates a closure for each separate chain spawned from this $LAB instance, to keep state cleanly separated between chains
		function create_chain() {
			var chainedAPI,
				chain_opts = merge_objs(global_defaults,{}),
				chain = [],
				exec_cursor = 0,
				scripts_currently_loading = false,
				group
			;
			
			// called when a script has finished preloading
			function chain_script_ready(script_obj,exec_trigger) {
				/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("script preload finished: "+script_obj.real_src);/*!END_DEBUG*/
				script_obj.ready = true;
				script_obj.exec_trigger = exec_trigger;
				advance_exec_cursor(); // will only check for 'ready' scripts to be executed
			}

			// called when a script has finished executing
			function chain_script_executed(script_obj,chain_group) {
				/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("script execution finished: "+script_obj.real_src);/*!END_DEBUG*/
				script_obj.ready = script_obj.finished = true;
				script_obj.exec_trigger = null;
				// check if chain group is all finished
				for (var i=0; i<chain_group.scripts.length; i++) {
					if (!chain_group.scripts[i].finished) return;
				}
				// chain_group is all finished if we get this far
				chain_group.finished = true;
				advance_exec_cursor();
			}

			// main driver for executing each part of the chain
			function advance_exec_cursor() {
				while (exec_cursor < chain.length) {
					if (is_func(chain[exec_cursor])) {
						/*!START_DEBUG*/if (chain_opts[_Debug]) log_msg("$LAB.wait() executing: "+chain[exec_cursor]);/*!END_DEBUG*/
						try { chain[exec_cursor++](); } catch (err) {
							/*!START_DEBUG*/if (chain_opts[_Debug]) log_error("$LAB.wait() error caught: ",err);/*!END_DEBUG*/
						}
						continue;
					}
					else if (!chain[exec_cursor].finished) {
						if (check_chain_group_scripts_ready(chain[exec_cursor])) continue;
						break;
					}
					exec_cursor++;
				}
				// we've reached the end of the chain (so far)
				if (exec_cursor == chain.length) {
					scripts_currently_loading = false;
					group = false;
				}
			}
			
			// setup next chain script group
			function init_script_chain_group() {
				if (!group || !group.scripts) {
					chain.push(group = {scripts:[],finished:true});
				}
			}

			// API for $LAB chains
			chainedAPI = {
				// start loading one or more scripts
				script:function(){
					for (var i=0; i<arguments.length; i++) {
						(function(script_obj,script_list){
							var splice_args;
							
							if (!is_array(script_obj)) {
								script_list = [script_obj];
							}
							for (var j=0; j<script_list.length; j++) {
								init_script_chain_group();
								script_obj = script_list[j];
								
								if (is_func(script_obj)) script_obj = script_obj();
								if (!script_obj) continue;
								if (is_array(script_obj)) {
									// set up an array of arguments to pass to splice()
									splice_args = [].slice.call(script_obj); // first include the actual array elements we want to splice in
									splice_args.unshift(j,1); // next, put the `index` and `howMany` parameters onto the beginning of the splice-arguments array
									[].splice.apply(script_list,splice_args); // use the splice-arguments array as arguments for splice()
									j--; // adjust `j` to account for the loop's subsequent `j++`, so that the next loop iteration uses the same `j` index value
									continue;
								}
								if (typeof script_obj == "string") script_obj = {src:script_obj};
								script_obj = merge_objs(script_obj,{
									ready:false,
									ready_cb:chain_script_ready,
									finished:false,
									finished_cb:chain_script_executed
								});
								group.finished = false;
								group.scripts.push(script_obj);
								
								do_script(chain_opts,script_obj,group,(can_use_preloading && scripts_currently_loading));
								scripts_currently_loading = true;
								
								if (chain_opts[_AlwaysPreserveOrder]) chainedAPI.wait();
							}
						})(arguments[i],arguments[i]);
					}
					return chainedAPI;
				},
				// force LABjs to pause in execution at this point in the chain, until the execution thus far finishes, before proceeding
				wait:function(){
					if (arguments.length > 0) {
						for (var i=0; i<arguments.length; i++) {
							chain.push(arguments[i]);
						}
						group = chain[chain.length-1];
					}
					else group = false;
					
					advance_exec_cursor();
					
					return chainedAPI;
				}
			};

			// the first chain link API (includes `setOptions` only this first time)
			return {
				script:chainedAPI.script, 
				wait:chainedAPI.wait, 
				setOptions:function(opts){
					merge_objs(opts,chain_opts);
					return chainedAPI;
				}
			};
		}

		// API for each initial $LAB instance (before chaining starts)
		instanceAPI = {
			// main API functions
			setGlobalDefaults:function(opts){
				merge_objs(opts,global_defaults);
				return instanceAPI;
			},
			setOptions:function(){
				return create_chain().setOptions.apply(null,arguments);
			},
			script:function(){
				return create_chain().script.apply(null,arguments);
			},
			wait:function(){
				return create_chain().wait.apply(null,arguments);
			},

			// built-in queuing for $LAB `script()` and `wait()` calls
			// useful for building up a chain programmatically across various script locations, and simulating
			// execution of the chain
			queueScript:function(){
				queue[queue.length] = {type:"script", args:[].slice.call(arguments)};
				return instanceAPI;
			},
			queueWait:function(){
				queue[queue.length] = {type:"wait", args:[].slice.call(arguments)};
				return instanceAPI;
			},
			runQueue:function(){
				var $L = instanceAPI, len=queue.length, i=len, val;
				for (;--i>=0;) {
					val = queue.shift();
					$L = $L[val.type].apply(null,val.args);
				}
				return $L;
			},

			// rollback `[global].$LAB` to what it was before this file was loaded, the return this current instance of $LAB
			noConflict:function(){
				global.$LAB = _$LAB;
				return instanceAPI;
			},

			// create another clean instance of $LAB
			sandbox:function(){
				return create_sandbox();
			}
		};

		return instanceAPI;
	}

	// create the main instance of $LAB
	global.$LAB = create_sandbox();


	/* The following "hack" was suggested by Andrea Giammarchi and adapted from: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
	   NOTE: this hack only operates in FF and then only in versions where document.readyState is not present (FF < 3.6?).
	   
	   The hack essentially "patches" the **page** that LABjs is loaded onto so that it has a proper conforming document.readyState, so that if a script which does 
	   proper and safe dom-ready detection is loaded onto a page, after dom-ready has passed, it will still be able to detect this state, by inspecting the now hacked 
	   document.readyState property. The loaded script in question can then immediately trigger any queued code executions that were waiting for the DOM to be ready. 
	   For instance, jQuery 1.4+ has been patched to take advantage of document.readyState, which is enabled by this hack. But 1.3.2 and before are **not** safe or 
	   fixed by this hack, and should therefore **not** be lazy-loaded by script loader tools such as LABjs.
	*/ 
	(function(addEvent,domLoaded,handler){
		if (document.readyState == null && document[addEvent]){
			document.readyState = "loading";
			document[addEvent](domLoaded,handler = function(){
				document.removeEventListener(domLoaded,handler,false);
				document.readyState = "complete";
			},false);
		}
	})("addEventListener","DOMContentLoaded");

})(this);/*
  mustache.js — Logic-less templates in JavaScript

  See http://mustache.github.com/ for more info.
*/

var Mustache = function() {
  var Renderer = function() {};

  Renderer.prototype = {
    otag: "{{",
    ctag: "}}",
    pragmas: {},
    buffer: [],
    pragmas_implemented: {
      "IMPLICIT-ITERATOR": true
    },
    context: {},

    render: function(template, context, partials, in_recursion) {
      // reset buffer & set context
      if(!in_recursion) {
        this.context = context;
        this.buffer = []; // TODO: make this non-lazy
      }

      // fail fast
      if(!this.includes("", template)) {
        if(in_recursion) {
          return template;
        } else {
          this.send(template);
          return;
        }
      }

      template = this.render_pragmas(template);
      var html = this.render_section(template, context, partials);
      if(in_recursion) {
        return this.render_tags(html, context, partials, in_recursion);
      }

      this.render_tags(html, context, partials, in_recursion);
    },

    /*
      Sends parsed lines
    */
    send: function(line) {
      if(line !== "") {
        this.buffer.push(line);
      }
    },

    /*
      Looks for %PRAGMAS
    */
    render_pragmas: function(template) {
      // no pragmas
      if(!this.includes("%", template)) {
        return template;
      }

      var that = this;
      var regex = new RegExp(this.otag + "%([\\w-]+) ?([\\w]+=[\\w]+)?" +
            this.ctag, "g");
      return template.replace(regex, function(match, pragma, options) {
        if(!that.pragmas_implemented[pragma]) {
          throw({message: 
            "This implementation of mustache doesn't understand the '" +
            pragma + "' pragma"});
        }
        that.pragmas[pragma] = {};
        if(options) {
          var opts = options.split("=");
          that.pragmas[pragma][opts[0]] = opts[1];
        }
        return "";
        // ignore unknown pragmas silently
      });
    },

    /*
      Tries to find a partial in the curent scope and render it
    */
    render_partial: function(name, context, partials) {
      name = this.trim(name);
      if(!partials || partials[name] === undefined) {
        throw({message: "unknown_partial '" + name + "'"});
      }
      if(typeof(context[name]) != "object") {
        return this.render(partials[name], context, partials, true);
      }
      return this.render(partials[name], context[name], partials, true);
    },

    /*
      Renders inverted (^) and normal (#) sections
    */
    render_section: function(template, context, partials) {
      if(!this.includes("#", template) && !this.includes("^", template)) {
        return template;
      }

      var that = this;
      // CSW - Added "+?" so it finds the tighest bound, not the widest
      var regex = new RegExp(this.otag + "(\\^|\\#)\\s*(.+)\\s*" + this.ctag +
              "\n*([\\s\\S]+?)" + this.otag + "\\/\\s*\\2\\s*" + this.ctag +
              "\\s*", "mg");

      // for each {{#foo}}{{/foo}} section do...
      return template.replace(regex, function(match, type, name, content) {
        var value = that.find(name, context);
        if(type == "^") { // inverted section
          if(!value || that.is_array(value) && value.length === 0) {
            // false or empty list, render it
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        } else if(type == "#") { // normal section
          if(that.is_array(value)) { // Enumerable, Let's loop!
            return that.map(value, function(row) {
              return that.render(content, that.create_context(row),
                partials, true);
            }).join("");
          } else if(that.is_object(value)) { // Object, Use it as subcontext!
            return that.render(content, that.create_context(value),
              partials, true);
          } else if(typeof value === "function") {
            // higher order section
            return value.call(context, content, function(text) {
              return that.render(text, context, partials, true);
            });
          } else if(value) { // boolean section
            return that.render(content, context, partials, true);
          } else {
            return "";
          }
        }
      });
    },

    /*
      Replace {{foo}} and friends with values from our view
    */
    render_tags: function(template, context, partials, in_recursion) {
      // tit for tat
      var that = this;

      var new_regex = function() {
        return new RegExp(that.otag + "(=|!|>|\\{|%)?([^\\/#\\^]+?)\\1?" +
          that.ctag + "+", "g");
      };

      var regex = new_regex();
      var tag_replace_callback = function(match, operator, name) {
        switch(operator) {
        case "!": // ignore comments
          return "";
        case "=": // set new delimiters, rebuild the replace regexp
          that.set_delimiters(name);
          regex = new_regex();
          return "";
        case ">": // render partial
          return that.render_partial(name, context, partials);
        case "{": // the triple mustache is unescaped
          return that.find(name, context);
        default: // escape the value
          return that.escape(that.find(name, context));
        }
      };
      var lines = template.split("\n");
      for(var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(regex, tag_replace_callback, this);
        if(!in_recursion) {
          this.send(lines[i]);
        }
      }

      if(in_recursion) {
        return lines.join("\n");
      }
    },

    set_delimiters: function(delimiters) {
      var dels = delimiters.split(" ");
      this.otag = this.escape_regex(dels[0]);
      this.ctag = this.escape_regex(dels[1]);
    },

    escape_regex: function(text) {
      // thank you Simon Willison
      if(!arguments.callee.sRE) {
        var specials = [
          '/', '.', '*', '+', '?', '|',
          '(', ')', '[', ']', '{', '}', '\\'
        ];
        arguments.callee.sRE = new RegExp(
          '(\\' + specials.join('|\\') + ')', 'g'
        );
      }
      return text.replace(arguments.callee.sRE, '\\$1');
    },

    /*
      find `name` in current `context`. That is find me a value
      from the view object
    */
    find: function(name, context) {
      name = this.trim(name);

      // Checks whether a value is thruthy or false or 0
      function is_kinda_truthy(bool) {
        return bool === false || bool === 0 || bool;
      }

      var value;
      if(is_kinda_truthy(context[name])) {
        value = context[name];
      } else if(is_kinda_truthy(this.context[name])) {
        value = this.context[name];
      }

      if(typeof value === "function") {
        return value.apply(context);
      }
      if(value !== undefined) {
        return value;
      }
      // silently ignore unkown variables
      return "";
    },

    // Utility methods

    /* includes tag */
    includes: function(needle, haystack) {
      return haystack.indexOf(this.otag + needle) != -1;
    },

    /*
      Does away with nasty characters
    */
    escape: function(s) {
      s = String(s === null ? "" : s);
      return s.replace(/&(?!\w+;)|["'<>\\]/g, function(s) {
        switch(s) {
        case "&": return "&amp;";
        case "\\": return "\\\\";
        case '"': return '&quot;';
        case "'": return '&#39;';
        case "<": return "&lt;";
        case ">": return "&gt;";
        default: return s;
        }
      });
    },

    // by @langalex, support for arrays of strings
    create_context: function(_context) {
      if(this.is_object(_context)) {
        return _context;
      } else {
        var iterator = ".";
        if(this.pragmas["IMPLICIT-ITERATOR"]) {
          iterator = this.pragmas["IMPLICIT-ITERATOR"].iterator;
        }
        var ctx = {};
        ctx[iterator] = _context;
        return ctx;
      }
    },

    is_object: function(a) {
      return a && typeof a == "object";
    },

    is_array: function(a) {
      return Object.prototype.toString.call(a) === '[object Array]';
    },

    /*
      Gets rid of leading and trailing whitespace
    */
    trim: function(s) {
      return s.replace(/^\s*|\s*$/g, "");
    },

    /*
      Why, why, why? Because IE. Cry, cry cry.
    */
    map: function(array, fn) {
      if (typeof array.map == "function") {
        return array.map(fn);
      } else {
        var r = [];
        var l = array.length;
        for(var i = 0; i < l; i++) {
          r.push(fn(array[i]));
        }
        return r;
      }
    }
  };

  return({
    name: "mustache.js",
    version: "0.3.1-dev",

    /*
      Turns a template and view into HTML
    */
    to_html: function(template, view, partials, send_fun) {
      var renderer = new Renderer();
      if(send_fun) {
        renderer.send = send_fun;
      }
      renderer.render(template, view, partials);
      if(!send_fun) {
        return renderer.buffer.join("\n");
      }
    }
  });
}();
// Underscore.js 1.2.3
// (c) 2009-2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){function r(a,c,d){if(a===c)return a!==0||1/a==1/c;if(a==null||c==null)return a===c;if(a._chain)a=a._wrapped;if(c._chain)c=c._wrapped;if(a.isEqual&&b.isFunction(a.isEqual))return a.isEqual(c);if(c.isEqual&&b.isFunction(c.isEqual))return c.isEqual(a);var e=l.call(a);if(e!=l.call(c))return false;switch(e){case "[object String]":return a==String(c);case "[object Number]":return a!=+a?c!=+c:a==0?1/a==1/c:a==+c;case "[object Date]":case "[object Boolean]":return+a==+c;case "[object RegExp]":return a.source==
c.source&&a.global==c.global&&a.multiline==c.multiline&&a.ignoreCase==c.ignoreCase}if(typeof a!="object"||typeof c!="object")return false;for(var f=d.length;f--;)if(d[f]==a)return true;d.push(a);var f=0,g=true;if(e=="[object Array]"){if(f=a.length,g=f==c.length)for(;f--;)if(!(g=f in a==f in c&&r(a[f],c[f],d)))break}else{if("constructor"in a!="constructor"in c||a.constructor!=c.constructor)return false;for(var h in a)if(m.call(a,h)&&(f++,!(g=m.call(c,h)&&r(a[h],c[h],d))))break;if(g){for(h in c)if(m.call(c,
h)&&!f--)break;g=!f}}d.pop();return g}var s=this,F=s._,o={},k=Array.prototype,p=Object.prototype,i=k.slice,G=k.concat,H=k.unshift,l=p.toString,m=p.hasOwnProperty,v=k.forEach,w=k.map,x=k.reduce,y=k.reduceRight,z=k.filter,A=k.every,B=k.some,q=k.indexOf,C=k.lastIndexOf,p=Array.isArray,I=Object.keys,t=Function.prototype.bind,b=function(a){return new n(a)};if(typeof exports!=="undefined"){if(typeof module!=="undefined"&&module.exports)exports=module.exports=b;exports._=b}else typeof define==="function"&&
define.amd?define("underscore",function(){return b}):s._=b;b.VERSION="1.2.3";var j=b.each=b.forEach=function(a,c,b){if(a!=null)if(v&&a.forEach===v)a.forEach(c,b);else if(a.length===+a.length)for(var e=0,f=a.length;e<f;e++){if(e in a&&c.call(b,a[e],e,a)===o)break}else for(e in a)if(m.call(a,e)&&c.call(b,a[e],e,a)===o)break};b.map=function(a,c,b){var e=[];if(a==null)return e;if(w&&a.map===w)return a.map(c,b);j(a,function(a,g,h){e[e.length]=c.call(b,a,g,h)});return e};b.reduce=b.foldl=b.inject=function(a,
c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(x&&a.reduce===x)return e&&(c=b.bind(c,e)),f?a.reduce(c,d):a.reduce(c);j(a,function(a,b,i){f?d=c.call(e,d,a,b,i):(d=a,f=true)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};b.reduceRight=b.foldr=function(a,c,d,e){var f=arguments.length>2;a==null&&(a=[]);if(y&&a.reduceRight===y)return e&&(c=b.bind(c,e)),f?a.reduceRight(c,d):a.reduceRight(c);var g=b.toArray(a).reverse();e&&!f&&(c=b.bind(c,e));return f?b.reduce(g,
c,d,e):b.reduce(g,c)};b.find=b.detect=function(a,c,b){var e;D(a,function(a,g,h){if(c.call(b,a,g,h))return e=a,true});return e};b.filter=b.select=function(a,c,b){var e=[];if(a==null)return e;if(z&&a.filter===z)return a.filter(c,b);j(a,function(a,g,h){c.call(b,a,g,h)&&(e[e.length]=a)});return e};b.reject=function(a,c,b){var e=[];if(a==null)return e;j(a,function(a,g,h){c.call(b,a,g,h)||(e[e.length]=a)});return e};b.every=b.all=function(a,c,b){var e=true;if(a==null)return e;if(A&&a.every===A)return a.every(c,
b);j(a,function(a,g,h){if(!(e=e&&c.call(b,a,g,h)))return o});return e};var D=b.some=b.any=function(a,c,d){c||(c=b.identity);var e=false;if(a==null)return e;if(B&&a.some===B)return a.some(c,d);j(a,function(a,b,h){if(e||(e=c.call(d,a,b,h)))return o});return!!e};b.include=b.contains=function(a,c){var b=false;if(a==null)return b;return q&&a.indexOf===q?a.indexOf(c)!=-1:b=D(a,function(a){return a===c})};b.invoke=function(a,c){var d=i.call(arguments,2);return b.map(a,function(a){return(c.call?c||a:a[c]).apply(a,
d)})};b.pluck=function(a,c){return b.map(a,function(a){return a[c]})};b.max=function(a,c,d){if(!c&&b.isArray(a))return Math.max.apply(Math,a);if(!c&&b.isEmpty(a))return-Infinity;var e={computed:-Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b>=e.computed&&(e={value:a,computed:b})});return e.value};b.min=function(a,c,d){if(!c&&b.isArray(a))return Math.min.apply(Math,a);if(!c&&b.isEmpty(a))return Infinity;var e={computed:Infinity};j(a,function(a,b,h){b=c?c.call(d,a,b,h):a;b<e.computed&&(e={value:a,
computed:b})});return e.value};b.shuffle=function(a){var c=[],b;j(a,function(a,f){f==0?c[0]=a:(b=Math.floor(Math.random()*(f+1)),c[f]=c[b],c[b]=a)});return c};b.sortBy=function(a,c,d){return b.pluck(b.map(a,function(a,b,g){return{value:a,criteria:c.call(d,a,b,g)}}).sort(function(a,c){var b=a.criteria,d=c.criteria;return b<d?-1:b>d?1:0}),"value")};b.groupBy=function(a,c){var d={},e=b.isFunction(c)?c:function(a){return a[c]};j(a,function(a,b){var c=e(a,b);(d[c]||(d[c]=[])).push(a)});return d};b.sortedIndex=
function(a,c,d){d||(d=b.identity);for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(c)?e=g+1:f=g}return e};b.toArray=function(a){return!a?[]:a.toArray?a.toArray():b.isArray(a)?i.call(a):b.isArguments(a)?i.call(a):b.values(a)};b.size=function(a){return b.toArray(a).length};b.first=b.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};b.initial=function(a,b,d){return i.call(a,0,a.length-(b==null||d?1:b))};b.last=function(a,b,d){return b!=null&&!d?i.call(a,Math.max(a.length-b,0)):a[a.length-
1]};b.rest=b.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};b.compact=function(a){return b.filter(a,function(a){return!!a})};b.flatten=function(a,c){return b.reduce(a,function(a,e){if(b.isArray(e))return a.concat(c?e:b.flatten(e));a[a.length]=e;return a},[])};b.without=function(a){return b.difference(a,i.call(arguments,1))};b.uniq=b.unique=function(a,c,d){var d=d?b.map(a,d):a,e=[];b.reduce(d,function(d,g,h){if(0==h||(c===true?b.last(d)!=g:!b.include(d,g)))d[d.length]=g,e[e.length]=a[h];return d},
[]);return e};b.union=function(){return b.uniq(b.flatten(arguments,true))};b.intersection=b.intersect=function(a){var c=i.call(arguments,1);return b.filter(b.uniq(a),function(a){return b.every(c,function(c){return b.indexOf(c,a)>=0})})};b.difference=function(a){var c=b.flatten(i.call(arguments,1));return b.filter(a,function(a){return!b.include(c,a)})};b.zip=function(){for(var a=i.call(arguments),c=b.max(b.pluck(a,"length")),d=Array(c),e=0;e<c;e++)d[e]=b.pluck(a,""+e);return d};b.indexOf=function(a,
c,d){if(a==null)return-1;var e;if(d)return d=b.sortedIndex(a,c),a[d]===c?d:-1;if(q&&a.indexOf===q)return a.indexOf(c);for(d=0,e=a.length;d<e;d++)if(d in a&&a[d]===c)return d;return-1};b.lastIndexOf=function(a,b){if(a==null)return-1;if(C&&a.lastIndexOf===C)return a.lastIndexOf(b);for(var d=a.length;d--;)if(d in a&&a[d]===b)return d;return-1};b.range=function(a,b,d){arguments.length<=1&&(b=a||0,a=0);for(var d=arguments[2]||1,e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;)g[f++]=a,a+=d;return g};
var E=function(){};b.bind=function(a,c){var d,e;if(a.bind===t&&t)return t.apply(a,i.call(arguments,1));if(!b.isFunction(a))throw new TypeError;e=i.call(arguments,2);return d=function(){if(!(this instanceof d))return a.apply(c,e.concat(i.call(arguments)));E.prototype=a.prototype;var b=new E,g=a.apply(b,e.concat(i.call(arguments)));return Object(g)===g?g:b}};b.bindAll=function(a){var c=i.call(arguments,1);c.length==0&&(c=b.functions(a));j(c,function(c){a[c]=b.bind(a[c],a)});return a};b.memoize=function(a,
c){var d={};c||(c=b.identity);return function(){var b=c.apply(this,arguments);return m.call(d,b)?d[b]:d[b]=a.apply(this,arguments)}};b.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};b.defer=function(a){return b.delay.apply(b,[a,1].concat(i.call(arguments,1)))};b.throttle=function(a,c){var d,e,f,g,h,i=b.debounce(function(){h=g=false},c);return function(){d=this;e=arguments;var b;f||(f=setTimeout(function(){f=null;h&&a.apply(d,e);i()},c));g?h=true:
a.apply(d,e);i();g=true}};b.debounce=function(a,b){var d;return function(){var e=this,f=arguments;clearTimeout(d);d=setTimeout(function(){d=null;a.apply(e,f)},b)}};b.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};b.wrap=function(a,b){return function(){var d=G.apply([a],arguments);return b.apply(this,d)}};b.compose=function(){var a=arguments;return function(){for(var b=arguments,d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};b.after=
function(a,b){return a<=0?b():function(){if(--a<1)return b.apply(this,arguments)}};b.keys=I||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)m.call(a,d)&&(b[b.length]=d);return b};b.values=function(a){return b.map(a,b.identity)};b.functions=b.methods=function(a){var c=[],d;for(d in a)b.isFunction(a[d])&&c.push(d);return c.sort()};b.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)b[d]!==void 0&&(a[d]=b[d])});return a};b.defaults=function(a){j(i.call(arguments,
1),function(b){for(var d in b)a[d]==null&&(a[d]=b[d])});return a};b.clone=function(a){return!b.isObject(a)?a:b.isArray(a)?a.slice():b.extend({},a)};b.tap=function(a,b){b(a);return a};b.isEqual=function(a,b){return r(a,b,[])};b.isEmpty=function(a){if(b.isArray(a)||b.isString(a))return a.length===0;for(var c in a)if(m.call(a,c))return false;return true};b.isElement=function(a){return!!(a&&a.nodeType==1)};b.isArray=p||function(a){return l.call(a)=="[object Array]"};b.isObject=function(a){return a===
Object(a)};b.isArguments=function(a){return l.call(a)=="[object Arguments]"};if(!b.isArguments(arguments))b.isArguments=function(a){return!(!a||!m.call(a,"callee"))};b.isFunction=function(a){return l.call(a)=="[object Function]"};b.isString=function(a){return l.call(a)=="[object String]"};b.isNumber=function(a){return l.call(a)=="[object Number]"};b.isNaN=function(a){return a!==a};b.isBoolean=function(a){return a===true||a===false||l.call(a)=="[object Boolean]"};b.isDate=function(a){return l.call(a)==
"[object Date]"};b.isRegExp=function(a){return l.call(a)=="[object RegExp]"};b.isNull=function(a){return a===null};b.isUndefined=function(a){return a===void 0};b.noConflict=function(){s._=F;return this};b.identity=function(a){return a};b.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};b.escape=function(a){return(""+a).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;").replace(/\//g,"&#x2F;")};b.mixin=function(a){j(b.functions(a),function(c){J(c,
b[c]=a[c])})};var K=0;b.uniqueId=function(a){var b=K++;return a?a+b:b};b.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};b.template=function(a,c){var d=b.templateSettings,d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.escape,function(a,b){return"',_.escape("+b.replace(/\\'/g,"'")+"),'"}).replace(d.interpolate,function(a,b){return"',"+b.replace(/\\'/g,
"'")+",'"}).replace(d.evaluate||null,function(a,b){return"');"+b.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+";__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');",e=new Function("obj","_",d);return c?e(c,b):function(a){return e.call(this,a,b)}};var n=function(a){this._wrapped=a};b.prototype=n.prototype;var u=function(a,c){return c?b(a).chain():a},J=function(a,c){n.prototype[a]=function(){var a=i.call(arguments);H.call(a,this._wrapped);return u(c.apply(b,
a),this._chain)}};b.mixin(b);j("pop,push,reverse,shift,sort,splice,unshift".split(","),function(a){var b=k[a];n.prototype[a]=function(){b.apply(this._wrapped,arguments);return u(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];n.prototype[a]=function(){return u(b.apply(this._wrapped,arguments),this._chain)}});n.prototype.chain=function(){this._chain=true;return this};n.prototype.value=function(){return this._wrapped}}).call(this);
/* main file */

if ( window.IriSP === undefined && window.__IriSP === undefined ) { 
	var IriSP = {}; 
	var __IriSP = IriSP; /* for backward compatibility */
}

IriSP.loadLibs = function( libs, config, metadata_url, callback ) {
    // Localize jQuery variable
		IriSP.jQuery = null;
    var $L = $LAB.script(libs.jQuery).script(libs.swfObject)
                .script(libs.jQueryUI)
                                   
    if (config.player.type === "jwplayer") {
      // load our popcorn.js lookalike
      $L = $L.script(libs.jwplayer);
    } else {
      // load the real popcorn
      $L = $L.script(libs.popcorn).script(libs["popcorn.code"]);
      if (config.player.type === "youtube") {
        $L = $L.script(libs["popcorn.youtube"]);
      } 
      if (config.player.type === "vimeo")
        $L = $L.script(libs["popcorn.vimeo"]);
      
      /* do nothing for html5 */
    }       
    
    /* widget specific requirements */
    for (var idx in config.gui.widgets) {
      if (config.gui.widgets[idx].type === "PolemicWidget") {        
        $L.script(libs.raphael);
      }
    }
    
    // same for modules
    /*
    for (var idx in config.modules) {
      if (config.modules[idx].type === "PolemicWidget")
        $L.script(libs.raphaelJs);
    }
    */

    $L.wait(function() {
      IriSP.jQuery = window.jQuery.noConflict( true );
      IriSP._ = window._.noConflict();
      IriSP.underscore = IriSP._;
      
      var css_link_jquery = IriSP.jQuery( "<link>", { 
        rel: "stylesheet", 
        type: "text/css", 
        href: libs.cssjQueryUI,
        'class': "dynamic_css"
      } );
      var css_link_custom = IriSP.jQuery( "<link>", { 
        rel: "stylesheet", 
        type: "text/css", 
        href: config.gui.css,
        'class': "dynamic_css"
      } );
      
      css_link_jquery.appendTo('head');
      css_link_custom.appendTo('head');
          
      IriSP.setupDataLoader();
      IriSP.__dataloader.get(metadata_url, 
          function(data) {
            /* save the data so that we could re-use it to
               configure the video
            */
            IriSP.__jsonMetadata = data;
            callback.call(window) });
    });
};
IriSP.annotation_template = "{{! template for an annotation displayed in a segmentWidget }}<div title='{{divTitle}}' id='{{id}}'	class='Ldt-iri-chapter' 	style='left: {{startPixel}}px;          width: {{pxWidth}}px;          background-color:#{{hexa_color}};' 	></div>";
IriSP.annotationWidget_template = "{{! template for the annotation widget }}<div class='Ldt-AnnotationsWidget'>  <!-- ugly div because we want to have a double border -->  <div class='Ldt-Annotation-DoubleBorder'>      <div class='Ldt-AnnotationContent'>        <div class='Ldt-AnnotationShareIcons'>         <a class='Ldt-fbShare' href=''><img src='{{img_dir}}/facebook.png' alt='share on facebook'></img></a>         <a class='Ldt-TwShare' href=''><img src='{{img_dir}}/twitter.png' alt='share on twitter'></img></a>         <a class='Ldt-GplusShare' href=''><img src='{{img_dir}}/google.png' alt='share on google+'></img></a>      </div>		  <div class='Ldt-SaTitle'></div>	  	<div class='Ldt-SaDescription'></div>    </div>  </div></div>";
IriSP.annotation_loading_template = "{{! template shown while the annotation widget is loading }}<div id='Ldt-load-container'><div id='Ldt-loader'>&nbsp;</div> Chargement... </div>";
IriSP.arrowWidget_template = "<div class='Ldt-arrowWidget'></div>";
IriSP.overlay_marker_template = "{{! the template for the small bars which is z-indexed over our segment widget }}<div class='Ldt-SegmentPositionMarker' style='background-color: #F7268E;'></div>";
IriSP.player_template = "{{! template for the radio player }}<div class='Ldt-controler demo'>	<div class='Ldt-LeftPlayerControls'>    <div class='Ldt-button Ldt-CtrlPlay'></div>		<div class='Ldt-button Ldt-CtrlAnnotate'></div>    <div class='Ldt-button Ldt-CtrlSearch'></div>	</div>		<div class='Ldt-RightPlayerControls'>    <div class='Ldt-Time'>      <div class='Ldt-ElapsedTime'></div>      <div class='Ldt-TimeSeparator'>/</div>      <div class='Ldt-TotalTime'></div>    </div>		<div class='Ldt-button Ldt-CtrlSound'></div>	</div></div>";
IriSP.search_template = "{{! template for the search container }}<div class='LdtSearchContainer'	style='margin-left: {{margin_left}}; position: absolute; margin-top: -60px;'>	<div class='LdtSearch'		style='display: none; background-color: #EEE; width: 165px; boder: 1px; border-color: #CFCFCF; position: absolute; text-align: center;'>		<input class='LdtSearchInput'			style='margin-top: 2px; margin-bottom: 2px;' />	</div></div><div class='cleaner'></div>";
IriSP.share_template = "{{! social network sharing template }}<a onclick='__IriSP.MyApiPlayer.share(\'delicious\');' title='partager avec delicious'><span class='share shareDelicious'>&nbsp;</span></a>		<a onclick='__IriSP.MyApiPlayer.share(\'facebook\');' title='partager avec facebook'> <span class='share shareFacebook'>&nbsp;</span></a><a onclick='__IriSP.MyApiPlayer.share(\'twitter\');' title='partager avec twitter'>  <span class='share shareTwitter'>&nbsp;</span></a><a onclick='__IriSP.MyApiPlayer.share(\'myspace\');' title='partager avec Myspace'>  <span class='share shareMySpace'>&nbsp;</span></a>";
IriSP.sliderWidget_template = "{{! template for the slider widget - it's composed of two divs we one overlayed on top    of the other }}<div class='Ldt-sliderBackground'></div><div class='Ldt-sliderForeground'></div><div class='Ldt-sliderPositionMarker'></div>";
IriSP.tooltip_template = "{{! template used by the jquery ui tooltip }}<div class='Ldt-tooltip'>  <div class='title'>{{title}}</div>  <div class='time'>{{begin}} : {{end}} </div>  <div class='description'>{{description}}</div></div>";
IriSP.tooltipWidget_template = "{{! template for the tooltip widget }}<div class='tip'>	<div class='tipcolor' style='height:10px;width:10px'></div>	<div class='tiptext'></div>";
IriSP.tweetWidget_template = "{{! template for the tweet widget }}<div class='Ldt-tweetWidget'>  <div class='Ldt-tweet-DoubleBorder'>      <img src='{{img_dir}}/minimize.png' class='Ldt-tweetWidgetKeepOpen' alt='dont minimize automatically'></img>      <img src='{{img_dir}}/minimize.png' class='Ldt-tweetWidgetMinimize' alt='minimize window'></img>      <div class='Ldt-tweetAvatar'></div>      <img src='{{img_dir}}/profile_arrow.png' class='Ldt-tweetAvatar-profileArrow'></img>      <div class='Ldt-tweetContents'></div>      <a href='' target='_blank' class='Ldt-Retweet'><div class='Ldt-RetweetIcon'></div> - Retweet </a>      <a href='' target='_blank' class='Ldt-TweetReply'><div class='Ldt-TweetReplyIcon'></div> - Reply</a>  </div></div>";/* wrapper that simulates popcorn.js because
   popcorn is a bit unstable at the time */

IriSP.PopcornReplacement = {
  msgPump : {} /* used by jquery to receive and send messages */
};

IriSP.PopcornReplacement.media = { 
  "paused": true,
  "muted": false
};

IriSP.PopcornReplacement.listen = function(msg, callback) {
//  IriSP.jQuery(IriSP.PopcornReplacement.msgPump).bind(msg, function(event, rest) { callback(rest); });
  if (!IriSP.PopcornReplacement.msgPump.hasOwnProperty(msg))
    IriSP.PopcornReplacement.msgPump[msg] = [];

  IriSP.PopcornReplacement.msgPump[msg].push(callback);
};

IriSP.PopcornReplacement.trigger = function(msg, params) {
//  IriSP.jQuery(IriSP.PopcornReplacement.msgPump).trigger(msg, params);
  
  if (!IriSP.PopcornReplacement.msgPump.hasOwnProperty(msg))
    return;

  var d = IriSP.PopcornReplacement.msgPump[msg];
  for(var entry in d) {
    d[entry].call(window, params);
  }

};

IriSP.PopcornReplacement.guid = function(prefix) {
  var str = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
   });

  return prefix + str;
};

IriSP.PopcornReplacement.__initApi = function() {
  IriSP.PopcornReplacement.trigger("loadedmetadata"); // we've done more than loading metadata of course,
                                                      // but popcorn doesn't need to know more.
  IriSP.PopcornReplacement.media.muted = jwplayer(IriSP.PopcornReplacement._container).getMute();
};

IriSP.PopcornReplacement.jwplayer = function(container, options) {
  IriSP.PopcornReplacement._container = container.slice(1); //eschew the '#'
  options.events = {
      onReady: IriSP.PopcornReplacement.__initApi,
      onTime: IriSP.PopcornReplacement.__timeHandler,
      onPlay: IriSP.PopcornReplacement.__playHandler,
      onPause: IriSP.PopcornReplacement.__pauseHandler,
      onSeek: IriSP.PopcornReplacement.__seekHandler 
      }
    
  jwplayer(IriSP.PopcornReplacement._container).setup(options);
  IriSP.PopcornReplacement.media.duration = options.duration;
  return IriSP.PopcornReplacement;
};

IriSP.PopcornReplacement.currentTime = function(time) {
  if (typeof(time) === "undefined") {
      return jwplayer(IriSP.PopcornReplacement._container).getPosition();            
  } else {
     var currentTime = +time;
     jwplayer( IriSP.PopcornReplacement._container ).seek( currentTime );
     IriSP.PopcornReplacement.trigger("seeked");
     return jwplayer(IriSP.PopcornReplacement._container).getPosition();            
  }
};

IriSP.PopcornReplacement.play = function() {
      IriSP.PopcornReplacement.media.paused = false;
      IriSP.PopcornReplacement.trigger("play");
//      IriSP.PopcornReplacement.trigger("playing");
      jwplayer( IriSP.PopcornReplacement._container ).play();
};
    
IriSP.PopcornReplacement.pause = function() {
      if ( !IriSP.PopcornReplacement.media.paused ) {
        IriSP.PopcornReplacement.media.paused = true;
        IriSP.PopcornReplacement.trigger( "pause" );
        jwplayer( IriSP.PopcornReplacement._container ).pause();
      }
};

IriSP.PopcornReplacement.muted = function(val) {
  if (typeof(val) !== "undefined") {

    if (jwplayer(IriSP.PopcornReplacement._container).getMute() !== val) {
      if (val) {
        jwplayer(IriSP.PopcornReplacement._container).setMute(true);
        IriSP.PopcornReplacement.media.muted = true;
      } else {
        jwplayer( IriSP.PopcornReplacement._container ).setMute(false);
        IriSP.PopcornReplacement.media.muted = false;
      }

      IriSP.PopcornReplacement.trigger( "volumechange" );
    }
    
    return jwplayer( IriSP.PopcornReplacement._container ).getMute();
  } else {
    return jwplayer( IriSP.PopcornReplacement._container ).getMute();
  }
};

IriSP.PopcornReplacement.mute = IriSP.PopcornReplacement.muted;

IriSP.PopcornReplacement.__codes = [];
IriSP.PopcornReplacement.code = function(options) {
  IriSP.PopcornReplacement.__codes.push(options);
  return IriSP.PopcornReplacement;
};

IriSP.PopcornReplacement.__runCode = function() {
  var currentTime = jwplayer(IriSP.PopcornReplacement._container).getPosition();
  var i = 0;
  for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
    var c = IriSP.PopcornReplacement.__codes[i];
    if (currentTime == c.start) {
      c.onStart();
    }
    
    if (currentTime == c.end) {
      c.onEnd();
    }

  }
};

/* called everytime the player updates itself 
   (onTime event)
 */

IriSP.PopcornReplacement.__timeHandler = function(event) {
  var pos = event.position;

  var i = 0;
  for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
     var c = IriSP.PopcornReplacement.__codes[i];
     
     if (pos >= c.start && pos < c.end && 
         pos - 0.1 <= c.start) {       
        c.onStart();
     }
 
     if (pos > c.start && pos > c.end && 
         pos - 0.1 <= c.end) {
         console.log("eonedn");
        c.onEnd();
     }
   
  }
 
  IriSP.PopcornReplacement.trigger("timeupdate");
};

IriSP.PopcornReplacement.__seekHandler = function(event) {
  var i = 0;
  
  for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
     var c = IriSP.PopcornReplacement.__codes[i];
    
     if (event.position >= c.start && event.position < c.end) {        
        c.onEnd();
     }         
   }

   for(i = 0; i < IriSP.PopcornReplacement.__codes.length; i++) {
     var c = IriSP.PopcornReplacement.__codes[i];

     if (typeof(event.offset) === "undefined")
       event.offset = 0;
           
     if (event.offset >= c.start && event.offset < c.end) { 
       c.onStart();
     }
     
   }

  IriSP.PopcornReplacement.trigger("timeupdate");
};


IriSP.PopcornReplacement.__playHandler = function(event) {
  IriSP.PopcornReplacement.media.paused = false;
  IriSP.PopcornReplacement.trigger("play");
};

IriSP.PopcornReplacement.__pauseHandler = function(event) {
  IriSP.PopcornReplacement.media.paused = true;
  IriSP.PopcornReplacement.trigger("pause");
};

IriSP.PopcornReplacement.roundTime = function() {
  var currentTime = IriSP.PopcornReplacement.currentTime();
  return Math.round(currentTime);
};
/* utils.js - various utils that don't belong anywhere else */

/* trace function, for debugging */

IriSP.traceNum = 0;
IriSP.trace = function( msg, value ) {
/*
	if( IriSP.config.gui.debug === true ) {
		IriSP.traceNum += 1;
		IriSP.jQuery( "<div>"+IriSP.traceNum+" - "+msg+" : "+value+"</div>" ).appendTo( "#Ldt-output" );
	}
*/
};

/* used in callbacks - because in callbacks we lose "this",
   we need to have a special function which wraps "this" in 
   a closure. This way, the 
*/   
IriSP.wrap = function (obj, fn) {
  return function() {    
    var args = Array.prototype.slice.call(arguments, 0);
    return fn.apply(obj, args);
  }
}

/* convert a time to a percentage in the media */
IriSP.timeToPourcent = function(time, timetotal){
	var time = Math.abs(time);
  var timetotal = Math.abs(timetotal);
  
	return Math.floor((time/timetotal) * 100);
};

IriSP.padWithZeros = function(num) {
  if (Math.abs(num) < 10) {
    return "0" + num.toString();
  } else {
    return num.toString();
  }
};
/* convert a number of seconds to a tuple of the form 
   [hours, minutes, seconds]
*/
IriSP.secondsToTime = function(secs) {  
  var hours = Math.abs(parseInt( secs / 3600 ) % 24);
  var minutes = Math.abs(parseInt( secs / 60 ) % 60);
  var seconds = parseFloat(Math.abs(secs % 60).toFixed(0));
  
  var toString_fn = function() {
    var ret = "";
    if (hours > 0)
       ret = IriSP.padWithZeros(this.hours) + ":";
    ret += IriSP.padWithZeros(this.minutes) + ":" + IriSP.padWithZeros(this.seconds);

    return ret;
  }
  return {"hours" : hours, "minutes" : minutes, "seconds" : seconds, toString: toString_fn};
};

IriSP.secondsToString

/* format a tweet - replaces @name by a link to the profile, #hashtag, etc. */
IriSP.formatTweet = function(tweet) {
  /*
    an array of arrays which hold a regexp and its replacement.
  */
  var regExps = [
    /* copied from http://codegolf.stackexchange.com/questions/464/shortest-url-regex-match-in-javascript/480#480 */
    [/((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi, "<a href='$1'>$1</a>"],
    [/@(\w+)/gi, "<a href='http://twitter.com/$1'>@$1</a>"], // matches a @handle
    [/#(\w+)/gi, "<a href='http://twitter.com/search?q=%23$1'>#$1</a>"],// matches a hashtag
    [/(\+\+)/gi, "<span class='Ldt-PolemicPlusPlus'>$1</span>"],
    [/(--)/gi, "<span class='Ldt-PolemicMinusMinus'>$1</span>"],
    [/(==)/gi, "<span class='Ldt-PolemicEqualEqual'>$1</span>"],
    [/(\?\?)/gi, "<span class='Ldt-PolemicQuestion'>$1</span>"]
  ]; 

  var i = 0;
  for(i = 0; i < regExps.length; i++) {
     tweet = tweet.replace(regExps[i][0], regExps[i][1]);
  }
  
  return tweet;
};

IriSP.countProperties = function(obj) {
    var count = 0;

    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
                ++count;
    }

    return count;
};

// conversion de couleur Decimal vers HexaDecimal || 000 si fff
IriSP.DEC_HEXA_COLOR = function (dec) {
	 var hexa='0123456789ABCDEF';
   var hex='';
	 var tmp;
	 while (dec>15){
		  tmp = dec-(Math.floor(dec/16))*16;
		  hex = hexa.charAt(tmp)+hex;
		  dec = Math.floor(dec/16);
	 }
	 hex = hexa.charAt(dec)+hex;	 
	 return(hex);
};

/* shortcut to have global variables in templates */
IriSP.templToHTML = function(template, values) {
  var params = IriSP.jQuery.extend(IriSP.default_templates_vars, values);
  return Mustache.to_html(template, params);
};

/* we need to be stricter than encodeURIComponent,
   because of twitter
*/  
IriSP.encodeURI = function(str) {
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').  
                                 replace(/\)/g, '%29').replace(/\*/g, '%2A');  
}  

IriSP.__guidCounter = 0;
IriSP.guid = function(prefix) {
  IriSP.__guidCounter += 1;
  return prefix + IriSP.__guidCounter;
};
/* for ie compatibility
if (Object.prototype.__defineGetter__&&!Object.defineProperty) {
   Object.defineProperty=function(obj,prop,desc) {
      if ("get" in desc) obj.__defineGetter__(prop,desc.get);
      if ("set" in desc) obj.__defineSetter__(prop,desc.set);
   }
}
*/
/* data.js - this file deals with how the players gets and sends data */

IriSP.DataLoader = function() {
  this._cache = {};
  
  /*
    A structure to hold callbacks for specific urls. We need it because
    ajax calls are asynchronous, so it means that sometimes we ask
    multiple times for a ressource because the first call hasn't been
    received yet.
  */
  this._callbacks = {};
};

IriSP.DataLoader.prototype.get = function(url, callback) {

  var base_url = url.split("&")[0]
  if (this._cache.hasOwnProperty(base_url)) {
    callback(this._cache[base_url]);
  } else {  
    if (!this._callbacks.hasOwnProperty(base_url)) {
      this._callbacks[base_url] = [];
      this._callbacks[base_url].push(callback);   
      /* we need a closure because this gets lost when it's called back */
  
      // uncomment you don't want to use caching.
      // IriSP.jQuery.get(url, callback);
      
      var func = function(data) {
                  this._cache[base_url] = data;                                
                  var i = 0;
                  
                  for (i = 0; i < this._callbacks[base_url].length; i++) {
                    this._callbacks[base_url][i](this._cache[base_url]);                                  
                  }
      };
      
      /* automagically choose between json and jsonp */
      if (url.indexOf(document.location.hostname) === -1 &&
          url.indexOf("http://") !== -1 /* not a relative url */ ) {
        // we contacting a foreign domain, use JSONP

        IriSP.jQuery.get(url, {}, IriSP.wrap(this, func), "jsonp");
      } else {

        // otherwise, hey, whatever rows your boat
        IriSP.jQuery.get(url, IriSP.wrap(this, func));
      }
    
    } else {
      /* simply push the callback - it'll get called when the ressource
         has been received */
      
      this._callbacks[base_url].push(callback);   
   
    }
  }
}

/* the base abstract "class" */
IriSP.Serializer = function(DataLoader, url) {
  this._DataLoader = DataLoader;
  this._url = url;
  this._data = [];
};

IriSP.Serializer.prototype.serialize = function(data) { };
IriSP.Serializer.prototype.deserialize = function(data) {};

IriSP.Serializer.prototype.currentMedia = function() {  
};

IriSP.Serializer.prototype.sync = function(callback) {  
  callback.call(this, this._data);  
};

IriSP.SerializerFactory = function(DataLoader) {
  this._dataloader = DataLoader;
};

IriSP.SerializerFactory.prototype.getSerializer = function(metadataOptions) {
  /* This function returns serializer set-up with the correct
     configuration - takes a metadata struct describing the metadata source
  */
  
  if (metadataOptions === undefined)
    /* return an empty serializer */
    return IriSP.Serializer("", "");
            
  switch(metadataOptions.type) {
    case "json":
      return new IriSP.JSONSerializer(this._dataloader, metadataOptions.src);
      break;
    
    case "dummy": /* only used for unit testing - not defined in production */
      return new IriSP.MockSerializer(this._dataloader, metadataOptions.src);
      break;
    
    case "empty":
      return new IriSP.Serializer("", "empty");
      break;
      
    default:      
      return undefined;
  }
};
/* site.js - all our site-dependent config : player chrome, cdn locations, etc...*/

IriSP.lib = { 
		jQuery : "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js",
		jQueryUI : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.js",
		jQueryToolTip : "http://cdn.jquerytools.org/1.2.4/all/jquery.tools.min.js",
		swfObject : "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js",
		cssjQueryUI : "http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/themes/base/jquery-ui.css",
    popcorn : "/mdp/src/js/libs/popcorn.js",
    jwplayer : "/mdp/src/js/libs/jwplayer.js",
    popcornReplacement: "/mdp/src/js/libs/pop.js",
    raphael: "/mdp/src/js/libs/raphael.js",
    "popcorn.mediafragment" : "/mdp/src/js/libs/popcorn.mediafragment.js",
    "popcorn.code" : "/mdp/src/js/libs/popcorn.code.js",
    "popcorn.jwplayer": "/mdp/src/js/libs/popcorn.jwplayer.js",
    "popcorn.youtube": "/mdp/src/js/libs/popcorn.youtube.js"
};

//Player Configuration 
IriSP.config = undefined;

IriSP.widgetsDefaults = {
  "LayoutManager" : {spacer_div_height : "0px" },
  "PlayerWidget" : {},
  "AnnotationsWidget": {
    "share_text" : "I'm watching ",     
    "fb_link" : "http://www.facebook.com/share.php?u=",
    "tw_link" : "http://twitter.com/home?status=",
    "gplus_link" : ""
    },
  "TweetsWidget" : {
      default_profile_picture : "https://si0.twimg.com/sticky/default_profile_images/default_profile_1_normal.png",
      tweet_display_period: 10000 // how long do we show a tweet ?
  },
  "SliderWidget" : {
      minimize_period: 850 // how long does the slider stays maximized after the user leaves the zone ?
  },
  "Main" : {
      autoplay: true
  }
  
};

IriSP.paths = {
//  "imgs": "/tweetlive/res/metadataplayer/src/css/imgs"
  "imgs": "/mdp/src/css/imgs"
};
IriSP.default_templates_vars = {
  "img_dir" : IriSP.paths.imgs 
};

/* ui.js - ui related functions */

/* FIXME: use an sharing library */
IriSP.LdtShareTool = IriSP.share_template; /* the contents come from share.html */

IriSP.createPlayerChrome = function(){
	var width = IriSP.config.gui.width;
	var height = IriSP.config.gui.height;
	var heightS = IriSP.config.gui.height-20;
	
	// AUDIO  */
	// PB dans le html : ; 
	IriSP.trace( "__IriSP.createMyHtml",IriSP.config.gui.container );

	
	/* FIXME : factor this in another file */
	if( IriSP.config.gui.mode=="radio" ){

		IriSP.jQuery( "#"+IriSP.config.gui.container ).before(IriSP.search_template);
		var radioPlayer = Mustache.to_html(IriSP.radio_template, {"share_template" : IriSP.share_template});
		IriSP.jQuery(radioPlayer).appendTo("#"+IriSP.config.gui.container);

		// special tricks for IE 7
		if (IriSP.jQuery.browser.msie==true && IriSP.jQuery.browser.version=="7.0"){
			//LdtSearchContainer
			//__IriSP.jQuery("#LdtPlayer").attr("margin-top","50px");
			IriSP.jQuery("#Ldt-Root").css("padding-top","25px");
			IriSP.trace("__IriSP.createHtml","IE7 SPECIAL ");
		}
	} else if(IriSP.config.gui.mode=="video") {
	
		var videoPlayer = Mustache.to_html(IriSP.video_template, {"share_template" : IriSP.share_template, "heightS" : heightS});
		IriSP.jQuery(videoPlayer).appendTo("#"+IriSP.config.gui.container);
	}
	
	IriSP.jQuery("#Ldt-Annotations").width(width-(75*2));
	IriSP.jQuery("#Ldt-Show-Arrow-container").width(width-(75*2));
	IriSP.jQuery("#Ldt-ShowAnnotation-audio").width(width-10);
	IriSP.jQuery("#Ldt-ShowAnnotation-video").width(width-10);
	IriSP.jQuery("#Ldt-SaKeyword").width(width-10);
	IriSP.jQuery("#Ldt-controler").width(width-10);
	IriSP.jQuery("#Ldt-Control").attr("z-index","100");
	IriSP.jQuery("#Ldt-controler").hide();
	
	IriSP.jQuery(IriSP.annotation_loading_template).appendTo("#Ldt-ShowAnnotation-audio");

	if(IriSP.config.gui.mode=='radio'){
		IriSP.jQuery("#Ldt-load-container").attr("width",IriSP.config.gui.width);
	}
	// Show or not the output
	if(IriSP.config.gui.debug===true){
		IriSP.jQuery("#Ldt-output").show();
	} else {
		IriSP.jQuery("#Ldt-output").hide();
	}
	
};


/* create the buttons and the slider   */
IriSP.createInterface = function( width, height, duration ) {
		
		IriSP.jQuery( "#Ldt-controler" ).show();
		//__IriSP.jQuery("#Ldt-Root").css('display','visible');
		IriSP.trace( "__IriSP.createInterface" , width+","+height+","+duration+"," );
		
		IriSP.jQuery( "#Ldt-ShowAnnotation").click( function () { 
			 //__IriSP.jQuery(this).slideUp(); 
		} );

		var LdtpPlayerY = IriSP.jQuery("#Ldt-PlaceHolder").attr("top");
		var LdtpPlayerX = IriSP.jQuery("#Ldt-PlaceHolder").attr("left");
		
		IriSP.jQuery( "#slider-range-min" ).slider( { //range: "min",
			value: 0,
			min: 1,
			max: duration/1000,//1:54:52.66 = 3600+3240+
			step: 0.1,
			slide: function(event, ui) {
				
				//__IriSP.jQuery("#amount").val(ui.value+" s");
				//player.sendEvent('SEEK', ui.value)
				IriSP.MyApiPlayer.seek(ui.value);
				//changePageUrlOffset(ui.value);
				//player.sendEvent('PAUSE')
			}
		} );
		
		IriSP.trace("__IriSP.createInterface","ICI");
		IriSP.jQuery("#amount").val(IriSP.jQuery("#slider-range-min").slider("value")+" s");
		IriSP.jQuery(".Ldt-Control1 button:first").button({
			icons: {
				primary: 'ui-icon-play'
			},
			text: false
		}).next().button({
			icons: {
				primary: 'ui-icon-seek-next'
			},
			 text: false
		});
		IriSP.jQuery(".Ldt-Control2 button:first").button({
			icons: {
				primary: 'ui-icon-search'//,
				//secondary: 'ui-icon-volume-off'
			},
			text: false
		}).next().button({
			icons: {
				primary: 'ui-icon-volume-on'
			},
			 text: false
		});

		// /!\ PB A MODIFIER 
		//__IriSP.MyTags.draw();
		IriSP.trace("__IriSP.createInterface","ICI2");
		IriSP.jQuery( "#ldt-CtrlPlay" ).attr( "style", "background-color:#CD21C24;" );
		
		IriSP.jQuery( "#Ldt-load-container" ).hide();
		
		if( IriSP.config.gui.mode=="radio" & IriSP.jQuery.browser.msie != true ) {
			IriSP.jQuery( "#Ldtplayer1" ).attr( "height", "0" );
		}
		IriSP.trace( "__IriSP.createInterface" , "3" );

		IriSP.trace( "__IriSP.createInterface", "END" );
		
	};
/* the widget classes and definitions */

IriSP.Widget = function(Popcorn, config, Serializer) {

  if (config === undefined || config === null) {
    config = {}
  }
  
  this._Popcorn = Popcorn;
  this._config = config;  
  this._serializer = Serializer;
  
  if (config.hasOwnProperty("container")) {
     this._id = config.container;
     this.selector = IriSP.jQuery("#" + this._id);
  }

  if (config.hasOwnProperty("spacer")) {
     this._spacerId = config.spacer;
     this.spacer = IriSP.jQuery("#" + this._spacerId);
  }


  if (config.hasOwnProperty("width")) {
     // this.width and not this._width because we consider it public.
     this.width = config.width;     
  }
  
  if (config.hasOwnProperty("height")) {    
     this.height = config.height;     
  }
  
  if (config.hasOwnProperty("heightmax")) {
     this.heightmax = config.heightmax;     
  }

  if (config.hasOwnProperty("widthmax")) {
     this.widthmax = config.widthmax;     
  }
  
};

IriSP.Widget.prototype.draw = function() {
  /* implemented by "sub-classes" */  
};

IriSP.Widget.prototype.redraw = function() {
  /* implemented by "sub-classes" */  
};
/* modules are non-graphical entities, similar to widgets */

IriSP.Module = function(Popcorn, config, Serializer) {

  if (config === undefined || config === null) {
    config = {}
  }
  
  this._Popcorn = Popcorn;
  this._config = config;  
  this._serializer = Serializer;
};
/* layout.js - very basic layout management */

/*
  a layout manager manages a div and the layout of objects
  inside it.
*/

IriSP.LayoutManager = function(options) {
    this._Popcorn = null;
    this._widgets = [];
    
    this._div = "LdtPlayer";
    this._width = 640;
    
    if (options === undefined) {
      options = {};
    };
    
    if (options.hasOwnProperty('container')) {
      this._div = options.container;
    }

    if (options.hasOwnProperty('width')) {
      this._width = options.width;
    }    
    
    if (options.hasOwnProperty('height')) {
      this._height = options.height;
    } 
    
    /* this is a shortcut */
    this.selector = IriSP.jQuery("#" + this._div);
    
    this.selector.css("width", this._width);
    
    if (this._height !== undefined)
      this.selector.css("height", this._height);
};

/* we need this special setter because of a chicken and egg problem :
   we want the manager to use popcorn but the popcorn div will be managed
   by the manager. So we need a way to set the instance the manager uses
*/
   
IriSP.LayoutManager.prototype.setPopcornInstance = function(popcorn) {
    this._Popcorn = popcorn;
}

/* stem is a string to append to the id of the widget */
IriSP.LayoutManager.prototype.createDiv = function(stem) {
    if (typeof(stem) === "undefined")
       stem = "";

    var newDiv = IriSP.guid(this._div + "_widget_" + stem + "_");
    var spacerDiv = IriSP.guid("LdtPlayer_spacer_");
    this._widgets.push(newDiv);

    var divTempl = "<div id='{{id}}' style='width: {{width}}px; position: relative;'></div";
    var spacerTempl = "<div id='{{spacer_id}}' style='width: {{width}}px; position: relative; height: {{spacer_div_height}};'></div";
    
    var divCode = Mustache.to_html(divTempl, {id: newDiv, width: this._width});
    var spacerCode = Mustache.to_html(spacerTempl, {spacer_id: spacerDiv, width: this._width,
                                                    spacer_div_height: IriSP.widgetsDefaults.LayoutManager.spacer_div_height });

    this.selector.append(divCode);
    this.selector.append(spacerCode);

    return [newDiv, spacerDiv];
};
/* init.js - initialization and configuration of Popcorn and the widgets
exemple json configuration:
 
 */

IriSP.setupDataLoader = function() {
  /* we set it up separately because we need to
     get data at the very beginning, for instance when
     setting up the video */
  IriSP.__dataloader = new IriSP.DataLoader();
};

IriSP.configurePopcorn = function (layoutManager, options) {
    var pop;
    var ret = layoutManager.createDiv(); 
    var containerDiv = ret[0];
    
    switch(options.type) {
      /*
        todo : dynamically create the div/video tag which
        will contain the video.
      */
      case "html5":
           var tmpId = Popcorn.guid("video"); 
           IriSP.jQuery("#" + containerDiv).append("<video src='" + options.file + "' id='" + tmpId + "'></video>");

           if (options.hasOwnProperty("width"))
             IriSP.jQuery("#" + containerDiv).css("width", options.width);
           
           if (options.hasOwnProperty("height"))
             IriSP.jQuery("#" + containerDiv).css("height", options.height);

           pop = Popcorn("#" + tmpId);
        break;
        
      case "jwplayer":
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;

          if (options.provider === "rtmp") {
            /* exit if we can't access the metadata */
            if (typeof(IriSP.__jsonMetadata) === "undefined") {
                break;
            };


            // the json format is totally illogical
            opts.streamer = IriSP.__jsonMetadata["medias"][0]["meta"]["item"]["value"];
            var source = IriSP.__jsonMetadata["medias"][0]["href"];

            // the source if a full url but jwplayer wants an url relative to the
            // streamer url, so we've got to remove the common part.
            opts.file = source.slice(opts.streamer.length);
          } else {
            /* other providers type, video for instance -
               pass everything as is */
          }

          pop = IriSP.PopcornReplacement.jwplayer("#" + containerDiv, opts);
        break;
      
      case "youtube":
          var opts = IriSP.jQuery.extend({}, options);
          delete opts.container;
          opts.controls = 0;
          opts.autostart = false;
          templ = "width: {{width}}px; height: {{height}}px;";
          var str = Mustache.to_html(templ, {width: opts.width, height: opts.height});    
          // Popcorn.youtube wants us to specify the size of the player in the style attribute of its container div.
          IriSP.jQuery("#" + containerDiv).attr("style", str);
          
          pop = Popcorn.youtube("#" + containerDiv, opts.video, opts);
        break;
        
      default:
        pop = undefined;
    };
    
    return pop;
};

IriSP.configureWidgets = function (popcornInstance, layoutManager, guiOptions) {
 
  var serialFactory = new IriSP.SerializerFactory(IriSP.__dataloader);
  var params = {width: guiOptions.width, height: guiOptions.height};

  var ret_widgets = [];
  var index;
  
  for (index = 0; index < guiOptions.widgets.length; index++) {    
    var widgetConfig = guiOptions.widgets[index];
    var widget = IriSP.instantiateWidget(popcornInstance, serialFactory, layoutManager, widgetConfig);
    ret_widgets.push(widget);
   
  };

  return ret_widgets;
};

IriSP.configureModules = function (popcornInstance, modulesList) {
 
  var serialFactory = new IriSP.SerializerFactory(IriSP.__dataloader);
  var ret_modules = [];
  var index;
  
  for (index = 0; index < modulesList.length; index++) {    
    var moduleConfig = modulesList[index];
    
    var serializer = serialFactory.getSerializer(moduleConfig.metadata);
    var module = new IriSP[moduleConfig.type](popcornInstance, moduleConfig, serializer);    
    ret_modules.push(module);
  };

  return ret_modules;
};

IriSP.instantiateWidget = function(popcornInstance, serialFactory, layoutManager, widgetConfig) {
    /* create div returns us a container for the widget and a spacer */
    var ret = layoutManager.createDiv(widgetConfig.type);        
    var container = ret[0];
    var spacer = ret[1];

    var arr = IriSP.jQuery.extend({}, widgetConfig);
    arr.container = container;
    arr.spacer = spacer;
    
    var serializer = serialFactory.getSerializer(widgetConfig.metadata);    
    
    if (typeof serializer == "undefined")   
      debugger;
    
    // instantiate the object passed as a string
    var widget = new IriSP[widgetConfig.type](popcornInstance, arr, serializer);    
    
    if (widgetConfig.hasOwnProperty("requires")) {
      // also create the widgets this one depends on.
      // the dependency widget is available in the parent widget context as
      // this.WidgetName (for instance, this.TipWidget);
      
      var i = 0;
      for(i = 0; i < widgetConfig.requires.length; i++) {
        var widgetName = widgetConfig.requires[i]["type"];
        widget[widgetName] = IriSP.instantiateWidget(popcornInstance, serialFactory, layoutManager, widgetConfig.requires[i]);
      }
    }       
     
    serializer.sync(IriSP.wrap(widget, function() { this.draw(); }));
    return widget;
};
/* mediafragment module */

IriSP.MediaFragment = function(Popcorn, config, Serializer) {
  IriSP.Module.call(this, Popcorn, config, Serializer);

  this.mutex = false; /* a mutex because we access the url from two different functions */

  this._Popcorn.listen( "loadedmetadata", IriSP.wrap(this, IriSP.MediaFragment.advanceTime));
  this._Popcorn.listen( "pause", IriSP.wrap(this, IriSP.MediaFragment.updateTime));
  this._Popcorn.listen( "seeked", IriSP.wrap(this, IriSP.MediaFragment.updateTime));
  this._Popcorn.listen( "IriSP.PolemicTweet.click", IriSP.wrap(this, IriSP.MediaFragment.updateAnnotation));
  this._Popcorn.listen( "IriSP.SegmentsWidget.click", IriSP.wrap(this, IriSP.MediaFragment.updateAnnotation));
};

IriSP.MediaFragment.advanceTime = function() {
             var url = window.location.href;

              if ( url.split( "#" )[ 1 ] != null ) {
                  pageoffset = url.split( "#" )[1];

                  if ( pageoffset.substring(0, 2) === "t=") {
                    // timecode 
                    if ( pageoffset.substring( 2 ) != null ) {
                    var offsettime = pageoffset.substring( 2 );
                    this._Popcorn.currentTime( parseFloat( offsettime ) );
                    }
                  } else if ( pageoffset.substring(0, 2) === "a=") {
                    // annotation
                    var annotationId = pageoffset.substring( 2 );

                    // there's no better way than that because
                    // of possible race conditions
                    this._serializer.sync(IriSP.wrap(this, function() {
                          IriSP.MediaFragment.lookupAnnotation.call(this, annotationId); 
                          }));
                  }
              }
};

IriSP.MediaFragment.updateTime = function() {
  if (this.mutex === true) {
    return;
  }

  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#t=" + this._Popcorn.currentTime().toFixed( 2 ) );
};


IriSP.MediaFragment.updateAnnotation = function(annotationId) {
  var _this = this;
  this.mutex = true;

  var history = window.history;
  if ( !history.pushState ) {
    return false;
  }
  
  splitArr = window.location.href.split( "#" )
  history.replaceState( {}, "", splitArr[0] + "#a=" + annotationId);
 
  window.setTimeout(function() { _this.mutex = false }, 50);
};

// lookup and seek to the beginning of an annotation
IriSP.MediaFragment.lookupAnnotation = function(annotationId) {
  var annotation = undefined;
  var annotations = this._serializer._data.annotations;

  var i;
  for (i = 0; i < annotations.length; i++) {
      if (annotations[i].id === annotationId) {
        annotation = annotations[i];
        break;
      }
  }

  if (typeof(annotation) !== "undefined") {
    this._Popcorn.currentTime(annotation.begin / 1000);
  }
};
IriSP.AnnotationsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
};


IriSP.AnnotationsWidget.prototype = new IriSP.Widget();

IriSP.AnnotationsWidget.prototype.clear = function() {
    this.selector.find(".Ldt-SaTitle").text("");
    this.selector.find(".Ldt-SaDescription").text("");
    this.selector.find(".Ldt-SaKeywordText").text("");
};

IriSP.AnnotationsWidget.prototype.displayAnnotation = function(annotation) {   

    var title = annotation.content.title;
    var description = annotation.content.description;
    var keywords =  "" // FIXME;
    var begin = +annotation.begin / 1000;
    var end = +annotation.end / 1000;
    var duration = +this._serializer.currentMedia().meta["dc:duration"];
    
    var title_templ = "{{title}} - ( {{begin}} - {{end}} )";
    var endstr = Mustache.to_html(title_templ, {title: title, begin: IriSP.secondsToTime(begin), end: IriSP.secondsToTime(end)});

    this.selector.find(".Ldt-SaTitle").text(endstr);
    this.selector.find(".Ldt-SaDescription").text(description);
    
    // update sharing buttons
    var defaults = IriSP.widgetsDefaults.AnnotationsWidget;
    var text = defaults.share_text;
    var fb_link = defaults.fb_link;
    var tw_link = defaults.tw_link;
    var gplus_link = defaults.gplus_link;
    var url = document.location.href + "#a=" + annotation.id;
    this.selector.find(".Ldt-fbShare").attr("href", fb_link + IriSP.encodeURI(text) + IriSP.encodeURI(url));
    this.selector.find(".Ldt-TwShare").attr("href", tw_link + IriSP.encodeURI(text) + IriSP.encodeURI(url));
    this.selector.find(".Ldt-GplusShare").attr("href", fb_link + IriSP.encodeURI(text) + IriSP.encodeURI(url));
};

IriSP.AnnotationsWidget.prototype.clearWidget = function() {

    
    /* retract the pane between two annotations */
    this.selector.find(".Ldt-SaTitle").text("");
    this.selector.find(".Ldt-SaDescription").text("");
    this.selector.find(".Ldt-SaKeywordText").html("");
    this.selector.find(".Ldt-ShowAnnotation").slideUp();
};

IriSP.AnnotationsWidget.prototype.draw = function() {
  var _this = this;

  var annotationMarkup = IriSP.templToHTML(IriSP.annotationWidget_template);
	this.selector.append(annotationMarkup);
  var view;

  if (typeof(this._serializer._data.views) !== "undefined" && this._serializer._data.views !== null)
     view = this._serializer._data.views[0];

  var view_type = "";

  if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
          view_type = view.annotation_types[0];
  }
 
  var annotations = this._serializer._data.annotations;
  var i;
  
	for (i in annotations) {    
    var annotation = annotations[i];
    var begin = Math.round((+ annotation.begin) / 1000);
    var end = Math.round((+ annotation.end) / 1000);

    if (view_type != "" && typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }


    var conf = {start: begin, end: end, 
                onStart: 
                       function(annotation) { 
                        return function() { 
                            _this.displayAnnotation(annotation); 
                          
                        } }(annotation),
                onEnd: 
                       function() { _this.clearWidget.call(_this); }
                };
    this._Popcorn = this._Popcorn.code(conf);                                             
  }

};
IriSP.ArrowWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);

  this._oldAnnotation = null;
  
};


IriSP.ArrowWidget.prototype = new IriSP.Widget();

IriSP.ArrowWidget.prototype.clear = function() {

};

IriSP.ArrowWidget.prototype.clearWidget = function() {
};

IriSP.ArrowWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.arrowWidget_template, {});
  this.selector.append(templ);
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeUpdateHandler));
};

IriSP.ArrowWidget.prototype.timeUpdateHandler = function(percents) {
  var currentTime = this._Popcorn.currentTime();
  var currentAnnotation = this._serializer.currentAnnotations(currentTime)[0]; // FIXME : use the others ?

  /* move the arrow only if the current annotation changes */
  if (currentAnnotation != this._oldAnnotation) {
    var begin = (+ currentAnnotation.begin) / 1000;
    var end = (+ currentAnnotation.end) / 1000;

    var duration = +this._serializer.currentMedia().meta["dc:duration"] / 1000;
    var middle_time = (begin + end) / 2;
    var percents = Math.floor((middle_time / duration) * 100);

    // we need to apply a fix because the arrow has a certain length
    // it's half the length of the arrow (27 / 2). We need to convert
    // it in percents though.
    var totalWidth = this.selector.width();
    var correction = ((27 / 2) / totalWidth) * 100;
    var corrected_percents = percents - correction;

    /* don't move out of the screen */
    if (corrected_percents <= 0)
      corrected_percents = 0;

    this.selector.children(".Ldt-arrowWidget").animate({"left" : corrected_percents + "%"});

    this._oldAnnotation = currentAnnotation;
  }
}
IriSP.PlayerWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  
  this._searchBlockOpen = false;
  this._searchLastValue = "";
};

IriSP.PlayerWidget.prototype = new IriSP.Widget();

IriSP.PlayerWidget.prototype.draw = function() {
  var self = this;
  var width = this.width;
	var height = this.height;
	var heightS = this.height-20;
	  
	var Player_templ = Mustache.to_html(IriSP.player_template, {"share_template" : IriSP.share_template});
  this.selector.append(Player_templ);		
	
  this.selector.children(".Ldt-controler").show();
    
  // handle clicks by the user on the video.
  this._Popcorn.listen("play", IriSP.wrap(this, this.playButtonUpdater));
  this._Popcorn.listen("pause", IriSP.wrap(this, this.playButtonUpdater));
  
  this._Popcorn.listen("volumechange", IriSP.wrap(this, this.muteButtonUpdater));

  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.timeDisplayUpdater));
  this._Popcorn.listen("IriSP.search.matchFound", IriSP.wrap(this, this.searchMatch));
  this._Popcorn.listen("IriSP.search.noMatchFound", IriSP.wrap(this, this.searchNoMatch));
  
  
  this.selector.find(".Ldt-CtrlPlay").click(function() { self.playHandler.call(self); });
  this.selector.find(".Ldt-CtrlNext").click(function() { });
  this.selector.find(".Ldt-CtrlSearch").click(function() { self.searchButtonHandler.call(self); });
  
  this.selector.find('.Ldt-CtrlSound').click(function() { self.muteHandler.call(self); } );

  this.selector.find(".Ldt-CtrlPlay").attr( "style", "background-color:#CD21C24;" );
  
  var searchButtonPos = this.selector.find(".Ldt-CtrlSearch").position();
  var searchBox = Mustache.to_html(IriSP.search_template, {margin_left : searchButtonPos.left + "px"});
  this.selector.append(searchBox);
  
  // trigger an IriSP.PlayerWidget.MouseOver to the widgets that are interested (i.e : sliderWidget)
  this.selector.hover(function() { self._Popcorn.trigger("IriSP.PlayerWidget.MouseOver"); }, 
                      function() { self._Popcorn.trigger("IriSP.PlayerWidget.MouseOut"); });
 
  this.muteButtonUpdater(); /* some player - jwplayer notable - save the state of the mute button between sessions */
};

/* Update the elasped time div */
IriSP.PlayerWidget.prototype.timeDisplayUpdater = function() {
  
  if (this._previousSecond === undefined)
    this._previousSecond = this._Popcorn.roundTime();
  
  else {
    /* we're still in the same second, so it's not necessary to update time */
    if (this._Popcorn.roundTime() == this._previousSecond)
      return;
      
  }
  
  // we get it at each call because it may change.
  var duration = +this._serializer.currentMedia().meta["dc:duration"] / 1000; 
  var totalTime = IriSP.secondsToTime(duration);
  var elapsedTime = IriSP.secondsToTime(this._Popcorn.currentTime());
  
  this.selector.find(".Ldt-ElapsedTime").html(elapsedTime.toString());
  this.selector.find(".Ldt-TotalTime").html(totalTime.toString());
  this._previousSecond = this._Popcorn.roundTime();
};

/* update the icon of the button - separate function from playHandler
   because in some cases (for instance, when the user directly clicks on
   the jwplayer window) we have to change the icon without playing/pausing
*/
IriSP.PlayerWidget.prototype.playButtonUpdater = function() {
  var status = this._Popcorn.media.paused;
  
  if ( status == true ){        
    this.selector.find(".Ldt-CtrlPlay").attr("title", "Play");
   
    // we use templToHTML because it has some predefined
    // vars like where to get the images
    var templ = IriSP.templToHTML("url({{img_dir}}/play_sprite.png)");
    this.selector.find(".Ldt-CtrlPlay").css("background-image", templ);

  } else {
    this.selector.find(".Ldt-CtrlPlay").attr("title", "Pause");

    // we use templToHTML because it has some predefined
    // vars like where to get the images
    var templ = IriSP.templToHTML("url({{img_dir}}/pause_sprite.png)");
    this.selector.find(".Ldt-CtrlPlay").css("background-image", templ);
  }  

  return;
};


IriSP.PlayerWidget.prototype.playHandler = function() {
  var status = this._Popcorn.media.paused;
  
  if ( status == true ){        
    this._Popcorn.play();   
  } else {
    this._Popcorn.pause();
  }  
};

IriSP.PlayerWidget.prototype.muteHandler = function() {
  if (!this._Popcorn.muted()) {    
      this._Popcorn.mute(true);
    } else {
      this._Popcorn.mute(false);
    }
};

IriSP.PlayerWidget.prototype.muteButtonUpdater = function() {
  var status = this._Popcorn.media.muted;
  
  if ( status == true ){        
    this.selector.find(".Ldt-CtrlSound").attr("title", "Unmute");
   
    // we use templToHTML because it has some predefined
    // vars like where to get the images
    var templ = IriSP.templToHTML("url({{img_dir}}/sound_sprite.png)");
    this.selector.find(".Ldt-CtrlSound").css("background-image", templ);

  } else {
    this.selector.find(".Ldt-CtrlSound").attr("title", "Mute");

    // we use templToHTML because it has some predefined
    // vars like where to get the images
    var templ = IriSP.templToHTML("url({{img_dir}}/mute_sprite.png)");
    this.selector.find(".Ldt-CtrlSound").css("background-image", templ);
  }  

  return;
};


IriSP.PlayerWidget.prototype.searchButtonHandler = function() {
    var self = this;

    /* show the search field if it is not shown */
  	if ( this._searchBlockOpen == false ) {      
      this.selector.find(".LdtSearch").show(100);
      
      this.selector.find(".LdtSearchInput").css('background-color','#fff');
      this.selector.find(".LdtSearchInput").focus();
      this.selector.find(".LdtSearchInput").attr('value', this._searchLastValue);      
      this._Popcorn.trigger("IriSP.search", this._searchLastValue); // trigger the search to make it more natural.
      
      this._searchBlockOpen = true;           
      this.selector.find(".LdtSearchInput").bind('keyup', null, function() { self.searchHandler.call(self); } );
      
      // we need this variable because some widget can find a match in
      // their data while at the same time other's don't. As we want the
      // search field to become green when there's a match, we need a 
      // variable to remember that we had one.
      this._positiveMatch = false;

      // tell the world the field is open
      this._Popcorn.trigger("IriSP.search.open");
      
	} else {
      this._searchLastValue = this.selector.find(".LdtSearchInput").attr('value');
      this.selector.find(".LdtSearchInput").attr('value','');
      this.selector.find(".LdtSearch").hide(100);
      
      // unbind the watcher event.
      this.selector.find(".LdtSearchInput").unbind('keypress set');
      this._searchBlockOpen = false;

      this._positiveMatch = false;
      
      this._Popcorn.trigger("IriSP.search.closed");
  }
};

/* this handler is called whenever the content of the search
   field changes */
IriSP.PlayerWidget.prototype.searchHandler = function() {
  this._searchLastValue = this.selector.find(".LdtSearchInput").attr('value');
  this._positiveMatch = false;
  
  // do nothing if the search field is empty, instead of highlighting everything.
  if (this._searchLastValue == "") {
    this._Popcorn.trigger("IriSP.search.cleared");
    this.selector.find(".LdtSearchInput").css('background-color','');
  } else {
    this._Popcorn.trigger("IriSP.search", this._searchLastValue);
  }
};

/*
  handler for the IriSP.search.found message, which is sent by some views when they
  highlight a match.
*/
IriSP.PlayerWidget.prototype.searchMatch = function() {
  this._positiveMatch = true;
  this.selector.find(".LdtSearchInput").css('background-color','#e1ffe1');
}

/* the same, except that no value could be found */
IriSP.PlayerWidget.prototype.searchNoMatch = function() {
  if (this._positiveMatch !== true)
    this.selector.find(".LdtSearchInput").css('background-color', "#d62e3a");
}

/* 
 *   
 *  Copyright 2010 Institut de recherche et d'innovation 
 *  contributor(s) : Samuel Huron 
 *   
 *  contact@iri.centrepompidou.fr
 *  http://www.iri.centrepompidou.fr 
 *   
 *  This software is a computer program whose purpose is to show and add annotations on a video .
 *  This software is governed by the CeCILL-C license under French law and
 *  abiding by the rules of distribution of free software. You can  use, 
 *  modify and/ or redistribute the software under the terms of the CeCILL-C
 *  license as circulated by CEA, CNRS and INRIA at the following URL
 *  "http://www.cecill.info". 
 *  
 *  The fact that you are presently reading this means that you have had
 *  knowledge of the CeCILL-C license and that you accept its terms.
*/
// CHART TIMELINE / VERSION PROTOTYPE  ::

IriSP.PolemicWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
 
  this.userPol    = new Array();
  this.userNoPol  = new Array();
  this.userst      = new Array();
  this.numberOfTweet = 0;
  this.Users;
  this.TweetPolemic;
  this.yMax        = this.height; 
  this.PaperSlider;
  this.heightOfChart;
  this.tweets  = new Array();
  this.svgElements = {};
  
  // Make and define the Raphael area
  this.paper = Raphael(document.getElementById(this._id), config.width, config.height);
  
  this.oldSearchMatches = [];

  // event handlers
  this._Popcorn.listen("IriSP.search", IriSP.wrap(this, function(searchString) { this.searchHandler(searchString); }));
  this._Popcorn.listen("IriSP.search.closed", IriSP.wrap(this, this.searchFieldClosedHandler));
  this._Popcorn.listen("IriSP.search.cleared", IriSP.wrap(this, this.searchFieldClearedHandler));

};

IriSP.PolemicWidget.prototype = new IriSP.Widget();
  
IriSP.PolemicWidget.prototype.draw = function() {
  
    // variable 
    // yMax
    
    var self = this;
    var yCoef        = 2;             // coef for height of 1 tweet 
    var frameSize     = 5;             // frame size 
    var margin         = 1;            // marge between frame
    var lineSize      = this.width;        // timeline pixel width 
    var nbrframes     = lineSize/frameSize;     // frame numbers
    var numberOfTweet   = 0;            // number of tweet overide later 
    var duration      = +this._serializer.currentMedia().meta["dc:duration"];      // timescale width 
    var frameLength   = lineSize / frameSize;    // frame timescale  
    var timeline;
    var colors  = new Array("","#1D973D","#C5A62D","#CE0A15","#036AAE","#585858");
    
    // array 
    //var tweets  = new Array();
    var element = new Array();
    var cluster = new Array();
    var frames  = new Array(frameLength);
    var slices  = new Array();
    
    
    // Classes =======================================================================
    var Frames = function(){
      
      var Myclusters;
      var x;
      var y;
      var width;
      var height;
    };
    Frames = function(json){
      // make my clusters
      // ou Frame vide 
    };
    Frames.prototype.draw = function(){
    };
    Frames.prototype.zoom = function(){
    };
    Frames.prototype.inside = function(){
    };
    var Clusters = function(){
      var Object;
      var yDist;
      var x;
      var y;
      var width;
      var height;
    };
    Clusters = function(json){
      // make my object
    };
    var Tweet = function(){
    };
    // Classes =======================================================================

    // Refactoring (parametere) ************************************************************
    // color translastion
    var qTweet_0  =0;
    var qTweet_Q  =0;
    var qTweet_REF=0;
    var qTweet_OK =0;
    var qTweet_KO =0;
    function colorTranslation(value){
      if(value == "Q"){
        qTweet_Q+=1;
        return 2;
      }else if(value =="REF"){
        qTweet_REF+=1;
        return 4;
      }else if(value =="OK"){
        qTweet_OK+=1;
        return 1;
      }else if(value =="KO"){
        qTweet_KO+=1;
        return 3;
      }else if(value ==""){
        qTweet_0+=1;
        return 5;
      }
    }
    

      this._serializer.sync(function(data) { loaded_callback.call(self, data) });
      
      function loaded_callback (json) {

        // get current view (the first ???)
        view = json.views[0];
        
        // the tweets are by definition of the second annotation type FIXME ?
        tweet_annot_type = null;
        if(typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
          tweet_annot_type = view.annotation_types[1];
        }
      
      for(var i = 0; i < json.annotations.length; i++) {
        var item = json.annotations[i];        
        var MyTime  = Math.floor(item.begin/duration*lineSize);
        var Myframe = Math.floor(MyTime/lineSize*frameLength);

        if (typeof(item.meta) !== "undefined" 
          && typeof(item.meta["id-ref"]) !== "undefined"
          && item.meta["id-ref"] === tweet_annot_type) {
            
          var MyTJson = JSON.parse(item.meta['dc:source']['content']);
          
            if (item.content['polemics'] != undefined 
            && item.content['polemics'][0] != null) {
            
              // a tweet can have many polemics at the same time.
              for(var j=0; j<item.content['polemics'].length; j++){
                  
                  this.tweets[numberOfTweet] = {
                        id:i,
                        qualification:colorTranslation(item.content['polemics'][j]),
                        yIndicator:MyTime,
                        yframe:Myframe,
                        title:item.content['title'],
                        timeframe:item.begin,
                        userId: MyTJson.id,
                        userScreenName: MyTJson.screen_name,
                        tsource:MyTJson,
                        cinecast_id: item.id
                        };
                  numberOfTweet+=1;
                  
              }
          }
          else {
            this.tweets[numberOfTweet] = {
                  id:i,
                  qualification:colorTranslation(""),
                  yIndicator:MyTime,
                  yframe:Myframe,
                  title:item.content['title'],
                  timeframe:item.begin,
                  userId: MyTJson.id,
                  userScreenName: MyTJson.screen_name,
                  tsource:MyTJson,
                  cinecast_id: item.id
            };
            numberOfTweet+=1;
          }
          
        } 
      };  
      
       DrawTweets.call (this); // FIXME: ugly.
       
      };      

    // tweet Drawing (in raphael) 
    function DrawTweets (){
    // GROUPES TWEET ============================================
    // Count nbr of cluster and tweet in a frame an save int in "frames"
      numberOfTweet = this.tweets.length;
      for(var i=0; i<nbrframes; i++) {  
        for(var j=0; j<numberOfTweet; j++) {  
        
          if (i==this.tweets[j].yframe){
            
            var k = this.tweets[j].qualification;
            
            // make array for frame cluster
            if(frames[i]==undefined){
              frames[i] = {id:i,
                     qualifVol:new Array(),
                     mytweetsID:new Array()
                    };
            }
            // add my tweet to frame
            frames[i].mytweetsID.push(this.tweets[j]);
            
            // count opinion by frame
            if( frames[i].qualifVol[k] == undefined){
              frames[i].qualifVol[k] = 1;
            }else{
              frames[i].qualifVol[k] += 1;
            }
            
          }
        }
      }
    
    // GROUPES TWEET ============================================    
    // max of tweet by Frame 
      var max = 0; 
      for(var i = 0; i < nbrframes; i++) {
        var moy  = 0;
        for (var j = 0; j < 6; j++) {    
          if (frames[i] != undefined) {
            if (frames[i].qualifVol[j] != undefined) {
              moy += frames[i].qualifVol[j];
            }
          }
        }
        
        if (moy > max) {
          max = moy;
        }
      }
    
      var tweetDrawed = new Array();
      var TweetHeight = 5;
      
      // DRAW  TWEETS ============================================
      for(var i = 0; i < nbrframes; i++) {
        var addEheight = 5;
        if (frames[i] != undefined){                
          // by type 
          
          for (var j = 6; j > -1; j--) {
            if (frames[i].qualifVol[j] != undefined) {
              // show tweet by type 
              for (var k = 0; k < frames[i].mytweetsID.length; k++) {
              
                if (frames[i].mytweetsID[k].qualification == j) {                
                  var x = i * frameSize;
                  var y = this.heightmax - addEheight;
                  
                  if (this.yMax > y) {
                    this.yMax = y;
                  }
                  
                  var e = this.paper.rect(x, y, frameSize - margin, TweetHeight /* height */)
                                    .attr({stroke:"#00","stroke-width":0.1,  fill: colors[j]});  
                  
                  addEheight += TweetHeight;
                  
                  e.color = colors[j];
                  e.time = frames[i].mytweetsID[k].timeframe;
                  e.title = frames[i].mytweetsID[k].title;
                  e.id = frames[i].mytweetsID[k].cinecast_id;

                  this.svgElements[e.id] = e;

                  /*
                  e.mouseover(function(element) { return function (event) {
                        // event.clientX and event.clientY are to raphael what event.pageX and pageY are to jquery.                        
                        self.TooltipWidget.show.call(self.TooltipWidget, element.title, element.attr("fill"), event.clientX - 106, event.clientY - 160);
                        element.displayed = true;
                  }}(e)).mouseout(function(element) { return function () {                          
                          self.TooltipWidget.hide.call(self.TooltipWidget);
                  }}(e)).mousedown(function () {
                    self._Popcorn.currentTime(this.time/1000);
                    self._Popcorn.trigger("IriSP.PolemicTweet.click", this.id); 
                  });
                  */
                  
                  IriSP.jQuery(e.node).mouseenter(function(element) { return function (event) {                        
                        // event.clientX and event.clientY are to raphael what event.pageX and pageY are to jquery.                        
                        self.TooltipWidget.show.call(self.TooltipWidget, element.title, element.attr("fill"), event.pageX - 106, event.pageY - 160);
                        element.displayed = true;
                  }}(e)).mousedown(function(element) { return function () {                    
                    self._Popcorn.currentTime(element.time/1000);
                    self._Popcorn.trigger("IriSP.PolemicTweet.click", element.id); 
                    }
                  }(e));                  
                  
                  IriSP.jQuery(e.node).attr('id', 't' + k + '');
                  IriSP.jQuery(e.node).attr('title', frames[i].mytweetsID[k].title);
                  IriSP.jQuery(e.node).attr('begin',  frames[i].mytweetsID[k].timeframe);                  
                }
              }
            }
          }
        }

      }    
      // DRAW UI :: resize border and bgd      
      this.paperBackground = this.paper.rect(0, 0, this.width, this.heightmax).attr({fill:"#F8F8F8","stroke-width":0.1,opacity: 1});  

      // outer borders
      this.outerBorders   = [];
      this.outerBorders.push(this.paper.rect(0, this.height - 1, this.width, 1).attr({fill:"#ababab",stroke: "none",opacity: 1}));  
      this.outerBorders.push(this.paper.rect(0, 0, this.width, 1).attr({fill:"#ababab",stroke: "none",opacity: 1}));  

      // inner borders
      this.innerBorders   = [];
      this.innerBorders.push(this.paper.rect(1, this.height - 2, this.width, 1).attr({fill:"#efefef",stroke: "none",opacity: 1}));  
      this.innerBorders.push(this.paper.rect(1, 1, this.width, 1).attr({fill:"#efefef",stroke: "none",opacity: 1}));  
      this.innerBorders.push(this.paper.rect(1, 1, 1, this.height - 2).attr({fill:"#d0d1d1",stroke: "none",opacity: 0.8}));  
      this.innerBorders.push(this.paper.rect(this.width - 2, 1, 1, this.height - 2).attr({fill:"#efefef",stroke: "none",opacity: 1}));  



      this.paperSlider   = this.paper.rect(0, 0, 0, this.heightmax).attr({fill:"#D4D5D5", stroke: "none", opacity: 1});
      
      // the small white line displayed over the slider.
      this.sliderTip = this.paper.rect(0, 0, 1, this.heightmax).attr({fill:"#fc00ff", stroke: "none", opacity: 1});
      // decalage 
      // tweetSelection = this.paper.rect(-100,-100,5,5).attr({fill:"#fff",stroke: "none",opacity: 1});  
      
      
      this.paperSlider.toBack();
      this.paperBackground.toBack();
      this.sliderTip.toFront();
    }
    
    this.selector.mouseleave(IriSP.wrap(this, function() { self.TooltipWidget.hide.call(self.TooltipWidget); }));
    this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));
}

IriSP.PolemicWidget.prototype.sliderUpdater = function() {

    var time = +this._Popcorn.currentTime();
    var duration = +this._serializer.currentMedia().meta["dc:duration"];
    
    this.paperSlider.attr("width", time * (this.width / (duration / 1000)));
        
    this.sliderTip.attr("x", time * (this.width / (duration / 1000)));
};
    
IriSP.PolemicWidget.prototype.searchHandler = function(searchString) {
  if (searchString == "")
    return;

  var matches = this._serializer.searchTweetsOccurences(searchString);

  if (IriSP.countProperties(matches) > 0) {
    this._Popcorn.trigger("IriSP.search.matchFound");
  } else {
    this._Popcorn.trigger("IriSP.search.noMatchFound");
  }

  for (var id in matches) {
    if (this.svgElements.hasOwnProperty(id)) {
      var e = this.svgElements[id];
      this.svgElements[id].attr({fill: "#fc00ff"});
    }
  }

  // clean up the blocks that were in the previous search
  // but who aren't in the current one.
  for (var id in this.oldSearchMatches) {
    if (!matches.hasOwnProperty(id)) {
      var e = this.svgElements[id];
      e.attr({fill: e.color});
    }
  }
  
  this.oldSearchMatches = matches;
};

IriSP.PolemicWidget.prototype.searchFieldClearedHandler = function() {
  // clean up the blocks that were in the previous search
  // but who aren't in the current one.
  for (var id in this.oldSearchMatches) {
      var e = this.svgElements[id];
      e.attr({fill: e.color});
  }
 
};

IriSP.PolemicWidget.prototype.searchFieldClosedHandler = function() {
  // clean up the blocks that were in the previous search
  // but who aren't in the current one.
  for (var id in this.oldSearchMatches) {
      var e = this.svgElements[id];
      e.attr({fill: e.color});
  }
 
};
   
IriSP.SegmentsWidget = function(Popcorn, config, Serializer) {

  var self = this;
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this.oldSearchMatches = [];

  // event handlers
  this._Popcorn.listen("IriSP.search", function(searchString) { self.searchHandler.call(self, searchString); });
  this._Popcorn.listen("IriSP.search.closed", function() { self.searchFieldClosedHandler.call(self); });
  this._Popcorn.listen("IriSP.search.cleared", function() { self.searchFieldClearedHandler.call(self); });
};

IriSP.SegmentsWidget.prototype = new IriSP.Widget();

/* Get the width of a segment, in pixels. */
IriSP.SegmentsWidget.prototype.segmentToPixel = function(annotation) {  
  var begin = Math.round((+ annotation.begin) / 1000);
  var end = Math.round((+ annotation.end) / 1000);    
  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  
  var startPourcent 	= IriSP.timeToPourcent(begin, duration);
  var startPixel = Math.floor(this.selector.parent().width() * (startPourcent / 100));
  
  var endPourcent 	= Math.floor(IriSP.timeToPourcent(end, duration) - startPourcent);
  var endPixel = Math.floor(this.selector.parent().width() * (endPourcent / 100));
  
  return endPixel;
};

/* compute the total length of a group of segments */
IriSP.SegmentsWidget.prototype.segmentsLength = function(segmentsList) {
  var self = this;
  var total = 0;
  
  for (var i = 0; i < segmentsList.length; i++)
    total += self.segmentToPixel(segmentsList[i].annotation);
  
  return total;  
};

IriSP.SegmentsWidget.prototype.draw = function() {

  var self = this;
  var annotations = this._serializer._data.annotations;

  this.selector.addClass("Ldt-SegmentsWidget");
  this.selector.append(Mustache.to_html(IriSP.overlay_marker_template));
          
  var view_type = this._serializer.getNonTweetIds()[0];    
  
  this.positionMarker = this.selector.children(":first");
  
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.positionUpdater));
  
  
  var i = 0;
  
  var segments_annotations = [];
  
  for (i = 0; i < annotations.length; i++) {
    var annotation = annotations[i];

    /* filter the annotations whose type is not the one we want */
    if (view_type != "" && typeof(annotation.meta) !== "undefined" && typeof(annotation.meta["id-ref"]) !== "undefined"
          && annotation.meta["id-ref"] != view_type) {
        continue;
    }

    segments_annotations.push(annotation);
  }
    
  var totalWidth = this.selector.width() - segments_annotations.length;
  var lastSegment = IriSP.underscore.max(segments_annotations, function(annotation) { return annotation.end; });
  
  for (i = 0; i < segments_annotations.length; i++) {
  
    var annotation = segments_annotations[i];
    var begin = (+ annotation.begin);
    var end = (+ annotation.end);
    var duration = this._serializer.currentMedia().meta["dc:duration"];
    var id = annotation.id;
        
    var startPixel = Math.floor(this.selector.parent().width() * (begin / duration));

    var endPixel = Math.floor(this.selector.parent().width() * (end / duration));
    
    if (annotation.id !== lastSegment.id) 
      var pxWidth = endPixel - startPixel -1;
    else
      /* the last segment has no segment following it */
      var pxWidth = endPixel - startPixel;
 
    var divTitle = (annotation.content.title + " - " + annotation.content.description).substr(0,55);

    if (typeof(annotation.content.color) !== "undefined")
      var color = annotation.content.color;
    else
      var color = annotation.color;
    
    var hexa_color = IriSP.DEC_HEXA_COLOR(color);

    if (hexa_color === "FFCC00")
      hexa_color = "333";
    if (hexa_color.length == 4)
      hexa_color = hexa_color + '00';
    
    var annotationTemplate = Mustache.to_html(IriSP.annotation_template,
        {"divTitle" : divTitle, "id" : id, "startPixel" : startPixel,
        "pxWidth" : pxWidth, "hexa_color" : hexa_color,
        "seekPlace" : Math.round(begin/1000)});

        
    this.selector.append(annotationTemplate);
    
    /* add a special class to the last segment and change its border */
    if (annotation.id === lastSegment.id) {
        this.selector.find("#" + id).addClass("Ldt-lastSegment");        
        this.selector.find(".Ldt-lastSegment").css("border-color", "#" + hexa_color);        
    }

    IriSP.jQuery("#" + id).fadeTo(0, 0.3);

    IriSP.jQuery("#" + id).mouseover(
    /* we wrap the handler in another function because js's scoping
       rules are function-based - otherwise, the internal vars like
       divTitle are preserved but they are looked-up from the draw
       method scope, so after that the loop is run, so they're not
       preserved */
    (function(divTitle) { 
     return function(event) {
          IriSP.jQuery(this).animate({opacity: 0.6}, 5);
          var offset = IriSP.jQuery(this).offset();
          var correction = IriSP.jQuery(this).outerWidth() / 2;

          var offset_x = offset.left + correction - 106;
          if (offset_x < 0)
            offset_x = 0;
                    
          self.TooltipWidget.show(divTitle, color, offset_x, event.pageY - 160);
    } })(divTitle)).mouseout(function(){
      IriSP.jQuery(this).animate({opacity: 0.3}, 5);
      self.TooltipWidget.hide();
    });

    IriSP.jQuery("#" + id).click(function(_this, annotation) {
                                    return function() { _this.clickHandler(annotation)};
                                 }(this, annotation));
  }
};

/* restores the view after a search */
IriSP.SegmentsWidget.prototype.clear = function() {
  this.selector.children(".Ldt-iri-chapter").animate({opacity:0.3}, 100);
};

IriSP.SegmentsWidget.prototype.clickHandler = function(annotation) {
  this._Popcorn.trigger("IriSP.SegmentsWidget.click", annotation.id);
  var begin = (+ annotation.begin) / 1000;
  this._Popcorn.currentTime(Math.round(begin));
};

IriSP.SegmentsWidget.prototype.searchHandler = function(searchString) {

  if (searchString == "")
    return;

  var matches = this._serializer.searchOccurences(searchString);

  if (IriSP.countProperties(matches) > 0) {
    this._Popcorn.trigger("IriSP.search.matchFound");
  } else {
    this._Popcorn.trigger("IriSP.search.noMatchFound");
  }

  // un-highlight all the blocks
  this.selector.children(".Ldt-iri-chapter").css("opacity", 0.1);
 
  // then highlight the ones with matches.
  for (var id in matches) {
    var factor = 0.5 + matches[id] * 0.2;
    this.selector.find("#"+id).dequeue();
    this.selector.find("#"+id).animate({opacity:factor}, 200);
  }

 
  this.oldSearchMatches = matches;
};

IriSP.SegmentsWidget.prototype.searchFieldClearedHandler = function() {
  this.clear();
};

IriSP.SegmentsWidget.prototype.searchFieldClosedHandler = function() {
  this.clear();
};

IriSP.SegmentsWidget.prototype.positionUpdater = function() {  
  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var time = this._Popcorn.currentTime();
  //var position 	= ((time / duration) * 100).toFixed(2);
  var position 	= ((time / duration) * 100).toFixed(2);

  this.positionMarker.css("left", position + "%");  
};
IriSP.SliderWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
};

IriSP.SliderWidget.prototype = new IriSP.Widget();

IriSP.SliderWidget.prototype.draw = function() {
  var self = this;

  this.selector.append(Mustache.to_html(IriSP.sliderWidget_template, {}));
  this.selector.addClass("Ldt-SliderMinimized");

  this.sliderBackground = this.selector.find(".Ldt-sliderBackground");
  this.sliderForeground = this.selector.find(".Ldt-sliderForeground");
  this.positionMarker = this.selector.find(".Ldt-sliderPositionMarker");


  // a special variable to stop methods from tinkering
  // with the positionMarker when the user is dragging it
  this.draggingOngoing = false;

  // another special variable used by the timeout handler to
  // open or close the slider.
  this.sliderMaximized = false;
  this.timeOutId = null;

  
  this.positionMarker.draggable({axis: "x",
  start: IriSP.wrap(this, this.positionMarkerDraggingStartedHandler),
  stop: IriSP.wrap(this, this.positionMarkerDraggedHandler),
  containment: "parent"
  });
  this.positionMarker.css("position", "absolute");
  
  this.sliderBackground.click(function(event) { self.backgroundClickHandler.call(self, event); });
  this.sliderForeground.click(function(event) { self.foregroundClickHandler.call(self, event); });

  this.selector.hover(IriSP.wrap(this, this.mouseOverHandler), IriSP.wrap(this, this.mouseOutHandler));

  // update the positions
  this._Popcorn.listen("timeupdate", IriSP.wrap(this, this.sliderUpdater));

  // special messages :
  this._Popcorn.listen("IriSP.PlayerWidget.MouseOver", IriSP.wrap(this, this.mouseOverHandler));
  this._Popcorn.listen("IriSP.PlayerWidget.MouseOut", IriSP.wrap(this, this.mouseOutHandler));
};

/* update the slider and the position marker as time passes */
IriSP.SliderWidget.prototype.sliderUpdater = function() {
  if(this.draggingOngoing || this._disableUpdate)
    return;
  
  var time = this._Popcorn.currentTime();

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var percent = ((time / duration) * 100).toFixed(2);
  
  /* we do these complicated calculations to center exactly
     the position Marker */
  var pixels_to_percents = 100 / this.selector.width(); /* how much is a pixel in percents */
  var positionMarker_width = this.positionMarker.width();
  var correction = (pixels_to_percents * positionMarker_width) / 2;

  var newPos = percent - correction;
  if (newPos <= 0)
    newPos = 0;
  
	this.sliderForeground.css("width", percent + "%");
	this.positionMarker.css("left", newPos + "%");

};

IriSP.SliderWidget.prototype.backgroundClickHandler = function(event) {
  /* this piece of code is a little bit convoluted - here's how it works :
     we want to handle clicks on the progress bar and convert those to seeks in the media.
     However, jquery only gives us a global position, and we want a number of pixels relative
     to our container div, so we get the parent position, and compute an offset to this position,
     and finally compute the progress ratio in the media.
     Finally we multiply this ratio with the duration to get the correct time
  */

  var parentOffset = this.sliderBackground.parent().offset();
  var width = this.sliderBackground.width();
  var relX = event.pageX - parentOffset.left;

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((relX / width) * duration).toFixed(2);

  this._Popcorn.currentTime(newTime);
};

/* same function as the previous one, except that it handles clicks
   on the foreground element */
IriSP.SliderWidget.prototype.foregroundClickHandler = function(event) {
  var parentOffset = this.sliderForeground.parent().offset();
  var width = this.sliderBackground.width();
  var relX = event.pageX - parentOffset.left;

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((relX / width) * duration).toFixed(2);

  this._Popcorn.currentTime(newTime);
};

/* handles mouse over the slider */
IriSP.SliderWidget.prototype.mouseOverHandler = function(event) {
  
  if (this.timeOutId !== null) {
    window.clearTimeout(this.timeOutId);
  }
 
  this.sliderMaximized = true;

  this.sliderBackground.animate({"height": "9px"}, 100);
  this.sliderForeground.animate({"height": "9px"}, 100);
  this.positionMarker.animate({"height": "9px", "width": "9px"}, 100);
  //this.positionMarker.css("margin-top", "-4px");
  
//  this.selector.removeClass("Ldt-SliderMinimized");
//  this.selector.addClass("Ldt-SliderMaximized");
};

/* handles when the mouse leaves the slider */
IriSP.SliderWidget.prototype.mouseOutHandler = function(event) {

  this.timeOutId = window.setTimeout(IriSP.wrap(this, this.minimizeOnTimeout),
                                     IriSP.widgetsDefaults.SliderWidget.minimize_period);
};

IriSP.SliderWidget.prototype.minimizeOnTimeout = function(event) {
  this.sliderBackground.animate({"height": "5px"}, 100);
  this.sliderForeground.animate({"height": "5px"}, 100);
  this.positionMarker.animate({"height": "5px", "width": "5px"}, 100);
  this.positionMarker.css("margin-top", "0px");
  this.sliderMinimized = true;
  
//  this.selector.removeClass("Ldt-SliderMaximized");
//  this.selector.addClass("Ldt-SliderMinimized");

};

// called when the user starts dragging the position indicator
IriSP.SliderWidget.prototype.positionMarkerDraggingStartedHandler = function(event, ui) {  
  this.draggingOngoing = true;
};

IriSP.SliderWidget.prototype.positionMarkerDraggedHandler = function(event, ui) {   
  this._disableUpdate = true; // disable slider position updates while dragging is ongoing.
  window.setTimeout(IriSP.wrap(this, function() { this._disableUpdate = false; }), 500);

  var parentOffset = this.sliderForeground.parent().offset();
  var width = this.sliderBackground.width();
  var relX = event.pageX - parentOffset.left;

  var duration = this._serializer.currentMedia().meta["dc:duration"] / 1000;
  var newTime = ((relX / width) * duration).toFixed(2);

  this._Popcorn.currentTime(newTime);
  
  this.draggingOngoing = false;
};

/* this widget displays a small tooltip */
IriSP.TooltipWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);
  this._shown = false;
  this._displayedText = "";
  this._hideTimeout = -1;
};


IriSP.TooltipWidget.prototype = new IriSP.Widget();

IriSP.TooltipWidget.prototype.draw = function() {
  var templ = Mustache.to_html(IriSP.tooltipWidget_template);

  this.selector.append(templ);
  this.hide();

};

IriSP.TooltipWidget.prototype.clear = function() {
	this.selector.find(".tiptext").text("");
};

IriSP.TooltipWidget.prototype.show = function(text, color, x, y) {

  if (this._displayedText == text)
    return;
  
  this.selector.find(".tipcolor").css("background-color", color);
  this._displayedText = text;
	this.selector.find(".tiptext").text(text);
  //this.selector.find(".tip").css("left", x).css("top", y);  
  this.selector.find(".tip").css("left", x).css("top", y);
  this.selector.find(".tip").show();
  this._shown = true;
};

IriSP.TooltipWidget.prototype.hide = function() {                                                   
  this.selector.find(".tip").hide();
  this._shown = false;  
};/* a widget that displays tweet - used in conjunction with the polemicWidget */

IriSP.TweetsWidget = function(Popcorn, config, Serializer) {
  IriSP.Widget.call(this, Popcorn, config, Serializer);

  this._displayingTweet = false;
  this._timeoutId = undefined;  
};


IriSP.TweetsWidget.prototype = new IriSP.Widget();


IriSP.TweetsWidget.prototype.drawTweet = function(annotation) {
    
    var title = IriSP.formatTweet(annotation.content.title);
    var img = annotation.content.img.src;
    if (typeof(img) === "undefined" || img === "" || img === "None") {
      img = IriSP.widgetsDefaults.TweetsWidget.default_profile_picture;
    }

    var imageMarkup = IriSP.templToHTML("<img src='{{src}}' alt='user image'></img>", 
                                       {src : img});
    
    if (typeof(annotation.meta["dc:source"].content) !== "undefined") {
      var tweetContents = JSON.parse(annotation.meta["dc:source"].content);
      var creator = tweetContents.user.screen_name;
      var real_name = tweetContents.user.name;

      imageMarkup = IriSP.templToHTML("<a href='http://twitter.com/{{creator}}'><img src='{{src}}' alt='user image'></img></a>", 
                                       {src : img, creator: creator});
            
      var formatted_date = new Date(tweetContents.created_at).toLocaleDateString();
      title = IriSP.templToHTML("<a class='Ldt-tweet_userHandle' href='http://twitter.com/{{creator}}'>@{{creator}}</a> - " + 
                                "<div class='Ldt-tweet_realName'>{{real_name}}</div>" +
                                "<div class='Ldt-tweet_tweetContents'>{{{ contents }}}</div>" +
                                "<div class='Ldt-tweet_date'>{{ date }}</div>", 
                                {creator: creator, real_name: real_name, contents : title, date : formatted_date});

      this.selector.find(".Ldt-TweetReply").attr("href", "http://twitter.com/home?status=@" + creator + ":%20");


      var rtText = Mustache.to_html("http://twitter.com/home?status=RT @{{creator}}: {{text}}",
                                    {creator: creator, text: IriSP.encodeURI(annotation.content.title)});
      this.selector.find(".Ldt-Retweet").attr("href", rtText);
    }

    this.selector.find(".Ldt-tweetContents").html(title);
    this.selector.find(".Ldt-tweetAvatar").html(imageMarkup);
    this.selector.show("blind", 250); 
};

IriSP.TweetsWidget.prototype.displayTweet = function(annotation) {
  if (this._displayingTweet === false) {
    this._displayingTweet = true;
  } else {
    window.clearTimeout(this._timeoutId);
  }

  this.drawTweet(annotation);

  var time = this._Popcorn.currentTime();  
  this._timeoutId = window.setTimeout(IriSP.wrap(this, this.clearPanel), IriSP.widgetsDefaults.TweetsWidget.tweet_display_period);
};


IriSP.TweetsWidget.prototype.clearPanel = function() {  
    this._displayingTweet = false;
    this._timeoutId = undefined;
    this.closePanel();
    
};

IriSP.TweetsWidget.prototype.closePanel = function() {
    if (this._timeoutId != undefined) {
      /* we're called from the "close window" link */
      /* cancel the timeout */
      window.clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
    
    this.selector.hide("blind", 400);
    
};

/* cancel the timeout if the user clicks on the keep panel open button */
IriSP.TweetsWidget.prototype.keepPanel = function() {
    if (this._timeoutId != undefined) {
      /* we're called from the "close window" link */
      /* cancel the timeout */
      window.clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
};

IriSP.TweetsWidget.prototype.draw = function() {
  var _this = this;
  
  var tweetMarkup = IriSP.templToHTML(IriSP.tweetWidget_template, {"share_template" : IriSP.share_template});
  this.selector.append(tweetMarkup);
  this.selector.hide();
  this.selector.find(".Ldt-tweetWidgetMinimize").click(IriSP.wrap(this, this.closePanel));
  this.selector.find(".Ldt-tweetWidgetKeepOpen").click(IriSP.wrap(this, this.keepPanel));
  
  this._Popcorn.listen("IriSP.PolemicTweet.click", IriSP.wrap(this, this.PolemicTweetClickHandler));
};

IriSP.TweetsWidget.prototype.PolemicTweetClickHandler = function(tweet_id) {  
  var index, annotation;
  for (index in this._serializer._data.annotations) {
    annotation = this._serializer._data.annotations[index];
    
    if (annotation.id === tweet_id)
      break;
  }
    
  if (annotation.id !== tweet_id)
      /* we haven't found it */
      return;
  
  this.displayTweet(annotation);
  return;
};

IriSP.JSONSerializer = function(DataLoader, url) {
  IriSP.Serializer.call(this, DataLoader, url);
};

IriSP.JSONSerializer.prototype = new IriSP.Serializer();

IriSP.JSONSerializer.prototype.serialize = function(data) {
  return JSON.stringify(data);
};

IriSP.JSONSerializer.prototype.deserialize = function(data) {
  return JSON.parse(data);
};

IriSP.JSONSerializer.prototype.sync = function(callback) {
  /* we don't have to do much because jQuery handles json for us */

  var self = this;

  var fn = function(data) {      
      self._data = data;      
      // sort the data too     
      self._data["annotations"].sort(function(a, b) 
          { var a_begin = +a.begin;
            var b_begin = +b.begin;
            return a_begin - b_begin;
          });
     
      callback(data);      
  };
  
  this._DataLoader.get(this._url, fn);
};

IriSP.JSONSerializer.prototype.currentMedia = function() {  
  return this._data.medias[0]; /* FIXME: don't hardcode it */
};

/* this function searches for an annotation which matches title, description and keyword 
   "" matches any field. 
   Note: it ignores tweets.
*/    
IriSP.JSONSerializer.prototype.searchAnnotations = function(title, description, keyword) {
    /* we can have many types of annotations. We want search to only look for regular segments */
    /* the next two lines are a bit verbose because for some test data, _serializer.data.view is either
       null or undefined.
    */
    var view;

    if (typeof(this._data.views) !== "undefined" && this._data.views !== null)
       view = this._data.views[0];

    var searchViewType = "";

    if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
            searchViewType = view.annotation_types[0];
    }

    var filterfn = function(annotation) {
      if( searchViewType  != "" && 
          typeof(annotation.meta) !== "undefined" && 
          typeof(annotation.meta["id-ref"]) !== "undefined" &&
          annotation.meta["id-ref"] !== searchViewType) {
        return true; // don't pass
      } else {
          return false;
      }
    };

    return this.searchAnnotationsFilter(title, description, keyword, filterfn);

};

/* only look for tweets */
IriSP.JSONSerializer.prototype.searchTweets = function(title, description, keyword) {
    /* we can have many types of annotations. We want search to only look for regular segments */
    /* the next two lines are a bit verbose because for some test data, _serializer.data.view is either
       null or undefined.
    */
    var view;

    if (typeof(this._data.views) !== "undefined" && this._data.views !== null)
       view = this._data.views[0];

    var searchViewType = "";

    if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length > 1) {
            searchViewType = view.annotation_types[0];
    }

    var filterfn = function(annotation) {
      if( searchViewType  != "" && 
          typeof(annotation.meta) !== "undefined" && 
          typeof(annotation.meta["id-ref"]) !== "undefined" &&
          annotation.meta["id-ref"] !== searchViewType) {
        return false; // pass
      } else {
          return true;
      }
    };

    return this.searchAnnotationsFilter(title, description, keyword, filterfn);

};

/*
  the previous function call this one, which is more general:
 */    
IriSP.JSONSerializer.prototype.searchAnnotationsFilter = function(title, description, keyword, filter) {

    var rTitle;
    var rDescription;
    var rKeyword;
    /* match anything if given the empty string */
    if (title == "")
      title = ".*";
    if (description == "")
      description = ".*";
    if (keyword == "")
      keyword = ".*";
    
    rTitle = new RegExp(title, "i");  
    rDescription = new RegExp(description, "i");  
    rKeyword = new RegExp(keyword, "i");  
    
    var ret_array = [];
    
    var i;
    for (i in this._data.annotations) {
      var annotation = this._data.annotations[i];
      
      /* filter the annotations whose type is not the one we want */
      if (filter(annotation)) {
          continue;
      }
      
      if (rTitle.test(annotation.content.title) && 
          rDescription.test(annotation.content.description)) {
          /* FIXME : implement keyword support */
          ret_array.push(annotation);
      }
    }
    
    return ret_array;
};

/* breaks a string in words and searches each of these words. Returns an array
   of objects with the id of the annotation and its number of occurences.
   
   FIXME: optimize ? seems to be n^2 in the worst case.
*/
IriSP.JSONSerializer.prototype.searchOccurences = function(searchString) {
  var ret = { };
  var keywords = searchString.split(/\s+/);
  
  for (var i in keywords) {
    var keyword = keywords[i];
    
    // search this keyword in descriptions and title
    var found_annotations = []
    found_annotations = found_annotations.concat(this.searchAnnotations(keyword, "", ""));
    found_annotations = found_annotations.concat(this.searchAnnotations("", keyword, ""));
    
    for (var j in found_annotations) {
      var current_annotation = found_annotations[j];
      
      if (!ret.hasOwnProperty(current_annotation.id)) {
        ret[current_annotation.id] = 1;
      } else {
        ret[current_annotation.id] += 1;
      }
      
    }

  };
  
  return ret;
};

/* breaks a string in words and searches each of these words. Returns an array
   of objects with the id of the annotation and its number of occurences.
   
   FIXME: optimize ? seems to be n^2 in the worst case.
*/
IriSP.JSONSerializer.prototype.searchTweetsOccurences = function(searchString) {
  var ret = { };
  var keywords = searchString.split(/\s+/);
  
  for (var i in keywords) {
    var keyword = keywords[i];
    
    // search this keyword in descriptions and title
    var found_annotations = []
    found_annotations = found_annotations.concat(this.searchTweets(keyword, "", ""));
    found_annotations = found_annotations.concat(this.searchTweets("", keyword, ""));
    
    for (var j in found_annotations) {
      var current_annotation = found_annotations[j];
      
      if (!ret.hasOwnProperty(current_annotation.id)) {
        ret[current_annotation.id] = 1;
      } else {
        ret[current_annotation.id] += 1;
      }
      
    }

  };
  
  return ret;
};

/* takes the currentTime and returns all the annotations that are displayable at the moment 
   NB: only takes account the first type of annotations - ignores tweets 
   currentTime is in seconds.
 */

IriSP.JSONSerializer.prototype.currentAnnotations = function(currentTime) {
  var view;
  var currentTimeMs = 1000 * currentTime;

  if (typeof(this._data.views) !== "undefined" && this._data.views !== null)
     view = this._data.views[0];

  var view_type = "";

  if(typeof(view) !== "undefined" && typeof(view.annotation_types) !== "undefined" && view.annotation_types.length >= 1) {
          view_type = view.annotation_types[0];
  }

  var ret_array = [];
  
  var i;
 
  for (i in this._data.annotations) {
    var annotation = this._data.annotations[i];
    
    if (annotation.meta["id-ref"] === view_type && annotation.begin <= currentTimeMs && annotation.end >= currentTimeMs)
      ret_array.push(annotation);
  }

  return ret_array;
};


/* this function returns a list of ids of tweet lines */
IriSP.JSONSerializer.prototype.getTweetIds = function() {
  if (typeof(this._data.lists) === "undefined" || this._data.lists === null)
    return [];

  var tweetsId = [];
  
  /* first get the list containing the tweets */
  var tweets = IriSP.underscore.filter(this._data.lists, function(entry) { return entry.id.indexOf("tweet") !== -1 });
  
  // FIXME: collect tweets from multiple sources ?
  tweetsId = IriSP.underscore.pluck(tweets[0].items, "id-ref");

  return tweetsId;
};

/* this function returns a list of lines which are not tweet lines */
IriSP.JSONSerializer.prototype.getNonTweetIds = function() {
  if (typeof(this._data.lists) === "undefined" || this._data.lists === null)
    return [];
  
  /* get all the ids */
  var ids = IriSP.underscore.map(this._data.lists, function(entry) {                                                         
                                                         return IriSP.underscore.pluck(entry.items, "id-ref"); });
                                                         
  var illegal_values = this.getTweetIds();
  return IriSP.underscore.difference(ids, illegal_values);
  
};
