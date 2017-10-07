import models from '../../models';
import faker from 'faker';
import co from 'co';
import _ from 'lodash';

export default co.wrap(function* () {
  var data = [{
      name: "Bug",
      color: "#a8345c"
  },

  ];

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
