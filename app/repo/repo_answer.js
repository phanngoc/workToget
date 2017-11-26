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

  return new Promise((resolve, reject) => {
    async.map(days, function(item, callback) {
      models.Answer.findAll({
        where: {question_id: question_id, date_created: item.date_created},
        order: [['updated_at', 'DESC']],
        include: [{
          model: models.User,
          as: 'User'
        }],
      }).then(function(answers) {
        callback(null, {date: item.date_created, answers: answers});
      }).catch(err => {
        callback(err);
      });
    }, function(err, results) {
        console.log('arra results', results);
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
    });
  });
}


export async function findOne(id) {
  let answer = await models.Answer.findOne({
    where: {id: id},
    include: [
      {
        model: models.User,
        as: 'User'
      }
    ]
  }, {raw: true});
  return answer;
}
  