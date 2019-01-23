let html = {
  loginPage: `
        <div class="infoSection">
          <h1>Leave a comment</h1>
          <form action="/login" method="POST">
          <label>Name: </label> <input type="text" name="name" id="name"/>
            <input type="submit" value="Login"/>
          </form>
        </div>`,
  loggedInPage: `
    <div>
      <h1>Leave a comment</h1>
      <form action="/logout" method="POST">
      __USERNAME__
        <input type="submit" value="Log out"/>
      </form>
      <form action="/sendComment" method="POST">
        <p>
          <label for="comment">Comment: </label>
          <textarea name="comment" id="comment" cols="20" rows="3" required></textarea>
        </p>
        <input type="submit" value="Submit" />
      </form>
    </div>`
};

module.exports = {
  html
};
