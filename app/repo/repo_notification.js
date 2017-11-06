import redis from 'redis'
import moment from 'moment'
import Ajv from 'ajv'
import _ from 'lodash'
import bluebird from 'bluebird'
import {ioEmitter} from '../../io.js';
import uuidv1 from 'uuid/v1';

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

let client = redis.createClient();

client.on('error', function(err) {
  console.log('error', err);
});

export const NEW = 0;
export const CHECKED = 1;
export const VISITED = 2;

export async function visit(user_id, time, data) {
  await client.zremAsync("notification:" + user_id, data);
  let newData = JSON.parse(data);
  newData.type = VISITED;
  let stringNewData = JSON.stringify(newData);
  await client.zaddAsync("notification:" + user_id, time, stringNewData);
  return [stringNewData, time];
}

export async function check(user_id, time, data) {
  await client.zremAsync("notification:" + user_id, data);
  let newData = JSON.parse(data);
  newData.type = CHECKED;
  let stringNewData = JSON.stringify(newData);
  await client.zaddAsync("notification:" + user_id, time, stringNewData);
  return [stringNewData, time];
}

export async function list_notify(user_id, time) {
  let results = [];
  let min = moment().subtract(1, 'months').unix();
  return new Promise((resolve, reject) => {
    client.zrevrangebyscore('notification:' + user_id, time, min, 'withscores', function(err, members) {
      console.log(err, members);
      if (err) {
        reject(err);
      } else {
        let lists = _.reduce(members, function(result, value, key) {
          if (_.isUndefined(result[Math.floor(key/2)])) {
            result[Math.floor(key/2)] = [value];
          } else {
            result[Math.floor(key/2)].push(value);
          }
          return result;
        }, {});
        results = _.toArray(lists);
        resolve(results);
      }
    });
  });
}

export async function check_list_notify(user_id, data) {
  let results = [];
  return new Promise((resolve, reject) => {
    async.map(data, function(item, callback) {
      check(user_id, item[1], item[0]).then((res) => {
        callback(res);
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

export async function visit_notify(user_id, data) {
  return await visit(user_id, data[1], data[0]);
}

export async function notification(user_id, data) {
  let current = moment().unix();
  var schema = {
    "properties": {
      "type": {"enum": [NEW, CHECKED, VISITED]},
      "action": {
        "type": "string",
      },
      "owner": {
        "type": "object"
      },
      "target": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "data": { "type": "object" },
          "link": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "params": { "type": "object" },
            },
          }
        },
      },
      "rely_on": {
        "type": "object",
        "properties": {
          "type": { "type": "string" },
          "data": { "type": "object" },
        },
      }
    }
  };
  var ajv = new Ajv();
  var validate = ajv.compile(schema);
  var valid = validate(data);

  if (valid) {
    data.uuid = uuidv1();
    let userIdSoc = await client.hgetAsync('socket_ids', user_id);
    ioEmitter.to(userIdSoc).emit('NOTIFICATION', [JSON.stringify(data), current]);
    client.zadd("notification:" + user_id, current, JSON.stringify(data));
  } else {
    console.log(validate.errors)
  }
}
