/**
 * Vercel Speed Insights initialization
 * This script initializes Speed Insights tracking for the application
 * 
 * Note: The actual Speed Insights functionality is provided by Vercel when the site is deployed
 * and Speed Insights is enabled in the Vercel dashboard. This script provides the initialization
 * code that will connect to the Vercel Speed Insights service.
 */

(function() {
  'use strict';

  // Initialize Speed Insights queue
  if (window.si) return;
  
  window.si = function() {
    window.siq = window.siq || [];
    window.siq.push(arguments);
  };

  // Load the Speed Insights script from Vercel
  // This path will be automatically handled by Vercel when Speed Insights is enabled
  var script = document.createElement('script');
  script.src = '/_vercel/speed-insights/script.js';
  script.defer = true;
  script.onerror = function() {
    // Speed Insights is not yet enabled in Vercel dashboard
    console.log('Speed Insights: Enable in Vercel dashboard at vercel.com/[your-team]/[your-project]/settings/speed-insights');
  };
  
  // Inject the script
  var firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }
})();
