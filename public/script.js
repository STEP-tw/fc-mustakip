const getJar = function(document) {
  return document.getElementById('jar');
};

const blinkJar = function(document) {
  let jar = getJar(document);
  jar.style.visibility = 'hidden';
  setTimeout(() => {
    jar.style.visibility = 'visible';
  }, 1000);
};

const reloadComments = function() {
  let table = document.getElementById('table');
  fetch('/comments').then(function(response) {
    response.text().then(function(text) {
      table.innerHTML = text;
    });
  });
};
