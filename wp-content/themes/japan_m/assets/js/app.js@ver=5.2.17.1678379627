(function(w) { 
	'use strict'; 
    var app = {
        isDevice: $(window).width() < 1024,
        init: function() {
            if (this.initialized) return;
            this.initialized = true;
            for (var obj in this) this[obj].hasOwnProperty("init") && this[obj]["init"](this);
            app.readyCallbacks.fire()
        },
        readyCallbacks: $.Callbacks(),
        ready: function(callback) {
            app.readyCallbacks.add(callback) 
        },
        load: function() {
            // console.log('call load')
            app.loadCallbacks.fire()
        },
        loadCallbacks: $.Callbacks(),
        onLoad: function(callback) {
            app.loadCallbacks.add(callback) 
        }
    }
    w.app = app;
})(window);

