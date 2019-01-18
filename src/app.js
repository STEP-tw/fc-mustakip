const fs = require('fs');
const {App, userComment, Comments} = require('./framework');
let commentHtml = '';

const renderGuestBook = function(req, res) {
  let args = '';
  if (req.body) {
    args = extractArgs(req.body);
    let {dateAndTime, name, comment} = args;
    let newComment = new userComment(dateAndTime, name, comment);
    comments.addComment(newComment);
  }

  let path = './public/guestBook.html';
  fs.readFile(path, (err, data) => {
    res.write(data);
    fs.readFile('./data.json', (err, data) => {
      data = JSON.parse(data);
      let allComments = JSON.stringify(data.concat(comments.comments));

      res.write(allComments);
      res.end();
      // });
    });
  });
};

const getDateAndTime = function() {
  return new Date().toLocaleString();
};

const extractArgs = function(userContent) {
  let args = {};
  let keyValuePairs = userContent.split('&');
  keyValuePairs = keyValuePairs.map(pair => pair.split('='));
  keyValuePairs.forEach(pair => (args[pair[0]] = pair[1]));
  args.dateAndTime = getDateAndTime();
  return args;
};

const readBodyAndUpdate = function(req, res, next) {
  let content = '';

  req.on('data', chunk => {
    content = content + chunk;
  });
  req.on('end', () => {
    req.body = content;
    renderGuestBook(req, res);
    next();
  });
};

const renderFile = function(req, res) {
  let path = `./public${req.url}`;

  if (req.url == '/') {
    path = './public/index.html';
  }

  fs.readFile(path, (err, data) => {
    res.write(data);
    res.end();
  });
};

let comments = new Comments();

let app = new App();
app.get('/', renderFile);
app.post('./guestBook.html', renderFile);
app.get('/indexStyle.css', renderFile);
app.get('/favicon.ico', renderFile);
app.get('/images/freshorigins.jpg', renderFile);
app.get('/images/animated-flower-image-0021.gif', renderFile);
app.get('/script.js', renderFile);
app.get('/guestBook.html', renderGuestBook);
app.get('/guestBook.css', renderFile);
app.get('/images/pbase-Abeliophyllum.jpg', renderFile);
app.get('/AbeliophyllumStyle.css', renderFile);
app.get('/Abeliophyllum.pdf', renderFile);
app.get('/Abeliophyllum.html', renderFile);
app.post('/guestBook.html', readBodyAndUpdate);

// Export a function that can act as a handler

module.exports = app.handle.bind(app);
