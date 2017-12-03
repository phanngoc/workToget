import models from '../../models';
import _ from 'lodash';
import async from 'async';

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var path = require('path');

var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR =  path.resolve('./config/');
var TOKEN_PATH = TOKEN_DIR + '/calendar-nodejs-quickstart.json';


function loadClientSecret() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join('config/', 'client_secret.json'), function processClientSecrets(err, content) {
      if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
      }
      var credential = JSON.parse(content);
      resolve(credential);
    });
  });
}

export async function authClient() {
  var credentials = await loadClientSecret();
  console.log('authorize', credentials.web.client_secret, credentials.web.client_id);
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, 'http://localhost:3000/auth-code');
  return oauth2Client;
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
export async function authorize() {
  let oauth2Client = await authClient();
  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      if (err) {
        var authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES
        });
        console.log('Authorize this app by visiting this url: ', authUrl);
        resolve(authUrl);
      } else {
        oauth2Client.credentials = JSON.parse(token);
        resolve(oauth2Client);
      }
    });
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
export async function getNewToken(ctx) {
  let oauth2Client = await authClient();
  oauth2Client.getToken(ctx.query.code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    console.log('token ne:', token);
    oauth2Client.credentials = token;
    storeToken(token);
  });
}


/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
export async function listEvents(auth) {
  var calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var events = response.items;
    if (events.length == 0) {
      console.log('No upcoming events found.');
    } else {
      console.log('Upcoming 10 events:');
      for (var i = 0; i < events.length; i++) {
        var event = events[i];
        var start = event.start.dateTime || event.start.date;
        console.log('%s - %s', start, event.summary);
      }
    }
  });
}

export async function insertEvent(auth) {
  var calendar = google.calendar('v3');
  var event = {
    'summary': 'Google I/O 2015',
    'location': '800 Howard St., San Francisco, CA 94103',
    'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': '2017-12-20T09:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': '2017-12-20T17:00:00-07:00',
      'timeZone': 'America/Los_Angeles',
    },
    'attendees': [
      {'email': 'lpage@example.com'},
      {'email': 'sbrin@example.com'},
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10},
      ],
    },
  };
  
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}



export async function create(data, question_id, user) {
    // Load client secrets from a local file.
  
  return await models.Answer.create({
    content: data.content,
    question_id: question_id,
    user_id: user.id,
    date_created: data.date_created
  }).then((answer) => {
    answer = answer.toJSON();
    answer.User = user;
    return answer;
  });
}

export async function update(data) {
  return new Promise((resolve, reject) => {
    models.Answer.findOne({where: {id: data.id}})
    .then((answer) => {
      // Check if record exists in db
      if (answer) {
        answer.updateAttributes({
          content: data.content,
          date_created: data.date_created,
        })
        .then(function (result) {
          resolve(answer);
        })
      } else {
        reject(answer);
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
