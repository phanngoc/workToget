import models from '../../models';
import _ from 'lodash';
import async from 'async';

export async function loadMore(answer_id, page) {
  return new Promise((resolve, reject) => {
    models.Comment.findAll({
      where: {commentable_id: answer_id, commentable: 'answer'},
      include: [
        {
          model: models.User,
          as: 'User'
        }
      ],
      limit: 5,
      offset: (page-1) * 5
    }).then((comments) => {
      resolve(comments);
    }).catch((err) => {
      reject(err);
    })
  });
}

export async function create(data, answer_id, user) {
  return await models.Comment.create({
    content: data.content,
    user_id: user.id,
    commentable: 'answer',
    commentable_id: answer_id
  }).then((comment) => {
      comment = comment.toJSON();
      comment.User = user;
      return comment;
  });
}

export async function update(data) {
  return new Promise((resolve, reject) => {
    models.Comment.findOne({
      where: {id: data.id},
      include: [{
        model: models.User,
        as: 'User'
      }]
    })
    .then((comment) => {
      if (comment) {
        comment.updateAttributes({
          content: data.content
        })
        .then(function (result) {
          resolve(comment);
        })
      } else {
        reject(comment);
      }
    }).catch((err) => {
      reject(err);
    })
  });
}

export async function destroy(id) {
  return new Promise((resolve, reject) => {
    models.Comment.findOne({where: {id: id}})
    .then((comment) => {
      if (comment) {
        if (comment.destroy()) {
          resolve(comment);
        }
      } else {
        reject(comment);
      }
    })
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
