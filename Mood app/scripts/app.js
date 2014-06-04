(function (global) {
    var app = global.app = global.app || {};
    
	var productId = "963fd53d71c64a36b1baf5305fa7c8c9"; // App unique product key

      // Make analytics available via the window.analytics variable
      // Start analytics by calling window.analytics.Start()
      var analytics = global.analytics = global.analytics || {};
      analytics.Start = function()
      {
        // Handy shortcuts to the analytics api
        var factory = window.plugins.EqatecAnalytics.Factory;
        var monitor = window.plugins.EqatecAnalytics.Monitor;
        // Create the monitor instance using the unique product key for Mood Analytics
        var settings = factory.CreateSettings(productId);
        settings.LoggingInterface = factory.CreateTraceLogger();
        factory.CreateMonitorWithSettings(settings,
          function() {
            console.log("Monitor created");
            // Start the monitor inside the success-callback
            monitor.Start(function() {
              console.log("Monitor started");
            });
          },
          function(msg) {
            console.log("Error creating monitor: " + msg);
          });
      }
      analytics.Stop = function()
      {
        var monitor = window.plugins.EqatecAnalytics.Monitor;
        monitor.Stop();
      }
      analytics.Monitor = function()
      {
        return window.plugins.EqatecAnalytics.Monitor;
      }    

     document.addEventListener('deviceready', function () {
     	app.application = new kendo.mobile.Application(document.body, { layout: "tabstrip-layout" });
        analytics.Start(); 

    }, false);
    
     document.addEventListener('pause', function () {
        analytics.Stop(); 
    });
    
     document.addEventListener('resume', function () {
        analytics.Start(); 
    });

})(window);