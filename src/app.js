const fs = require('fs');
const {App, Comments} = require('./framework');

const convertToHtml = function(commentList) {
  let htmlText = '</table>';
  commentList.forEach(commentObject => {
    let {date, time, author, comment} = commentObject;
    console.log(commentObject);
    let tablerow = `
    <tr>
    <td class = 'date'>${date}</td>
    <td class = 'time'>${time}</td>
    <td class = 'author'>${author}</td>
    <td class = 'comment'>${comment}</td>
    </tr>
    `;
    htmlText = tablerow + htmlText;
  });
  return htmlText;
};

const renderGuestBook = function(req, res) {
  if (req.body) {
    let comment = extractComment(req.body);
    comments.addComment(comment);
  }
  let path = './public/html/guestBook.html';
  fs.readFile(path, (err, content) => {
    res.write(content);
    renderComments(req, res);
  });
};

const renderComments = function(req, res) {
  fs.readFile('./data.json', (err, jsonContent) => {
    let parsedContent = JSON.parse(jsonContent);
    let allComments = parsedContent.concat(comments.commentList);
    fs.writeFile('./data.json', JSON.stringify(allComments), () => {
      let commentHtml = convertToHtml(allComments);

      res.write(commentHtml);
      res.end();
    });
  });
};

const getTime = function() {
  return new Date().toLocaleTimeString();
};
const getDate = function() {
  return new Date().toLocaleDateString();
};
const getAuthorAndComment = function(userContent) {
  let comment = {};
  let args = userContent.split('&');
  let keyValuePairs = args.map(pair => pair.split('='));
  keyValuePairs.forEach(pair => (comment[pair[0]] = pair[1]));
  return comment;
};

const extractComment = function(userContent) {
  let comment = getAuthorAndComment(userContent);
  comment.time = getTime();
  comment.date = getDate();
  return comment;
};

const readBodyAndUpdate = function(req, res) {
  let content = '';

  req.on('data', chunk => {
    content = content + chunk;
  });
  req.on('end', () => {
    req.body = content;
    renderGuestBook(req, res);
  });
};

const renderFile = function(req, res) {
  let path = `./public${req.url}`;

  if (req.url == '/') {
    path = './public/html/index.html';
  }
  console.log(path);

  fs.readFile(path, (err, data) => {
    res.write(data);
    res.end();
  });
};

let comments = new Comments();

let app = new App();
app.get('/html/guestBook.html', renderGuestBook);
app.post('/html/guestBook.html', readBodyAndUpdate);
app.use(renderFile);

module.exports = app.handle.bind(app);
