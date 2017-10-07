import models from '../../models';
import faker from 'faker';
import co from 'co';
import _ from 'lodash';

export default co.wrap(function* () {
  var data = [];
  var frame_ids = [1, 2, 3];

  let fngetRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (var i=1; i<=20; i++) {
    let item = {
      id: i,
      title: faker.fake('{{lorem.words}}'),
      description:  faker.fake('{{lorem.sentence}}'),
      created_at: faker.fake('{{date.past}}'),
      updated_at: faker.fake('{{date.past}}'),
      frame_id: fngetRandomArbitrary(1, 3),
    };
    data.push(item);
  }

  var step1 = yield models.Task.destroy({
    where: {},
    truncate: true,
    force: true
  }).then(() => {Promise.resolve(true)});

  // var project_id = models..findAll({
  //   attributes: ['id']
  // });

  var step2 = yield models.Task.bulkCreate(data).then(() => {
    Promise.resolve(true);
  });

  return yield Promise.resolve(true);
});
