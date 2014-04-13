window.onload = function() {
  "use strict";

  var graph = knowledgeGraph.create({
    inside: '#graph',
    graph: {
      concepts: [{
        id: 'root',
        name: 'Click me to start editing!',
        content: [{
          text: "Edit me!"
        }]
      }]
    },
    plugins: ['editing']
  });

  window.graphID = '';

  window.publish = function() {
    var statusEl = document.getElementById('status');
    var publishLink = document.getElementById('publish');
    statusEl.innerHTML = window.graphID ? 'Saving...' : 'Publishing...';
    publishLink.innerHTML = '';

    var request = new XMLHttpRequest();
    request.open(
      window.graphID ? 'PUT' : 'POST',
      getStorageHost(window.location.origin) + window.graphID,
      true);

    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE) {
        if(request.status === 200) {
          var response;
          if(window.graphID) {
            response = {id: window.graphID};
          } else {
            response = JSON.parse(request.responseText);
          }

          if(response.id) {
            var url = window.location.origin + '/view#' + response.id;
            statusEl.innerHTML = 'Your graph is at <a href="'+url+'">'+url+'</a>';
            publishLink.innerHTML = 'Save this graph!';
            window.graphID = response.id;
          } else {
            publishLink.innerHTML = '';
            statusEl.innerHTML =
              'Something went wrong while publishing! Please try again later.';
          }
        } else {
          publishLink.innerHTML = '';
          statusEl.innerHTML =
            'Something went wrong while publishing! Please try again later.';
        }
      }
    };

    request.send(graph.toJSON());
  };

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
