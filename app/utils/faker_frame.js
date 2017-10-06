import models from '../../models';
import faker from 'faker';
import co from 'co';
import _ from 'lodash';

export default co.wrap(function* () {
  var data = [];

  for (var i=1; i<=3; i++) {
    let item = {
      id: i,
      name: faker.fake("Frame {{lorem.words}}"),
      order: i,
      project_id: 1
    };
    data.push(item);
  }

  var step1 = yield models.Frame.destroy({
    where: {},
    truncate: true,
    force: true
  }).then(() => {Promise.resolve(true)});

  var step2 = yield models.Frame.bulkCreate(data).then(() => {
    Promise.resolve(true);
  }).then(frames => {
    console.log(frames) // ... in order to get the array of user objects
  })

  return yield Promise.resolve(true);
});
