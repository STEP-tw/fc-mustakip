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

  let path = './public/htmlFiles/guestBook.html';
  fs.readFile(path, (err, data) => {
    res.write(data);
    fs.readFile('./data.json', (err, data) => {
      data = JSON.parse(data);
      let allComments = JSON.stringify(comments.comments.concat(data));

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
    path = './public/htmlFiles/index.html';
  }
  console.log(path);

  fs.readFile(path, (err, data) => {
    res.write(data);
    res.end();
  });
};

let comments = new Comments();

let app = new App();
app.get('/', renderFile);
app.get('/htmlFiles/Ageratum.html', renderFile);
app.get('/htmlFiles/guestBook.html', renderGuestBook);
app.post('/htmlFiles/guestBook.html', readBodyAndUpdate);
app.get('/htmlFiles/Abeliophyllum.html', renderFile);
app.get('/cssFiles/guestBook.css', renderFile);
app.get('/cssFiles/indexStyle.css', renderFile);
app.get('/cssFiles/ageratumStyle.css', renderFile);
app.get('/cssFiles/AbeliophyllumStyle.css', renderFile);
app.get('images/favicon.ico', renderFile);
app.get('/images/freshorigins.jpg', renderFile);
app.get('/images/pbase-agerantum.jpg', renderFile);
app.get('/images/pbase-Abeliophyllum.jpg', renderFile);
app.get('/images/animated-flower-image-0021.gif', renderFile);
app.get('/script.js', renderFile);
app.get('/pdfFiles/ageratum.pdf', renderFile);
app.get('/pdfFiles/Abeliophyllum.pdf', renderFile);

// Export a function that can act as a handler

module.exports = app.handle.bind(app);
