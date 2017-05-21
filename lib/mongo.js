var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});

exports.User = mongolass.model('User', {
  name: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  bio: { type: 'string' }
});
exports.User.index({ name: 1 }, { unique: true }).exec();// 根据用户名找到用户，用户名全局唯一

exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  name: { type: 'string' },
  sit: { type: 'string' }
});
exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的签到记录

exports.Course = mongolass.model('Course', {
  name: { type: 'string' },
  manager: { type: 'string'},
  stulist: { type: 'string'},
  bio: { type: 'string'}
});
exports.Course.index({ name: 1 }, { unique: true }).exec();  // 课程名全局唯一

exports.Student = mongolass.model('Student', {
  number: { type: 'string'},
  name: { type: 'string' },
  course: { type: 'string'}
});
exports.Student.index({ number: 1 }, { unique: true }).exec();

exports.Sign = mongolass.model('Sign', {
  course: { type: 'string' },
  number: { type: 'string' },
  name: { type: 'string' }
});
exports.Sign.index({ course: 1, _id: -1 }).exec();// 按创建时间降序查看用户的签到记录