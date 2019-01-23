const getJar = function(document) {
  return document.getElementById('jar');
};

const getCommentsDiv = function(document) {
  return document.getElementById('tableDiv');
};

const blinkJar = function(document) {
  let jar = getJar(document);
  jar.style.visibility = 'hidden';
  setTimeout(() => {
    jar.style.visibility = 'visible';
  }, 1000);
};

const getCommentsHtml = function(commentList) {
  let htmlText = `
  <table>
  <tr>
  <td class = 'date'>Date</td>
  <td class = 'author'>Author</td>
  <td class = 'comment'>Comment</td>
  </tr>
  `;
  htmlOfComments = commentList.map(commentObject => {
    let {date, author, comment} = commentObject;
    let localeDate = new Date(date).toLocaleString();
    return `
    <tr>
    <td class = 'date'>${localeDate}</td>
    <td class = 'author'>${author}</td>
    <td class = 'comment'>${comment}</td>
    </tr>
    `;
  });
  return htmlText + htmlOfComments.join('\n') + '</table>';
};

const updateComments = function(comments) {
  commentsDiv = getCommentsDiv(document);
  commentsDiv.innerHTML = getCommentsHtml(comments);
};

const reloadComments = function() {
  fetch('/getComments').then(function(comments) {
    comments.json().then(updateComments);
  });
};

window.onload = () => {
  let refreshButton = document.getElementById('refreshButton');
  refreshButton.onclick = reloadComments;
  reloadComments();
};
