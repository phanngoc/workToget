class HomeController {
  constructor(...args) {
    this.args = args;
  }

  index(ctx, next) {
    //ctx.body = "Welcome to koajs-starter";
    return ctx.render('index.pug', {
      title: 'This is title'
    });
  }

  * view(next) {
    yield this.render('index.ect', {
      title: 'Render view template'
    });
    yield next;
  }
};

export default HomeController;
