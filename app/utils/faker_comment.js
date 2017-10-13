import models from '../../models';
import faker from 'faker';
import co from 'co';
import _ from 'lodash';

export default co.wrap(function* () {
  var data = [];

  let fngetRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  }

  for (var i=1; i<=3; i++) {
    let item = {
      id: i,
      content: faker.fake("{{lorem.sentences}}"),
      user_id: 1,
      commentable: 'Task',
      commentable_id: fngetRandomArbitrary(1, 20)
    };
    data.push(item);
  }

  var step1 = yield models.Comment.destroy({
    where: {},
    truncate: true,
    force: true
  }).then(() => {Promise.resolve(true)});

  var step2 = yield models.Comment.bulkCreate(data).then(() => {
    Promise.resolve(true);
  }).then(frames => {
    console.log(frames) // ... in order to get the array of user objects
  })

  return yield Promise.resolve(true);
});
