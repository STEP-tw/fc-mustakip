const fs = require('fs');

const renderGuestBook = function(req, res) {
  fs.readFile('guestBook.html', (err, data) => {
    res.write(data);
    res.end();
  });
};

// const renderMessageReceived = function(req, res) {
//   res.write('Written');
//   res.end();
// };

const readBody = function(req, res) {
  let content = '';
  req.on('data', chunk => {
    content = content + chunk;
  });
  req.on('end', () => {
    res.body = content;
  });
};

const renderHome = function(req, res) {
  fs.readFile('index.html', (err, data) => {
    res.write(data);
    res.end();
  });
};

const renderFile = function(req, res) {
  fs.readFile('.' + req.url, (err, data) => {
    res.write(data);
    res.end();
  });
};

class App {
  constructor() {
    this.routes = [];
  }

  handle(req, res) {
    let remainingRoutes = this.routes.filter(route => {
      if (route.url == req.url && route.method === req.method) return true;
      return false;
    });
    remainingRoutes[0].handler(req, res);
  }

  post(url, handler) {
    this.routes.push({method: 'POST', url, handler});
  }

  get(url, handler) {
    this.routes.push({method: 'GET', url, handler});
  }
}

let app = new App();
app.get('/', renderHome);
app.get('/indexStyle.css', renderFile);
app.get('/favicon.ico', renderFile);
app.get('/images/freshorigins.jpg', renderFile);
app.get('/images/animated-flower-image-0021.gif', renderFile);
app.get('/src/script.js', renderFile);
app.get('/guestBook', renderGuestBook);
app.get('/guestBook.css', renderFile);
app.post('/guestBook', readBody);

// Export a function that can act as a handler

module.exports = app.handle.bind(app);
