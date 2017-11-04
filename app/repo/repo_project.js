import redis from 'redis';
import bluebird from 'bluebird';
import models from '../../models';
import async from 'async';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

export const WAITING = 0;
export const MEMBER = 1;

export async function addWatingPeople(project_id, user_ids) {
  let data = {};
  _.forEach(user_ids, function(id) {
    data[id] = WAITING;
  });
  let result = await client.HMSETAsync('project_member:' + project_id, data);
  return result;
}

export async function changeToMember(project_id, user_id) {
  let result = await client.hsetAsync('project_member:' + project_id, user_id, MEMBER);
  return result;
}

export async function createWaitingPeople(project_id, user_ids) {
  return new Promise((resolve, reject) => {
    async.map(user_ids, (id, callback) => {
        models.ProjectUser.create({
          user_id: id,
          project_id: project_id,
          role: 'guest'
        }).then(function(projectUser) {
          return models.User.findOne({
            where: {
              id: projectUser.user_id
            }
          }).then((user) => {
            user = user.toJSON();
            user.project_users = projectUser;
            return user;
          });
        }).then(function(user) {
          callback(null, user);
        }).catch(function(error) {
          callback(error);
        });
      }
      , function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
    });
  });
}
