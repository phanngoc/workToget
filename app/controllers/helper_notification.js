import redis from 'redis'
import moment from 'moment'
import Ajv from 'ajv'
import _ from 'lodash'
import bluebird from 'bluebird'

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
  await client.zaddAsync("notification:" + user_id, time, JSON.stringify(newData));
}

export async function check(user_id, time, data) {
  await client.zremAsync("notification:" + user_id, data);
  let newData = JSON.parse(data);
  newData.type = CHECKED;
  await client.zaddAsync("notification:" + user_id, time, JSON.stringify(newData));
}

export default function notification(user_id, data) {
  let current = moment().unix();
  var schema = {
    "properties": {
      "type": [NEW, CHECKED, VISITED],
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
    client.zadd("notification:" + user_id, current, JSON.stringify(data));
  } else {
    console.log(validate.errors)
  }
}
