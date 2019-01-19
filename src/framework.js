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
    let remainingRoute = matchingRoutes[0];
    console.log(remainingRoute);
    remainingRoute.handler(req, res);
  }

  post(url, handler) {
    this.routes.push({method: 'POST', url, handler});
  }

  get(url, handler) {
    this.routes.push({method: 'GET', url, handler});
  }
  use(handler) {
    this.routes.push({handler});
  }
}

class Comments {
  constructor() {
    this.commentList = [];
  }
  addComment(comment) {
    this.commentList.push(comment);
  }
}

module.exports = {
  App,
  Comments
};
