class App {
  constructor() {
    this.routes = [];
  }

  isMatching(req, route) {
    if (route.url && req.url != route.url) return false;
    if (route.method && req.method != route.method) return false;
    return true;
  }

  handle(req, res) {
    let matchingRoutes = this.routes.filter(this.isMatching.bind(null, req));
    let remainingRoutes = [...matchingRoutes];

    const next = function() {
      let current = remainingRoutes[0];
      if (!current) {
        res.end();
        return;
      }
      remainingRoutes = remainingRoutes.slice(1);
      current.handler(req, res, next);
    };
    next();
    }

  post(url, handler) {
    this.routes.push({method: 'POST', url, handler});
  }

  get(url, handler) {
    this.routes.push({method: 'GET', url, handler});
  }
}

module.exports = App;
