import redis from 'redis'
import moment from 'moment'
import Ajv from 'ajv'
import _ from 'lodash'
import {NEW, CHECKED, VISITED} from './repo_notification';

let client = redis.createClient();

client.on('error', function(err) {
  console.log('error', err);
});

export function load_activity(project_id) {
  let current = moment().unix();
  let results = [];
  return new Promise((resolve, reject) => {
    client.zrevrange('activity:' + project_id, 0, -1, 'withscores', function(err, members) {
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

export default function activity(project_id, data) {
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
      }
    }
  };
  var ajv = new Ajv();
  var validate = ajv.compile(schema);
  var valid = validate(data);

  if (valid) {
    client.zadd("activity:" + project_id, current, JSON.stringify(data));
  } else {
    console.log(validate.errors)
  }

}
