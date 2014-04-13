window.onload = function() {
  "use strict";

  window.onhashchange = function() {
    if(window.location.hash) {
      // Destroy old graph if one exists.
      document.getElementById('graph').innerHTML = 'Loading graph...';

      var slug = window.location.hash.substring(1);
      var request = new XMLHttpRequest();

      request.open('GET', getStorageHost(window.location.origin)+slug, true);
      request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE) {
          if(request.status === 200) {
            document.getElementById('graph').innerHTML = "";
            // Server returns plain text.
            var graph = JSON.parse(request.responseText);
            // We decide which plugins to use.
            knowledgeGraph.create({
              graph: graph,
              inside: '#graph',
              plugins: ['modals'],
            });
          } else {
            document.getElementById('graph').innerHTML =
              'Error loading graph. Please try again later!';
          }
        }
      };
      request.send();
    }
  }

  // Force a hash change when the page loads to detect the first graph.
  window.onhashchange();

  function getStorageHost(domain) {
    // During development, use a local storage server. Change true to false on
    // the next line if you're not running your own storage server locally.
    if(true && -1 !== domain.indexOf('localhost')) {
      return 'http://localhost:8000/';
    } else {
      return 'http://powerful-journey-6066.herokuapp.com/';
    }
  }
}
