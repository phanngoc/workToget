import models from '../../models';
import faker from 'faker';
import co from 'co';
import _ from 'lodash';

export default co.wrap(function* () {
  var data = [{
      id: 1,
      name: "Bug",
      color: "#a8345c"
  },
  {
      id: 2,
      name: "Task",
      color: "#259b25"
  },
  {
      id: 3,
      name: "Document",
      color: "#e9f26a"
  }
  ];

  let fngetRandomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
  }

  var dataTaskLabel = [];
  for (var i=1; i<=20; i++) {
    dataTaskLabel.push({
      task_id: i,
      label_id: fngetRandomArbitrary(1, 3)
    });
  }

  var step1 = yield models.Label.destroy({
    where: {},
    truncate: true,
    force: true
  }).then(() => {Promise.resolve(true)});

  var step2 = yield models.TaskLabel.destroy({
    where: {},
    truncate: true,
    force: true
  }).then(() => {Promise.resolve(true)});

  var step3 = yield models.Label.bulkCreate(data).then(() => {
    Promise.resolve(true);
  });

  var step4 = yield models.TaskLabel.bulkCreate(dataTaskLabel).then(() => {
    Promise.resolve(true);
  });
  return yield Promise.resolve(true);
});
