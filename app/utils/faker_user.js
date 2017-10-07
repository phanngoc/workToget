import models from '../../models';
import faker from 'faker';
import co from 'co';
import _ from 'lodash';

export default co.wrap(function* () {
  var data = [];

  for (var i=1; i<=20; i++) {
    let item = {
      id: i,
      fullname: faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}"),
      username:  faker.fake('{{internet.userName}}'),
      password: "123456",
      avatar: "default_avatar.png"
    };
    data.push(item);
  }

  var step1 = yield models.User.destroy({
    where: {},
    truncate: true,
    force: true
  }).then(() => {Promise.resolve(true)});

  var step2 = yield models.User.bulkCreate(data).then(() => {
    Promise.resolve(true);
  });

  return yield Promise.resolve(true);
});
