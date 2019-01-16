const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const cssFile = fs.readFileSync('style.css', 'utf8');

const app = (req, res) => {
  res.write(html);
  res.end();
};

// Export a function that can act as a handler

module.exports = app;
