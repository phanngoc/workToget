import models from '../../models';
import faker from 'faker';
import co from 'co';
import _ from 'lodash';

export default co.wrap(function* () {
  var data = [];

  for (var i=0; i<20; i++) {
    let item = { name: faker.fake("{{lorem.words}}"),
      description:  faker.fake('{{lorem.sentence}}'),
      num_star: 0, owner_id: 3};
    data.push(item);
  }

  var step1 = yield models.Project.destroy({
    where: {},
    truncate: true,
    force: true
  }).then(() => {Promise.resolve(true)});

  var step2 = yield models.Project.bulkCreate(data).then(() => {
    Promise.resolve(true);
  }).then(users => {
    console.log(users) // ... in order to get the array of user objects
  })

  return yield Promise.resolve(true);
});

