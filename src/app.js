const fs = require('fs');
const COMMENTS_FILE = './comments.json';
const {html} = require('./htmls.js');
const {App} = require('./framework.js');

const getOldComments = function() {
  let comments = fs.readFileSync(COMMENTS_FILE, 'utf8');
  return JSON.parse(comments);
};

const comments = getOldComments();

let guestBook = fs.readFileSync('./public/html/guestBook.html', 'utf8');

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
  comment.date = new Date();
  return comment;
};

const saveComment = function(req, res, next) {
  let user = 'author=' + req.cookies.value + '&' + req.body;
  let comment = extractComment(user);
  comments.unshift(comment);
  fs.writeFile(COMMENTS_FILE, JSON.stringify(comments), err => {});

  redirectToGuestBook(res);
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

const redirectToGuestBook = function(res) {
  res.writeHead(302, {
    Location: '/html/guestBook.html'
  });
  res.end();
  return;
};
const renderGuestBook = function(req, res) {
  if (req.cookies.name) {
    send(
      res,
      guestBook
        .replace('__LOGGINGIN__', html.loggedInPage)
        .replace('__USERNAME__', req.cookies.value)
    );
    return;
  }
  send(res, guestBook.replace('__LOGGINGIN__', html.loginPage));
};

const renderLoggedInPage = function(req, res, next) {
  let username = req.body.split('=')[1];
  res.setHeader('Set-Cookie', `username=${username}`);

  redirectToGuestBook(res);
};

const renderLoggedOutPage = function(req, res, next) {
  res.setHeader(
    'Set-Cookie',
    'username=;expires=Thu, 01 Jan 1970 00:00:00 UTC'
  );
  redirectToGuestBook(res);
};

const renderComments = function(req, res) {
  send(res, JSON.stringify(comments));
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

const readCookie = function(req, res, next) {
  let cookie = req.headers.cookie;
  let cookies = {};
  if (cookie) {
    cookie.split(';').forEach(element => {
      let cookieInfo = element.split('=');
      cookies.name = cookieInfo[0];
      cookies.value = cookieInfo[1];
    });
  }
  req.cookies = cookies;
  next();
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
app.use(readCookie);
app.use(readBody);
app.get('/html/guestBook.html', renderGuestBook);
app.post('/login', renderLoggedInPage);
app.post('/logout', renderLoggedOutPage);
app.get('/getComments', renderComments);
app.post('/sendComment', saveComment);
app.use(renderFile);
app.use(sendNotFound);

module.exports = app.handle.bind(app);
