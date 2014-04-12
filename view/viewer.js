window.onload = function() {
  "use strict";

  if(window.location.hash) {
    var slug = window.location.hash.substring(1);
    var request = new XMLHttpRequest();
    request.open("GET", "http://powerful-journey-6066.herokuapp.com/"+slug, true);
    request.send();

    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
        var graph = request.responseText;
        exho(graph);
      }
    };
  }
}
