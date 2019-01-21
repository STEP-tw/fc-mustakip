const fs = require('fs');
const COMMENTS_FILE = './comments.json';
const {App} = require('./framework');

const getOldComments = function() {
  let comments = fs.readFileSync(COMMENTS_FILE, 'utf8');
  return JSON.parse(comments);
};

const comments = getOldComments();

const convertToHtml = function(commentList) {
  let htmlText = '</table>';
  commentList.forEach(commentObject => {
    let {date, time, author, comment} = commentObject;
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
  let path = './public/html/guestBook.html';
  fs.readFile(path, (err, content) => {
    let commentsHtml = convertToHtml(comments);
    send(res, content + commentsHtml);
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

const getComment = function(req, res) {
  let comment = extractComment(req.body);
  comments.push(comment);
  fs.writeFile(COMMENTS_FILE, JSON.stringify(comments), err => {
    renderGuestBook(req, res);
  });
};

const readBody = function(req, res, next) {
  let content = '';
  req.on('data', chunk => {
    content = content + chunk;
  });
  req.on('end', () => {
    req.body = content;
    next();
  });
};

const getPath = function(url) {
  if (url == '/') return './public/html/index.html';
  return `./public${url}`;
};

const send = function(res, content, statusCode = 200) {
  res.statusCode = statusCode;
  res.write(content);
  res.end();
};

const renderFile = function(req, res) {
  let path = getPath(req.url);
  fs.readFile(path, (err, fileContent) => {
    if (err) {
      sendNotFound(req, res);
      return;
    }
    send(res, fileContent);
  });
};

const sendNotFound = function(req, res) {
  send(res, 'File not Found', 404);
};

let app = new App();
app.use(readBody);
app.get('/html/guestBook.html', renderGuestBook);
app.post('/html/guestBook.html', getComment);
app.use(renderFile);

module.exports = app.handle.bind(app);
