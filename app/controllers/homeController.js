import models from '../../models';

class HomeController {
  constructor(...args) {
    this.args = args;
  }

  async index(ctx, next) {
    return await Promise.all([
        models.User.create({
          fullname: "Phan Ngoc",
          username: "phann123",
          password: "123456",
          avatar: "sdsdd"
        }),
        ctx.render('index.pug', {
          title: 'This is title'
        })]).then(function(results) {
          console.log(results);
            return results[1];
      });
  }

  async getProjects(next) {

  }
};

export default HomeController;
