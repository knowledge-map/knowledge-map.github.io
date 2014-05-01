window.onload = function() {
  "use strict";

  var graph = knowledgeMap.create({
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
    plugins: ['editing', 'editing-modals']
  });

  var editGraphFrom = function() {
    var slug = window.location.hash.substring(1);
    if(slug) {
      var request = new XMLHttpRequest();
      request.open('GET', getStorageHost(window.location.origin)+slug, true);
      request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE) {
          if(request.status === 200) {
            document.getElementById('graph').innerHTML = "";
            // Server returns plain text.
            var g = JSON.parse(request.responseText);
            // We decide which plugins to use.
            graph = knowledgeMap.create({
              graph: g,
              inside: '#graph',
              plugins: ['editing', 'editing-modals'],
            });
            window.graphID = slug;
          }
        }
      };
      request.send();
    }
  };
  window.onhashchange = editGraphFrom;
  editGraphFrom();

  window.graphID = '';
  var statusEl = document.getElementById('status');
  var saveLink = document.getElementById('save');
  var publishLink = document.getElementById('publish');

  window.save = function(lock, done) {
    statusEl.innerHTML = 'Saving...';

    var request = new XMLHttpRequest();
    request.open(
      window.graphID ? 'PUT' : 'POST',
      getStorageHost(window.location.origin)
        + window.graphID
        + (lock ? '?lock' : ''),
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
            statusEl.innerHTML = 'Your graph is at <a target="_blank" href="'+url+'">'+url+'</a>';
            publishLink.innerHTML = 'Publish this graph!';
            window.graphID = response.id;
            window.onhashchange = undefined;
            window.location.hash = '#' + response.id;
            window.onhashchange = editGraphFrom;
            if(done) done();
          } else {
            statusEl.innerHTML =
              'Something went wrong while saving! Please try again later.';
          }
        } else {
          statusEl.innerHTML =
            'Something went wrong while saving! Please try again later.';
        }
      }
    };

    request.send(graph.toJSON());
  };

  window.publish = function() {
    if(window.graphID) {
      statusEl.innerHTML = 'Publishing...';
      save(true, function() {
        saveLink.innerHTML = '';
        publishLink.innerHTML = '';
      });
    } else {
      statusEl.innerHTML = 'Please save your graph first!';
    }
  };

  function getStorageHost(domain) {
    // During development, use a local storage server. Change true to false on
    // the next line if you're not running your own storage server locally.
    if(false && -1 !== domain.indexOf('localhost')) {
      return 'http://localhost:8000/';
    } else {
      return 'http://powerful-journey-6066.herokuapp.com/';
    }
  }
}
