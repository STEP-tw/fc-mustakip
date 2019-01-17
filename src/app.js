const fs = require('fs');

const app = (req, res) => {
  if (req.url == '/') {
    fs.readFile('index.html', (err, data) => {
      res.write(data);
      res.end();
    });
    return;
  }
  if (req.url != '/favicon.ico') {
    fs.readFile('.' + req.url, (err, data) => {
      res.write(data);
      res.end();
    });
    return;
  }
  res.end();
};

// Export a function that can act as a handler

module.exports = app;
