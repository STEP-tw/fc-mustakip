const fs = require('fs');
const COMMENTS_FILE = './comments.json';
const {App} = require('./framework');

const getOldComments = function() {
  let comments = fs.readFileSync(COMMENTS_FILE, 'utf8');
  return JSON.parse(comments);
};

const comments = getOldComments();

const convertToHtml = function(commentList) {
  let htmlText = `
  <tr>
  <td class = 'date'>Date</td>
  <td class = 'author'>Author</td>
  <td class = 'comment'>Comment</td>
  </tr>
  `;
  commentList.forEach(commentObject => {
    let {date, author, comment} = commentObject;
    let tablerow = `
    <tr>
    <td class = 'date'>${date}</td>
    <td class = 'author'>${author}</td>
    <td class = 'comment'>${comment}</td>
    </tr>
    `;
    htmlText = htmlText + tablerow;
  });
  return htmlText + '</table>';
};

const renderGuestBook = function(req, res) {
  let path = './public/html/guestBook.html';
  fs.readFile(path, (err, content) => {
    let commentsHtml = convertToHtml(comments);
    send(res, content + commentsHtml);
  });
};

const removeNoise = function(userContent) {
  return userContent.replace(/[+]/g, ' ');
};

const getAuthorAndComment = function(userContent) {
  let comment = {};
  let cleanContent = removeNoise(userContent);
  let args = cleanContent.split('&');
  let keyValuePairs = args.map(pair => pair.split('='));
  keyValuePairs.forEach(pair => (comment[pair[0]] = pair[1]));
  return comment;
};

const extractComment = function(userContent) {
  let comment = getAuthorAndComment(userContent);
  comment.date = new Date().toLocaleDateString();
  return comment;
};

const saveComment = function(req, res) {
  let comment = extractComment(req.body);
  comments.unshift(comment);
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

const renderComments = function(req, res) {
  let commentsHtml = convertToHtml(comments);
  send(res, commentsHtml);
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
app.post('/html/guestBook.html', saveComment);
app.get('/comments', renderComments);
app.use(renderFile);
app.use(sendNotFound);

module.exports = app.handle.bind(app);
