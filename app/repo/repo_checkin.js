import models from '../../models';
import _ from 'lodash';
import cron from 'cron';
import async from 'async';

var CronJob = cron.CronJob;

/**
 * [convertCron description]
 * @param  {[type]} obj Ex
 * {
 *  question,
 *  with_user,
 *  cron,
 *  time
 * }
 * @return {[type]}     [description]
 */

let arNumDay = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
function convertCron(obj) {
  let result = '';
  let hour = obj.time.substr(0, 2);
  let minute = obj.time.substr(3, 2);
  let listDate = "";
  if (obj.type == 'daily') {
    _.forEach(obj.days, function(val) {
      listDate += arNumDay.indexOf(val) + ',';
    });
    listDate = listDate.substring(0, listDate.length-1);
    result = minute + ' ' + hour + ' * * ' + listDate;
  } else if (obj.type == 'once_a_week') {
    result = minute + ' ' + hour + ' * * ' + arNumDay.indexOf(obj.date);
  } else if (obj.type == 'other_week') {
    let listDate = '';
    _.forEach(arNumDay, function(val, key) {
      if (val != obj.date) {
        listDate += key + ',';
      }
    });
    listDate = listDate.substring(0, listDate.length-1);
    result = minute + ' ' + hour + ' * * ' + listDate;
  } else  if (obj.type == 'once_a_month') {
    let startDate = arNumDay.indexOf(obj.date) + 1;
    result = minute + ' ' + hour + ' 1-7 * * ' + startDate;
  }
  return result;
}

export async function create(data, project_id) {
  return models.Checkin.create({
    question: data.question,
    with_user: data.with_user,
    cron: convertCron(data.cron),
    schedule: JSON.stringify(data.cron),
    time: data.cron.time,
    project_id: project_id
  }).then((value) => {
    return value;
  });
}

export async function update(data) {
  return models.Checkin.find({ where: { id: data.id } })
    .then(checkin => {
      if (checkin) {
        return checkin.updateAttributes({
          question: data.question,
          with_user: data.with_user,
          cron: convertCron(data.cron),
          schedule: JSON.stringify(data.cron),
          time: data.cron.time
        }).then(function (checkinUp) {
          return Promise.resolve(checkinUp);
        }).catch((err) => {
          return Promise.reject(err);
        });
      } else {
        return Promise.reject(checkin);
      }
    }).catch((err) => {
      return Promise.reject(err);
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

export async function findOne(id) {
  let checkin = await models.Checkin.findOne({
    where: {id: id},
  }, {raw: true});
  let checkinObjJson = checkin.toJSON();
  let userIds = JSON.parse('[' + checkin.with_user + ']');
  checkinObjJson.Users = await loadAttachUser(userIds);
  return checkinObjJson;
}
