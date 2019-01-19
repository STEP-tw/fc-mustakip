const fs = require('fs');
const {App, userComment, Comments} = require('./framework');

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
  let args = '';
  if (req.body) {
    args = extractArgs(req.body);
    let {date, time, author, comment} = args;

    let newComment = new userComment(date, time, author, comment);
    comments.addComment(newComment);
  }

  let path = './public/htmlFiles/guestBook.html';
  fs.readFile(path, (err, data) => {
    res.write(data);
    fs.readFile('./data.json', (err, data) => {
      data = JSON.parse(data);
      let allComments = data.concat(comments.commentList);
      fs.writeFile('./data.json', JSON.stringify(allComments), () => {
        let commentHtml = convertToHtml(allComments);

        res.write(commentHtml);
        res.end();
      });
    });
  });
};

const getTime = function() {
  return new Date().toLocaleTimeString();
};
const getDate = function() {
  return new Date().toLocaleDateString();
};

const extractArgs = function(userContent) {
  let args = {};
  let keyValuePairs = userContent.split('&');
  keyValuePairs = keyValuePairs.map(pair => pair.split('='));
  keyValuePairs.forEach(pair => (args[pair[0]] = pair[1]));
  args.time = getTime();
  args.date = getDate();
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
app.get('/cssFiles/pageStyle.css', renderFile);
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
