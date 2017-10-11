/**
 * Dependencies.
 */
import _ from 'lodash';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';
import moment from 'moment';
import Promise from 'bluebird';
import slug from 'slug';
import errors from '../app/lib/errors';
/**
 * Constants.
 */

const SALT_WORK_FACTOR = 10;

/**
 * Model.
 */
export default (Sequelize, DataTypes) => {

  const models = Sequelize.models;

  const User = Sequelize.define('users', {

    fullname: DataTypes.STRING,

    username: {
      type: DataTypes.STRING,
      unique: true
    },

    avatar: DataTypes.STRING,

    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: [6, 128],
          msg: 'Email must be between 6 and 128 characters in length'
        },
        isEmail: {
          msg: 'Email must be valid'
        }
      }
    },

    password_hash: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      set(val) {
        const password = String(val);
        this.setDataValue('password', password);
        this.setDataValue('password_hash', bcrypt.hashSync(password, this._salt));
      },
      validate: {
        len: {
          args: [6, 128],
          msg: 'Password must be between 6 and 128 characters in length'
        }
      }
    },

    _salt: {
      type: DataTypes.STRING,
      defaultValue: bcrypt.genSaltSync(SALT_WORK_FACTOR)
    },

    createdAt: {
      field: 'created_at',
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },

    updatedAt: {
      field: 'updated_at',
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW
    },

    deletedAt: {
      field: 'deleted_at',
      type: DataTypes.DATE,
    }

  }, {
    paranoid: true,

    getterMethods: {

    },
  });

  // JWT token.
  User.prototype.jwt = function(payload, expiresInHours) {
    const SECRET = process.env.SECRET;
    expiresInHours = expiresInHours || 24*30; // 1 month

    // We are sending too much data (large jwt) but the app and website
    // need the id and email. We will refactor that progressively to have
    // a smaller token.
    const data = {id: this.id, email: this.email};
    
    return jwt.sign(data, SECRET, {
      expiresIn: 60 * 60 * expiresInHours,
      subject: this.id + "", // user
      issuer: process.env.BASE_URL
    });
  };

  User.auth = function(usernameOrEmail, password, cb) {
    const msg = 'Invalid username/email or password.';
    usernameOrEmail = usernameOrEmail.toLowerCase();

    User.find({
      where: {$or: [
                {username: usernameOrEmail},
                {email: usernameOrEmail}
              ]}
    })
    .then((user) => {
      if (!user) return cb(new errors.BadRequest(msg));

      bcrypt.compare(password, user.password_hash, (err, matched) => {
        if (!err && matched) {
          user.updateAttributes({
            updated_at: new Date()
          })
            .tap(user => cb(null, user))
            .catch(cb);
        } else {
          cb(new errors.BadRequest(msg));
        }
      });
    })
    .catch(cb);
  };

  User.hashPass = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR));
  };

  return User;
};
