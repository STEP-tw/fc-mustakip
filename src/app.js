const fs = require('fs');
const App = require('./framework');

// const renderGuestBook = function(req, res) {
//   fs.readFile('./public/guestBook.html', (err, data) => {
//     res.write(data);
//     res.end();
//   });
// };

const readBody = function(req, res, next) {
  let content = '';
  req.on('data', chunk => {
    content = content + chunk;
  });
  req.on('end', () => {
    req.body = content;
    res.write('got the info ');
    res.write(content);
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

let app = new App();
app.get('/', renderFile);
app.get('/indexStyle.css', renderFile);
app.get('/favicon.ico', renderFile);
app.get('/images/freshorigins.jpg', renderFile);
app.get('/images/animated-flower-image-0021.gif', renderFile);
app.get('/script.js', renderFile);
app.get('/guestBook.html', renderFile);
app.get('/guestBook.css', renderFile);
app.post('/guestBook', readBody);

// Export a function that can act as a handler

module.exports = app.handle.bind(app);
