import models from '../../models';
import _ from 'lodash';
import async from 'async';

export async function create(data, question_id, user_id) {
  return await models.Answer.create({
    content: data.content,
    question_id: question_id,
    user_id: user_id,
    date_created: data.date_created
  }).then((value) => {
    return value;
  });
}

export async function update(data) {
  return new Promise((resolve, reject) => {
    models.Answer.find({ where: { id: data.id } })
    .on('success', function (checkin) {
      // Check if record exists in db
      if (checkin) {
        checkin.updateAttributes({
          question: data.question,
          with_user: data.with_user,
          cron: convertCron(data.cron),
          schedule: JSON.stringify(data.cron),
          time: data.time
        })
        .success(function () {
          resolve(checkin);
        })
      } else {
        reject(checkin);
      }
    })
  });
}

async function loadAttachUser(userIds) {
  return new Promise((resolve, reject) => {
    async.map(userIds, function(item, callback) {
      models.User.findOne({where: {id: item}}).then(function(result) {
        callback(null, result);
      }).catch((err) => {
        callback(err);
      });
    }, function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
    });
  });
}

export async function loadMore(question_id, page) {
  let days = await models.Answer.findAll({
    attributes: ['date_created'],
    where: {question_id: question_id},
    group: ['date_created'],
    order: [['date_created', 'DESC']],
    limit: 3,
    offset: (page - 1) * 3
  });
  _.forEach(days, function(value) {

  });
  return results;
}


export async function load(project_id) {
  var toType = function(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
  }

  let checkins = await models.Checkin.findAll({
    where: {project_id: project_id},
  }, {raw: true});
  let results = [];
  for (var i = 0, len = checkins.length; i < len; i++) {
    let userIds = JSON.parse('[' + checkins[i].with_user + ']');
    let checkinObjJson = checkins[i].toJSON();
    checkinObjJson.Users = await loadAttachUser(userIds);
    results.push(checkinObjJson);
  }
  return results;
}
